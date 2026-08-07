import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

export const dynamic = "force-dynamic";

// Tier → base price lookup (in rupees / dollars, NOT paise)
// Annual prices already reflect ~20% discount vs 12× monthly
const PLAN_PRICES: Record<string, { INR: number; USD: number }> = {
  pro_monthly:          { INR: 699,   USD: 9   },
  pro_yearly:           { INR: 6708,  USD: 84  },  // ₹559/mo × 12 = ₹6,708 ($7/mo × 12 = $84)
  business_monthly:     { INR: 2199,  USD: 29  },
  business_yearly:      { INR: 21108, USD: 276 },  // ₹1,759/mo × 12 = ₹21,108 ($23/mo × 12 = $276)
};

// Promo codes: { discountPercent }
const PROMO_CODES: Record<string, { discountPercent: number; description: string }> = {
  LAUNCH50:   { discountPercent: 50, description: "Launch special — 50% off" },
  PULSEFIRST: { discountPercent: 20, description: "First-user discount — 20% off" },
};

function normalisePlanKey(planId: string): string {
  const raw = (planId || "").toLowerCase().trim();
  const aliases: Record<string, string> = {
    pro:                     "pro_monthly",
    plan_pro_test_id:        "pro_monthly",
    plan_pro_annual_test_id: "pro_yearly",
    business:                "business_monthly",
    biz:                     "business_monthly",
    plan_biz_test_id:        "business_monthly",
    plan_biz_annual_test_id: "business_yearly",
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

    const { planId, currency = "INR", promoCode } = body as {
      planId?: string;
      currency?: "INR" | "USD";
      promoCode?: string;
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

    let basePrice = prices[curr];
    let discountPercent = 0;
    let discountDescription: string | null = null;

    // ── Apply promo code ────────────────────────────────────────────────────
    if (promoCode) {
      const normalizedCode = String(promoCode).toUpperCase().trim();
      const promo = PROMO_CODES[normalizedCode];
      if (promo) {
        discountPercent = promo.discountPercent;
        discountDescription = promo.description;
      } else {
        return NextResponse.json(
          { success: false, error: `Invalid promo code: "${promoCode}"` },
          { status: 400 }
        );
      }
    }

    const discountedPrice = discountPercent > 0
      ? Math.round(basePrice * (1 - discountPercent / 100))
      : basePrice;

    const amount = Math.round(discountedPrice * 100);

    if (amount < 100) {
      return NextResponse.json(
        { success: false, error: "Resolved amount is below the minimum 100 paise threshold." },
        { status: 400 }
      );
    }

    // ── Credentials with Auto-Trimming ──────────────────────────────────────
    const rawKeyId = process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
    const rawKeySecret = process.env.RAZORPAY_KEY_SECRET;

    const keyId = rawKeyId?.trim();
    const keySecret = rawKeySecret?.trim();

    console.log(`[ORDER_ROUTE] Key ID present: ${!!keyId} (length: ${keyId?.length}), Secret present: ${!!keySecret} (length: ${keySecret?.length})`);

    if (!keyId || !keySecret) {
      console.error("[ORDER_ROUTE] Missing Razorpay credentials — check env vars");
      return NextResponse.json(
        {
          success: false,
          error: "Razorpay payment gateway credentials are not configured on the server."
        },
        { status: 500 }
      );
    }

    // ── Derive receipt ID ───────────────────────────────────────────────────
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
        amount,
        currency: curr,
        receipt,
        notes: {
          userId,
          planId: canonicalKey,
          currency: curr,
          ...(discountPercent > 0 ? { promoCode, discountPercent, discountDescription } : {}),
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
      order_id:            rzData.id as string,
      amount:              rzData.amount as number,
      currency:            rzData.currency as string,
      notes:               rzData.notes,
      ...(discountPercent > 0 ? {
        discountApplied:   discountPercent,
        discountLabel:     discountDescription,
        originalAmount:    Math.round(basePrice * 100),
      } : {}),
    });
  } catch (err: unknown) {
    console.error("[ORDER_ROUTE] Unhandled exception:", err);
    return NextResponse.json(
      { success: false, error: "Internal server error during order creation" },
      { status: 500 }
    );
  }
}