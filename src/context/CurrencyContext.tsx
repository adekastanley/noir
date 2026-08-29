import React, { createContext, useContext, useState } from 'react';
import type { CurrencyCode, CurrencyConfig } from '../types';
import { SUPPORTED_CURRENCIES, DEFAULT_CURRENCY } from '../data/currencies';

interface CurrencyContextType {
  currency: CurrencyCode;
  config: CurrencyConfig;
  setCurrency: (code: CurrencyCode) => void;
  formatPrice: (amountInEUR: number) => string;
  convertPrice: (amountInEUR: number) => number;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

const STORAGE_KEY = 'noir_atelier_currency';

export const CurrencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currency, setCurrencyState] = useState<CurrencyCode>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved && SUPPORTED_CURRENCIES[saved as CurrencyCode]) {
        return saved as CurrencyCode;
      }
    } catch {
      // localStorage not accessible
    }
    return DEFAULT_CURRENCY;
  });

  const config = SUPPORTED_CURRENCIES[currency] || SUPPORTED_CURRENCIES[DEFAULT_CURRENCY];

  const setCurrency = (code: CurrencyCode) => {
    if (SUPPORTED_CURRENCIES[code]) {
      setCurrencyState(code);
      try {
        localStorage.setItem(STORAGE_KEY, code);
      } catch {
        // ignore
      }
    }
  };

  const convertPrice = (amountInEUR: number): number => {
    return amountInEUR * config.rate;
  };

  const formatPrice = (amountInEUR: number): string => {
    const converted = convertPrice(amountInEUR);
    const formattedNum = converted.toLocaleString(undefined, {
      minimumFractionDigits: config.decimalPlaces,
      maximumFractionDigits: config.decimalPlaces,
    });

    if (config.position === 'prefix') {
      return `${config.symbol}${formattedNum}`;
    }
    return `${formattedNum} ${config.symbol}`;
  };

  return (
    <CurrencyContext.Provider
      value={{
        currency,
        config,
        setCurrency,
        formatPrice,
        convertPrice,
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = (): CurrencyContextType => {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};
