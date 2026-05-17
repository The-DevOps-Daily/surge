---
name: add-page
description: |
  Scaffold a new page (authed app page, admin page, or public marketing page)
  using the established patterns. Wires the route, layout integration, nav
  entry if applicable, and a placeholder shell with the design tokens.
  Use this when the user says "add a new page", "add a /<thing> route",
  or "scaffold a page for X".
---

# /add-page

## Steps

### 1. Ask which surface

Prompt the user to pick:
- **Authed app page** — under `(app)` group, sits in the sidebar.
- **Admin page** — under `(admin)` group, role-gated, sits in the admin sidebar.
- **Public marketing page** — under `(marketing)` group, no auth.

Then ask: slug, page title, one-line description.

### 2. Pick the right template

- Authed app: read `examples/tier-gated-page.tsx` if the page should be gated, otherwise read `src/app/(app)/dashboard/page.tsx` as the model. Copy to `src/app/(app)/<slug>/page.tsx`.
- Admin list: copy `examples/admin-table-page.tsx` → `src/app/(admin)/admin/<slug>/page.tsx`. Also scaffold the matching API route via `/add-api-route`.
- Admin simple: copy `src/app/(admin)/admin/system/page.tsx` as the model (single-pane stats page).
- Marketing: read `src/app/(marketing)/compare/page.tsx` for the chrome (MarketingNav + MarketingFooter + bg-mesh + section structure).

### 3. Add the nav entry

- Authed app: edit `src/components/layout/sidebar.tsx` and `src/components/layout/mobile-nav.tsx`. Both have a `links` array near the top. Add an entry with `{ href, label, icon: <SVG> }`. Use an inline SVG — no emojis.
- Admin: edit `src/components/admin/admin-sidebar.tsx` and `src/components/admin/admin-mobile-nav.tsx`.
- Marketing: edit `src/components/marketing/marketing-nav.tsx` — the desktop links array.

### 4. SEO + metadata

For marketing pages, add `metadata` export using `seo()` from `@/lib/seo`:

```ts
import { seo } from "@/lib/seo";

export const metadata = seo({
  title: "Page title",
  description: "One-line description.",
  path: "/your-path",
});
```

For authed/admin pages, metadata is inherited from the route group layout — usually no extra `metadata` needed.

### 5. Verify

- `npx tsc --noEmit` — clean.
- `npm test` — green.
- Show the user the new route. Remind them the dev server needs a restart only if they edited `next.config.ts`.

## Conventions to honor

- Default to dark mode (the app is dark-first), but every color must come from CSS variables.
- Use `<Card>`, `<Button>`, `<Input>` primitives — no raw HTML form controls.
- Page wrapper pattern: `<div className="space-y-6 animate-fade-in">...</div>` for app/admin, `<div className="min-h-screen bg-[var(--surface-0)] text-[var(--ink-3)] relative overflow-hidden">` + `<div className="bg-mesh" />` for marketing.
- Headings: `text-2xl font-semibold tracking-[-0.01em] text-[var(--ink-3)]` for h1 on app/admin, `text-4xl md:text-5xl font-semibold tracking-[-0.02em]` for marketing hero h1.
