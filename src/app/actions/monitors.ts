"use server";

import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function createMonitor(
  url: string,
  userId: string,
  webhookUrl?: string,
  alertEmail?: string | null,
  telegramChatId?: string | null,
  alertOnFailure: boolean = true,
  httpMethod: string = "GET",
  customHeaders?: Record<string, string> | null,
  expectedBodyText?: string | null
) {
  try {
    const session = await auth();
    if (!session.userId || session.userId !== userId) {
      throw new Error("Access denied. Authentication signature mismatch.");
    }

    let userRecord = await db.user.findUnique({ where: { id: userId } });
    if (!userRecord) {
      userRecord = await db.user.create({
        data: { id: userId, email: userId, plan: "FREE" }
      });
    }

    const currentCount = await db.monitor.count({ where: { userId } });
    const plan = userRecord.plan;

    if (plan === "FREE" && currentCount >= 2) {
      throw new Error("Free Tier monitor limit reached (max 2 endpoints). Upgrade to Pro or Business to expand capacity.");
    }
    if (plan === "PRO" && currentCount >= 20) {
      throw new Error("Pro Tier monitor limit reached (max 20 endpoints). Upgrade to Business Tier for unlimited capacity.");
    }

    const parsedUrl = new URL(url);
    if (!["http:", "https:"].includes(parsedUrl.protocol)) {
      throw new Error("Invalid target protocol. URL must be http:// or https://");
    }

    if (webhookUrl) {
      if (plan === "FREE") {
        throw new Error("Webhook alerts are a premium feature. Upgrade to Pro or Business Tier to activate alerts.");
      }
      const parsedWebhook = new URL(webhookUrl);
      if (plan === "PRO" && !parsedWebhook.hostname.includes("discord")) {
        throw new Error("Pro Tier only supports Discord webhook alert channels. Upgrade to Business Tier to activate Slack or Custom webhooks.");
      }
    }

    const frequency = plan === "FREE" ? 10 : plan === "PRO" ? 1 : 30;

    const monitor = await db.monitor.create({
      data: {
        url: parsedUrl.href,
        webhookUrl: webhookUrl || null,
        userId,
        frequency,
        isActive: true,
        alertEmail: alertEmail || null,
        telegramChatId: telegramChatId || null,
        alertOnFailure,
        httpMethod: httpMethod || "GET",
        customHeaders: customHeaders ?? null,
        expectedBodyText: expectedBodyText || null,
      } as any,
    });

    revalidatePath("/dashboard");
    return { success: true, monitor };
  } catch (error: any) {
    console.error("FAILED_TO_CREATE_MONITOR:", error);
    return { success: false, error: error.message || "Failed to register endpoint" };
  }
}

export async function deleteMonitor(monitorId: string) {
  try {
    const session = await auth();
    if (!session.userId) throw new Error("Unauthorized execution context request.");

    const target = await db.monitor.findUnique({ where: { id: monitorId } });
    if (!target || target.userId !== session.userId) {
      throw new Error("Permission denied. Target identity records do not match active profile session.");
    }

    await db.pingLog.deleteMany({ where: { monitorId } });
    await db.monitor.delete({ where: { id: monitorId } });

    revalidatePath("/dashboard");
    return { success: true };
  } catch (error: any) {
    console.error("FAILED_TO_DELETE_MONITOR:", error);
    return { success: false, error: error.message || "Failed to terminate channel" };
  }
}

export async function toggleMonitor(monitorId: string) {
  try {
    const session = await auth();
    if (!session.userId) throw new Error("Unauthorized.");

    const target = await db.monitor.findUnique({ where: { id: monitorId } });
    if (!target || target.userId !== session.userId) {
      throw new Error("Permission denied.");
    }

    await db.monitor.update({
      where: { id: monitorId },
      data: { isActive: !target.isActive },
    });

    revalidatePath("/dashboard");
    return { success: true, isActive: !target.isActive };
  } catch (error: any) {
    console.error("FAILED_TO_TOGGLE_MONITOR:", error);
    return { success: false, error: error.message || "Failed to toggle monitor" };
  }
}

export async function updateMonitorAlert(
  monitorId: string,
  alertEmail: string | null,
  telegramChatId: string | null,
  webhookUrl: string | null = null,
  alertOnFailure: boolean = true,
  method: string = "GET",
  headers: string | null = null,
  body: string | null = null,
  keywordCheck: string | null = null,
  sslTrack: boolean = false,
  isHeartbeat: boolean = false
) {
  try {
    const session = await auth();
    if (!session.userId) throw new Error("Unauthorized.");

    const target = await db.monitor.findUnique({ where: { id: monitorId } });
    if (!target || target.userId !== session.userId) {
      throw new Error("Permission denied.");
    }

    await db.monitor.update({
      where: { id: monitorId },
      data: {
        alertEmail: alertEmail || null,
        telegramChatId: telegramChatId || null,
        webhookUrl: webhookUrl || null,
        alertOnFailure,
        method: method || "GET",
        headers: headers || null,
        body: body || null,
        keywordCheck: keywordCheck || null,
        sslTrack,
        isHeartbeat,
      } as any,
    });

    revalidatePath("/dashboard");
    return { success: true };
  } catch (error: any) {
    console.error("FAILED_TO_UPDATE_MONITOR_ALERT:", error);
    return { success: false, error: error.message || "Failed to update alert settings" };
  }
}

