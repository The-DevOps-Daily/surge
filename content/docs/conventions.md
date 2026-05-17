---
title: Conventions
description: The rules every change should follow — same as CLAUDE.md, summarized for humans.
order: 2
updatedAt: 2026-05-17
---

# Conventions

If you're editing by hand, follow these. If you're editing through Claude Code, the CLAUDE.md at the repo root primes the agent so you don't have to think about them.

## Colors

All colors come from CSS variables defined in `src/app/globals.css`. Use them via Tailwind's arbitrary-value syntax:

```tsx
className="bg-[var(--surface-1)] text-[var(--ink-3)] border border-[var(--line-1)]"
```

Never `bg-emerald-500`, never `text-gray-400`, never `style={{ color: "#fff" }}`.

## Form controls

Use the primitives in `src/components/ui/input.tsx`:

```tsx
import { Input, Select, Textarea } from "@/components/ui/input";

<Input label="Email" type="email" required />
<Select label="Currency" options={[{ value: "USD", label: "US Dollar" }]} />
```

No raw `<input>`, `<select>`, `<textarea>` in pages. They bypass focus rings, label/aria pairing, and theme handling.

## Confirms and toasts

```tsx
// Don't
if (confirm("Delete?")) deleteIt();
alert("Done!");

// Do
<ConfirmDialog isOpen={open} onClose={...} onConfirm={deleteIt} tone="danger" />
const { addToast } = useToast();
addToast("Done", "success");
```

## API routes

- Auth check first: `const session = await auth(); if (!session?.user?.id) return 401`.
- Rate-limit every route. Pattern in `src/lib/rate-limit.ts`.
- Validate every field before any DB call. Return 400 with a specific error.
- Wrap DB calls in try/catch. Return generic 500 — never leak `err.message`.

The canonical examples live in `examples/authed-api-route.ts` and `examples/admin-api-route.ts`.

## Emails

All transactional emails use `emailLayout()` from `src/lib/email-layout.ts`. The scaffold renders light-friendly cards that work in Gmail/Outlook/Apple Mail.

```tsx
import { emailLayout, emailHeading, emailParagraph, emailButton } from "@/lib/email-layout";

const html = emailLayout(
  emailHeading("Welcome") + emailParagraph("Glad you're here.") + emailButton("/dashboard", "Open"),
  { preheader: "Welcome to the app", appName: "Your App" },
);
```

## Tests

Run via `npm test`. Don't run `npm run dev` or `npm run build` on a low-RAM dev box — it OOMs. Type-check via `npx tsc --noEmit`.

Don't add Prisma mock tests — the existing mock typing is brittle. Test pure functions and component rendering instead.

## Subagents will keep you honest

Three subagents auto-run on the relevant change types:

- `route-auditor` on API route changes (flags missing auth/rate-limit/validation)
- `migration-reviewer` on Prisma schema changes (flags destructive operations, missing indexes)
- `token-enforcer` on .tsx changes (flags hardcoded colors, raw form controls, native confirm/alert)

If you're using Claude Code, they run automatically when relevant. If you're using another agent, the same rules apply.
