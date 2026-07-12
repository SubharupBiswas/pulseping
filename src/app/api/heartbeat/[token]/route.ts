import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Heartbeat Ingestion Gateway (Pillar 2 — Inverse Heartbeat)
 *
 * Dead-man's switch receiver. Any GET or POST to:
 *   /api/heartbeat/<token>
 * records a successful check-in, resetting the failure window.
 *
 * Usage:
 *   curl https://yourdomain.com/api/heartbeat/<your-token>
 */
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  return handlePing(await params);
}

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  return handlePing(await params);
}

async function handlePing({ token }: { token: string }) {
  if (!token || typeof token !== "string" || token.trim() === "") {
    return NextResponse.json({ error: "Invalid token" }, { status: 400 });
  }

  try {
    const heartbeat = await (db as any).heartbeat.findUnique({
      where: { token },
    });

    if (!heartbeat) {
      return NextResponse.json({ error: "Heartbeat token not found" }, { status: 404 });
    }

    if (!heartbeat.isActive) {
      return NextResponse.json({ error: "Heartbeat monitor is paused" }, { status: 403 });
    }

    await (db as any).heartbeat.update({
      where: { token },
      data: { lastPingedAt: new Date() },
    });

    return NextResponse.json({
      ok: true,
      name: heartbeat.name,
      pingedAt: new Date().toISOString(),
      nextWindowSeconds: heartbeat.frequencySeconds,
    });
  } catch (error: any) {
    console.error("Heartbeat ping error:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
