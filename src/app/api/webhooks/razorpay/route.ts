import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { db } from "@/lib/db";

// This route MUST NOT use Edge runtime — Node.js crypto is required
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// ── Plan tier resolution ─────────────────────────────────────────────────────
// Maps the canonical planId stored in order.notes to a DB plan value.
// Falls back to "PRO" for any recognised paid plan so the account is
// never downgraded on an unknown identifier.
function resolveTierFromPlanId(planId?: string): "PRO" | "BUSINESS" | null {
  if (!planId) return null;
  const key = planId.toLowerCase();
  if (key.startsWith("business")) return "BUSINESS";
  if (key.startsWith("pro") || key.startsWith("plan_pro")) return "PRO";
  if (key.startsWith("biz") || key.startsWith("plan_biz")) return "BUSINESS";
  return null;
}

// ── Webhook handler ──────────────────────────────────────────────────────────
export async function POST(req: NextRequest): Promise<NextResponse> {
  // 1. Read the raw body as a Buffer for exact HMAC verification.
  //    Converting to text first then back would work too, but raw ArrayBuffer
  //    → Buffer is the most reliable path.
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

  // Constant-time comparison to prevent timing attacks
  const isValid = crypto.timingSafeEqual(
    Buffer.from(expectedSignature, "hex"),
    Buffer.from(signature, "hex")
  );

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

        // userId is embedded in order notes
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

        await db.user.update({
          where: { id: userId },
          data:  { plan: tier },
        });

        console.info(
          `[WEBHOOK] payment.captured — upgraded user ${userId} → ${tier}`
        );
        break;
      }

      // ── subscription.charged: recurring billing event ────────────────────
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

        const tier = resolveTierFromPlanId(planId);
        if (!tier) {
          console.warn("[WEBHOOK] subscription.charged — unknown planId:", planId);
          break;
        }

        // Renew / confirm the plan on each successful charge
        await db.user.update({
          where: { id: userId },
          data:  { plan: tier },
        });

        console.info(
          `[WEBHOOK] subscription.charged — renewed user ${userId} → ${tier}`
        );
        break;
      }

      // ── subscription.cancelled: downgrade back to FREE ───────────────────
      case "subscription.cancelled": {
        const subscription = event.payload?.subscription?.entity;
        if (!subscription) break;

        // userId may live in subscription notes
        const notes = subscription.notes as Record<string, string> | undefined;
        const userId = notes?.userId;

        if (!userId) {
          console.warn("[WEBHOOK] subscription.cancelled — notes.userId missing");
          break;
        }

        await db.user.update({
          where: { id: userId },
          data:  { plan: "FREE" },
        });

        console.info(
          `[WEBHOOK] subscription.cancelled — downgraded user ${userId} → FREE`
        );
        break;
      }

      default:
        // Unknown / unhandled events — acknowledge silently
        console.info(`[WEBHOOK] Unhandled event type: ${eventType}`);
    }
  } catch (dbErr: unknown) {
    console.error("[WEBHOOK] Database update failed:", dbErr);
    // Return 500 so Razorpay retries delivery
    return NextResponse.json(
      { error: "Database sync failed — will retry" },
      { status: 500 }
    );
  }

  // 6. Acknowledge receipt — Razorpay expects a 200 OK
  return NextResponse.json({ received: true, event: eventType });
}
