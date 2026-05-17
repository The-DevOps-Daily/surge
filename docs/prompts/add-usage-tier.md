# Prompt: Add a usage-based tier

Adds metered billing (Stripe metered prices) for power users.

```
I want to add a usage-based "Scale" tier in addition to the existing
flat Pro and Team plans. Pricing: $0.001 per API call, billed monthly,
with a 1M call cap before they get throttled to 429.

Plan:
1. Run /add-stripe-tier for "Scale" with a metered Stripe price.
2. Add a UsageRecord model to schema.prisma (userId, eventType, count,
   periodStart). Add @@index([userId, periodStart]).
3. Add a helper in lib/usage.ts that records usage events and reports
   monthly totals to Stripe via the Usage Records API.
4. Add a middleware that increments UsageRecord and 429s when the cap
   is hit.
5. Wire the migration into api/user/delete/route.ts cascade.
6. Add a "Usage this month" widget to the dashboard.

Don't run prisma migrate yourself — show me the command and I'll run it.
```

## Why give Claude this much structure

The skills + CLAUDE.md handle the boilerplate (auth, rate limit, validation, token-driven UI). Your job is to define the *business logic* — the cap, the rate, the model fields, the cascade. The prompt above isolates exactly that.

If you skip the plan and just say "add a usage tier", Claude will guess at the schema. With the plan, it asks zero clarifying questions and gets it right on the first try.
