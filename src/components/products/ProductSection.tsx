import React, { useState, useMemo } from 'react';
import { useUI } from '../../context/UIContext';
import { useProducts, useCategories } from '../../api/queries';
import { Skeleton } from '../ui/skeleton';
import type { ProductCategory, SortOption } from '../../types';
import { ProductGrid } from './ProductGrid';
import { ProductFilterDrawer } from './ProductFilterDrawer';
import { SlidersHorizontal, LayoutGrid, Grid3X3, Grid2X2, ArrowRight } from 'lucide-react';

export const ProductSection: React.FC = () => {
  const {
    activeCategory,
    setActiveCategory,
    gridDensity,
    setGridDensity,
    openFilterDrawer,
  } = useUI();

  const { data: productsData, isLoading: isLoadingProducts } = useProducts();
  const { data: categoriesData, isLoading: isLoadingCategories } = useCategories();
  const PRODUCTS = productsData || [];

  // Calculate maximum price dynamically from products
  const maxProductPrice = useMemo(() => {
    if (!productsData || productsData.length === 0) return 10000000;
    return Math.max(...productsData.map((p) => p.price), 1000);
  }, [productsData]);

  // Local filter states
  const [selectedSort, setSelectedSort] = useState<SortOption>('featured');
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000000]);

  // Dynamic Categories list
  const categories = useMemo(() => {
    const defaultCat = { label: 'All Silhouettes', value: 'all' as ProductCategory };
    if (!categoriesData) return [defaultCat];
    const dynamicCats = categoriesData.map((c: any) => ({
      label: c.name,
      value: c.slug as ProductCategory,
    }));
    return [defaultCat, ...dynamicCats];
  }, [categoriesData]);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let result = [...PRODUCTS];

    if (activeCategory !== 'all') {
      result = result.filter((p) => p.category === activeCategory);
    }

    if (selectedSize) {
      result = result.filter((p) => p.sizes.includes(selectedSize));
    }

    if (selectedColor) {
      result = result.filter((p) =>
        p.colorways.some((cw) => cw.name.toLowerCase() === selectedColor.toLowerCase())
      );
    }

    if (inStockOnly) {
      result = result.filter((p) => p.inStock && p.stockCount > 0);
    }

    // Only filter price if the user actually adjusted the price range
    if (priceRange[0] > 0 || priceRange[1] < maxProductPrice) {
      result = result.filter((p) => p.price >= priceRange[0] && p.price <= priceRange[1]);
    }

    switch (selectedSort) {
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        result.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
        break;
      case 'name-asc':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'featured':
      default:
        result.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
        break;
    }

    return result;
  }, [PRODUCTS, activeCategory, selectedSize, selectedColor, inStockOnly, priceRange, maxProductPrice, selectedSort]);

  const activeFilterCount =
    (selectedSize ? 1 : 0) +
    (selectedColor ? 1 : 0) +
    (inStockOnly ? 1 : 0) +
    (priceRange[0] > 0 || priceRange[1] < maxProductPrice ? 1 : 0);

  const clearAllFilters = () => {
    setSelectedSize(null);
    setSelectedColor(null);
    setInStockOnly(false);
    setPriceRange([0, maxProductPrice]);
    setActiveCategory('all');
  };

  return (
    <section
      id="collection-grid"
      aria-label="Atelier Collection Catalog"
      className="w-full max-w-[1920px] mx-auto bg-background"
    >
      {/* Control Bar: Categories, Filter Trigger, Density Switcher, Count */}
      <div className="border-b border-border bg-background flex flex-col md:flex-row items-stretch justify-between">
        {/* Horizontal Category Nav Scrollable */}
        <div className="flex items-center overflow-x-auto no-scrollbar border-b md:border-b-0 border-border">
          {isLoadingCategories ? (
            <div className="flex items-center px-4 py-3.5 space-x-6">
              <Skeleton className="w-24 h-4 bg-muted-foreground/10" />
              <Skeleton className="w-32 h-4 bg-muted-foreground/10" />
              <Skeleton className="w-20 h-4 bg-muted-foreground/10" />
            </div>
          ) : (
            categories.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setActiveCategory(cat.value)}
                className={`px-4 sm:px-6 py-3.5 text-[11px] uppercase tracking-[0.2em] font-mono whitespace-nowrap transition-colors border-r border-border ${
                  activeCategory === cat.value
                    ? 'bg-foreground text-background font-semibold'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/40'
                }`}
              >
                {cat.label}
              </button>
            ))
          )}
        </div>

        {/* Right Tools: Filter Drawer Trigger, Density, Sort */}
        <div className="flex items-stretch justify-between md:justify-end divide-x divide-border">
          {/* Total Count */}
          <div className="flex items-center px-4 py-2 text-[10px] font-mono tracking-widest uppercase text-muted-foreground">
            <span>{filteredProducts.length} Silhouettes</span>
          </div>

          {/* Filter Drawer Trigger */}
          <button
            onClick={openFilterDrawer}
            className={`flex items-center gap-2 px-4 py-2 text-[11px] font-mono uppercase tracking-[0.2em] transition-colors ${
              activeFilterCount > 0
                ? 'bg-foreground text-background font-medium'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted/40'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Filter</span>
            {activeFilterCount > 0 && <span>({activeFilterCount})</span>}
          </button>

          {/* Grid Density Switcher (Desktop) */}
          <div className="hidden lg:flex items-center px-2 gap-1 bg-surface-subtle">
            <button
              onClick={() => setGridDensity('2-col')}
              className={`p-1.5 transition-colors ${
                gridDensity === '2-col' ? 'text-foreground' : 'text-muted-foreground/50 hover:text-foreground'
              }`}
              title="2 Column View"
            >
              <Grid2X2 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setGridDensity('3-col')}
              className={`p-1.5 transition-colors ${
                gridDensity === '3-col' ? 'text-foreground' : 'text-muted-foreground/50 hover:text-foreground'
              }`}
              title="3 Column View (Default)"
            >
              <Grid3X3 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setGridDensity('4-col')}
              className={`p-1.5 transition-colors ${
                gridDensity === '4-col' ? 'text-foreground' : 'text-muted-foreground/50 hover:text-foreground'
              }`}
              title="4 Column View"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Active Filter Chips (if any) */}
      {activeFilterCount > 0 && (
        <div className="px-4 py-2.5 bg-muted/20 border-b border-border flex items-center gap-2 flex-wrap text-[10px] font-mono">
          <span className="text-muted-foreground uppercase tracking-widest mr-1">ACTIVE:</span>
          {selectedSize && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-background border border-border">
              Size: {selectedSize}
              <button onClick={() => setSelectedSize(null)} className="hover:text-red-500">×</button>
            </span>
          )}
          {selectedColor && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-background border border-border">
              Color: {selectedColor}
              <button onClick={() => setSelectedColor(null)} className="hover:text-red-500">×</button>
            </span>
          )}
          {inStockOnly && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-background border border-border">
              In Stock Only
              <button onClick={() => setInStockOnly(false)} className="hover:text-red-500">×</button>
            </span>
          )}
          {(priceRange[0] > 0 || priceRange[1] < 600) && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-background border border-border">
              €{priceRange[0]} – €{priceRange[1]}
              <button onClick={() => setPriceRange([0, 600])} className="hover:text-red-500">×</button>
            </span>
          )}
          <button
            onClick={clearAllFilters}
            className="text-muted-foreground hover:text-foreground underline ml-2 uppercase tracking-widest"
          >
            Clear all
          </button>
        </div>
      )}

      {/* Product Grid Render */}
      {isLoadingProducts ? (
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-px bg-border">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="bg-background flex flex-col">
              <Skeleton className="w-full aspect-[3/4] rounded-none" />
              <div className="p-4 flex flex-col gap-2">
                <Skeleton className="w-2/3 h-4 rounded-none" />
                <Skeleton className="w-1/3 h-4 rounded-none" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <ProductGrid products={filteredProducts} />
      )}

      {/* View All Products Link (Direct Reference to inspiration image) */}
      <div className="w-full py-8 sm:py-10 border-b border-border bg-background flex items-center justify-center">
        <button
          onClick={() => {
            clearAllFilters();
            const el = document.getElementById('collection-grid');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
          className="group text-[11px] font-mono uppercase tracking-[0.25em] text-foreground hover:opacity-75 transition-all inline-flex items-center gap-2"
        >
          <span>View all products</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      {/* Slide-out Filter Drawer */}
      <ProductFilterDrawer
        selectedSort={selectedSort}
        setSelectedSort={setSelectedSort}
        selectedSize={selectedSize}
        setSelectedSize={setSelectedSize}
        selectedColor={selectedColor}
        setSelectedColor={setSelectedColor}
        inStockOnly={inStockOnly}
        setInStockOnly={setInStockOnly}
        priceRange={priceRange}
        setPriceRange={setPriceRange}
        maxPriceLimit={maxProductPrice}
        onReset={clearAllFilters}
        totalResults={filteredProducts.length}
      />
    </section>
  );
};
