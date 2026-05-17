# Surge — Guidance for Claude

This file primes Claude (and any other agent that reads it) with the conventions, primitives, and constraints of this repo. It saves you from rediscovering the same patterns each session.

If a task in this repo matches one of the skills in `.claude/skills/`, use that skill. It's faster and produces output that matches the codebase.

---

## Stack at a glance

- **Next.js 16** App Router with route groups: `(app)` (authed), `(admin)` (role-gated), `(marketing)` (public).
- **TypeScript** strict, no `any`.
- **Tailwind CSS 4** via `@import "tailwindcss"` — no `tailwind.config.js`. Tokens live in `src/app/globals.css`.
- **Prisma 6 / SQLite** (Postgres in prod). Schema at `prisma/schema.prisma`. Migrations via `npx prisma migrate dev`.
- **NextAuth v5** beta. Credentials provider. Session via `import { auth } from "@/lib/auth"`.
- **Stripe** for billing. Webhook at `/api/stripe/webhook`. Plans in `src/lib/pricing.ts`.
- **smtpfa.st** for transactional email (REST, no SDK). All sends go through `sendEmail()` in `src/lib/email.ts`. Shared HTML scaffold in `src/lib/email-layout.ts`.
- **Vitest** for tests. Run via `npm test` (which is `vitest run`).

---

## Hard rules

1. **Never run `npm run dev` or `npm run build` on the host the user is editing from.** They're constrained. Use `npx tsc --noEmit` to type-check and `npm test` to run tests. CI builds the full app.
2. **No hardcoded colors in components.** Every color comes from a CSS variable defined in `globals.css`: `var(--surface-N)`, `var(--line-N)`, `var(--ink-N)`, `var(--accent)`, `var(--warn)`, `var(--danger)`. The token-enforcer subagent will flag violations.
3. **All form controls use the primitives** in `src/components/ui/input.tsx` (`Input`, `Select`, `Textarea`). Never raw `<input>` / `<select>` / `<textarea>` in pages — that bypasses focus rings, label/aria pairing, and theme handling.
4. **All confirms use `<ConfirmDialog>`** from `src/components/ui/confirm-dialog.tsx`. Never `window.confirm()`.
5. **All toasts use `useToast()`** from `src/components/ui/toast.tsx`. Never `window.alert()`.
6. **All modals use `<Modal>`** from `src/components/ui/modal.tsx` (handles focus restore, ESC, overlay click).
7. **All transactional emails use `emailLayout()`** from `src/lib/email-layout.ts` so they render light-friendly across clients.
8. **Rate-limit every auth-adjacent route.** Pattern in `src/lib/rate-limit.ts`. See `forgot-password`, `reset-password`, `register`, `user/password`.
9. **Auth check pattern.** Every authed route handler starts with:
   ```ts
   const session = await auth();
   if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
   ```
10. **Admin check pattern.** Use `requireAdmin()` from `src/lib/admin.ts`. Returns `null` if not admin — redirect or 403.

---

## Primitives directory (read this before adding UI)

| Need | Use |
|---|---|
| Button | `src/components/ui/button.tsx` — variants: `primary`, `accent`, `secondary`, `ghost`, `danger`. Has `loading` prop with built-in spinner. |
| Card surface | `src/components/ui/card.tsx` — variants: `flat`, `raised`, `interactive`. Auto-promotes to `interactive` if `onClick` is set. |
| Form control | `src/components/ui/input.tsx` — `Input`, `Select` (takes `options: {value,label}[]`), `Textarea`. All accept `label`, `error`, `hint`. |
| Modal | `src/components/ui/modal.tsx` — `<Modal isOpen onClose title description footer>`. |
| Confirm | `src/components/ui/confirm-dialog.tsx` — `<ConfirmDialog isOpen onClose onConfirm tone="danger">`. |
| Toast | `useToast()` from `src/components/ui/toast.tsx` — `addToast(message, "success" | "error" | "info")`. |
| Theme toggle | `src/components/ui/theme-toggle.tsx`. |
| Skeleton loader | `src/components/ui/skeleton.tsx`. |
| Currency input | `src/components/ui/currency-input.tsx`. |
| Combobox | `src/components/ui/searchable-select.tsx`. |
| Upgrade nudge | `src/components/ui/upgrade-prompt.tsx`. |

