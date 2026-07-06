import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized access context" }, { status: 401 });
    }

    const body = await req.json();
    const { amount, currency = "INR" } = body;

    if (!amount || typeof amount !== "number" || amount < 100) {
      return NextResponse.json(
        { error: "Invalid amount. Minimum amount is 100 paise." },
        { status: 400 }
      );
    }

    const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keyId || !keySecret) {
      console.error("Missing Razorpay credentials in server context");
      return NextResponse.json({ error: "Billing setup misconfigured" }, { status: 500 });
    }

    const authHeader = "Basic " + Buffer.from(`${keyId}:${keySecret}`).toString("base64");

    const response = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": authHeader,
      },
      body: JSON.stringify({
        amount,
        currency,
        receipt: `receipt_${userId.replace(/[^a-zA-Z0-9]/g, "").substring(0, 10)}_${Date.now()}`,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Razorpay Order API failed:", data);
      return NextResponse.json(
        { error: data.error?.description || "Failed to instantiate billing session" },
        { status: response.status }
      );
    }

    return NextResponse.json({
      success: true,
      order_id: data.id,
      amount: data.amount,
      currency: data.currency,
    });
  } catch (error: any) {
    console.error("CREATE_ORDER_ROUTE_ERROR:", error);
    return NextResponse.json({ error: "Internal processing crash" }, { status: 500 });
  }
}
