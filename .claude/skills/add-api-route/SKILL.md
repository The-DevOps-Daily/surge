---
name: add-api-route
description: |
  Scaffold a new API route handler with the right auth pattern,
  rate limiting, validation, and error handling. Supports authed
  (per-user), admin (role-gated), and public (rate-limited by IP)
  variants. Use when the user says "add an endpoint", "add an API
  route", or "wire up an endpoint for X".
---

# /add-api-route

## Steps

### 1. Ask the shape

- HTTP method (GET, POST, PUT, DELETE) — can be multiple in the same file.
- Auth: **authed** (user must be signed in), **admin** (must have admin role), or **public** (no auth, IP-rate-limited).
- Path: `/api/<segment>`. Suggest a sensible RESTful naming.
- Inputs: what fields, what types, what limits.
- Output shape.

### 2. Pick the template

- Authed: copy `examples/authed-api-route.ts` → `src/app/api/<segment>/route.ts`.
- Admin: copy `examples/admin-api-route.ts` → `src/app/api/admin/<segment>/route.ts`.
- Public: same as authed but skip the session check and key the rate limiter on `getClientIp(req)` instead of `session.user.id`.

### 3. Adapt

For each method:

1. **Auth check first** (already in template).
2. **Rate limit** with a sensible per-window. Defaults: 30/min for authed reads, 10/min for writes, 5/hour for password-adjacent operations. Use a unique key prefix per route so limits don't collide.
3. **Validate every field**:
   - `typeof x !== "string"` and length checks for strings.
   - `Number.isFinite()` and range checks for numbers.
   - Allow-list checks for enums.
   - Return 400 with a specific error string for each failure.
4. **DB call inside try/catch**. On error, `console.error("[<route>]", err)` and return 500 with a generic message — never leak the actual error.
5. **Successful response** uses `NextResponse.json({...})`.

### 4. If the route mutates a model, also wire deletes into user/delete

If you added a model, edit `src/app/api/user/delete/route.ts` and add a `await tx.<model>.deleteMany({ where: { userId } });` line inside the transaction, before `tx.user.delete`. Otherwise the cascade won't fire and you'll leak rows.

### 5. If the route returns tier-gated data

Use the helper pattern:

```ts
const user = await prisma.user.findUnique({
  where: { id: session.user.id },
  select: { tier: true },
});
const isPaid = user?.tier === "pro" || user?.tier === "family";
if (!isPaid) {
  return NextResponse.json({ error: "Upgrade required" }, { status: 403 });
}
```

### 6. Verify

- `npx tsc --noEmit` clean.
- `npm test` green.
- Suggest a test under `src/__tests__/api/<segment>.test.ts` — but warn the user that the Prisma mock typing is brittle, so test the **handler's response logic** (e.g., 401 path, validation path) rather than the DB call.
- Don't run a curl test for the user — they don't have a dev server running on the Pi. Just print a sample curl they can run locally.

## Conventions

- Auth check `if (!session?.user?.id)` returns 401 (authed) or 403 (admin — distinguishes "you're not signed in" from "you're signed in but lack the role").
- Always rate-limit. Even admin routes.
- Validate body before any DB call — don't waste a roundtrip on garbage input.
- Don't trust client-provided IDs that the user shouldn't own. `where: { id: input.id, userId: session.user.id }` is the safe pattern.
