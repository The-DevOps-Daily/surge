import { format } from "date-fns";
import { getCurrencyInfo } from "./currencies";

export function formatCurrency(amount: number, currency: string = "EUR"): string {
  const info = getCurrencyInfo(currency);
  return new Intl.NumberFormat(info.locale, {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(date: Date | string): string {
  return format(new Date(date), "dd MMM yyyy");
}

export function formatDateTime(date: Date | string): string {
  return format(new Date(date), "dd MMM yyyy, HH:mm");
}

export const ASSET_CATEGORIES = [
  "REAL_ESTATE",
  "VEHICLE",
  "STOCKS",
  "CASH",
  "CRYPTO",
  "OTHER",
] as const;

export const LIABILITY_CATEGORIES = [
  "MORTGAGE",
  "LOAN",
  "CREDIT_CARD",
  "OTHER",
] as const;

export const CATEGORY_LABELS: Record<string, string> = {
  REAL_ESTATE: "Real Estate",
  VEHICLE: "Vehicles",
  STOCKS: "Stocks",
  CASH: "Cash",
  CRYPTO: "Crypto",
  MORTGAGE: "Mortgage",
  LOAN: "Loans",
  CREDIT_CARD: "Credit Cards",
  OTHER: "Other",
};

export const CHART_COLORS = [
  "#6ee7b7", // emerald-300
  "#93c5fd", // blue-300
  "#fcd34d", // amber-300
  "#fda4af", // rose-300
  "#c4b5fd", // violet-300
  "#67e8f9", // cyan-300
  "#bef264", // lime-300
  "#f9a8d4", // pink-300
];
