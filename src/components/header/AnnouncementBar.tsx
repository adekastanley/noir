import React, { useState } from 'react';
import { useCurrency } from '../../context/CurrencyContext';
import { SUPPORTED_CURRENCIES } from '../../data/currencies';
import type { CurrencyCode } from '../../types';
import { ChevronDown, Globe } from 'lucide-react';

export const AnnouncementBar: React.FC = () => {
  const { currency, setCurrency } = useCurrency();
  const [showCurrencyDropdown, setShowCurrencyDropdown] = useState(false);

  const announcements = [
    'Escape the noise.',
    'Collection 04 — Silent Form now available worldwide.',
    'Complimentary carbon-neutral DHL Express on orders over €250.',
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  const nextAnnouncement = () => {
    setCurrentIndex((prev) => (prev + 1) % announcements.length);
  };

  return (
    <div className="w-full bg-background border-b border-border text-foreground text-[11px] uppercase tracking-[0.2em] font-mono select-none">
      <div className="max-w-[1920px] mx-auto px-4 h-8 flex items-center justify-between">
        {/* Left Region Indicator */}
        <div className="hidden sm:flex items-center gap-2 text-muted-foreground">
          <Globe className="w-3 h-3 opacity-60" />
          <span className="text-[10px] tracking-[0.25em]">GLOBAL / ATELIER PARIS</span>
        </div>

        {/* Center Tagline ticker */}
        <div
          onClick={nextAnnouncement}
          className="flex-1 text-center cursor-pointer hover:opacity-75 transition-opacity px-2 truncate"
          title="Click to cycle announcement"
        >
          <span className="text-[11px] tracking-[0.25em] font-medium">
            {announcements[currentIndex]}
          </span>
        </div>

        {/* Right Currency Selector */}
        <div className="relative">
          <button
            onClick={() => setShowCurrencyDropdown((prev) => !prev)}
            className="flex items-center gap-1 text-[10px] text-muted-foreground hover:text-foreground transition-colors px-1 py-0.5 tracking-[0.25em]"
            aria-expanded={showCurrencyDropdown}
            aria-label="Select currency"
          >
            <span>{currency} ({SUPPORTED_CURRENCIES[currency].symbol})</span>
            <ChevronDown className="w-2.5 h-2.5 opacity-60" />
          </button>

          {showCurrencyDropdown && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setShowCurrencyDropdown(false)}
              />
              <div className="absolute right-0 top-full mt-1 bg-popover text-popover-foreground border border-border shadow-xl z-50 py-1 min-w-[120px]">
                {(Object.keys(SUPPORTED_CURRENCIES) as CurrencyCode[]).map((code) => (
                  <button
                    key={code}
                    onClick={() => {
                      setCurrency(code);
                      setShowCurrencyDropdown(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 text-[10px] tracking-widest font-mono flex items-center justify-between hover:bg-muted transition-colors ${
                      currency === code ? 'font-bold text-foreground bg-muted/50' : 'text-muted-foreground'
                    }`}
                  >
                    <span>{code}</span>
                    <span>{SUPPORTED_CURRENCIES[code].symbol}</span>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
