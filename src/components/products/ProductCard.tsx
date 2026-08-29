import React, { useState } from 'react';
import type { Product } from '../../types';
import { useCurrency } from '../../context/CurrencyContext';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useUI } from '../../context/UIContext';
import { ImageWithFallback } from '../ui/ImagePlaceholder';
import { Heart, Eye, Plus, Check } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { formatPrice } = useCurrency();
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { openQuickView, showToast } = useUI();

  const [isHovered, setIsHovered] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  const selectedColor = product.colorName;
  const selectedSize = product.sizes[0] || 'One Size';

  const isSaved = isInWishlist(product.id);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsAdding(true);
    addToCart(product, selectedSize, selectedColor, 1);
    showToast(`Added "${product.name}" (${selectedSize}) to your bag.`, 'success');

    setTimeout(() => {
      setIsAdding(false);
    }, 900);
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWishlist(product);
    showToast(
      isSaved
        ? `Removed "${product.name}" from your saved items.`
        : `Saved "${product.name}" to your wishlist.`,
      'info'
    );
  };

  // Determine current display image based on hover
  const displayImage = isHovered && product.images.secondary
    ? product.images.secondary
    : product.images.primary;

  return (
    <article
      className="group relative flex flex-col bg-card border-r border-b border-border transition-all duration-300 select-none cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => openQuickView(product)}
      aria-label={`View details for ${product.name}`}
    >
      {/* Visual Media Container */}
      <div className="relative aspect-[3/4] sm:aspect-[4/5] md:aspect-[3/4] w-full overflow-hidden bg-surface-subtle">
        <ImageWithFallback
          src={displayImage}
          alt={product.name}
          fallbackColor={product.placeholderColor}
          className="w-full h-full object-cover luxury-image-zoom filter brightness-[0.98]"
        />

        {/* Badges (Top-Left) */}
        <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5 pointer-events-none">
          {product.isNew && (
            <span className="bg-foreground text-background text-[9px] font-mono uppercase tracking-[0.2em] px-2 py-0.5 font-medium">
              NEW FORM
            </span>
          )}
          {product.isLimited && (
            <span className="bg-muted-foreground/20 backdrop-blur-sm text-foreground text-[9px] font-mono uppercase tracking-[0.2em] px-2 py-0.5 border border-border">
              LIMITED
            </span>
          )}
        </div>

        {/* Wishlist Toggle Button (Top-Right) */}
        <button
          type="button"
          onClick={handleWishlistToggle}
          aria-label={isSaved ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
          className={`absolute top-3 right-3 z-20 p-2 rounded-none border transition-all ${
            isSaved
              ? 'bg-foreground text-background border-foreground opacity-100'
              : 'bg-background/80 hover:bg-background text-foreground border-border opacity-0 group-hover:opacity-100'
          }`}
        >
          <Heart
            className={`w-3.5 h-3.5 ${isSaved ? 'fill-current' : ''}`}
          />
        </button>

        {/* Quick Actions Bar Overlay (Slide Up on Hover) */}
        <div className="absolute inset-x-0 bottom-0 z-20 p-3 bg-gradient-to-t from-black/60 via-black/20 to-transparent flex items-center justify-between gap-2 opacity-0 group-hover:opacity-100 transition-all duration-200 translate-y-1 group-hover:translate-y-0">
          {/* Quick View Button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              openQuickView(product);
            }}
            className="flex-1 py-2 px-2.5 bg-background/90 hover:bg-background text-foreground text-[10px] font-mono uppercase tracking-[0.2em] border border-border backdrop-blur-sm transition-colors flex items-center justify-center gap-1.5"
          >
            <Eye className="w-3 h-3" />
            <span>Quick View</span>
          </button>

          {/* Quick Add To Bag */}
          <button
            type="button"
            onClick={handleQuickAdd}
            disabled={isAdding || !product.inStock}
            className="py-2 px-3 bg-foreground hover:bg-neutral-800 text-background text-[10px] font-mono uppercase tracking-[0.2em] border border-foreground transition-colors flex items-center justify-center gap-1 font-medium disabled:opacity-50"
            aria-label={`Quick add ${product.name} to bag`}
          >
            {isAdding ? (
              <Check className="w-3 h-3 text-emerald-400" />
            ) : (
              <Plus className="w-3 h-3" />
            )}
            <span className="hidden sm:inline">Add</span>
          </button>
        </div>
      </div>

      {/* Bottom Metadata Grid Row (Exact match to reference layout) */}
      <div className="p-3 sm:p-4 flex flex-col justify-between flex-1 border-t border-border bg-card">
        <div className="flex flex-col gap-1">
          {/* Title on Top Row */}
          <div className="flex items-start justify-between gap-2">
            <h2 className="text-xs sm:text-[13px] font-medium tracking-tight text-foreground line-clamp-1 group-hover:opacity-75 transition-opacity">
              {product.name}
            </h2>
          </div>

          {/* Subtitle / Material spec */}
          <p className="text-[11px] text-muted-foreground font-light line-clamp-1">
            {product.subtitle}
          </p>
        </div>

        {/* Bottom Row: Price & Color Swatches */}
        <div className="mt-3 pt-2 border-t border-border/40 flex items-center justify-between">
          {/* Price */}
          <div className="flex items-center gap-2">
            <span className="text-xs sm:text-[13px] font-mono font-normal tracking-wide text-foreground">
              {formatPrice(product.price)}
            </span>
            {product.compareAtPrice && (
              <span className="text-[11px] font-mono text-muted-foreground line-through">
                {formatPrice(product.compareAtPrice)}
              </span>
            )}
          </div>

          {/* Colorway Dots */}
          {product.colorways && product.colorways.length > 0 && (
            <div className="flex items-center gap-1">
              {product.colorways.slice(0, 3).map((cw) => (
                <span
                  key={cw.name}
                  title={cw.name}
                  className="w-2.5 h-2.5 rounded-full border border-border/80 shrink-0"
                  style={{ backgroundColor: cw.hex }}
                />
              ))}
              {product.colorways.length > 3 && (
                <span className="text-[9px] font-mono text-muted-foreground ml-0.5">
                  +{product.colorways.length - 3}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </article>
  );
};
