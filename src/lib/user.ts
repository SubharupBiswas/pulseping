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

  try {
    let rawUser = await db.user.findUnique({
      where: { id: userId },
      include: {
        alertChannels: {
          select: {
            id: true,
            providerType: true,
            destinationUrl: true,
            userFriendlyName: true,
          },
        },
      },
    });

    if (!rawUser) {
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

      try {
        rawUser = await db.user.create({
          data: {
            id: userId,
            email: userEmail,
            plan: "FREE",
            alertThreshold: 3,
            emailNotificationsEnabled: true,
            telegramNotificationsEnabled: false,
          },
          include: {
            alertChannels: {
              select: {
                id: true,
                providerType: true,
                destinationUrl: true,
                userFriendlyName: true,
              },
            },
          },
        });
      } catch (createErr) {
        rawUser = await db.user.findUnique({
          where: { id: userId },
          include: {
            alertChannels: {
              select: {
                id: true,
                providerType: true,
                destinationUrl: true,
                userFriendlyName: true,
              },
            },
          },
        });

        if (!rawUser) {
          rawUser = await db.user.create({
            data: {
              id: userId,
              email: `${userId}-${Date.now()}@user.pulseping.com`,
              plan: "FREE",
              alertThreshold: 3,
              emailNotificationsEnabled: true,
              telegramNotificationsEnabled: false,
            },
            include: {
              alertChannels: {
                select: {
                  id: true,
                  providerType: true,
                  destinationUrl: true,
                  userFriendlyName: true,
                },
              },
            },
          });
        }
      }
    }

    return {
      id: rawUser.id,
      email: rawUser.email,
      plan: rawUser.plan || "FREE",
      alertThreshold: rawUser.alertThreshold ?? 3,
      emailNotificationsEnabled: rawUser.emailNotificationsEnabled !== false,
      telegramNotificationsEnabled: Boolean(rawUser.telegramNotificationsEnabled),
      alertChannels: (rawUser.alertChannels || []).map((ch: any) => ({
        id: ch.id,
        providerType: ch.providerType,
        destinationUrl: ch.destinationUrl,
        userFriendlyName: ch.userFriendlyName ?? null,
      })),
    };
  } catch (err) {
    console.error("Error in getOrCreateUser:", err);
    return fallbackRecord;
  }
}
