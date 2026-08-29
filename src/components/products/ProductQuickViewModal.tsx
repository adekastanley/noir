import React, { useState } from 'react';
import { useUI } from '../../context/UIContext';
import { useCurrency } from '../../context/CurrencyContext';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { ImageWithFallback } from '../ui/ImagePlaceholder';
import { X, Heart, Plus, Minus, Check, Ruler } from 'lucide-react';
import type { Product } from '../../types';

interface QuickViewContentProps {
  product: Product;
  onClose: () => void;
}

const QuickViewContent: React.FC<QuickViewContentProps> = ({ product, onClose }) => {
  const { formatPrice } = useCurrency();
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { openSizeGuide, showToast } = useUI();

  const [selectedImage, setSelectedImage] = useState<string>(product.images.primary);
  const [selectedSize, setSelectedSize] = useState<string>(product.sizes[0] || 'One Size');
  const [selectedColor, setSelectedColor] = useState<string>(product.colorName);
  const [quantity, setQuantity] = useState<number>(1);
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'details' | 'specs' | 'care'>('details');

  const isSaved = isInWishlist(product.id);

  const imagesList = [
    product.images.primary,
    product.images.secondary,
    product.images.detail,
    product.images.flatLay,
  ].filter(Boolean) as string[];

  const handleAddToCart = () => {
    setIsAdding(true);
    addToCart(product, selectedSize, selectedColor, quantity);
    showToast(
      `Added ${quantity}x "${product.name}" (${selectedSize} / ${selectedColor}) to your bag.`,
      'success'
    );

    setTimeout(() => {
      setIsAdding(false);
      onClose();
    }, 600);
  };

  return (
    <div className="relative w-full max-w-5xl bg-background border border-border shadow-2xl z-10 max-h-[90vh] overflow-y-auto flex flex-col md:flex-row">
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-30 p-2 bg-background/80 hover:bg-background border border-border text-foreground transition-colors"
        aria-label="Close product quick view"
      >
        <X className="w-5 h-5" />
      </button>

      {/* Left Half: Gallery */}
      <div className="w-full md:w-1/2 p-4 sm:p-6 border-b md:border-b-0 md:border-r border-border flex flex-col gap-3 bg-surface-subtle">
        {/* Main Large Image */}
        <div className="relative aspect-[3/4] w-full overflow-hidden bg-surface-subtle border border-border">
          <ImageWithFallback
            src={selectedImage || product.images.primary}
            alt={product.name}
            fallbackColor={product.placeholderColor}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Thumbnails */}
        {imagesList.length > 1 && (
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
            {imagesList.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedImage(img)}
                className={`w-16 h-20 border overflow-hidden shrink-0 transition-all ${
                  selectedImage === img
                    ? 'border-foreground ring-1 ring-foreground'
                    : 'border-border opacity-70 hover:opacity-100'
                }`}
              >
                <img src={img} alt={`Angle ${idx + 1}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Right Half: Garment Details & Actions */}
      <div className="w-full md:w-1/2 p-6 sm:p-8 flex flex-col justify-between space-y-6">
        <div className="space-y-4">
          {/* Header / Category & Badges */}
          <div className="flex items-center justify-between">
            <span className="micro-label text-muted-foreground">
              {product.category.toUpperCase()} / {product.origin}
            </span>
            {product.isLimited && (
              <span className="text-[9px] font-mono uppercase tracking-widest text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 border border-amber-500/20">
                Limited Edition
              </span>
            )}
          </div>

          {/* Title & Price */}
          <div>
            <h2 id="quick-view-title" className="editorial-title text-base sm:text-lg text-foreground font-semibold">
              {product.name}
            </h2>
            <p className="text-xs text-muted-foreground font-light mt-1">
              {product.subtitle}
            </p>
            <div className="mt-3 flex items-baseline gap-3">
              <span className="text-base sm:text-lg font-mono font-medium text-foreground">
                {formatPrice(product.price)}
              </span>
              {product.compareAtPrice && (
                <span className="text-xs font-mono text-muted-foreground line-through">
                  {formatPrice(product.compareAtPrice)}
                </span>
              )}
            </div>
          </div>

          {/* Colorway Selection */}
          <div className="space-y-2 pt-2 border-t border-border">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-muted-foreground uppercase tracking-widest text-[10px]">COLOR:</span>
              <span className="text-foreground font-medium">{selectedColor}</span>
            </div>
            <div className="flex items-center gap-2">
              {product.colorways.map((cw) => (
                <button
                  key={cw.name}
                  onClick={() => setSelectedColor(cw.name)}
                  className={`flex items-center gap-2 px-3 py-1.5 border text-xs font-mono transition-all ${
                    selectedColor === cw.name
                      ? 'border-foreground bg-muted font-bold'
                      : 'border-border text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <span
                    className="w-3 h-3 rounded-full border border-border"
                    style={{ backgroundColor: cw.hex }}
                  />
                  <span>{cw.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Size Selection & Size Guide */}
          <div className="space-y-2 pt-2 border-t border-border">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-muted-foreground uppercase tracking-widest text-[10px]">SELECT SIZE:</span>
              <button
                type="button"
                onClick={openSizeGuide}
                className="text-[10px] uppercase tracking-widest text-muted-foreground hover:text-foreground inline-flex items-center gap-1 underline"
              >
                <Ruler className="w-3 h-3" />
                <span>Size & Dimensions Guide</span>
              </button>
            </div>
            <div className="grid grid-cols-5 gap-2">
              {product.sizes.map((sz) => (
                <button
                  key={sz}
                  onClick={() => setSelectedSize(sz)}
                  className={`py-2 text-center text-xs font-mono tracking-widest border transition-all ${
                    selectedSize === sz
                      ? 'bg-foreground text-background border-foreground font-bold'
                      : 'border-border text-foreground hover:bg-muted/50'
                  }`}
                >
                  {sz}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity Selector */}
          <div className="flex items-center gap-4 pt-2 border-t border-border">
            <span className="text-muted-foreground uppercase tracking-widest text-[10px] font-mono">QUANTITY:</span>
            <div className="flex items-center border border-border">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="p-2 hover:bg-muted transition-colors"
                aria-label="Decrease quantity"
              >
                <Minus className="w-3 h-3" />
              </button>
              <span className="px-4 py-1 text-xs font-mono font-medium">{quantity}</span>
              <button
                onClick={() => setQuantity((q) => q + 1)}
                className="p-2 hover:bg-muted transition-colors"
                aria-label="Increase quantity"
              >
                <Plus className="w-3 h-3" />
              </button>
            </div>

            {/* Stock Indicator */}
            <span className="text-[10px] font-mono text-muted-foreground">
              {product.stockCount < 10
                ? `Only ${product.stockCount} remaining in atelier inventory`
                : 'In Stock for Immediate Dispatch'}
            </span>
          </div>

          {/* Spec Tabs */}
          <div className="pt-3 border-t border-border space-y-3">
            <div className="flex items-center gap-4 border-b border-border text-[10px] font-mono uppercase tracking-widest">
              <button
                onClick={() => setActiveTab('details')}
                className={`pb-2 border-b-2 transition-colors ${
                  activeTab === 'details' ? 'border-foreground text-foreground font-bold' : 'border-transparent text-muted-foreground'
                }`}
              >
                Description
              </button>
              <button
                onClick={() => setActiveTab('specs')}
                className={`pb-2 border-b-2 transition-colors ${
                  activeTab === 'specs' ? 'border-foreground text-foreground font-bold' : 'border-transparent text-muted-foreground'
                }`}
              >
                Materiality
              </button>
              <button
                onClick={() => setActiveTab('care')}
                className={`pb-2 border-b-2 transition-colors ${
                  activeTab === 'care' ? 'border-foreground text-foreground font-bold' : 'border-transparent text-muted-foreground'
                }`}
              >
                Atelier Care
              </button>
            </div>

            <div className="text-xs text-muted-foreground leading-relaxed font-light min-h-[65px]">
              {activeTab === 'details' && <p>{product.description}</p>}
              {activeTab === 'specs' && (
                <div className="space-y-1">
                  <p><strong className="font-mono text-foreground text-[10px]">Composition:</strong> {product.composition}</p>
                  <p><strong className="font-mono text-foreground text-[10px]">Origin:</strong> {product.origin}</p>
                  {product.measurements && (
                    <p><strong className="font-mono text-foreground text-[10px]">Fit:</strong> {product.measurements.fit} silhouette. {product.measurements.modelStats}</p>
                  )}
                </div>
              )}
              {activeTab === 'care' && (
                <ul className="list-disc pl-4 space-y-1">
                  {product.careInstructions.map((instruction, idx) => (
                    <li key={idx}>{instruction}</li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-4 border-t border-border flex items-center gap-3">
          <button
            onClick={handleAddToCart}
            disabled={isAdding || !product.inStock}
            className="flex-1 py-3.5 px-6 bg-foreground text-background hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors text-xs font-mono uppercase tracking-[0.25em] font-semibold flex items-center justify-center gap-2"
          >
            {isAdding ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span>Added to Bag</span>
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" />
                <span>Add to Bag — {formatPrice(product.price * quantity)}</span>
              </>
            )}
          </button>

          <button
            onClick={() => toggleWishlist(product)}
            className={`p-3.5 border transition-colors ${
              isSaved
                ? 'bg-foreground text-background border-foreground'
                : 'border-border text-foreground hover:bg-muted'
            }`}
            aria-label="Save to Wishlist"
          >
            <Heart className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
          </button>
        </div>
      </div>
    </div>
  );
};

export const ProductQuickViewModal: React.FC = () => {
  const { quickViewProduct, closeQuickView } = useUI();

  if (!quickViewProduct) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="quick-view-title"
      className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 sm:p-6 md:p-10 animate-in fade-in duration-200"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-xs transition-opacity"
        onClick={closeQuickView}
      />

      <QuickViewContent key={quickViewProduct.id} product={quickViewProduct} onClose={closeQuickView} />
    </div>
  );
};