export async function createHeartbeat(
  name: string,
  frequencySeconds: number = 3600,
  gracePeriodSeconds: number = 300
) {
  try {
    const session = await auth();
    if (!session.userId) throw new Error("Unauthorized.");

    const heartbeat = await (db as any).heartbeat.create({
      data: {
        name: name.trim(),
        frequencySeconds,
        gracePeriodSeconds,
        userId: session.userId,
        isActive: true,
      },
    });

    revalidatePath("/dashboard");
    return { success: true, heartbeat };
  } catch (error: any) {
    console.error("FAILED_TO_CREATE_HEARTBEAT:", error);
    return { success: false, error: error.message || "Failed to create heartbeat" };
  }
}

export async function toggleMonitorAlertChannel(
  monitorId: string,
  channelId: string,
  enabled: boolean
) {
  try {
    const session = await auth();
    if (!session.userId) throw new Error("Unauthorized.");

    const monitor = await db.monitor.findUnique({
      where: { id: monitorId },
    });
    if (!monitor || monitor.userId !== session.userId) {
      throw new Error("Access denied. Monitor not found.");
    }

    const channel = await (db as any).alertChannel.findUnique({
      where: { id: channelId },
    });
    if (!channel || channel.userId !== session.userId) {
      throw new Error("Access denied. Alert channel not found.");
    }

    if (enabled) {
      await db.monitor.update({
        where: { id: monitorId },
        data: {
          alertChannels: {
            connect: { id: channelId },
          },
        } as any,
      });
    } else {
      await db.monitor.update({
        where: { id: monitorId },
        data: {
          alertChannels: {
            disconnect: { id: channelId },
          },
        } as any,
      });
    }

    revalidatePath("/dashboard");
    return { success: true };
  } catch (error: any) {
    console.error("FAILED_TO_TOGGLE_MONITOR_ALERT_CHANNEL:", error);
    return { success: false, error: error.message || "Failed to toggle alert channel link" };
  }
}

export async function getLatestTelemetry(userId: string) {
  try {
    const session = await auth();
    if (!session.userId || session.userId !== userId) {
      throw new Error("Unauthorized.");
    }

    const monitors = await db.monitor.findMany({
      where: { userId },
      select: {
        id: true,
        url: true,
        isActive: true,
        frequency: true,
        alertEmail: true,
        telegramChatId: true,
        webhookUrl: true,
        alertOnFailure: true,
        method: true,
        headers: true,
        body: true,
        keywordCheck: true,
        sslTrack: true,
        isHeartbeat: true,
        alertChannels: {
          select: {
            id: true,
            providerType: true,
            destinationUrl: true,
            userFriendlyName: true,
          }
        },
        logs: {
          orderBy: { checkedAt: "desc" },
          take: 100,
          select: {
            id: true,
            statusCode: true,
            latency: true,
            checkedAt: true,
          }
        }
      } as any,
      orderBy: { id: "desc" },
    });

    return {
      success: true,
      monitors: monitors.map((m: any) => ({
        id: m.id,
        url: m.url,
        isActive: m.isActive,
        frequency: m.frequency,
        alertEmail: m.alertEmail ?? null,
        telegramChatId: m.telegramChatId ?? null,
        webhookUrl: m.webhookUrl ?? null,
        alertOnFailure: m.alertOnFailure,
        method: m.method ?? "GET",
        headers: m.headers ?? null,
        body: m.body ?? null,
        keywordCheck: m.keywordCheck ?? null,
        sslTrack: m.sslTrack ?? false,
        isHeartbeat: m.isHeartbeat ?? false,
        alertChannels: (m.alertChannels || []).map((ch: any) => ({
          id: ch.id,
          providerType: ch.providerType,
          destinationUrl: ch.destinationUrl,
          userFriendlyName: ch.userFriendlyName ?? null,
        })),
        logs: m.logs.map((l: any) => ({
          id: l.id,
          statusCode: l.statusCode,
          latency: l.latency,
          checkedAt: l.checkedAt instanceof Date ? l.checkedAt.toISOString() : l.checkedAt,
        })),
      })),
    };
  } catch (err: any) {
    console.error("FAILED_TO_GET_LATEST_TELEMETRY:", err);
    return { success: false, error: err.message || "Failed to fetch fresh telemetry" };
  }
}
