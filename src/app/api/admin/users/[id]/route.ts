import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { prisma } from "@/lib/prisma";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const { id } = await params;

  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      email: true,
      name: true,
      tier: true,
      role: true,
      stripeCustomerId: true,
      stripeSubscriptionId: true,
      tierExpiresAt: true,
      onboarded: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  return NextResponse.json(user);
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const { id } = await params;
  const body = await req.json();

  const updateData: Record<string, string> = {};
  if (body.tier && ["free", "pro", "family"].includes(body.tier)) {
    updateData.tier = body.tier;
  }
  if (body.role && ["user", "admin"].includes(body.role)) {
    updateData.role = body.role;
  }

  if (Object.keys(updateData).length === 0) {
    return NextResponse.json({ error: "No valid fields to update" }, { status: 400 });
  }

  const user = await prisma.user.update({
    where: { id },
    data: updateData,
    select: {
      id: true,
      email: true,
      name: true,
      tier: true,
      role: true,
    },
  });

  return NextResponse.json(user);
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const { id } = await params;

  // Soft disable: set tier to "free" and clear subscription info
  const user = await prisma.user.update({
    where: { id },
    data: {
      tier: "free",
      stripeSubscriptionId: null,
      tierExpiresAt: null,
    },
    select: { id: true, email: true },
  });

  return NextResponse.json({ message: "Account disabled", user });
}
