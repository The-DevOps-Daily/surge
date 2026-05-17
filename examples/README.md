# examples/

Canonical snippets that the skills in `.claude/skills/` copy from. Each file is a complete, working pattern you can reference verbatim.

These are **not** wired into the app — they're reference. To use one, copy it into the right location under `src/app/` or `src/components/`, rename, and adapt.

## Index

| File | What it shows |
|---|---|
| `authed-api-route.ts` | POST handler with session check, JSON validation, rate limit, error response. |
| `admin-api-route.ts` | Admin-only route using `requireAdmin()`. |
| `tier-gated-page.tsx` | Page that reads the user's tier and shows a paywall for free users. |
| `admin-table-page.tsx` | Full admin list page: search/filter/pagination + detail modal + token-driven styling. |
| `stripe-webhook-handler.ts` | Adding a new event case to the Stripe webhook (e.g. `customer.subscription.trial_will_end`). |
| `transactional-email.ts` | Sending a one-off email through the shared `emailLayout` helper. |

If you need a pattern that isn't here, add it. The skills auto-discover anything in this directory.
