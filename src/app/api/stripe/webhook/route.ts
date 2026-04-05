import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import { Resend } from "resend";

interface StripeSubscription {
  id: string;
  status: string;
  current_period_end: number;
  items: { data: Array<{ price: { id: string } }> };
}

interface StripeCheckoutSession {
  metadata?: Record<string, string>;
  subscription?: string;
  customer?: string;
}

interface StripeInvoice {
  customer: string;
  subscription?: string;
}

function getTierFromPriceId(priceId: string): string {
  if (priceId === process.env.STRIPE_FAMILY_PRICE_ID) return "family";
  return "pro";
}

export async function POST(req: Request) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  if (!sig) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event;
  try {
    event = getStripe().webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as unknown as StripeCheckoutSession;
      const userId = session.metadata?.userId;
      if (!userId || !session.subscription) break;

      const subscriptionId = session.subscription;
      const customerId = session.customer || "";

      const subResponse = await getStripe().subscriptions.retrieve(subscriptionId);
      const subscription = subResponse as unknown as StripeSubscription;
      const priceId = subscription.items.data[0]?.price.id;
      const tier = getTierFromPriceId(priceId);

      await prisma.user.update({
        where: { id: userId },
        data: {
          stripeCustomerId: customerId,
          stripeSubscriptionId: subscriptionId,
          tier,
          tierExpiresAt: subscription.current_period_end
            ? new Date(subscription.current_period_end * 1000)
            : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        },
      });
      break;
    }

    case "customer.subscription.updated": {
      const subscription = event.data.object as unknown as StripeSubscription;
      const user = await prisma.user.findFirst({
        where: { stripeSubscriptionId: subscription.id },
      });
      if (!user) break;

      const priceId = subscription.items.data[0]?.price.id;
      const tier = getTierFromPriceId(priceId);

      if (subscription.status === "active") {
        await prisma.user.update({
          where: { id: user.id },
          data: {
            tier,
            tierExpiresAt: subscription.current_period_end
            ? new Date(subscription.current_period_end * 1000)
            : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          },
        });
      }
      break;
    }

    case "customer.subscription.deleted": {
      const subscription = event.data.object as unknown as StripeSubscription;
      const user = await prisma.user.findFirst({
        where: { stripeSubscriptionId: subscription.id },
      });
      if (!user) break;

      await prisma.user.update({
        where: { id: user.id },
        data: {
          tier: "free",
          stripeSubscriptionId: null,
          tierExpiresAt: null,
        },
      });
      break;
    }

    case "invoice.payment_failed": {
      const invoice = event.data.object as unknown as StripeInvoice;
      const customerId =
        typeof invoice.customer === "string" ? invoice.customer : "";
      if (!customerId) break;

      const user = await prisma.user.findFirst({
        where: { stripeCustomerId: customerId },
      });
      if (!user) break;

      console.warn(`[stripe] invoice.payment_failed for user ${user.id} (${user.email})`);

      if (process.env.RESEND_API_KEY) {
        const resend = new Resend(process.env.RESEND_API_KEY);
        await resend.emails.send({
          from: process.env.RESEND_FROM_EMAIL || "Surge <noreply@example.com>",
          to: user.email,
          subject: "Payment failed - action needed",
          html: `
            <div style="font-family: -apple-system, sans-serif; max-width: 500px; margin: 0 auto; padding: 32px 20px;">
              <h2 style="color: #111; margin-bottom: 16px;">Payment failed</h2>
              <p style="color: #666; line-height: 1.6;">
                We were unable to process your latest payment.
                Please update your payment method to keep your subscription active.
              </p>
              <a href="${process.env.NEXTAUTH_URL}/billing" style="display: inline-block; background: #10b981; color: white; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-weight: 600; margin-top: 16px;">
                Update Payment Method
              </a>
            </div>
          `,
        }).catch((err) => console.error("[stripe] Failed to send payment-failed email:", err));
      }
      break;
    }

    case "invoice.payment_succeeded": {
      const invoice = event.data.object as unknown as StripeInvoice;
      const customerId =
        typeof invoice.customer === "string" ? invoice.customer : "";
      if (!customerId || !invoice.subscription) break;

      const user = await prisma.user.findFirst({
        where: { stripeCustomerId: customerId },
      });
      if (!user) break;

      const subResponse = await getStripe().subscriptions.retrieve(invoice.subscription);
      const subscription = subResponse as unknown as StripeSubscription;

      await prisma.user.update({
        where: { id: user.id },
        data: {
          tierExpiresAt: subscription.current_period_end
            ? new Date(subscription.current_period_end * 1000)
            : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        },
      });
      break;
    }
  }

  return NextResponse.json({ received: true });
}
