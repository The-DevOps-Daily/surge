/**
 * Adding a new Stripe webhook event.
 *
 * Open: src/app/api/stripe/webhook/route.ts
 * Find the big `switch (event.type)` block. Add a new `case` like this.
 *
 * Conventions:
 *   - Always look up the user via `stripeCustomerId` (never `customer_email`
 *     — emails can change).
 *   - If `!user` after lookup, log + break (don't 500 — Stripe will retry).
 *   - Send transactional emails through `emailLayout` from lib/email-layout.ts.
 *   - Keep the body short — put logic in named helpers in lib/ if it grows.
 */

import { Resend } from "resend";
import { prisma } from "@/lib/prisma";
import {
  emailLayout,
  emailButton,
  emailHeading,
  emailParagraph,
} from "@/lib/email-layout";

/** Reference handler — copy into the switch in route.ts and adapt. */
export async function handleTrialWillEnd(invoice: {
  customer: string | { id: string };
}) {
  const customerId =
    typeof invoice.customer === "string" ? invoice.customer : invoice.customer.id;

  const user = await prisma.user.findFirst({
    where: { stripeCustomerId: customerId },
  });
  if (!user) {
    console.warn(`[stripe] trial_will_end: no user for customer ${customerId}`);
    return;
  }

  if (!process.env.RESEND_API_KEY) return;
  const resend = new Resend(process.env.RESEND_API_KEY);
  const billingUrl = `${process.env.NEXTAUTH_URL || "https://example.com"}/billing`;

  const html = emailLayout(
    [
      emailHeading("Your trial ends soon"),
      emailParagraph(
        "Your free trial will end in 3 days. To keep using your account without interruption, add a payment method now.",
      ),
      `<div style="margin-top:24px;">${emailButton(billingUrl, "Add payment method")}</div>`,
    ].join(""),
    {
      preheader: "Add a payment method to continue without interruption.",
      appName: "SaaS App",
    },
  );

  await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL || "SaaS App <noreply@example.com>",
    to: user.email,
    subject: "Your trial ends in 3 days",
    html,
  }).catch((err) =>
    console.error("[stripe] trial_will_end email failed:", err),
  );
}
