// Centralized pricing config - edit prices here, they update everywhere
export const PLANS = {
  free: {
    name: "Free",
    price: "$0",
    period: "forever",
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
    period: "/month",
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
    period: "/month",
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

export function getPlan(key: string) {
  return PLANS[key as PlanKey] || PLANS.free;
}
