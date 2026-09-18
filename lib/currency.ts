export const AFRICAN_CURRENCIES = [
  "NGN",
  "KES",
  "GHS",
  "ZAR",
  "XAF",
  "XOF",
  "TZS",
  "UGX",
  "RWF",
  "MAD",
  "EGP",
  "CDF",
  "BWP",
] as const;

export type AfricanCurrency = (typeof AFRICAN_CURRENCIES)[number];

export const DEFAULT_AFRICAN_CURRENCY: AfricanCurrency = "NGN";

export function isAfricanCurrency(value: string): value is AfricanCurrency {
  return AFRICAN_CURRENCIES.includes(value as AfricanCurrency);
}

export function formatCurrency(amount: number, currency: AfricanCurrency = DEFAULT_AFRICAN_CURRENCY) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(amount);
}
