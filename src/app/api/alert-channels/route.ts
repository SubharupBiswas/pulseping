import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const SUPPORTED_TYPES = ["DISCORD", "SLACK", "EMAIL", "WEBHOOK"];

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { type, url, name } = body;

    if (!type || !SUPPORTED_TYPES.includes(type.toUpperCase())) {
      return NextResponse.json(
        { error: `Invalid channel type. Supported: ${SUPPORTED_TYPES.join(", ")}` },
        { status: 400 }
      );
    }

    if (!url || typeof url !== "string" || url.length < 5) {
      return NextResponse.json({ error: "A valid webhook URL is required" }, { status: 400 });
    }

    // Check plan gating
    const userRecord = await db.user.findUnique({ where: { id: userId } });
    if (!userRecord || userRecord.plan === "FREE") {
      return NextResponse.json(
        { error: "Alert Channels require a PRO or BUSINESS subscription" },
        { status: 403 }
      );
    }

    const channel = await db.alertChannel.create({
      data: {
        userId,
        providerType: type.toUpperCase(),
        destinationUrl: url,
        userFriendlyName: name?.trim() || null,
      },
    });

    return NextResponse.json({ success: true, channel });
  } catch (error: any) {
    console.error("[ALERT_CHANNELS_CREATE_ERROR]:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const channels = await db.alertChannel.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ channels });
  } catch (error: any) {
    console.error("[ALERT_CHANNELS_GET_ERROR]:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
