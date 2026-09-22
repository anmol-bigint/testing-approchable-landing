'use client';

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { parsePricingCurrency, PRICING_CURRENCY_TTL_MS, type PricingCurrency } from '@/lib/currency';

/** No payment happens on this page and both currencies lead to the same next
 *  step, so we default to INR (most of our traffic) while the real geo
 *  lookup resolves in the background — there is no undercharging risk to
 *  fail closed against. */
const FALLBACK_CURRENCY: PricingCurrency = 'INR';

const CACHE_KEY = 'approachable-pricing-currency';

type CacheEntry = { currency: PricingCurrency; expiresAt: number };

type PricingCurrencyContextType = {
  currency: PricingCurrency;
  isLoading: boolean;
};

const PricingCurrencyContext = createContext<PricingCurrencyContextType | undefined>(undefined);

function readCache(): PricingCurrency | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.sessionStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const entry = JSON.parse(raw) as CacheEntry;
    if (Date.now() > entry.expiresAt) return null;
    return parsePricingCurrency(entry.currency);
  } catch {
    return null;
  }
}

function writeCache(currency: PricingCurrency) {
  try {
    const entry: CacheEntry = { currency, expiresAt: Date.now() + PRICING_CURRENCY_TTL_MS };
    window.sessionStorage.setItem(CACHE_KEY, JSON.stringify(entry));
  } catch {
    // ignore storage write errors (privacy mode / quota)
  }
}

function currencyFromCountryCode(countryCode: string | null | undefined): PricingCurrency {
  return countryCode?.toUpperCase() === 'IN' ? 'INR' : countryCode ? 'USD' : 'INR';
}

/**
 * Looked up directly from the browser (not via our own API route) so the
 * request is a real, external network call — testable with a browser VPN
 * extension, same as the learner app's registration page. A same-origin
 * `/api/...` route would never be proxied by a browser VPN extension since
 * those never touch localhost/same-origin traffic.
 */
async function lookupCurrency(): Promise<PricingCurrency> {
  const res = await fetch('https://ipwho.is/', { signal: AbortSignal.timeout(4000) });
  const data = (await res.json()) as { success?: boolean; country_code?: string };
  if (!data.success) throw new Error('ipwho.is lookup failed');
  return currencyFromCountryCode(data.country_code);
}

export function PricingCurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrency] = useState<PricingCurrency>(() => readCache() ?? FALLBACK_CURRENCY);
  const [isLoading, setIsLoading] = useState(() => readCache() === null);

  useEffect(() => {
    let cancelled = false;

    async function fetchCurrency() {
      const cached = readCache();
      // Serve the cached value instantly, but always revalidate in the
      // background so a VPN switch, location change, or a stale/bad lookup
      // doesn't stick around for the whole cache window.
      if (!cached) setIsLoading(true);

      try {
        const resolved = await lookupCurrency();
        if (cancelled) return;
        writeCache(resolved);
        setCurrency(resolved);
      } catch {
        if (cancelled) return;
        setCurrency(cached ?? FALLBACK_CURRENCY);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    fetchCurrency();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <PricingCurrencyContext.Provider value={{ currency, isLoading }}>{children}</PricingCurrencyContext.Provider>
  );
}

export function usePricingCurrency() {
  const context = useContext(PricingCurrencyContext);
  if (!context) {
    throw new Error('usePricingCurrency must be used within PricingCurrencyProvider');
  }
  return context;
}
