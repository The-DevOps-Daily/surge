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
 *   - Send transactional emails through `sendEmail()` from lib/email.ts.
 *     That helper short-circuits when SMTPFAST_API_KEY is unset.
 *   - Keep the body short — put logic in named helpers in lib/ if it grows.
 */

import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/email";
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

  await sendEmail({
    to: user.email,
    subject: "Your trial ends in 3 days",
    html,
  });
}
