/**
 * Canonical admin-only API route.
 *
 * Copy to: src/app/api/admin/<your-resource>/route.ts
 *
 * `requireAdmin()` returns the session if the user is admin, else null.
 * Return 403 (not 404 or 401) so the caller can tell they tried but lack
 * the role.
 */

import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const limit = Math.min(Number(searchParams.get("limit") ?? 20) || 20, 100);
  const cursor = searchParams.get("cursor") || undefined;

  const users = await prisma.user.findMany({
    take: limit,
    ...(cursor ? { skip: 1, cursor: { id: cursor } } : {}),
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

  const nextCursor = users.length === limit ? users[users.length - 1].id : null;

  return NextResponse.json({ users, nextCursor });
}
