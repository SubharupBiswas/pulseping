import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Lean query: capped at 30 items with selective column projection
    const logs = await db.pingLog.findMany({
      where: {
        monitor: { userId },
      },
      take: 30,
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