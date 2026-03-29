export const TIER_LIMITS = {
  free: {
    // TODO: Define your free tier limits
    maxItems: 10,
    hasExport: false,
    hasProfiles: false,
  },
  pro: {
    maxItems: Infinity,
    hasExport: true,
    hasProfiles: false,
  },
  family: {
    maxItems: Infinity,
    hasExport: true,
    hasProfiles: true,
  },
} as const;

export type Tier = keyof typeof TIER_LIMITS;

export function getTierLimits(tier: string) {
  return TIER_LIMITS[tier as Tier] || TIER_LIMITS.free;
}

export const TIER_LABELS: Record<string, string> = {
  free: "Free",
  pro: "Pro",
  family: "Family",
};
