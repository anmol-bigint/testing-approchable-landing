import { COHORT } from '@/lib/cohort-config';
import type { PricingCurrency } from '@/lib/currency';

export function isCohortLate(now = Date.now()): boolean {
  return now >= new Date(COHORT.priceIncreaseAt).getTime();
}

export function getCohortDisplay(currency: PricingCurrency, isLate = isCohortLate()) {
  const intl = currency === 'USD';
  return {
    current: isLate
      ? intl
        ? COHORT.priceIntlLate
        : COHORT.priceIndiaLate
      : intl
        ? COHORT.priceIntl
        : COHORT.priceIndia,
    original: intl ? COHORT.originalPriceIntl : COHORT.originalPriceIndia,
    tagline: isLate
      ? intl
        ? COHORT.priceTaglineIntlLate
        : COHORT.priceTaglineIndiaLate
        : intl
        ? COHORT.priceTaglineIntl
        : COHORT.priceTaglineIndia,
  };
}
