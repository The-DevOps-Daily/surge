import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

// We need to import fresh each time due to module-level state
// Use dynamic import approach with module isolation
describe("rateLimit", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("allows requests under the limit", async () => {
    const { rateLimit } = await import("@/lib/rate-limit");
    const key = `test-under-limit-${Date.now()}`;
    const result = rateLimit(key, { maxAttempts: 5, windowMs: 60000 });
    expect(result.success).toBe(true);
    expect(result.remaining).toBe(4);
  });

  it("blocks requests over the limit", async () => {
    const { rateLimit } = await import("@/lib/rate-limit");
    const key = `test-over-limit-${Date.now()}`;
    const opts = { maxAttempts: 3, windowMs: 60000 };

    rateLimit(key, opts); // 1
    rateLimit(key, opts); // 2
    rateLimit(key, opts); // 3
    const result = rateLimit(key, opts); // 4 - over limit
    expect(result.success).toBe(false);
    expect(result.remaining).toBe(0);
  });

  it("resets after window expires", async () => {
    const { rateLimit } = await import("@/lib/rate-limit");
    const key = `test-reset-${Date.now()}`;
    const opts = { maxAttempts: 2, windowMs: 60000 };

    rateLimit(key, opts); // 1
    rateLimit(key, opts); // 2
    const blocked = rateLimit(key, opts); // 3 - over limit
    expect(blocked.success).toBe(false);

    // Advance time past the window
    vi.advanceTimersByTime(61000);

    const afterReset = rateLimit(key, opts);
    expect(afterReset.success).toBe(true);
    expect(afterReset.remaining).toBe(1);
  });
});
