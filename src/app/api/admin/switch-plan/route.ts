import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { isAdminUser } from "@/lib/admin";
import { PlanTier } from "@/lib/tiers";

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    const user = await currentUser();

    if (!userId || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const primaryEmail = user.emailAddresses?.[0]?.emailAddress;

    if (!isAdminUser(primaryEmail)) {
      return NextResponse.json(
        { error: "Forbidden: Superuser privileges required" },
        { status: 403 }
      );
    }

    const { plan } = (await req.json()) as { plan: PlanTier };

    if (!["FREE", "PRO", "BUSINESS"].includes(plan)) {
      return NextResponse.json({ error: "Invalid plan tier" }, { status: 400 });
    }

    await db.user.update({
      where: { id: userId },
      data: { plan },
    });

    return NextResponse.json({
      success: true,
      message: `[ADMIN OVERRIDE] Account switched to ${plan}`,
      plan,
    });
  } catch (error: any) {
    console.error("Admin plan switch error:", error);
    return NextResponse.json(
      { error: "Failed to switch plan", details: error.message },
      { status: 500 }
    );
  }
}
