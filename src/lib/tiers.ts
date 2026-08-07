export type PlanTier = "FREE" | "PRO" | "BUSINESS";

export interface TierConfig {
  maxMonitors: number;
  minIntervalSeconds: number; // 180 for FREE (3m), 30 for PRO, 10 for BUSINESS
  maxHeartbeats: number;
  maxStatusPages: number; // 1 for FREE, 3 for PRO, Infinity for BUSINESS
  allowRemoveBadge: boolean;
  aiDiagnosticDepth: "BASIC" | "DETAILED" | "PRIORITY";
  allowedAlertChannels: ("EMAIL" | "DISCORD" | "SLACK" | "TELEGRAM" | "WEBHOOK")[];
  logRetentionDays: number;
  priceMonthlyINR: number;
  priceMonthlyUSD: number;
}

export const TIER_LIMITS: Record<PlanTier, TierConfig> = {
  FREE: {
    maxMonitors: 2,
    minIntervalSeconds: 180,
    maxHeartbeats: 1,
    maxStatusPages: 1,
    allowRemoveBadge: false,
    aiDiagnosticDepth: "BASIC",
    allowedAlertChannels: ["EMAIL"],
    logRetentionDays: 7,
    priceMonthlyINR: 0,
    priceMonthlyUSD: 0,
  },
  PRO: {
    maxMonitors: 20,
    minIntervalSeconds: 30,
    maxHeartbeats: 5,
    maxStatusPages: 3,
    allowRemoveBadge: true,
    aiDiagnosticDepth: "DETAILED",
    allowedAlertChannels: ["EMAIL", "DISCORD", "SLACK", "TELEGRAM"],
    logRetentionDays: 30,
    priceMonthlyINR: 699,
    priceMonthlyUSD: 9,
  },
  BUSINESS: {
    maxMonitors: 100,
    minIntervalSeconds: 10,
    maxHeartbeats: 25,
    maxStatusPages: 999,
    allowRemoveBadge: true,
    aiDiagnosticDepth: "PRIORITY",
    allowedAlertChannels: ["EMAIL", "DISCORD", "SLACK", "TELEGRAM", "WEBHOOK"],
    logRetentionDays: 90,
    priceMonthlyINR: 2199,
    priceMonthlyUSD: 29,
  },
};

export function getTierLimits(plan: string): TierConfig {
  const tier = (plan?.toUpperCase() || "FREE") as PlanTier;
  return TIER_LIMITS[tier] ?? TIER_LIMITS.FREE;
}
