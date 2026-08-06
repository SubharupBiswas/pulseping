import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { db } from "@/lib/db";

// This route MUST NOT use Edge runtime — Node.js crypto is required
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// ── Plan tier resolution ─────────────────────────────────────────────────────
function resolveTierFromPlanId(planId?: string): "PRO" | "BUSINESS" | null {
  if (!planId) return null;
  const key = planId.toLowerCase();
  if (key.startsWith("business") || key.startsWith("biz") || key.startsWith("plan_biz")) return "BUSINESS";
  if (key.startsWith("pro") || key.startsWith("plan_pro")) return "PRO";
  return null;
}

// ── Webhook handler ──────────────────────────────────────────────────────────
export async function POST(req: NextRequest): Promise<NextResponse> {
  // 1. Read the raw body as a Buffer for exact HMAC verification
  let rawBody: Buffer;
  try {
    const arrayBuffer = await req.arrayBuffer();
    rawBody = Buffer.from(arrayBuffer);
  } catch (err) {
    console.error("[WEBHOOK] Failed to read raw request body:", err);
    return NextResponse.json(
      { error: "Failed to read request body" },
      { status: 400 }
    );
  }

  // 2. Extract and validate signature header
  const signature = req.headers.get("x-razorpay-signature");
  if (!signature) {
    console.warn("[WEBHOOK] Missing x-razorpay-signature header");
    return NextResponse.json(
      { error: "Missing webhook signature" },
      { status: 400 }
    );
  }

  // 3. Verify HMAC-SHA256 using RAZORPAY_WEBHOOK_SECRET
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error("[WEBHOOK] RAZORPAY_WEBHOOK_SECRET env var is not set");
    return NextResponse.json(
      { error: "Webhook secret not configured" },
      { status: 500 }
    );
  }

  const expectedSignature = crypto
    .createHmac("sha256", webhookSecret)
    .update(rawBody)
    .digest("hex");

  const expectedBuf = Buffer.from(expectedSignature, "hex");
  const signatureBuf = Buffer.from(signature, "hex");

  // Prevent timing attacks & guard against length mismatch buffer crashes
  const isValid =
    expectedBuf.length === signatureBuf.length &&
    crypto.timingSafeEqual(expectedBuf, signatureBuf);

  if (!isValid) {
    console.warn("[WEBHOOK] Signature mismatch — rejecting event");
    return NextResponse.json(
      { error: "Webhook signature verification failed" },
      { status: 401 }
    );
  }

  // 4. Parse the verified payload
  let event: {
    event: string;
    payload: {
      payment?: { entity?: Record<string, any> };
      subscription?: { entity?: Record<string, any> };
    };
  };

  try {
    event = JSON.parse(rawBody.toString("utf-8"));
  } catch (err) {
    console.error("[WEBHOOK] JSON parse error:", err);
    return NextResponse.json(
      { error: "Malformed webhook payload" },
      { status: 400 }
    );
  }

  const eventType = event.event;
  console.info("[WEBHOOK] Received event:", eventType);

  // 5. Route by event type ───────────────────────────────────────────────────
  try {
    switch (eventType) {

      // ── payment.captured: one-off checkout flow ──────────────────────────
      case "payment.captured": {
        const payment = event.payload?.payment?.entity;
        if (!payment) break;

        const notes = payment.notes as Record<string, string> | undefined;
        const userId = notes?.userId;
        const planId = notes?.planId;

        if (!userId) {
          console.warn("[WEBHOOK] payment.captured — notes.userId missing, skipping DB update");
          break;
        }

        const tier = resolveTierFromPlanId(planId);
        if (!tier) {
          console.warn("[WEBHOOK] payment.captured — unknown planId:", planId);
          break;
        }

        const capturedAmount = payment.amount ?? 0; // amount in paise
        const capturedCurrency: string = (payment.currency ?? "INR").toUpperCase();
        const displayAmount =
          capturedCurrency === "INR"
            ? `₹${(capturedAmount / 100).toFixed(0)}`
            : `$${(capturedAmount / 100).toFixed(2)}`;

        const existingInvoice = await db.invoice.findFirst({
          where: {
            userId,
            date: { gte: new Date(Date.now() - 2 * 60 * 1000) },
          },
        });

        await db.user.update({
          where: { id: userId },
          data: { plan: tier },
        });

        if (!existingInvoice) {
          await db.invoice.create({
            data: {
              userId,
              amount: `${displayAmount} (${tier} — ${capturedCurrency})`,
              status: "PAID",
            },
          });
        }

        console.info(
          `[WEBHOOK] payment.captured — upgraded user ${userId} → ${tier}, invoice verified`
        );
        break;
      }

      // ── subscription.charged: recurring billing renewal ──────────────────
      case "subscription.charged": {
        const payment = event.payload?.payment?.entity;
        if (!payment) break;

        const notes = payment.notes as Record<string, string> | undefined;
        const userId = notes?.userId;
        const planId = notes?.planId;

        if (!userId) {
          console.warn("[WEBHOOK] subscription.charged — notes.userId missing");
          break;
        }

        const tier = resolveTierFromPlanId(planId) || "PRO"; // Default fallback to PRO for active renewals

        const chargedAmount = payment.amount ?? 0;
        const chargedCurrency: string = (payment.currency ?? "INR").toUpperCase();
        const chargedDisplay =
          chargedCurrency === "INR"
            ? `₹${(chargedAmount / 100).toFixed(0)}`
            : `$${(chargedAmount / 100).toFixed(2)}`;

        const existingInvoice = await db.invoice.findFirst({
          where: {
            userId,
            date: { gte: new Date(Date.now() - 2 * 60 * 1000) },
          },
        });

        await db.user.update({
          where: { id: userId },
          data: { plan: tier },
        });

        if (!existingInvoice) {
          await db.invoice.create({
            data: {
              userId,
              amount: `${chargedDisplay} (${tier} Renewal — ${chargedCurrency})`,
              status: "PAID",
            },
          });
        }

        console.info(
          `[WEBHOOK] subscription.charged — renewed user ${userId} → ${tier}, renewal invoice created`
        );
        break;
      }

      // ── subscription.cancelled & subscription.halted: revert to FREE ────
      case "subscription.cancelled":
      case "subscription.halted": {
        const subscription = event.payload?.subscription?.entity;
        const notes = subscription?.notes as Record<string, string> | undefined;
        const userId = notes?.userId;

        if (!userId) {
          console.warn(`[WEBHOOK] ${eventType} — notes.userId missing`);
          break;
        }

        await db.user.update({
          where: { id: userId },
          data: { plan: "FREE" },
        });

        console.info(
          `[WEBHOOK] ${eventType} — downgraded user ${userId} → FREE`
        );
        break;
      }

      // ── payment.failed: log dropped or failed checkout attempts ─────────
      case "payment.failed": {
        const payment = event.payload?.payment?.entity;
        console.warn(
          `[WEBHOOK] payment.failed — paymentId: ${payment?.id}, reason: ${payment?.error_description}`
        );
        break;
      }

      default:
        console.info(`[WEBHOOK] Unhandled event type acknowledged: ${eventType}`);
    }
  } catch (dbErr: unknown) {
    console.error("[WEBHOOK] Database update failed:", dbErr);
    return NextResponse.json(
      { error: "Database sync failed — will retry" },
      { status: 500 }
    );
  }

  // 6. Acknowledge receipt — Razorpay expects a 200 OK
  return NextResponse.json({ received: true, event: eventType });
}