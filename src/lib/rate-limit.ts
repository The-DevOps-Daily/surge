interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const store = new Map<string, RateLimitEntry>();

// Clean up expired entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of store.entries()) {
    if (entry.resetAt <= now) {
      store.delete(key);
    }
  }
}, 5 * 60 * 1000);

interface RateLimitResult {
  success: boolean;
  remaining: number;
  resetAt: Date;
}

export function rateLimit(
  key: string,
  { maxAttempts = 5, windowMs = 60_000 } = {}
): RateLimitResult {
  const now = Date.now();
  const entry = store.get(key);

  if (!entry || entry.resetAt <= now) {
    const resetAt = now + windowMs;
    store.set(key, { count: 1, resetAt });
    return { success: true, remaining: maxAttempts - 1, resetAt: new Date(resetAt) };
  }

  entry.count += 1;

  if (entry.count > maxAttempts) {
    return { success: false, remaining: 0, resetAt: new Date(entry.resetAt) };
  }

  return {
    success: true,
    remaining: maxAttempts - entry.count,
    resetAt: new Date(entry.resetAt),
  };
}

export function getClientIp(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  return "unknown";
}
