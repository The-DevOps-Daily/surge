export const CURRENCIES = {
  EUR: { symbol: "\u20ac", name: "Euro", locale: "de-DE" },
  USD: { symbol: "$", name: "US Dollar", locale: "en-US" },
  GBP: { symbol: "\u00a3", name: "British Pound", locale: "en-GB" },
  BGN: { symbol: "\u043b\u0432", name: "Bulgarian Lev", locale: "bg-BG" },
  CHF: { symbol: "CHF", name: "Swiss Franc", locale: "de-CH" },
} as const;

export type CurrencyCode = keyof typeof CURRENCIES;

export function getCurrencyInfo(code: string) {
  return CURRENCIES[code as CurrencyCode] || CURRENCIES.EUR;
}
