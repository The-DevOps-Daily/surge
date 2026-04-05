import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { prisma } from "@/lib/prisma";
import fs from "fs";
import path from "path";

export async function GET() {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  // Database connection check
  let dbConnected = false;
  try {
    await prisma.$queryRaw`SELECT 1`;
    dbConnected = true;
  } catch {
    dbConnected = false;
  }

  // Check configured env vars (without revealing values)
  const envVars = {
    DATABASE_URL: !!process.env.DATABASE_URL,
    NEXTAUTH_SECRET: !!process.env.NEXTAUTH_SECRET,
    NEXTAUTH_URL: !!process.env.NEXTAUTH_URL,
    STRIPE_SECRET_KEY: !!process.env.STRIPE_SECRET_KEY,
    STRIPE_PUBLISHABLE_KEY: !!process.env.STRIPE_PUBLISHABLE_KEY,
    STRIPE_WEBHOOK_SECRET: !!process.env.STRIPE_WEBHOOK_SECRET,
    RESEND_API_KEY: !!process.env.RESEND_API_KEY,
    REGISTRATION_ENABLED: process.env.REGISTRATION_ENABLED,
  };

  const stripeConfigured = !!process.env.STRIPE_SECRET_KEY;
  const emailConfigured = !!process.env.RESEND_API_KEY;
  const registrationEnabled = process.env.REGISTRATION_ENABLED !== "false";

  // Database size (SQLite)
  let dbSize = "Unknown";
  try {
    const dbUrl = process.env.DATABASE_URL || "";
    if (dbUrl.startsWith("file:")) {
      const dbPath = dbUrl.replace("file:", "");
      const resolvedPath = path.isAbsolute(dbPath)
        ? dbPath
        : path.join(process.cwd(), "prisma", dbPath);
      const stats = fs.statSync(resolvedPath);
      const sizeKb = stats.size / 1024;
      if (sizeKb > 1024) {
        dbSize = `${(sizeKb / 1024).toFixed(2)} MB`;
      } else {
        dbSize = `${sizeKb.toFixed(1)} KB`;
      }
    }
  } catch {
    dbSize = "Unable to determine";
  }

  // DB provider
  const dbProvider = (process.env.DATABASE_URL || "").startsWith("file:")
    ? "SQLite"
    : "PostgreSQL";

  // Runtime info
  const globalAny = globalThis as Record<string, unknown>;
  const bunObj = globalAny.Bun as { version: string } | undefined;
  const runtime = bunObj ? `Bun ${bunObj.version}` : `Node ${process.version}`;

  // Uptime
  const uptimeSeconds = process.uptime();
  const uptimeHours = Math.floor(uptimeSeconds / 3600);
  const uptimeMinutes = Math.floor((uptimeSeconds % 3600) / 60);
  const uptime =
    uptimeHours > 0
      ? `${uptimeHours}h ${uptimeMinutes}m`
      : `${uptimeMinutes}m`;

  const environment = process.env.NODE_ENV || "development";

  // Total users for quick reference
  const totalUsers = await prisma.user.count();

  return NextResponse.json({
    services: {
      database: {
        status: dbConnected ? "connected" : "error",
        provider: dbProvider,
        size: dbSize,
      },
      stripe: {
        status: stripeConfigured ? "configured" : "missing",
      },
      email: {
        status: emailConfigured ? "configured" : "missing",
      },
      registration: {
        status: registrationEnabled ? "enabled" : "disabled",
      },
    },
    system: {
      runtime,
      environment,
      uptime,
      totalUsers,
    },
    envVars,
  });
}