---

## Helpers directory

| Need | Use |
|---|---|
| Prisma client | `import { prisma } from "@/lib/prisma"` |
| Auth session | `import { auth } from "@/lib/auth"` |
| Admin gate | `import { requireAdmin } from "@/lib/admin"` |
| Stripe SDK | `import { getStripe } from "@/lib/stripe"` |
| Rate limit | `import { rateLimit, getClientIp } from "@/lib/rate-limit"` |
| Email scaffold | `import { emailLayout, emailButton, emailHeading, emailParagraph } from "@/lib/email-layout"` |
| Pricing config | `import { PLANS, TIER_LABELS } from "@/lib/pricing"` |
| Tier limits | `src/lib/tier-limits.ts` (placeholder — fill in for the product) |
| Currency table | `src/lib/currencies.ts` |
| SEO helpers | `import { seo, articleJsonLd, SITE_URL } from "@/lib/seo"` |
| Blog loader | `import { getAllPosts, getPostBySlug, getAllSlugs } from "@/lib/blog"` |

---

## Canonical examples

When scaffolding new code, start from the closest example in `examples/` rather than writing from scratch:

- `examples/authed-api-route.ts` — POST handler with session check, validation, rate limit
- `examples/admin-api-route.ts` — admin-gated route
- `examples/tier-gated-page.tsx` — page that nudges free users to upgrade
- `examples/admin-table-page.tsx` — full admin list page with search/filter/pagination/detail modal
- `examples/stripe-webhook-handler.ts` — adding a new Stripe event case
- `examples/transactional-email.ts` — sending a one-off email via the helper

---

## Code style

- Functional components only. No class components.
- No `useEffect` for derived state — derive in render.
- Server components by default. Add `"use client"` only when the component needs state/effects/event handlers.
- Tailwind utility classes, not CSS modules. Reach for `globals.css` only for design tokens and global typography (e.g. `.blog-content`).
- `tracking-[-0.02em]` on display text, `tracking-[-0.01em]` on headings, default tracking on body.
- Border radius scale: `6` / `10` / `12` / `14` / `18` / `20` / `24` / `28`. Pick the size that matches surrounding elements.
- No emojis in chrome (sidebar, nav, buttons). Inline SVGs only. Emojis are fine in blog content / OG copy / sample data.

---

## Testing

- Vitest with jsdom env. Tests live in `src/__tests__/`.
- `npm test` runs the suite. Don't run `dev` or `build`.
- Don't add Prisma mock tests — the existing mock typing is brittle. Test pure functions and component rendering instead.
- Don't snapshot-test class strings — those break on every refactor. Test behavior (clicks, state changes, accessible names).

---

## Folder map (when you need to grep)

```
src/
  app/
    (admin)/admin/         # admin pages
    (app)/                 # authed pages
    (marketing)/           # blog, compare, privacy, terms, tools
    api/                   # all route handlers
    landing/               # marketing landing
    login,register,...     # auth pages
  components/
    admin/                 # admin chrome
    blog/                  # reading progress, share, TOC
    layout/                # app-shell, sidebar, mobile-nav
    marketing/             # marketing chrome + helpers
    ui/                    # design system primitives
  lib/                     # utilities
content/blog/              # markdown blog posts (.md)
content/docs/              # markdown docs (.md)
prisma/                    # schema, migrations, seed
public/                    # static assets, manifest, favicon, robots
mcp/                       # MCP server (read-only Prisma data)
examples/                  # canonical scaffolding snippets
.claude/                   # skills, agents, settings
```
