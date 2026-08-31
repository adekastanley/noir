import type { CurrencyCode, CurrencyConfig } from '../types';

export const SUPPORTED_CURRENCIES: Record<CurrencyCode, CurrencyConfig> = {
  EUR: {
    code: 'EUR',
    symbol: '€',
    rate: 1.0,
    position: 'prefix',
    decimalPlaces: 2,
  },
  USD: {
    code: 'USD',
    symbol: '$',
    rate: 1.08,
    position: 'prefix',
    decimalPlaces: 2,
  },
  GBP: {
    code: 'GBP',
    symbol: '£',
    rate: 0.85,
    position: 'prefix',
    decimalPlaces: 2,
  },
  JPY: {
    code: 'JPY',
    symbol: '¥',
    rate: 165.0,
    position: 'prefix',
    decimalPlaces: 0,
  },
  CAD: {
    code: 'CAD',
    symbol: 'CA$',
    rate: 1.48,
    position: 'prefix',
    decimalPlaces: 2,
  },
  AUD: {
    code: 'AUD',
    symbol: 'AU$',
    rate: 1.66,
    position: 'prefix',
    decimalPlaces: 2,
  },
  CHF: {
    code: 'CHF',
    symbol: 'CHF ',
    rate: 0.96,
    position: 'prefix',
    decimalPlaces: 2,
  },
  NGN: {
    code: 'NGN',
    symbol: '₦',
    rate: 1.0, // Assuming NGN is the base currency for this store now
    position: 'prefix',
    decimalPlaces: 0,
  }
};

export const DEFAULT_CURRENCY: CurrencyCode = 'NGN';
