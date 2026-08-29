import React from 'react';
import { useUI } from '../../context/UIContext';
import { useCurrency } from '../../context/CurrencyContext';
import type { SortOption } from '../../types';
import { X, Check } from 'lucide-react';

interface ProductFilterDrawerProps {
  selectedSort: SortOption;
  setSelectedSort: (sort: SortOption) => void;
  selectedSize: string | null;
  setSelectedSize: (size: string | null) => void;
  selectedColor: string | null;
  setSelectedColor: (color: string | null) => void;
  inStockOnly: boolean;
  setInStockOnly: (val: boolean) => void;
  priceRange: [number, number];
  setPriceRange: (range: [number, number]) => void;
  onReset: () => void;
  totalResults: number;
}

export const ProductFilterDrawer: React.FC<ProductFilterDrawerProps> = ({
  selectedSort,
  setSelectedSort,
  selectedSize,
  setSelectedSize,
  selectedColor,
  setSelectedColor,
  inStockOnly,
  setInStockOnly,
  priceRange,
  setPriceRange,
  onReset,
  totalResults,
}) => {
  const { isFilterDrawerOpen, closeFilterDrawer } = useUI();
  const { formatPrice } = useCurrency();

  if (!isFilterDrawerOpen) return null;

  const sortOptions: { label: string; value: SortOption }[] = [
    { label: 'Featured Atelier Order', value: 'featured' },
    { label: 'Newest Arrivals', value: 'newest' },
    { label: 'Price: Low to High', value: 'price-asc' },
    { label: 'Price: High to Low', value: 'price-desc' },
    { label: 'Alphabetical: A – Z', value: 'name-asc' },
  ];

  const availableSizes = ['XS', 'S', 'M', 'L', 'XL', '28', '30', '32', '34', 'EU 42', 'EU 43', 'One Size'];

  const availableColors = [
    { name: 'Obsidian Black', hex: '#121212' },
    { name: 'Alabaster Cream', hex: '#f0ece1' },
    { name: 'Oatmeal Sand', hex: '#d9d0c1' },
    { name: 'Basalt Charcoal', hex: '#2c2d30' },
    { name: 'Dune Bone', hex: '#e3ded5' },
    { name: 'Pure Carbon', hex: '#181818' },
  ];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Filter atelier collection"
      className="fixed inset-0 z-50 overflow-hidden"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
        onClick={closeFilterDrawer}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-background border-l border-border shadow-2xl flex flex-col">
          {/* Drawer Header */}
          <div className="p-4 sm:p-6 border-b border-border flex items-center justify-between">
            <div>
              <span className="micro-label text-muted-foreground block">STUDIO CONTROLS</span>
              <h3 className="editorial-title text-sm sm:text-base font-semibold">
                Refine Collection
              </h3>
            </div>
            <button
              onClick={closeFilterDrawer}
              className="p-2 text-foreground hover:opacity-70 transition-opacity"
              aria-label="Close filter drawer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Drawer Content */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-8 divide-y divide-border/60">
            {/* Sort Section */}
            <div className="space-y-3">
              <span className="micro-label text-foreground font-semibold">SORT BY</span>
              <div className="space-y-1.5">
                {sortOptions.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setSelectedSort(opt.value)}
                    className={`w-full text-left p-2.5 text-xs font-mono tracking-wider flex items-center justify-between transition-colors ${
                      selectedSort === opt.value
                        ? 'bg-foreground text-background font-bold'
                        : 'hover:bg-muted/50 text-foreground'
                    }`}
                  >
                    <span>{opt.label}</span>
                    {selectedSort === opt.value && <Check className="w-3.5 h-3.5" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Sizes Section */}
            <div className="pt-6 space-y-3">
              <div className="flex items-center justify-between">
                <span className="micro-label text-foreground font-semibold">SIZE</span>
                {selectedSize && (
                  <button
                    onClick={() => setSelectedSize(null)}
                    className="text-[10px] font-mono text-muted-foreground hover:text-foreground underline"
                  >
                    Reset
                  </button>
                )}
              </div>
              <div className="grid grid-cols-4 gap-1.5">
                {availableSizes.map((sz) => {
                  const isSelected = selectedSize === sz;
                  return (
                    <button
                      key={sz}
                      onClick={() => setSelectedSize(isSelected ? null : sz)}
                      className={`py-2 px-1 text-center text-xs font-mono tracking-widest border transition-colors ${
                        isSelected
                          ? 'bg-foreground text-background border-foreground font-bold'
                          : 'border-border text-foreground hover:bg-muted/40'
                      }`}
                    >
                      {sz}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Colors Section */}
            <div className="pt-6 space-y-3">
              <div className="flex items-center justify-between">
                <span className="micro-label text-foreground font-semibold">COLOR PALETTE</span>
                {selectedColor && (
                  <button
                    onClick={() => setSelectedColor(null)}
                    className="text-[10px] font-mono text-muted-foreground hover:text-foreground underline"
                  >
                    Reset
                  </button>
                )}
              </div>
              <div className="grid grid-cols-2 gap-2">
                {availableColors.map((col) => {
                  const isSelected = selectedColor === col.name;
                  return (
                    <button
                      key={col.name}
                      onClick={() => setSelectedColor(isSelected ? null : col.name)}
                      className={`flex items-center gap-2.5 p-2 text-xs font-mono tracking-wider border transition-colors ${
                        isSelected
                          ? 'border-foreground bg-muted/40 font-bold'
                          : 'border-border hover:bg-muted/20'
                      }`}
                    >
                      <span
                        className="w-3.5 h-3.5 rounded-full border border-border/80 shrink-0"
                        style={{ backgroundColor: col.hex }}
                      />
                      <span className="truncate">{col.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Price Range */}
            <div className="pt-6 space-y-3">
              <div className="flex items-center justify-between">
                <span className="micro-label text-foreground font-semibold">MAXIMUM PRICE</span>
                <span className="text-xs font-mono">{formatPrice(priceRange[1])}</span>
              </div>
              <input
                type="range"
                min={100}
                max={600}
                step={20}
                value={priceRange[1]}
                onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                className="w-full accent-foreground cursor-pointer"
                aria-label="Filter maximum price"
              />
              <div className="flex justify-between text-[10px] font-mono text-muted-foreground">
                <span>{formatPrice(100)}</span>
                <span>{formatPrice(600)}</span>
              </div>
            </div>

            {/* Availability Toggle */}
            <div className="pt-6 flex items-center justify-between">
              <div>
                <span className="micro-label text-foreground font-semibold block">IN-STOCK ONLY</span>
                <span className="text-[11px] text-muted-foreground font-light">Exclude archived archive items</span>
              </div>
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                className="w-4 h-4 accent-foreground cursor-pointer"
                aria-label="Filter in-stock items only"
              />
            </div>
          </div>

          {/* Bottom Actions */}
          <div className="p-4 sm:p-6 border-t border-border bg-card flex items-center gap-3">
            <button
              onClick={onReset}
              className="py-3 px-4 text-xs font-mono uppercase tracking-widest border border-border text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-colors"
            >
              Reset All
            </button>
            <button
              onClick={closeFilterDrawer}
              className="flex-1 py-3 px-4 bg-foreground text-background text-xs font-mono uppercase tracking-widest font-semibold hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors text-center"
            >
              View {totalResults} Results
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
