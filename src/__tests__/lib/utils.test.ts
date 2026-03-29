import { describe, it, expect } from "vitest";
import { formatCurrency, formatDate, formatDateTime, ASSET_CATEGORIES, LIABILITY_CATEGORIES, CATEGORY_LABELS, CHART_COLORS } from "@/lib/utils";

describe("formatCurrency", () => {
  it("formats EUR amounts with no decimals", () => {
    const result = formatCurrency(1234);
    expect(result).toContain("1.234");
    expect(result).toContain("€");
  });

  it("defaults to EUR when no currency is specified", () => {
    const result = formatCurrency(500);
    expect(result).toContain("€");
  });

  it("formats USD amounts correctly", () => {
    const result = formatCurrency(1000, "USD");
    expect(result).toContain("$");
  });

  it("handles zero", () => {
    const result = formatCurrency(0);
    expect(result).toContain("0");
  });

  it("handles negative values", () => {
    const result = formatCurrency(-5000);
    expect(result).toContain("5.000");
  });

  it("handles large values", () => {
    const result = formatCurrency(1000000);
    expect(result).toContain("1.000.000");
  });
});

describe("formatDate", () => {
  it("formats a Date object", () => {
    const result = formatDate(new Date("2026-03-28"));
    expect(result).toBe("28 Mar 2026");
  });

  it("formats a date string", () => {
    const result = formatDate("2025-01-15T12:00:00Z");
    expect(result).toContain("Jan");
    expect(result).toContain("2025");
  });
});

describe("formatDateTime", () => {
  it("includes time component", () => {
    const result = formatDateTime("2026-03-28T14:30:00Z");
    expect(result).toContain("2026");
    expect(result).toContain("Mar");
  });
});

describe("constants", () => {
  it("ASSET_CATEGORIES has expected categories", () => {
    expect(ASSET_CATEGORIES).toContain("REAL_ESTATE");
    expect(ASSET_CATEGORIES).toContain("STOCKS");
    expect(ASSET_CATEGORIES).toContain("CASH");
    expect(ASSET_CATEGORIES).toContain("CRYPTO");
    expect(ASSET_CATEGORIES.length).toBeGreaterThanOrEqual(6);
  });

  it("LIABILITY_CATEGORIES has expected categories", () => {
    expect(LIABILITY_CATEGORIES).toContain("MORTGAGE");
    expect(LIABILITY_CATEGORIES).toContain("LOAN");
    expect(LIABILITY_CATEGORIES).toContain("CREDIT_CARD");
  });

  it("CATEGORY_LABELS maps all asset categories", () => {
    for (const cat of ASSET_CATEGORIES) {
      expect(CATEGORY_LABELS[cat]).toBeDefined();
    }
  });

  it("CATEGORY_LABELS maps all liability categories", () => {
    for (const cat of LIABILITY_CATEGORIES) {
      expect(CATEGORY_LABELS[cat]).toBeDefined();
    }
  });

  it("CHART_COLORS has at least 6 colors", () => {
    expect(CHART_COLORS.length).toBeGreaterThanOrEqual(6);
    for (const color of CHART_COLORS) {
      expect(color).toMatch(/^#[0-9a-f]{6}$/i);
    }
  });
});
