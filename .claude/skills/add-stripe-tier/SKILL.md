---
name: add-stripe-tier
description: |
  Add a new Stripe pricing tier across env vars, lib/pricing.ts,
  the billing page, the settings page, the pricing page, and the
  webhook handler. Use when the user says "add a new plan",
  "add a tier", or "wire up a new Stripe price".
---

# /add-stripe-tier

## Steps

### 1. Collect tier info

- Tier key (snake_case, used in DB tier column and env vars): e.g. `team`, `enterprise`, `growth`.
- Display name (capitalized): "Team", "Enterprise".
- Monthly price (number + display): e.g. `49` → `$49`.
- Yearly price (number + display): e.g. `490` → `$490`. Convention: 2 months free → yearly = monthly × 10.
- Description, features array, CTA copy, highlighted (yes/no).
- Stripe price IDs (monthly + yearly) — user creates these in their Stripe dashboard.

### 2. Update env scaffold

Edit `.env.example`:

```
NEXT_PUBLIC_STRIPE_<TIER_UPPER>_PRICE_ID=
NEXT_PUBLIC_STRIPE_<TIER_UPPER>_YEARLY_PRICE_ID=
```

Don't edit `.env` or `.env.local` — those have real secrets.

### 3. Update lib/pricing.ts

Add the tier to the `PLANS` object. Match the existing structure exactly — every field present, even empty arrays. Add the new key to `TIER_LABELS` too.

### 4. Update the billing page

`src/app/(app)/billing/page.tsx`. The `PlanCard` component already takes `planKey`, monthly/yearly IDs, and a highlighted flag. In the grid, add a third (or fourth) `<PlanCard>` invocation with the new tier's IDs and `highlighted={false}` (unless they want this one to be the promoted tier — only one tier should be highlighted).

### 5. Update the pricing page

`src/components/marketing/pricing-tiers.tsx` reads from `PLANS` automatically, so no edits there — but if the grid is `md:grid-cols-3` and they're adding a 4th tier, change to `md:grid-cols-2 lg:grid-cols-4`.

### 6. Update the settings page

`src/app/(app)/settings/page.tsx`. The Subscription section has the upgrade buttons. Add a third button for the new tier next to "Upgrade to Pro" and "Get Team".

### 7. Update the webhook handler

`src/app/api/stripe/webhook/route.ts`. Find the price-ID-to-tier mapping (in `checkout.session.completed` or `customer.subscription.updated`). Add:

```ts
if (priceId === process.env.NEXT_PUBLIC_STRIPE_<TIER_UPPER>_PRICE_ID ||
    priceId === process.env.NEXT_PUBLIC_STRIPE_<TIER_UPPER>_YEARLY_PRICE_ID) {
  tier = "<tier_key>";
}
```

### 8. Update isPaid helpers (if any)

Grep for `tier === "pro" || tier === "family"`. Update each occurrence to include the new tier. Common spots: `src/lib/admin.ts`-adjacent, settings page, billing page, dashboard upgrade prompt, `api/export/route.ts`.

If you're adding tiers a lot, consider extracting an `isPaidTier(tier)` helper to `lib/pricing.ts` — but only after the second time you've grepped.

### 9. Update tier-limits.ts

`src/lib/tier-limits.ts` — add the new tier's caps. Pro and Family should usually be `Infinity` for most resources, but the new tier might have its own caps (especially if it's a team plan with seat limits).

### 10. Verify

- `npx tsc --noEmit` clean.
- `npm test` green.
- Print the user a checklist of Stripe dashboard tasks they need to do: create the product, create monthly + yearly prices, copy the price IDs into `.env`, configure the webhook signing secret in Stripe to point at their endpoint.

## Conventions

- Tier keys are snake_case in env and DB, capitalized in UI labels.
- The "highlighted" flag should be on at most one tier at a time.
- Don't let the user remove the `free` tier — too many code paths assume it exists as the default.
