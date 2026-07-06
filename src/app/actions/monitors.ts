"use server";

import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function createMonitor(url: string, userId: string, webhookUrl?: string) {
  try {
    const session = await auth();
    if (!session.userId || session.userId !== userId) {
      throw new Error("Access denied. Authentication signature mismatch.");
    }

    // 1. Fetch or create the user profile to identify their operational plan tier
    let userRecord = await db.user.findUnique({ where: { id: userId } });
    if (!userRecord) {
      userRecord = await db.user.create({
        data: { id: userId, email: userId, plan: "FREE" }
      });
    }

    // 2. Query active monitor allocations to enforce resource caps
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

    // 3. Webhook configurations and validation rules
    if (webhookUrl) {
      if (plan === "FREE") {
        throw new Error("Webhook alerts are a premium feature. Upgrade to Pro or Business Tier to activate alerts.");
      }

      const parsedWebhook = new URL(webhookUrl);
      if (plan === "PRO" && !parsedWebhook.hostname.includes("discord")) {
        throw new Error("Pro Tier only supports Discord webhook alert channels. Upgrade to Business Tier to activate Slack or Custom webhooks.");
      }
    }

    // 4. Default frequency configuration based on plan
    // FREE: 10 mins, PRO: 1 min, BUSINESS: 30 secs
    const frequency = plan === "FREE" ? 10 : plan === "PRO" ? 1 : 30;

    const monitor = await db.monitor.create({
      data: {
        url: parsedUrl.href,
        webhookUrl: webhookUrl || null,
        userId,
        frequency,
        isActive: true,
      },
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
