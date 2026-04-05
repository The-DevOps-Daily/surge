import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getStripe } from "@/lib/stripe";

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.role || session.user.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  const user = await prisma.user.findUnique({ where: { id } });

  if (!user || !user.stripeSubscriptionId) {
    return NextResponse.json({ error: "No subscription found" }, { status: 404 });
  }

  try {
    const stripe = getStripe();
    const subscription = await stripe.subscriptions.retrieve(user.stripeSubscriptionId);

    const priceId = subscription.items.data[0]?.price.id;
    const tier = priceId === process.env.STRIPE_FAMILY_PRICE_ID ? "family" : "pro";
    const tierExpiresAt = new Date(subscription.current_period_end * 1000);

    const isActive = subscription.status === "active" || subscription.status === "trialing";

    await prisma.user.update({
      where: { id },
      data: {
        tier: isActive ? tier : "free",
        tierExpiresAt: isActive ? tierExpiresAt : null,
      },
    });

    return NextResponse.json({
      tier: isActive ? tier : "free",
      tierExpiresAt: isActive ? tierExpiresAt.toISOString() : null,
      stripeStatus: subscription.status,
    });
  } catch (err) {
    console.error("[admin/sync-stripe] Failed:", err);
    return NextResponse.json({ error: "Failed to sync from Stripe" }, { status: 500 });
  }
}
