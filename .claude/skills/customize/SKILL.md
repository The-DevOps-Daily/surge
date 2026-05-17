---
name: customize
description: |
  Personalize this SaaS starter for the user's product. Conversationally
  collects product name, tagline, brand color, support email, social handles,
  optional pricing edits, optional env var bootstrap. Edits the codebase to
  match. Use this when the user has just cloned the starter and says
  something like "let's make this mine" or "set this up for my SaaS".
---

# /customize

This skill walks the user through turning the surge starter into their own SaaS. Default is conversational — ask one question at a time, show what you're about to change, then change it. If the user says `/customize --quick`, do Tier 1 (brand swap only) in one shot without asking.

## Steps

### 1. Greet + ask scope

> "I can customize this starter for your product. Want to do the **full** walkthrough (brand + commerce + content + data model) or just the **quick brand swap**?"

If `--quick`: skip to step 2, do only Tier 1, commit, done.
If full: confirm scope ahead of each tier so the user can skip.

### 2. Tier 1 — Brand swap

Collect:
- Product name (replaces "SaaS App", "Surge", "Your SaaS App" everywhere)
- Tagline (replaces "Your tagline here" / "Production-ready Next.js starter kit")
- Support email (replaces `support@your-app.com`)
- Primary accent — keep green or swap. Show options: green (current), blue, violet, amber, rose, slate. If they pick something else, update `--accent`, `--accent-strong`, `--accent-soft`, `--accent-ring` in `src/app/globals.css` (both `:root` and `.dark` blocks).
- Domain (replaces `your-app.com` and `example.com` in robots.txt, llms.txt, sitemap)

Files to grep for and replace (in order — do these with the Edit tool one symbol at a time, don't bulk-sed):

1. `src/lib/seo.ts` — `siteName`, `defaultDescription`
2. `src/app/layout.tsx` — `metadata.title.default`, `metadata.title.template`, `metadata.description`
3. `src/app/landing/layout.tsx` — `metadata`
4. `src/app/(marketing)/compare/page.tsx` — competitors array + page title (currently "SaaS App vs the rest")
5. `src/app/(marketing)/privacy/page.tsx` and `terms/page.tsx` — "SaaS App" mentions
6. `src/components/marketing/marketing-nav.tsx` — brand mark text
7. `src/components/marketing/marketing-footer.tsx` — brand mark + copyright + social URLs
8. `src/components/landing-nav.tsx` — brand mark
9. `src/lib/email-layout.ts` — `appName` default
10. All `api/auth/*` routes, `api/stripe/webhook/route.ts`, `lib/email.ts`, `api/unsubscribe/route.ts` — `appName` and `from` defaults
11. `public/manifest.json` — `name`, `short_name`, `description`
12. `public/llms.txt` — site description + product copy
13. `public/robots.txt` — Sitemap URL host
14. `README.md` — title + tagline (keep the Built-on-Surge link, see below)

Brand mark SVG: if they want different colors, update `public/favicon.svg`, `public/icon-192.svg`, `public/icon-512.svg`, `public/manifest.json` (`theme_color`, `background_color`).

After Tier 1 changes, run `npx tsc --noEmit` and `npm test`. Commit as `chore(customize): brand swap to <product-name>`.

### 3. Tier 2 — Commerce (only if user confirms)

- Walk through `src/lib/pricing.ts`. Ask which tiers they want (default: free + pro + team). Edit names, prices, features, CTAs.
- Open `.env.example`. Show the Stripe vars (`STRIPE_SECRET_KEY`, `NEXT_PUBLIC_STRIPE_*_PRICE_ID`, `STRIPE_WEBHOOK_SECRET`, `NEXTAUTH_SECRET`, `SMTPFAST_API_KEY`, `SMTPFAST_FROM_EMAIL`). Offer to generate a fresh `NEXTAUTH_SECRET` via `openssl rand -base64 32`. Don't fill in real keys for the user — explain what each is and point at the Stripe / smtpfa.st dashboards.
- If a `.env.local` already exists, don't overwrite it. Just diff what's missing.

Commit as `chore(customize): pricing + env scaffold`.

### 4. Tier 3 — Content (only if user confirms)

- Landing page hero copy: `src/app/landing/page.tsx`. Replace the placeholder hero + features. Ask the user for: hero headline, hero subhead, 3 feature bullets.
- `/compare` page: replace the competitors array in `src/app/(marketing)/compare/page.tsx` with theirs.
- `/privacy` and `/terms`: flag that they need a lawyer's eyes but offer to swap the placeholder product name.
- Sample blog post: optionally write a "Welcome to <product>" post under `content/blog/`.

Commit as `chore(customize): landing + marketing copy`.

### 5. Tier 4 — Data model (only if user confirms)

This is the deepest tier. Ask: "What does your SaaS do? Describe the core thing a user creates or tracks."

Based on the answer:
- Add a Prisma model to `prisma/schema.prisma` (with `userId` foreign key, `createdAt`, `updatedAt`, and the fields they describe).
- Run `npx prisma migrate dev --name add_<model>` — but don't run this yourself; print the command and ask them to run it.
- Wire `src/app/api/dashboard/route.ts` to query the new model and return real numbers.
- Wire `src/app/api/export/route.ts` to export the new model's rows.
- Wire `src/app/api/user/delete/route.ts` — add `await tx.<model>.deleteMany({ where: { userId } })` before the user delete.
- Wire `src/lib/tier-limits.ts` with caps that make sense for the model (e.g. free: 10 items, pro: unlimited).
- Scaffold a basic CRUD route at `src/app/api/<model>/route.ts` using the `/add-api-route` skill.

Commit as `feat(customize): wire <model> data model`.

### 6. Wrap-up

Summarize what changed, what's left for the user to do (Stripe price IDs, verified smtpfa.st sending domain, OAuth providers if they want them, etc.), and remind them about `/add-page`, `/add-api-route`, `/add-stripe-tier`, `/add-email` for further work.

If they didn't change the README's "Built on Surge" link, leave it. If they explicitly want to remove the attribution, mention that the LICENSE just requires preserving the copyright line, not the marketing link.

## Notes

- Always show the user a diff (or summarize the changes) before committing. Bobby's style is to confirm before destructive or visible actions.
- Don't push to remote — user does that themselves.
- If `git status` is dirty at the start, ask before staging. Don't bulldoze in-progress work.
- Use the Edit tool one symbol at a time. Don't sed across the whole repo — too easy to corrupt code comments or strings.
