import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendMonthlyReport } from "@/lib/email";

export async function POST(req: Request) {
  // Verify cron secret to prevent unauthorized access
  const authHeader = req.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const users = await prisma.user.findMany({
      where: { emailReports: true },
      select: {
        id: true,
        email: true,
        currency: true,
      },
    });

    const results = [];

    for (const user of users) {
      try {
        const now = new Date();
        const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);

        const assets = await prisma.asset.aggregate({
          where: { userId: user.id },
          _sum: { value: true },
        });

        const liabilities = await prisma.liability.aggregate({
          where: { userId: user.id },
          _sum: { balance: true },
        });

        const totalAssets = assets._sum.value || 0;
        const totalLiabilities = liabilities._sum.balance || 0;
        const netWorth = totalAssets - totalLiabilities;

        const lastSnapshot = await prisma.netWorthSnapshot.findFirst({
          where: {
            userId: user.id,
            snapshotDate: {
              gte: lastMonth,
              lt: thisMonth,
            },
          },
          orderBy: { snapshotDate: "desc" },
        });

        const change = lastSnapshot ? netWorth - lastSnapshot.netWorth : 0;

        await sendMonthlyReport(user.email, {
          userId: user.id,
          netWorth,
          change,
          assets: totalAssets,
          liabilities: totalLiabilities,
          currency: user.currency,
        });

        results.push({ userId: user.id, status: "sent" });
      } catch (error) {
        console.error(`Failed to send report for user ${user.id}:`, error);
        results.push({ userId: user.id, status: "failed" });
      }
    }

    return NextResponse.json({ processed: results.length, results });
  } catch (error) {
    console.error("Monthly report cron failed:", error);
    return NextResponse.json(
      { error: "Failed to process monthly reports" },
      { status: 500 }
    );
  }
}
