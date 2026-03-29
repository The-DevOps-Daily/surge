import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";

// Use generic types to avoid strict SDK type mismatches across versions
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
    event = stripe.webhooks.constructEvent(
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

      const subResponse = await stripe.subscriptions.retrieve(subscriptionId);
      const subscription = subResponse as unknown as StripeSubscription;
      const priceId = subscription.items.data[0]?.price.id;
      const tier = getTierFromPriceId(priceId);

      await prisma.user.update({
        where: { id: userId },
        data: {
          stripeCustomerId: customerId,
          stripeSubscriptionId: subscriptionId,
          tier,
          tierExpiresAt: new Date(subscription.current_period_end * 1000),
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
            tierExpiresAt: new Date(subscription.current_period_end * 1000),
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

      console.warn(
        `[stripe] invoice.payment_failed for user ${user.id} (${user.email})`
      );
      // TODO: send payment-failed notification via Resend when configured
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

      const subResponse = await stripe.subscriptions.retrieve(
        invoice.subscription
      );
      const subscription = subResponse as unknown as StripeSubscription;

      await prisma.user.update({
        where: { id: user.id },
        data: {
          tierExpiresAt: new Date(subscription.current_period_end * 1000),
        },
      });
      break;
    }
  }

  return NextResponse.json({ received: true });
}
