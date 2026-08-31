import React, { useState, useEffect, useRef } from 'react';
import { useUI } from '../../context/UIContext';
import { useCurrency } from '../../context/CurrencyContext';
import { useProducts, useCategories } from '../../api/queries';
import type { Product, ProductCategory } from '../../types';
import { Search, X, ArrowRight, CornerDownLeft, Sparkles } from 'lucide-react';
import { ImageWithFallback } from '../ui/ImagePlaceholder';

export const SearchCommandModal: React.FC = () => {
  const { isSearchOpen, closeSearch, openQuickView, setActiveCategory } = useUI();
  const { formatPrice } = useCurrency();
  const { data: productsData } = useProducts();
  const { data: categoriesData } = useCategories();
  const PRODUCTS = productsData || [];

  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isSearchOpen) {
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [isSearchOpen]);

  if (!isSearchOpen) return null;

  const handleClose = () => {
    setQuery('');
    closeSearch();
  };

  const trendingQueries = [
    'Wool Structured Hoodie',
    'Down Parka',
    '3-Layer Ripstop',
    'Wide-Leg Trouser',
    'Raw Silk',
    'Lug Boot',
  ];

  const categoryTags: { label: string; value: ProductCategory }[] = categoriesData
    ? categoriesData.map((c: any) => ({ label: c.name, value: c.slug as ProductCategory }))
    : [
        { label: 'Outerwear', value: 'outerwear' as ProductCategory },
        { label: 'Knitwear', value: 'knitwear' as ProductCategory },
        { label: 'Tailoring', value: 'tailoring' as ProductCategory },
        { label: 'Bottoms', value: 'bottoms' as ProductCategory },
        { label: 'Objects', value: 'objects' as ProductCategory },
        { label: 'Footwear', value: 'footwear' as ProductCategory },
      ];

  const searchResults: Product[] = query.trim()
    ? PRODUCTS.filter((p) => {
        const q = query.toLowerCase().trim();
        return (
          p.name.toLowerCase().includes(q) ||
          p.subtitle.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.composition.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.colorName.toLowerCase().includes(q)
        );
      })
    : [];

  const handleSelectProduct = (product: Product) => {
    handleClose();
    openQuickView(product);
  };

  const handleSelectCategory = (cat: ProductCategory) => {
    setActiveCategory(cat);
    handleClose();
    const el = document.getElementById('collection-grid');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="search-modal-title"
      className="fixed inset-0 z-50 overflow-y-auto flex items-start justify-center p-4 sm:p-6 md:p-12 animate-in fade-in duration-150"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/75 backdrop-blur-xs transition-opacity"
        onClick={handleClose}
      />

      {/* Command Palette Box */}
      <div className="relative w-full max-w-2xl bg-background border border-border shadow-2xl z-10 overflow-hidden flex flex-col mt-4 sm:mt-10">
        {/* Search Input Bar */}
        <div className="p-4 sm:p-5 border-b border-border flex items-center gap-3 bg-card">
          <Search className="w-5 h-5 text-muted-foreground shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search silhouettes, materials (e.g. 'Cashmere', 'Ripstop')..."
            className="flex-1 bg-transparent text-sm sm:text-base font-mono text-foreground placeholder:text-muted-foreground outline-none"
            aria-label="Search silhouettes and materials"
          />
          {query ? (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-muted-foreground hover:text-foreground"
              aria-label="Clear search input"
            >
              <X className="w-4 h-4" />
            </button>
          ) : (
            <kbd className="hidden sm:inline-block text-[10px] font-mono px-2 py-0.5 bg-muted text-muted-foreground border border-border">
              ESC
            </kbd>
          )}
        </div>

        {/* Dynamic Results & Suggestions Body */}
        <div className="max-h-[60vh] overflow-y-auto p-4 sm:p-6 space-y-6">
          {query.trim() ? (
            <div>
              <div className="flex items-center justify-between text-[10px] font-mono text-muted-foreground uppercase tracking-widest mb-3">
                <span>Search Results ({searchResults.length})</span>
                <span>Press card to inspect</span>
              </div>

              {searchResults.length === 0 ? (
                <div className="py-12 text-center space-y-2">
                  <p className="text-sm font-mono text-foreground">
                    No silhouettes match &ldquo;{query}&rdquo;
                  </p>
                  <p className="text-xs text-muted-foreground font-light">
                    Try searching for materials like &ldquo;Wool&rdquo;, &ldquo;Silk&rdquo;, &ldquo;Down&rdquo; or categories.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {searchResults.map((product) => (
                    <div
                      key={product.id}
                      onClick={() => handleSelectProduct(product)}
                      className="p-3 bg-surface-subtle border border-border hover:border-foreground transition-all cursor-pointer flex gap-3 items-center group"
                    >
                      <div className="w-14 h-16 bg-card border border-border overflow-hidden shrink-0">
                        <ImageWithFallback
                          src={product.images.primary}
                          alt={product.name}
                          fallbackColor={product.placeholderColor}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="micro-label text-muted-foreground block text-[9px]">
                          {product.category.toUpperCase()}
                        </span>
                        <h4 className="text-xs font-medium text-foreground truncate group-hover:opacity-75">
                          {product.name}
                        </h4>
                        <p className="text-[11px] font-mono text-foreground font-semibold mt-1">
                          {formatPrice(product.price)}
                        </p>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-muted-foreground group-hover:text-foreground group-hover:translate-x-0.5 transition-all" />
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              {/* Category Quick Tags */}
              <div>
                <span className="micro-label text-muted-foreground block mb-2.5">
                  BROWSE ATELIER CATEGORIES
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {categoryTags.map((cat) => (
                    <button
                      key={cat.value}
                      onClick={() => handleSelectCategory(cat.value)}
                      className="px-3 py-1.5 bg-surface-subtle hover:bg-muted text-xs font-mono tracking-wider border border-border text-foreground transition-colors"
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Trending Queries */}
              <div>
                <span className="micro-label text-muted-foreground block mb-2.5">
                  POPULAR SEARCH QUERIES
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {trendingQueries.map((item) => (
                    <button
                      key={item}
                      onClick={() => setQuery(item)}
                      className="text-left p-2.5 bg-surface-subtle hover:bg-muted/60 text-xs font-mono tracking-wide text-foreground border border-border transition-colors flex items-center justify-between group"
                    >
                      <span className="flex items-center gap-2">
                        <Sparkles className="w-3 h-3 text-muted-foreground group-hover:text-foreground" />
                        {item}
                      </span>
                      <CornerDownLeft className="w-3 h-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="p-3 bg-surface-subtle border-t border-border flex items-center justify-between text-[10px] font-mono text-muted-foreground px-5">
          <span>Noir Atelier Studio Archive Search Engine</span>
          <span className="hidden sm:inline">Use ↑↓ keys and enter to navigate</span>
        </div>
      </div>
    </div>
  );
};
