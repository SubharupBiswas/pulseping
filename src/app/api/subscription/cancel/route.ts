import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userRecord = await db.user.findUnique({ where: { id: userId } });
    if (!userRecord) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (userRecord.plan === "FREE") {
      return NextResponse.json({ error: "No active subscription to cancel" }, { status: 400 });
    }

    await db.user.update({
      where: { id: userId },
      data: { plan: "FREE" },
    });

    console.info(`[CANCEL] User ${userId} downgraded to FREE`);
    return NextResponse.json({ success: true, message: "Subscription cancelled. Plan downgraded to FREE." });
  } catch (error: any) {
    console.error("[CANCEL_SUBSCRIPTION_ERROR]:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
