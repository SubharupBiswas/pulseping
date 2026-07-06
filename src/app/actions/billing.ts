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
