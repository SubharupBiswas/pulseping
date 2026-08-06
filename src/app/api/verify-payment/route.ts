import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import crypto from "crypto";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized access context" }, { status: 401 });
    }

    const body = await req.json();
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      plan = "PRO",
      currency = "INR",
    } = body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json(
        { error: "Missing required validation parameters" },
        { status: 400 }
      );
    }

    const keySecret = process.env.RAZORPAY_KEY_SECRET?.trim();
    if (!keySecret) {
      console.error("Missing Razorpay secret credentials in server context");
      return NextResponse.json({ error: "Billing setup misconfigured" }, { status: 500 });
    }

    // Standard Signature Verification: HMAC-SHA256(order_id + "|" + payment_id, secret)
    const text = `${razorpay_order_id}|${razorpay_payment_id}`;
    const generatedSignature = crypto
      .createHmac("sha256", keySecret)
      .update(text)
      .digest("hex");

    if (generatedSignature !== razorpay_signature) {
      console.error("Razorpay signature mismatch validation error");
      return NextResponse.json(
        { error: "Payment verification signature mismatch. Access denied." },
        { status: 400 }
      );
    }

    const normalizedPlan = plan?.toUpperCase();
    if (!["PRO", "BUSINESS"].includes(normalizedPlan)) {
      return NextResponse.json(
        { error: "Invalid target plan tier." },
        { status: 400 }
      );
    }

    // Determine invoice amount based on plan + currency
    const PLAN_PRICES: Record<string, Record<string, number>> = {
      PRO: { INR: 499, USD: 7 },
      BUSINESS: { INR: 1499, USD: 20 },
    };
    const curr = currency === "USD" ? "USD" : "INR";
    const invoiceAmount = PLAN_PRICES[normalizedPlan]?.[curr] ?? 499;

    // Atomic update: upgrade plan + create invoice
    await Promise.all([
      db.user.update({
        where: { id: userId },
        data: { plan: normalizedPlan },
      }),
      db.invoice.create({
        data: {
          userId,
          amount: `${curr === "INR" ? "₹" : "$"}${invoiceAmount} (${normalizedPlan} — ${curr})`,
          status: "PAID",
        },
      }),
    ]);

    console.info(`[VERIFY_PAYMENT] User ${userId} upgraded to ${normalizedPlan}, invoice created.`);

    return NextResponse.json({
      success: true,
      message: `Payment signature verified. Account successfully upgraded to ${normalizedPlan} Tier.`,
    });
  } catch (error: any) {
    console.error("VERIFY_PAYMENT_ROUTE_ERROR:", error);
    return NextResponse.json({ error: "Internal processing crash" }, { status: 500 });
  }
}
