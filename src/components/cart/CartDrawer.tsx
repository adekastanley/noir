import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { useCurrency } from '../../context/CurrencyContext';
import { useUI } from '../../context/UIContext';
import { ImageWithFallback } from '../ui/ImagePlaceholder';
import { X, Trash2, Plus, Minus, Tag, ArrowRight, ShieldCheck, Truck } from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const {
    items,
    isOpen,
    closeCart,
    removeFromCart,
    updateQuantity,
    updateItemSize,
    totalItems,
    subtotal,
    discountAmount,
    total,
    promoCode,
    isApplyingPromo,
    applyPromo,
    removePromo,
    freeShippingProgress,
    amountNeededForFreeShipping,
    isFreeShippingEligible,
  } = useCart();

  const { formatPrice } = useCurrency();
  const { openCheckout, showToast } = useUI();

  const [promoInput, setPromoInput] = useState('');

  if (!isOpen) return null;

  const handleApplyPromo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoInput.trim()) return;
    const res = await applyPromo(promoInput);
    if (res.valid) {
      showToast(res.message, 'success');
      setPromoInput('');
    } else {
      showToast(res.message, 'warning');
    }
  };

  const handleProceedToCheckout = () => {
    closeCart();
    openCheckout();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="cart-title"
      className="fixed inset-0 z-50 overflow-hidden"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={closeCart}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md sm:max-w-lg bg-background border-l border-border shadow-2xl flex flex-col">
          {/* Cart Header */}
          <div className="p-4 sm:p-6 border-b border-border flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 id="cart-title" className="editorial-title text-sm sm:text-base font-semibold text-foreground">
                Shopping Bag
              </h2>
              <span className="text-xs font-mono text-muted-foreground">
                [{totalItems} {totalItems === 1 ? 'item' : 'items'}]
              </span>
            </div>
            <button
              onClick={closeCart}
              className="p-2 text-foreground hover:opacity-70 transition-opacity"
              aria-label="Close shopping bag"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Indicator */}
          <div className="px-4 sm:px-6 py-3.5 bg-surface-subtle border-b border-border text-xs font-mono">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] flex items-center gap-1.5 font-medium text-foreground">
                <Truck className="w-3.5 h-3.5" />
                {isFreeShippingEligible
                  ? 'Complimentary Worldwide DHL Express Unlocked'
                  : `Add ${formatPrice(amountNeededForFreeShipping)} for Complimentary Express`}
              </span>
              <span className="text-[10px] text-muted-foreground">{Math.round(freeShippingProgress)}%</span>
            </div>
            <div className="w-full h-1 bg-border overflow-hidden">
              <div
                className="h-full bg-foreground transition-all duration-500"
                style={{ width: `${freeShippingProgress}%` }}
              />
            </div>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 divide-y divide-border/60">
            {items.length === 0 ? (
              <div className="py-20 text-center space-y-3">
                <span className="micro-label text-muted-foreground block">BAG IS EMPTY</span>
                <p className="text-xs text-muted-foreground max-w-xs mx-auto font-light">
                  You have not selected any atelier silhouettes yet. Explore our current edition to begin.
                </p>
                <button
                  onClick={closeCart}
                  className="mt-4 py-2.5 px-6 bg-foreground text-background text-xs font-mono uppercase tracking-widest font-medium"
                >
                  Explore Silhouettes
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div key={item.id} className="pt-4 first:pt-0 flex gap-3 sm:gap-4 items-start">
                  {/* Thumbnail */}
                  <div className="w-20 h-24 bg-surface-subtle border border-border overflow-hidden shrink-0">
                    <ImageWithFallback
                      src={item.product.images.primary}
                      alt={item.product.name}
                      fallbackColor={item.product.placeholderColor}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Item Specs & Modifiers */}
                  <div className="flex-1 min-w-0 space-y-1.5">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-xs sm:text-sm font-medium tracking-tight text-foreground truncate">
                        {item.product.name}
                      </h3>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-muted-foreground hover:text-red-500 transition-colors p-1"
                        aria-label={`Remove ${item.product.name} from bag`}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="flex items-center gap-3 text-[11px] font-mono text-muted-foreground">
                      <span>Color: {item.selectedColor}</span>
                      <span>·</span>
                      {/* Size switcher dropdown */}
                      <select
                        value={item.selectedSize}
                        onChange={(e) => updateItemSize(item.id, e.target.value)}
                        className="bg-transparent text-foreground border border-border px-1 py-0.5 text-[10px] font-mono uppercase outline-none"
                        aria-label="Change item size"
                      >
                        {item.product.sizes.map((sz) => (
                          <option key={sz} value={sz} className="bg-popover text-popover-foreground">
                            Size {sz}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      {/* Quantity buttons */}
                      <div className="flex items-center border border-border">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-1 hover:bg-muted text-foreground transition-colors"
                          aria-label="Decrease item quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2.5 text-xs font-mono font-medium">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-1 hover:bg-muted text-foreground transition-colors"
                          aria-label="Increase item quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Total Item Price */}
                      <span className="text-xs sm:text-sm font-mono font-medium text-foreground">
                        {formatPrice(item.unitPrice * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Cart Footer Summary & Checkout */}
          {items.length > 0 && (
            <div className="p-4 sm:p-6 border-t border-border bg-card space-y-4">
              {/* Promo Code Input */}
              <form onSubmit={handleApplyPromo} className="flex gap-2">
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={promoInput}
                    onChange={(e) => setPromoInput(e.target.value)}
                    placeholder="Privilege Voucher (Try 'NOIR10')"
                    className="w-full bg-background border border-border text-foreground px-3 py-2 text-xs font-mono uppercase tracking-widest placeholder:text-muted-foreground placeholder:normal-case outline-none focus:border-foreground"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isApplyingPromo || !promoInput.trim()}
                  className="px-4 py-2 bg-foreground text-background text-xs font-mono uppercase tracking-widest font-semibold hover:bg-neutral-800 transition-colors disabled:opacity-50"
                >
                  Apply
                </button>
              </form>

              {/* Active Promo Tag */}
              {promoCode && (
                <div className="flex items-center justify-between px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-400 text-xs font-mono">
                  <span className="flex items-center gap-1.5">
                    <Tag className="w-3 h-3" />
                    VOUCHER [{promoCode}] APPLIED ({discountAmount > 0 ? `-${formatPrice(discountAmount)}` : ''})
                  </span>
                  <button
                    onClick={removePromo}
                    className="hover:underline text-[10px] uppercase font-bold"
                  >
                    Remove
                  </button>
                </div>
              )}

              {/* Price Breakdown */}
              <div className="space-y-1.5 text-xs font-mono border-t border-border/60 pt-3">
                <div className="flex justify-between text-muted-foreground">
                  <span>SUBTOTAL</span>
                  <span className="text-foreground">{formatPrice(subtotal)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
                    <span>PRIVILEGE DISCOUNT</span>
                    <span>-{formatPrice(discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-muted-foreground">
                  <span>ESTIMATED SHIPPING</span>
                  <span className="text-foreground">
                    {isFreeShippingEligible ? 'COMPLIMENTARY' : formatPrice(25)}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-semibold text-foreground pt-2 border-t border-border">
                  <span>TOTAL ESTIMATED</span>
                  <span>{formatPrice(total + (isFreeShippingEligible ? 0 : 25))}</span>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                onClick={handleProceedToCheckout}
                className="w-full py-4 bg-foreground text-background hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors text-xs font-mono uppercase tracking-[0.25em] font-semibold flex items-center justify-center gap-2"
              >
                <span>Proceed to Secure Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-center gap-4 text-[10px] font-mono text-muted-foreground uppercase tracking-widest pt-1">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-500" />
                  256-Bit SSL Encrypted
                </span>
                <span>·</span>
                <span>30-Day Atelier Returns</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
