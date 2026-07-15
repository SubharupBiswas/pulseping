import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

export const dynamic = "force-dynamic";

// Tier → base price lookup (in rupees / dollars, NOT paise)
const PLAN_PRICES: Record<string, { INR: number; USD: number }> = {
  pro_monthly:          { INR: 499,   USD: 7   },
  pro_yearly:           { INR: 4788,  USD: 67  },
  business_monthly:     { INR: 1499,  USD: 20  },
  business_yearly:      { INR: 14388, USD: 200 },
};

function normalisePlanKey(planId: string): string {
  const raw = (planId || "").toLowerCase().trim();
  // Map legacy / shorthand IDs to canonical keys
  const aliases: Record<string, string> = {
    pro:                    "pro_monthly",
    plan_pro_test_id:       "pro_monthly",
    plan_pro_annual_test_id:"pro_yearly",
    business:               "business_monthly",
    biz:                    "business_monthly",
    plan_biz_test_id:       "business_monthly",
    plan_biz_annual_test_id:"business_yearly",
  };
  return aliases[raw] ?? raw;
}

export async function POST(req: NextRequest) {
  try {
    // ── Auth ────────────────────────────────────────────────────────────────
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized access context" },
        { status: 401 }
      );
    }

    // ── Parse body ──────────────────────────────────────────────────────────
    let body: Record<string, unknown>;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { success: false, error: "Malformed JSON request body" },
        { status: 400 }
      );
    }

    const { planId, currency = "INR" } = body as {
      planId?: string;
      currency?: "INR" | "USD";
    };

    const curr: "INR" | "USD" = currency === "USD" ? "USD" : "INR";

    // ── Resolve amount ──────────────────────────────────────────────────────
    const canonicalKey = normalisePlanKey(planId ?? "");
    const prices = PLAN_PRICES[canonicalKey];

    if (!prices) {
      return NextResponse.json(
        { success: false, error: `Unknown plan identifier: "${planId}"` },
        { status: 400 }
      );
    }

    // FIX: Strict integer paise conversion — Math.round prevents float drift
    const amount = Math.round(prices[curr] * 100);

    if (amount < 100) {
      return NextResponse.json(
        { success: false, error: "Resolved amount is below the minimum 100 paise threshold." },
        { status: 400 }
      );
    }

    // ── Credentials ─────────────────────────────────────────────────────────
    const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    console.log(`[ORDER_ROUTE] process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID: ${keyId ? `present (length: ${keyId.length})` : 'missing/undefined'}, process.env.RAZORPAY_KEY_SECRET: ${keySecret ? `present (length: ${keySecret.length})` : 'missing/undefined'}`);

    if (!keyId || !keySecret) {
      console.error("[ORDER_ROUTE] Missing Razorpay credentials — check env vars");
      return NextResponse.json(
        {
          success: false,
          error: "Razorpay payment gateway credentials are not configured on the server. Please define NEXT_PUBLIC_RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in your environment variables."
        },
        { status: 500 }
      );
    }

    // ── Derive a safe receipt ID (max 40 chars, alphanumeric + underscore) ──
    const safeUserId = userId.replace(/[^a-zA-Z0-9]/g, "").substring(0, 12);
    const receipt = `rcpt_${safeUserId}_${Date.now()}`.substring(0, 40);

    // ── Create Razorpay order ───────────────────────────────────────────────
    const authHeader =
      "Basic " + Buffer.from(`${keyId}:${keySecret}`).toString("base64");

    const razorpayRes = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: authHeader,
      },
      body: JSON.stringify({
        amount,          // integer paise — no floats
        currency: curr,
        receipt,
        // Embed userId in notes so it travels with the ledger record
        // and can be read by the webhook handler without a DB lookup
        notes: {
          userId,
          planId: canonicalKey,
          currency: curr,
        },
      }),
    });

    let rzData: Record<string, any>;
    try {
      rzData = await razorpayRes.json();
    } catch {
      console.error("[ORDER_ROUTE] Non-JSON Razorpay response — status:", razorpayRes.status);
      return NextResponse.json(
        { success: false, error: "Unexpected response from payment gateway" },
        { status: 502 }
      );
    }

    if (!razorpayRes.ok) {
      console.error("[ORDER_ROUTE] Razorpay order API error:", rzData);
      return NextResponse.json(
        {
          success: false,
          error: rzData?.error?.description ?? "Failed to create payment order",
        },
        { status: razorpayRes.status }
      );
    }

    return NextResponse.json({
      success: true,
      order_id: rzData.id as string,
      amount:   rzData.amount as number,
      currency: rzData.currency as string,
      notes:    rzData.notes,
    });
  } catch (err: unknown) {
    console.error("[ORDER_ROUTE] Unhandled exception:", err);
    return NextResponse.json(
      { success: false, error: "Internal server error during order creation" },
      { status: 500 }
    );
  }
}
