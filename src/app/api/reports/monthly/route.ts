import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  // Verify cron secret to prevent unauthorized access
  const authHeader = req.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Find users who have opted into email reports
    const users = await prisma.user.findMany({
      where: { emailReports: true },
      select: {
        id: true,
        email: true,
      },
    });

    const results = [];

    for (const user of users) {
      try {
        // Customize this section with your app's report data
        // Example: query user activity, usage stats, etc.

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
