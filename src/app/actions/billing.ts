"use server";

import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

/**
 * Mutates user billing record tier states upon checkout or cancellation
 */
export async function upgradeUserPlan(userId: string, targetPlan: "FREE" | "PRO" | "BUSINESS") {
  try {
    const session = await auth();
    if (!session.userId || session.userId !== userId) {
      throw new Error("Access denied. Identity signature validation failed.");
    }

    await db.user.update({
      where: { id: userId },
      data: { plan: targetPlan },
    });

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/billing");
    return { success: true };
  } catch (error: any) {
    console.error("BILLING_MUTATION_CRASH:", error);
    return { success: false, error: error.message || "Failed to update billing profile structures" };
  }
}

export async function updateUserAlertThreshold(userId: string, alertThreshold: number) {
  try {
    const session = await auth();
    if (!session.userId || session.userId !== userId) {
      throw new Error("Access denied. Authentication mismatch.");
    }

    await db.user.update({
      where: { id: userId },
      data: { alertThreshold } as any,
    });

    revalidatePath("/dashboard");
    return { success: true };
  } catch (error: any) {
    console.error("ALERT_THRESHOLD_MUTATION_CRASH:", error);
    return { success: false, error: error.message || "Failed to update threshold" };
  }
}

export async function updateUserNotificationSettings(
  userId: string,
  emailEnabled: boolean,
  telegramEnabled: boolean
) {
  try {
    const session = await auth();
    if (!session.userId || session.userId !== userId) {
      throw new Error("Access denied. Authentication signature mismatch.");
    }

    await db.user.update({
      where: { id: userId },
      data: {
        emailNotificationsEnabled: emailEnabled,
        telegramNotificationsEnabled: telegramEnabled,
      } as any,
    });

    revalidatePath("/dashboard");
    return { success: true };
  } catch (error: any) {
    console.error("NOTIFICATION_SETTINGS_MUTATION_CRASH:", error);
    return { success: false, error: error.message || "Failed to update notification settings" };
  }
}

export async function addAlertChannel(
  providerType: string,
  destinationUrl: string,
  userFriendlyName?: string | null
) {
  try {
    const session = await auth();
    if (!session.userId) throw new Error("Unauthorized.");

    const channel = await (db as any).alertChannel.create({
      data: {
        userId: session.userId,
        providerType: providerType.trim().toUpperCase(),
        destinationUrl: destinationUrl.trim(),
        userFriendlyName: userFriendlyName?.trim() || null,
      },
    });

    revalidatePath("/dashboard");
    return { success: true, channel };
  } catch (error: any) {
    console.error("ADD_ALERT_CHANNEL_CRASH:", error);
    return { success: false, error: error.message || "Failed to add channel" };
  }
}

export async function deleteAlertChannel(channelId: string) {
  try {
    const session = await auth();
    if (!session.userId) throw new Error("Unauthorized.");

    const target = await (db as any).alertChannel.findUnique({
      where: { id: channelId },
    });

    if (!target || target.userId !== session.userId) {
      throw new Error("Permission denied.");
    }

    await (db as any).alertChannel.delete({
      where: { id: channelId },
    });

    revalidatePath("/dashboard");
    return { success: true };
  } catch (error: any) {
    console.error("DELETE_ALERT_CHANNEL_CRASH:", error);
    return { success: false, error: error.message || "Failed to delete channel" };
  }
}
