import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized access context" },
        { status: 401 }
      );
    }

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
    const planKey = (planId || "").toLowerCase().trim();

    // FIX: All amounts use Math.round(price * 100) to guarantee clean integers
    let basePrice = 0;
    let canonicalPlanId = planKey;

    switch (planKey) {
      case "pro":
      case "plan_pro_test_id":
        basePrice     = curr === "INR" ? 499  : 7;
        canonicalPlanId = "pro_monthly";
        break;
      case "business":
      case "biz":
      case "plan_biz_test_id":
        basePrice     = curr === "INR" ? 1499 : 20;
        canonicalPlanId = "business_monthly";
        break;
      case "plan_pro_annual_test_id":
        basePrice     = curr === "INR" ? 4788 : 67;
        canonicalPlanId = "pro_yearly";
        break;
      case "plan_biz_annual_test_id":
        basePrice     = curr === "INR" ? 14388 : 200;
        canonicalPlanId = "business_yearly";
        break;
      default:
        basePrice = 0;
    }

    // Strict integer conversion — prevents paise float drift
    const amount = basePrice > 0
      ? Math.round(basePrice * 100)
      : Math.round(((body.amount as number) || (curr === "INR" ? 499 : 7)) * 100);

    if (!amount || typeof amount !== "number" || amount < 100) {
      return NextResponse.json(
        { success: false, error: "Invalid amount. Minimum 100 paise required." },
        { status: 400 }
      );
    }

    const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keyId || !keySecret) {
      console.error("[CREATE_ORDER] Missing Razorpay credentials");
      return NextResponse.json(
        { success: false, error: "Payment gateway configuration error" },
        { status: 500 }
      );
    }

    const authHeader =
      "Basic " + Buffer.from(`${keyId}:${keySecret}`).toString("base64");

    const safeUserId = userId.replace(/[^a-zA-Z0-9]/g, "").substring(0, 12);
    const receipt = `rcpt_${safeUserId}_${Date.now()}`.substring(0, 40);

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
        // Embed userId in notes — travels with ledger, readable by webhook
        notes: {
          userId,
          planId: canonicalPlanId,
          currency: curr,
        },
      }),
    });

    let data: Record<string, any>;
    try {
      data = await razorpayRes.json();
    } catch {
      return NextResponse.json(
        { success: false, error: "Unexpected response from payment gateway" },
        { status: 502 }
      );
    }

    if (!razorpayRes.ok) {
      console.error("[CREATE_ORDER] Razorpay API error:", data);
      return NextResponse.json(
        {
          success: false,
          error: data?.error?.description ?? "Failed to instantiate billing session",
        },
        { status: razorpayRes.status }
      );
    }

    return NextResponse.json({
      success:  true,
      order_id: data.id as string,
      amount:   data.amount as number,
      currency: data.currency as string,
      notes:    data.notes,
    });
  } catch (err: unknown) {
    console.error("[CREATE_ORDER_ROUTE_ERROR]:", err);
    return NextResponse.json(
      { success: false, error: "Internal processing crash" },
      { status: 500 }
    );
  }
}
