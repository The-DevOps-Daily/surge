import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const fourteenDaysAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

  // Total users
  const totalUsers = await prisma.user.count();

  // Users in last 7 days vs previous 7 days for growth
  const recentWeek = await prisma.user.count({
    where: { createdAt: { gte: sevenDaysAgo } },
  });
  const prevWeek = await prisma.user.count({
    where: { createdAt: { gte: fourteenDaysAgo, lt: sevenDaysAgo } },
  });
  const userGrowth =
    prevWeek === 0 ? (recentWeek > 0 ? 100 : 0) : Math.round(((recentWeek - prevWeek) / prevWeek) * 100);

  // Subscribers
  const proSubscribers = await prisma.user.count({
    where: { tier: "pro" },
  });
  const familySubscribers = await prisma.user.count({
    where: { tier: "family" },
  });

  // Simple MRR estimate (customize these prices as needed)
  const PRO_PRICE = 9.99;
  const FAMILY_PRICE = 19.99;
  const mrr = proSubscribers * PRO_PRICE + familySubscribers * FAMILY_PRICE;

  // Signups by day (last 30 days)
  const recentUsers = await prisma.user.findMany({
    where: { createdAt: { gte: thirtyDaysAgo } },
    select: { createdAt: true },
    orderBy: { createdAt: "asc" },
  });

  const dayMap: Record<string, number> = {};
  for (let i = 0; i < 30; i++) {
    const d = new Date(now.getTime() - (29 - i) * 24 * 60 * 60 * 1000);
    const key = d.toISOString().split("T")[0];
    dayMap[key] = 0;
  }
  for (const u of recentUsers) {
    const key = u.createdAt.toISOString().split("T")[0];
    if (dayMap[key] !== undefined) {
      dayMap[key]++;
    }
  }
  const signupsByDay = Object.entries(dayMap).map(([date, count]) => ({
    date: date.slice(5), // MM-DD
    count,
  }));

  // Tier distribution
  const freeCount = await prisma.user.count({ where: { tier: "free" } });
  const tierDistribution = [
    { name: "Free", value: freeCount },
    { name: "Pro", value: proSubscribers },
    { name: "Family", value: familySubscribers },
  ];

  // Recent signups
  const recentSignups = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    take: 10,
    select: {
      id: true,
      email: true,
      name: true,
      tier: true,
      createdAt: true,
    },
  });

  return NextResponse.json({
    totalUsers,
    userGrowth,
    proSubscribers,
    familySubscribers,
    mrr,
    signupsByDay,
    tierDistribution,
    recentSignups,
  });
}
