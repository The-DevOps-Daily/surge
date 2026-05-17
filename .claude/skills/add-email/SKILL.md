---
name: add-email
description: |
  Scaffold a new transactional email using the shared light-friendly
  emailLayout helper. Wires the send function, the trigger point, and
  optionally a List-Unsubscribe header for marketing emails. Use when
  the user says "add a new email", "send an email when X", or "add a
  notification email for Y".
---

# /add-email

## Steps

### 1. Collect the email spec

- **Trigger**: when is this sent? (signup, password reset, payment failed, weekly digest, custom event…)
- **Subject** line (short, no emojis in subject).
- **Preheader** (the preview text shown after the subject in inboxes).
- **Body**: heading, 1-3 paragraphs, optional CTA button + URL.
- **Recipient**: pulled from where? (session, DB lookup, webhook payload)
- **Type**: transactional (no unsubscribe) or marketing (needs `List-Unsubscribe` header).

### 2. Pick the location

- **Transactional, sent from a route handler**: inline the send in the route — see `src/app/api/auth/register/route.ts` (welcome) or `src/app/api/auth/forgot-password/route.ts` (reset).
- **Reusable helper called from multiple places**: add a function to `src/lib/email.ts` — see `sendMonthlyReport` for the pattern.
- **Webhook-triggered (Stripe events)**: inline in the relevant `case` block in `src/app/api/stripe/webhook/route.ts`.

### 3. Use the template

Always go through `sendEmail()` from `@/lib/email`. It short-circuits when `SMTPFAST_API_KEY` is unset, posts to smtpfa.st, and catches/logs failures so an email send never 500s the request that triggered it.

```ts
import { sendEmail } from "@/lib/email";
import {
  emailLayout,
  emailButton,
  emailHeading,
  emailParagraph,
} from "@/lib/email-layout";

const html = emailLayout(
  [
    emailHeading("Your heading"),
    emailParagraph("Body paragraph."),
    emailParagraph("Optional second paragraph."),
    `<div style="margin-top:24px;">${emailButton(actionUrl, "Call to action")}</div>`,
  ].join(""),
  {
    preheader: "One-line preview that shows in inbox.",
    appName: "SaaS App",
  },
);

await sendEmail({
  to: recipient.email,
  subject: "Subject line",
  html,
});
```

### 4. Don't re-invent the env check

`sendEmail()` already short-circuits when `SMTPFAST_API_KEY` is missing. Don't wrap call sites in an extra `if (process.env.SMTPFAST_API_KEY)` — it's redundant and inconsistent with the rest of the kit.

### 5. Don't re-invent the error handling

`sendEmail()` returns `{ sent: boolean }` and never throws. Branch on `result.sent` only if you actually care about the success path. Most callers don't (transactional email is fire-and-forget).

### 6. Marketing emails need unsubscribe

If this is a periodic email (digest, summary, newsletter), add:

```ts
headers: {
  "List-Unsubscribe": `<${unsubscribeUrl}>`,
  "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
},
```

Use `getUnsubscribeUrl(userId)` from `src/app/api/unsubscribe/route.ts`. Add a column to the User model if there's a per-email-type opt-out (e.g. `weeklyDigest: Boolean`) — currently only `emailReports` exists.

### 7. Verify

- `npx tsc --noEmit` clean.
- `npm test` green.
- Tell the user how to test: trigger the flow locally with a real `SMTPFAST_API_KEY` from https://smtpfa.st/api-keys (scope: `email:send`) and check the inbox.
- Remind them to update `SMTPFAST_FROM_EMAIL` in `.env` to a domain that's been added + verified at https://smtpfa.st/domains — sends from unverified domains will be rejected.

## Conventions

- All emails use the helper — no raw `<table>` or inline-styled HTML.
- Subject lines: short, sentence case, no emojis. "Reset your password" not "🔐 Reset Your Password!".
- One CTA per email. If you have two competing actions, pick the primary one and make the secondary a text link in the body.
- Light-friendly only. The helper renders on a white card on light gray body — never on a dark background. Email clients invert reliably for the user's preference; we don't need to ship our own dark mode.
