import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      tier: true,
      tierExpiresAt: true,
      stripeCustomerId: true,
      stripeSubscriptionId: true,
      emailReports: true,
    },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  return NextResponse.json({
    tier: user.tier,
    tierExpiresAt: user.tierExpiresAt,
    hasStripeSubscription: !!user.stripeSubscriptionId,
    hasStripeCustomer: !!user.stripeCustomerId,
    emailReports: user.emailReports,
  });
}

export async function PUT(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();

  if (typeof body.emailReports === "boolean") {
    await prisma.user.update({
      where: { id: session.user.id },
      data: { emailReports: body.emailReports },
    });
  }

  return NextResponse.json({ success: true });
}
