import { describe, it, expect } from "vitest";
import { TIER_LIMITS, getTierLimits, TIER_LABELS } from "@/lib/tier-limits";
import type { Tier } from "@/lib/tier-limits";

describe("TIER_LIMITS", () => {
  it("free tier has restrictive limits", () => {
    expect(TIER_LIMITS.free.maxItems).toBe(10);
    expect(TIER_LIMITS.free.hasExport).toBe(false);
    expect(TIER_LIMITS.free.hasProfiles).toBe(false);
  });

  it("pro tier has unlimited items and export", () => {
    expect(TIER_LIMITS.pro.maxItems).toBe(Infinity);
    expect(TIER_LIMITS.pro.hasExport).toBe(true);
    expect(TIER_LIMITS.pro.hasProfiles).toBe(false);
  });

  it("family tier has everything including profiles", () => {
    expect(TIER_LIMITS.family.maxItems).toBe(Infinity);
    expect(TIER_LIMITS.family.hasExport).toBe(true);
    expect(TIER_LIMITS.family.hasProfiles).toBe(true);
  });
});

describe("getTierLimits", () => {
  it("returns correct limits for known tiers", () => {
    expect(getTierLimits("free")).toEqual(TIER_LIMITS.free);
    expect(getTierLimits("pro")).toEqual(TIER_LIMITS.pro);
    expect(getTierLimits("family")).toEqual(TIER_LIMITS.family);
  });

  it("falls back to free tier for unknown tier string", () => {
    expect(getTierLimits("unknown")).toEqual(TIER_LIMITS.free);
    expect(getTierLimits("")).toEqual(TIER_LIMITS.free);
  });

  it("falls back to free tier for empty string", () => {
    const limits = getTierLimits("");
    expect(limits.maxItems).toBe(10);
  });
});

describe("TIER_LABELS", () => {
  it("has labels for all tiers", () => {
    expect(TIER_LABELS.free).toBe("Free");
    expect(TIER_LABELS.pro).toBe("Pro");
    expect(TIER_LABELS.family).toBe("Family");
  });
});

describe("Tier type", () => {
  it("Tier type accepts valid tier strings", () => {
    const tiers: Tier[] = ["free", "pro", "family"];
    expect(tiers).toHaveLength(3);
  });
});
