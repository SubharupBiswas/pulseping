import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { getTierLimits } from "@/lib/tiers";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const ALL_SUPPORTED_TYPES = ["DISCORD", "SLACK", "EMAIL", "WEBHOOK", "TELEGRAM"];

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { type, url, name } = body;

    const channelType = (type || "").toUpperCase();

    if (!channelType || !ALL_SUPPORTED_TYPES.includes(channelType)) {
      return NextResponse.json(
        { error: `Invalid channel type. Supported: ${ALL_SUPPORTED_TYPES.join(", ")}` },
        { status: 400 }
      );
    }

    if (!url || typeof url !== "string" || url.length < 5) {
      return NextResponse.json({ error: "A valid webhook URL is required" }, { status: 400 });
    }

    // Enforce tier-based channel type restrictions
    const userRecord = await db.user.findUnique({ where: { id: userId } });
    const tierLimits = getTierLimits(userRecord?.plan || "FREE");

    if (!tierLimits.allowedAlertChannels.includes(channelType as any)) {
      return NextResponse.json(
        {
          error: "UPGRADE_REQUIRED",
          message: `${channelType} alert channels are not available on the ${userRecord?.plan || "FREE"} plan. Upgrade to access this feature.`,
        },
        { status: 403 }
      );
    }

    const channel = await db.alertChannel.create({
      data: {
        userId,
        providerType: channelType,
        destinationUrl: url,
        userFriendlyName: name?.trim() || null,
      },
    });

    return NextResponse.json({ success: true, channel });
  } catch (error: unknown) {
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
