import React from 'react';
import { useCategories } from '../../api/queries';
import { useUI } from '../../context/UIContext';
import { useCurrency } from '../../context/CurrencyContext';
import { SUPPORTED_CURRENCIES } from '../../data/currencies';
import type { ProductCategory, CurrencyCode } from '../../types';
import { X, Globe, Heart, Search, ArrowRight } from 'lucide-react';
import { useWishlist } from '../../context/WishlistContext';

export const MobileNav: React.FC = () => {
  const { isMobileNavOpen, closeMobileNav, activeCategory, setActiveCategory, openSearch, showToast } = useUI();
  const { currency, setCurrency } = useCurrency();
  const { totalWishlistItems, openWishlist } = useWishlist();

  if (!isMobileNavOpen) return null;

  const { data: categoriesData } = useCategories();

  const categories = React.useMemo(() => {
    const defaultCat = { label: 'All Silhouettes', value: 'all' as ProductCategory };
    if (!categoriesData) return [defaultCat];
    const dynamicCats = categoriesData.map((c: any) => ({
      label: c.name,
      value: c.slug as ProductCategory,
    }));
    return [defaultCat, ...dynamicCats];
  }, [categoriesData]);

  const handleCategorySelect = (cat: ProductCategory) => {
    setActiveCategory(cat);
    closeMobileNav();
    const el = document.getElementById('collection-grid');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Mobile navigation menu"
      className="fixed inset-0 z-50 bg-background flex flex-col md:hidden animate-in fade-in duration-200"
    >
      {/* Top Bar */}
      <div className="flex items-center justify-between p-4 border-b border-border min-h-[58px]">
        <span className="editorial-title text-xs font-semibold tracking-[0.25em]">
          NOIR ATELIER
        </span>
        <button
          onClick={closeMobileNav}
          className="p-2 text-foreground hover:opacity-70 transition-opacity"
          aria-label="Close navigation menu"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Search Input Quick Button */}
      <div className="p-4 border-b border-border">
        <button
          onClick={() => {
            closeMobileNav();
            openSearch();
          }}
          className="w-full flex items-center justify-between p-3 bg-muted/40 text-muted-foreground border border-border text-xs font-mono tracking-widest uppercase text-left"
        >
          <span className="flex items-center gap-2">
            <Search className="w-4 h-4" />
            Search atelier archive...
          </span>
          <kbd className="text-[10px] bg-background px-1.5 py-0.5 border border-border">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Main Categories Tree */}
      <div className="flex-1 overflow-y-auto divide-y divide-border">
        <div className="px-4 py-2 bg-muted/20">
          <span className="micro-label text-muted-foreground">COLLECTIONS & CATEGORIES</span>
        </div>
        {categories.map((cat) => (
          <button
            key={cat.value}
            onClick={() => handleCategorySelect(cat.value)}
            className={`w-full flex items-center justify-between p-4 text-xs tracking-[0.2em] uppercase font-mono transition-colors text-left ${
              activeCategory === cat.value
                ? 'bg-foreground text-background font-bold'
                : 'text-foreground hover:bg-muted/40'
            }`}
          >
            <span>{cat.label}</span>
            <ArrowRight className="w-3.5 h-3.5 opacity-60" />
          </button>
        ))}

        {/* Editorial & Lookbook Link */}
        <div className="p-4 bg-muted/10">
          <a
            href="#campaign-lookbook"
            onClick={closeMobileNav}
            className="flex items-center justify-between text-xs tracking-[0.2em] uppercase font-mono text-foreground font-semibold"
          >
            <span>Edition 04 / Lookbook</span>
            <span className="text-[10px] text-muted-foreground">CAMPAIGN</span>
          </a>
        </div>
        <div className="p-4 bg-muted/10">
          <a
            href="#material-study"
            onClick={closeMobileNav}
            className="flex items-center justify-between text-xs tracking-[0.2em] uppercase font-mono text-foreground font-semibold"
          >
            <span>Material Studies</span>
            <span className="text-[10px] text-muted-foreground">OKAYAMA / BIELLA</span>
          </a>
        </div>
      </div>

      {/* Bottom Utilities */}
      <div className="p-4 border-t border-border bg-surface-subtle space-y-3">
        {/* Wishlist quick link */}
        <button
          onClick={() => {
            closeMobileNav();
            openWishlist();
          }}
          className="w-full flex items-center justify-between py-2 text-xs font-mono uppercase tracking-widest text-muted-foreground hover:text-foreground"
        >
          <span className="flex items-center gap-2">
            <Heart className="w-3.5 h-3.5" />
            Saved Pieces
          </span>
          <span>[{totalWishlistItems}]</span>
        </button>

        {/* Currency Switcher */}
        <div className="flex items-center justify-between pt-2 border-t border-border/50 text-xs font-mono tracking-widest">
          <span className="text-muted-foreground flex items-center gap-1.5 text-[11px]">
            <Globe className="w-3.5 h-3.5" /> Currency
          </span>
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value as CurrencyCode)}
            className="bg-background border border-border text-foreground px-2 py-1 text-xs font-mono uppercase outline-none"
            aria-label="Change currency"
          >
            {(Object.keys(SUPPORTED_CURRENCIES) as CurrencyCode[]).map((code) => (
              <option key={code} value={code}>
                {code} ({SUPPORTED_CURRENCIES[code].symbol})
              </option>
            ))}
          </select>
        </div>

        {/* VIP Account Trigger */}
        <button
          onClick={() => {
            closeMobileNav();
            showToast('Private Client Atelier Portal opens for VIP presale holders.', 'info');
          }}
          className="w-full py-2.5 bg-foreground text-background text-xs font-mono uppercase tracking-widest font-medium"
        >
          Client Atelier Portal / Log in
        </button>
      </div>
    </div>
  );
};
