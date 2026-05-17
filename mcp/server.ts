#!/usr/bin/env node
/**
 * Read-only MCP server exposing app data to AI clients.
 *
 * Install:
 *   claude mcp add saas-starter -- npx tsx mcp/server.ts
 *
 * Or in Claude Desktop's config:
 *   {
 *     "mcpServers": {
 *       "saas-starter": {
 *         "command": "npx",
 *         "args": ["tsx", "mcp/server.ts"],
 *         "cwd": "/absolute/path/to/this/repo"
 *       }
 *     }
 *   }
 *
 * The server reads DATABASE_URL from your .env. Every tool is read-only —
 * there's no write surface here by design. To add new tools, follow the
 * `server.tool(...)` pattern below and keep the queries to SELECTs.
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";
import fs from "fs";
import path from "path";

const prisma = new PrismaClient();

const server = new McpServer({
  name: "saas-starter",
  version: "1.0.0",
});

function ok(text: string) {
  return { content: [{ type: "text" as const, text }] };
}

server.tool(
  "list_users",
  "List users, optionally filtered by email/name substring. Returns id, email, name, tier, role, createdAt.",
  {
    limit: z.number().int().min(1).max(100).default(20),
    search: z.string().optional(),
  },
  async ({ limit, search }) => {
    const where = search
      ? {
          OR: [
            { email: { contains: search } },
            { name: { contains: search } },
          ],
        }
      : undefined;

    const users = await prisma.user.findMany({
      where,
      take: limit,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        email: true,
        name: true,
        tier: true,
        role: true,
        createdAt: true,
      },
    });

    return ok(JSON.stringify(users, null, 2));
  },
);

server.tool(
  "get_user",
  "Fetch one user by id. Returns the full record including Stripe IDs and tier expiry.",
  { id: z.string() },
  async ({ id }) => {
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        tier: true,
        role: true,
        currency: true,
        stripeCustomerId: true,
        stripeSubscriptionId: true,
        tierExpiresAt: true,
        emailReports: true,
        onboarded: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    if (!user) return ok(`No user with id ${id}.`);
    return ok(JSON.stringify(user, null, 2));
  },
);

server.tool(
  "recent_signups",
  "Users created in the last N days. Default 7.",
  { days: z.number().int().min(1).max(365).default(7) },
  async ({ days }) => {
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
    const users = await prisma.user.findMany({
      where: { createdAt: { gte: since } },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        email: true,
        name: true,
        tier: true,
        createdAt: true,
      },
    });
    return ok(
      `${users.length} signup(s) in the last ${days} day(s):\n` +
        JSON.stringify(users, null, 2),
    );
  },
);

server.tool(
  "subscription_stats",
  "Tier counts, MRR estimate, and churn-ready count (paid users with expired tierExpiresAt).",
  {},
  async () => {
    const tierCounts = await prisma.user.groupBy({
      by: ["tier"],
      _count: { tier: true },
    });

    // Read PLANS lazily from disk to avoid bundling the whole app.
    const pricingPath = path.join(process.cwd(), "src/lib/pricing.ts");
    let mrr = 0;
    let mrrDetail = "(pricing.ts not found — set MRR detection up manually)";
    if (fs.existsSync(pricingPath)) {
      const pricing = fs.readFileSync(pricingPath, "utf-8");
      const proMatch = pricing.match(
        /pro:[\s\S]*?monthlyPriceNum:\s*(\d+)/,
      );
      const familyMatch = pricing.match(
        /family:[\s\S]*?monthlyPriceNum:\s*(\d+)/,
      );
      const proPrice = proMatch ? Number(proMatch[1]) : 0;
      const familyPrice = familyMatch ? Number(familyMatch[1]) : 0;
      const proCount = tierCounts.find((c) => c.tier === "pro")?._count.tier ?? 0;
      const familyCount =
        tierCounts.find((c) => c.tier === "family")?._count.tier ?? 0;
      mrr = proCount * proPrice + familyCount * familyPrice;
      mrrDetail = `pro: ${proCount}×$${proPrice} + family: ${familyCount}×$${familyPrice}`;
    }

    const now = new Date();
    const churnReady = await prisma.user.count({
      where: {
        tier: { in: ["pro", "family"] },
        tierExpiresAt: { lt: now, not: null },
      },
    });

    return ok(
      JSON.stringify(
        {
          tierCounts: Object.fromEntries(
            tierCounts.map((c) => [c.tier, c._count.tier]),
          ),
          mrr,
          mrrDetail,
          churnReady,
        },
        null,
        2,
      ),
    );
  },
);

server.tool(
  "tier_distribution",
  "Buckets for a tier-distribution chart. Returns [{ name, value }].",
  {},
  async () => {
    const counts = await prisma.user.groupBy({
      by: ["tier"],
      _count: { tier: true },
    });
    return ok(
      JSON.stringify(
        counts.map((c) => ({ name: c.tier, value: c._count.tier })),
        null,
        2,
      ),
    );
  },
);

server.tool(
  "count_content",
  "Counts of blog posts and docs on disk.",
  {},
  async () => {
    const blogDir = path.join(process.cwd(), "content/blog");
    const docsDir = path.join(process.cwd(), "content/docs");
    const blog = fs.existsSync(blogDir)
      ? fs.readdirSync(blogDir).filter((f) => f.endsWith(".md")).length
      : 0;
    const docs = fs.existsSync(docsDir)
      ? fs.readdirSync(docsDir).filter((f) => f.endsWith(".md")).length
      : 0;
    return ok(JSON.stringify({ blogPosts: blog, docs }, null, 2));
  },
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  // Log to stderr so it doesn't corrupt the stdio protocol on stdout.
  console.error("[saas-starter mcp] connected over stdio");
}

main().catch((err) => {
  console.error("[saas-starter mcp] fatal:", err);
  process.exit(1);
});
