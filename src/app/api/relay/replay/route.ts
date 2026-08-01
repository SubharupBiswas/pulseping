import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
  const { logId } = await req.json();

  const log = await db.webhookLog.findUnique({
    where: { id: logId },
    include: { guard: true },
  });

  if (!log) {
    return NextResponse.json({ error: "Log not found" }, { status: 404 });
  }

  try {
    const replayResponse = await fetch(log.guard.targetUrl, {
      method: "POST",
      headers: log.requestHeaders as Record<string, string>,
      body: JSON.stringify(log.rawBody),
    });

    return NextResponse.json({
      success: true,
      status: replayResponse.status,
      message: "Webhook replayed successfully",
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
