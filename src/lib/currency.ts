/**
 * Shared currency type for IP-based pricing.
 * India resolves to INR; every other detected country resolves to USD; an
 * undetectable location also resolves to INR (this page never charges
 * money, so there is no undercharging risk to fail closed against).
 */
export type PricingCurrency = 'INR' | 'USD';

/** Client-side sessionStorage cache TTL for the resolved currency. */
export const PRICING_CURRENCY_TTL_MS = 60 * 60 * 1000;

export function parsePricingCurrency(value: unknown): PricingCurrency | null {
  return value === 'INR' || value === 'USD' ? value : null;
}
