import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { CURRENCIES, type CurrencyCode } from "@/lib/currencies";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { currency: true },
  });

  return NextResponse.json({ currency: user?.currency || "EUR" });
}

export async function PUT(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { currency } = await req.json();

  if (!currency || !CURRENCIES[currency as CurrencyCode]) {
    return NextResponse.json({ error: "Invalid currency" }, { status: 400 });
  }

  await prisma.user.update({
    where: { id: session.user.id },
    data: { currency },
  });

  return NextResponse.json({ currency });
}
