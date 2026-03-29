import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // TODO: Replace with your own dashboard data queries
  // Example:
  // const items = await prisma.item.findMany({ where: { userId: session.user.id } });

  return NextResponse.json({
    message: "Dashboard data endpoint. Customize this for your app.",
  });
}
