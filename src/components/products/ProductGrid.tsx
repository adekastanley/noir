import React from 'react';
import type { Product } from '../../types';
import { ProductCard } from './ProductCard';
import { useUI } from '../../context/UIContext';

interface ProductGridProps {
  products: Product[];
  isLoading?: boolean;
}

export const ProductGrid: React.FC<ProductGridProps> = ({ products, isLoading = false }) => {
  const { gridDensity } = useUI();

  if (isLoading) {
    return (
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 border-l border-t border-border">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="aspect-[3/4] p-4 flex flex-col justify-between border-r border-b border-border luxury-placeholder bg-surface-subtle"
          >
            <div className="w-full h-3/4 bg-neutral-200 dark:bg-neutral-800" />
            <div className="space-y-2 mt-4">
              <div className="h-4 bg-neutral-200 dark:bg-neutral-800 w-2/3" />
              <div className="h-3 bg-neutral-200 dark:bg-neutral-800 w-1/3" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="w-full py-20 px-4 text-center border-l border-r border-b border-border bg-card">
        <span className="micro-label text-muted-foreground block mb-2">ARCHIVE INQUIRY</span>
        <h3 className="editorial-title text-base text-foreground mb-2">No silhouettes found</h3>
        <p className="text-xs text-muted-foreground max-w-md mx-auto">
          Try clearing active filters or modifying search keywords to explore our full atelier collection.
        </p>
      </div>
    );
  }

  // Density column mapping
  const gridClasses = {
    '2-col': 'grid-cols-1 sm:grid-cols-2',
    '3-col': 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3',
    '4-col': 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4',
  }[gridDensity];

  return (
    <div className={`w-full grid ${gridClasses} border-l border-t border-border bg-background`}>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};
