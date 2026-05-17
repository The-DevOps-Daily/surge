// Centralized pricing config - edit prices here, they update everywhere
export const PLANS = {
  free: {
    name: "Free",
    price: "$0",
    monthlyPrice: "$0",
    yearlyPrice: "$0",
    monthlyPriceNum: 0,
    yearlyPriceNum: 0,
    period: "forever",
    yearlySavings: "",
    description: "Perfect for getting started",
    features: [
      "Core features",
      "Basic dashboard",
      "Community support",
    ],
    notIncluded: [
      "Advanced features",
      "CSV & JSON export",
      "Monthly reports",
      "Priority support",
    ],
    cta: "Start Free",
    href: "/register",
    highlighted: false,
  },
  pro: {
    name: "Pro",
    price: "$9",
    monthlyPrice: "$9",
    yearlyPrice: "$90",
    monthlyPriceNum: 9,
    yearlyPriceNum: 90,
    period: "/month",
    yearlySavings: "2 months free",
    description: "For power users",
    features: [
      "Everything in Free",
      "Unlimited usage",
      "Advanced features",
      "CSV & JSON export",
      "Monthly reports",
      "Priority support",
    ],
    notIncluded: [],
    cta: "Get Pro",
    href: "/billing?plan=pro",
    highlighted: true,
  },
  family: {
    name: "Team",
    price: "$29",
    monthlyPrice: "$29",
    yearlyPrice: "$290",
    monthlyPriceNum: 29,
    yearlyPriceNum: 290,
    period: "/month",
    yearlySavings: "2 months free",
    description: "For teams and organizations",
    features: [
      "Everything in Pro",
      "Multiple seats",
      "Shared dashboards",
      "Admin controls",
      "Dedicated support",
    ],
    notIncluded: [],
    cta: "Get Team",
    href: "/billing?plan=family",
    highlighted: false,
  },
} as const;

export type PlanKey = keyof typeof PLANS;

export const TIER_LABELS: Record<string, string> = {
  free: "Free",
  pro: "Pro",
  family: "Team",
};

export function getPlan(key: string) {
  return PLANS[key as PlanKey] || PLANS.free;
}

/**
 * Single source of truth for "is this user on a paid plan". Centralizing this
 * means adding a new tier (or splitting one apart) doesn't require grepping
 * every page that gates features.
 */
const PAID_TIERS: ReadonlySet<string> = new Set(["pro", "family"]);

export function isPaidTier(tier: string | null | undefined): boolean {
  if (!tier) return false;
  return PAID_TIERS.has(tier);
}
