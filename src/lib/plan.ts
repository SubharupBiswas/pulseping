export const getPollingIntervalText = (tier?: string) => {
  switch (tier?.toUpperCase()) {
    case "BUSINESS":
      return "10 seconds";
    case "PRO":
      return "30 seconds";
    default:
      return "3 minutes";
  }
};

const TIER_RANKS: Record<string, number> = {
  FREE: 0,
  PRO: 1,
  BUSINESS: 2,
};

export function getPlanActionState(planTier: string, currentActiveTier: string) {
  const currentRank = TIER_RANKS[currentActiveTier?.toUpperCase()] ?? 0;
  const targetRank = TIER_RANKS[planTier?.toUpperCase()] ?? 0;

  if (currentRank === targetRank) {
    return {
      label: "Current Plan",
      disabled: true,
      variant: "outline" as const,
    };
  }

  if (currentRank < targetRank) {
    return {
      label: `Upgrade to ${planTier}`,
      disabled: false,
      variant: "default" as const,
    };
  }

  return {
    label: `Downgrade to ${planTier}`,
    disabled: false,
    variant: "secondary" as const,
  };
}
