/**
 * Sending a one-off transactional email.
 *
 * Drop into any server-side context (route handler, cron, webhook). Imports
 * the shared `sendEmail()` helper from lib/email.ts so it goes through the
 * same env-check + retry semantics as the rest of the kit. The transport is
 * smtpfa.st (https://smtpfa.st); swap inside lib/email.ts to change provider.
 */

import { sendEmail } from "@/lib/email";
import {
  emailLayout,
  emailButton,
  emailHeading,
  emailParagraph,
} from "@/lib/email-layout";

interface SendArgs {
  to: string;
  recipientName?: string | null;
  actionUrl: string;
}

export async function sendActionRequiredEmail({
  to,
  recipientName,
  actionUrl,
}: SendArgs) {
  const name = recipientName || "there";
  const html = emailLayout(
    [
      emailHeading(`Action needed, ${name}`),
      emailParagraph(
        "We need a quick action from you to keep your account in good standing. Click the button below to continue.",
      ),
      `<div style="margin-top:24px;">${emailButton(actionUrl, "Take action")}</div>`,
      emailParagraph(
        "If you didn't expect this, you can safely ignore the email.",
      ),
    ].join(""),
    {
      preheader: "Quick action required on your SaaS App account.",
      appName: "SaaS App",
    },
  );

  return sendEmail({ to, subject: "Action required", html });
}
