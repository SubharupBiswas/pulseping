import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getTierLimits } from "@/lib/tiers";

export async function GET() {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const userRecord = await db.user.findUnique({ where: { id: userId } });
    const tierLimits = getTierLimits(userRecord?.plan || "FREE");
    const cutoffDate = new Date(Date.now() - tierLimits.logRetentionDays * 24 * 60 * 60 * 1000);

    const logs = await db.pingLog.findMany({
      where: {
        monitor: { userId },
        checkedAt: { gte: cutoffDate },
      },
      take: 100,
      select: {
        id: true,
        statusCode: true,
        latency: true,
        checkedAt: true,
      },
      orderBy: { checkedAt: "desc" },
    });

    return NextResponse.json(logs);
  } catch (error) {
    console.error("Telemetry fetch error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}