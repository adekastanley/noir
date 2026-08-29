import React from 'react';
import { useWishlist } from '../../context/WishlistContext';
import { useCart } from '../../context/CartContext';
import { useCurrency } from '../../context/CurrencyContext';
import { useUI } from '../../context/UIContext';
import { ImageWithFallback } from '../ui/ImagePlaceholder';
import { X, Trash2, Plus, Heart } from 'lucide-react';

import type { Product } from '../../types';

export const WishlistDrawer: React.FC = () => {
  const { items, isOpen, closeWishlist, removeFromWishlist, clearWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { formatPrice } = useCurrency();
  const { openQuickView, showToast } = useUI();

  if (!isOpen) return null;

  const handleMoveToBag = (product: Product) => {
    addToCart(product, product.sizes[0], product.colorName, 1);
    removeFromWishlist(product.id);
    showToast(`Moved "${product.name}" to your bag.`, 'success');
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="wishlist-title"
      className="fixed inset-0 z-50 overflow-hidden"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={closeWishlist}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-background border-l border-border shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-4 sm:p-6 border-b border-border flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 id="wishlist-title" className="editorial-title text-sm sm:text-base font-semibold text-foreground">
                Saved Silhouettes
              </h2>
              <span className="text-xs font-mono text-muted-foreground">
                [{items.length}]
              </span>
            </div>
            <button
              onClick={closeWishlist}
              className="p-2 text-foreground hover:opacity-70 transition-opacity"
              aria-label="Close saved items"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 divide-y divide-border/60">
            {items.length === 0 ? (
              <div className="py-20 text-center space-y-3">
                <Heart className="w-8 h-8 text-muted-foreground/40 mx-auto" />
                <span className="micro-label text-muted-foreground block">NO SAVED PIECES</span>
                <p className="text-xs text-muted-foreground max-w-xs mx-auto font-light">
                  Save pieces to review later or monitor inventory updates.
                </p>
              </div>
            ) : (
              items.map(({ product }) => (
                <div key={product.id} className="pt-4 first:pt-0 flex gap-3 sm:gap-4 items-start">
                  <div
                    onClick={() => {
                      closeWishlist();
                      openQuickView(product);
                    }}
                    className="w-20 h-24 bg-surface-subtle border border-border overflow-hidden shrink-0 cursor-pointer"
                  >
                    <ImageWithFallback
                      src={product.images.primary}
                      alt={product.name}
                      fallbackColor={product.placeholderColor}
                      className="w-full h-full object-cover hover:scale-105 transition-transform"
                    />
                  </div>

                  <div className="flex-1 min-w-0 space-y-1.5">
                    <div className="flex items-start justify-between gap-2">
                      <h3
                        onClick={() => {
                          closeWishlist();
                          openQuickView(product);
                        }}
                        className="text-xs sm:text-sm font-medium tracking-tight text-foreground truncate cursor-pointer hover:opacity-75"
                      >
                        {product.name}
                      </h3>
                      <button
                        onClick={() => removeFromWishlist(product.id)}
                        className="text-muted-foreground hover:text-red-500 transition-colors p-1"
                        aria-label={`Remove ${product.name} from saved items`}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <p className="text-[11px] font-mono font-medium text-foreground">
                      {formatPrice(product.price)}
                    </p>

                    <div className="pt-2 flex items-center gap-2">
                      <button
                        onClick={() => handleMoveToBag(product)}
                        className="flex-1 py-1.5 px-3 bg-foreground text-background text-[10px] font-mono uppercase tracking-widest font-semibold hover:bg-neutral-800 transition-colors flex items-center justify-center gap-1"
                      >
                        <Plus className="w-3 h-3" />
                        <span>Move to Bag</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {items.length > 0 && (
            <div className="p-4 sm:p-6 border-t border-border bg-card flex justify-between items-center">
              <button
                onClick={clearWishlist}
                className="text-xs font-mono uppercase tracking-widest text-muted-foreground hover:text-foreground underline"
              >
                Clear all
              </button>
              <button
                onClick={closeWishlist}
                className="py-2.5 px-6 bg-foreground text-background text-xs font-mono uppercase tracking-widest font-semibold"
              >
                Continue Browsing
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
