import { currentUser } from "@clerk/nextjs/server";
import { db } from "@/lib/db";

export interface UserRecord {
  id: string;
  email: string;
  plan: string;
  alertThreshold: number;
  emailNotificationsEnabled: boolean;
  telegramNotificationsEnabled: boolean;
  alertChannels: Array<{
    id: string;
    providerType: string;
    destinationUrl: string;
    userFriendlyName: string | null;
  }>;
}

export async function getOrCreateUser(userId: string): Promise<UserRecord> {
  const fallbackRecord: UserRecord = {
    id: userId,
    email: `${userId}@user.pulseping.com`,
    plan: "FREE",
    alertThreshold: 3,
    emailNotificationsEnabled: true,
    telegramNotificationsEnabled: false,
    alertChannels: [],
  };

  if (!userId || userId === "mock-user-uuid") {
    return fallbackRecord;
  }

  const alertChannelSelect = {
    select: {
      id: true,
      providerType: true,
      destinationUrl: true,
      userFriendlyName: true,
    },
  };

  try {
    // 1. FAST PATH: Read without database write locks (handles 99.9% of user requests)
    const existingUser = await db.user.findUnique({
      where: { id: userId },
      include: { alertChannels: alertChannelSelect },
    });

    if (existingUser) {
      return {
        id: existingUser.id,
        email: existingUser.email,
        plan: existingUser.plan || "FREE",
        alertThreshold: existingUser.alertThreshold ?? 3,
        emailNotificationsEnabled: existingUser.emailNotificationsEnabled !== false,
        telegramNotificationsEnabled: Boolean(existingUser.telegramNotificationsEnabled),
        alertChannels: (existingUser.alertChannels || []).map((ch: any) => ({
          id: ch.id,
          providerType: ch.providerType,
          destinationUrl: ch.destinationUrl,
          userFriendlyName: ch.userFriendlyName ?? null,
        })),
      };
    }

    // 2. SLOW PATH: First-time user creation
    let userEmail = `${userId}@user.pulseping.com`;
    try {
      const clerkUser = await currentUser();
      const primaryEmail =
        clerkUser?.emailAddresses?.find((e) => e.id === clerkUser.primaryEmailAddressId)
          ?.emailAddress || clerkUser?.emailAddresses?.[0]?.emailAddress;

      if (primaryEmail) {
        userEmail = primaryEmail;
      }
    } catch {
      // Fallback to synthetic email if Clerk API fetch is unavailable
    }

    const newUser = await db.user.create({
      data: {
        id: userId,
        email: userEmail,
        plan: "FREE",
        alertThreshold: 3,
        emailNotificationsEnabled: true,
        telegramNotificationsEnabled: false,
      },
      include: { alertChannels: alertChannelSelect },
    });

    return {
      id: newUser.id,
      email: newUser.email,
      plan: newUser.plan || "FREE",
      alertThreshold: newUser.alertThreshold ?? 3,
      emailNotificationsEnabled: newUser.emailNotificationsEnabled !== false,
      telegramNotificationsEnabled: Boolean(newUser.telegramNotificationsEnabled),
      alertChannels: (newUser.alertChannels || []).map((ch: any) => ({
        id: ch.id,
        providerType: ch.providerType,
        destinationUrl: ch.destinationUrl,
        userFriendlyName: ch.userFriendlyName ?? null,
      })),
    };
  } catch (err: any) {
    // 3. RACE CONDITION GUARD: If a concurrent request created the user mid-flight
    if (err?.code === "P2002") {
      try {
        const raceUser = await db.user.findUnique({
          where: { id: userId },
          include: { alertChannels: alertChannelSelect },
        });

        if (raceUser) {
          return {
            id: raceUser.id,
            email: raceUser.email,
            plan: raceUser.plan || "FREE",
            alertThreshold: raceUser.alertThreshold ?? 3,
            emailNotificationsEnabled: raceUser.emailNotificationsEnabled !== false,
            telegramNotificationsEnabled: Boolean(raceUser.telegramNotificationsEnabled),
            alertChannels: (raceUser.alertChannels || []).map((ch: any) => ({
              id: ch.id,
              providerType: ch.providerType,
              destinationUrl: ch.destinationUrl,
              userFriendlyName: ch.userFriendlyName ?? null,
            })),
          };
        }
      } catch {
        // Fallthrough to fallback
      }
    }

    console.error("Error in getOrCreateUser:", err);
    return fallbackRecord;
  }
}