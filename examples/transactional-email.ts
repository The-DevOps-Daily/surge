/**
 * Sending a one-off transactional email.
 *
 * Drop into any server-side context (route handler, cron, webhook).
 * Imports the shared light-friendly scaffold so it matches the rest
 * of the kit's emails (welcome, reset, monthly report).
 */

import { Resend } from "resend";
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
  if (!process.env.RESEND_API_KEY) {
    console.log("[email] RESEND_API_KEY not set, skipping");
    return null;
  }

  const resend = new Resend(process.env.RESEND_API_KEY);
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

  const { error } = await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL || "SaaS App <noreply@example.com>",
    to,
    subject: "Action required",
    html,
  });

  if (error) {
    console.error("[email] sendActionRequiredEmail failed:", error);
    throw error;
  }

  return { success: true };
}
