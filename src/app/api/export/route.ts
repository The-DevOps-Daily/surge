import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getTierLimits } from "@/lib/tier-limits";

export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const limits = getTierLimits(user.tier);
  if (!limits.hasExport) {
    return NextResponse.json(
      { error: "Export is available on Pro and Team plans" },
      { status: 403 }
    );
  }

  // TODO: Replace with your own data queries
  // const items = await prisma.item.findMany({ where: { userId: user.id } });

  const { searchParams } = new URL(req.url);
  const format = searchParams.get("format") || "json";

  if (format === "csv") {
    // TODO: Build CSV from your data
    const lines: string[] = [];
    lines.push("Type,Name,Value,Created");
    // for (const item of items) {
    //   lines.push(`Item,"${item.name}",${item.value},"${item.createdAt.toISOString()}"`);
    // }

    const csv = lines.join("\n");
    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="export-${new Date().toISOString().split("T")[0]}.csv"`,
      },
    });
  }

  // TODO: Replace with your data
  const data = { exportedAt: new Date().toISOString() };
  const json = JSON.stringify(data, null, 2);
  return new NextResponse(json, {
    headers: {
      "Content-Type": "application/json",
      "Content-Disposition": `attachment; filename="export-${new Date().toISOString().split("T")[0]}.json"`,
    },
  });
}
