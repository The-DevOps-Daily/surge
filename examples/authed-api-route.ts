/**
 * Canonical authed API route.
 *
 * Copy to: src/app/api/<your-resource>/route.ts
 * Then adapt the validation, the database call, and the response.
 *
 * Pattern enforced:
 *   1. Session check first.
 *   2. Rate limit before any DB read.
 *   3. Validate every field; reject with 400 + specific error.
 *   4. Wrap DB calls in try/catch with a generic 500 (don't leak the error).
 */

import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { rateLimit } from "@/lib/rate-limit";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const limiter = rateLimit(`example:${session.user.id}`, {
    maxAttempts: 30,
    windowMs: 60_000,
  });
  if (!limiter.success) {
    return NextResponse.json(
      { error: "Too many requests" },
      { status: 429 },
    );
  }

  const body = await req.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const { name } = body as { name?: unknown };
  if (typeof name !== "string" || name.length === 0 || name.length > 100) {
    return NextResponse.json(
      { error: "Name must be a non-empty string up to 100 characters" },
      { status: 400 },
    );
  }

  try {
    // Replace with your actual operation.
    const result = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { id: true, email: true },
    });
    return NextResponse.json({ ok: true, user: result, received: name });
  } catch (err) {
    console.error("[example] failed:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
