import React, { useState } from 'react';
import { useUI } from '../../context/UIContext';
import { useCart } from '../../context/CartContext';
import { useCurrency } from '../../context/CurrencyContext';
import { cartApi } from '../../services/api/cartApi';
import { X, CheckCircle2, CreditCard, Lock, ArrowLeft, ArrowRight, Truck } from 'lucide-react';

export const CheckoutModal: React.FC = () => {
  const { isCheckoutOpen, closeCheckout, showToast } = useUI();
  const { items, subtotal, total, isFreeShippingEligible, clearCart } = useCart();
  const { currency, formatPrice } = useCurrency();

  const [step, setStep] = useState<'shipping' | 'payment' | 'success'>('shipping');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSummary, setOrderSummary] = useState<{ orderId: string; estimatedDelivery: string } | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    fullName: 'Alexander Wright',
    email: 'client@atelier-noir.com',
    address: '14 Rue de Turenne',
    city: 'Paris',
    postalCode: '75004',
    country: 'France',
    cardNumber: '•••• •••• •••• 4242',
    cardExpiry: '12/28',
    cardCvc: '•••',
  });

  if (!isCheckoutOpen) return null;

  const shippingCost = isFreeShippingEligible ? 0 : 25;
  const finalTotal = total + shippingCost;

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await cartApi.submitOrder({
        items,
        currency,
        subtotal,
        shipping: shippingCost,
        tax: finalTotal * 0.2, // 20% VAT included
        total: finalTotal,
        shippingAddress: {
          fullName: formData.fullName,
          email: formData.email,
          addressLine: formData.address,
          city: formData.city,
          postalCode: formData.postalCode,
          country: formData.country,
        },
        paymentMethod: 'card',
      });

      setOrderSummary({
        orderId: res.orderId,
        estimatedDelivery: res.estimatedDelivery,
      });

      setStep('success');
      clearCart();
      showToast('Order confirmed. Archival dispatch underway.', 'success');
    } catch {
      showToast('Payment processing error. Please try again.', 'warning');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="checkout-modal-title"
      className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-xs transition-opacity"
        onClick={() => {
          if (step !== 'success') closeCheckout();
        }}
      />

      <div className="relative w-full max-w-2xl bg-background border border-border shadow-2xl z-10 p-6 sm:p-8">
        {/* Close Button */}
        <button
          onClick={closeCheckout}
          className="absolute top-4 right-4 p-2 text-foreground hover:opacity-70 transition-opacity"
          aria-label="Close checkout"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="border-b border-border pb-4 mb-6">
          <span className="micro-label text-muted-foreground block">
            NOIR ATELIER — SECURE ORDER DISPATCH
          </span>
          <h2 id="checkout-modal-title" className="editorial-title text-base sm:text-lg font-semibold text-foreground">
            {step === 'shipping' && 'Client & Delivery Logistics'}
            {step === 'payment' && 'Encrypted Payment Settlement'}
            {step === 'success' && 'Order Authenticated'}
          </h2>
        </div>

        {/* Step: Shipping */}
        {step === 'shipping' && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setStep('payment');
            }}
            className="space-y-4"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full bg-background border border-border px-3 py-2 text-xs font-mono outline-none focus:border-foreground"
                />
              </div>
              <div>
                <label className="block text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-1">
                  Email Dispatch Receipt
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-background border border-border px-3 py-2 text-xs font-mono outline-none focus:border-foreground"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-1">
                Street Address
              </label>
              <input
                type="text"
                required
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full bg-background border border-border px-3 py-2 text-xs font-mono outline-none focus:border-foreground"
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-1">
                  City
                </label>
                <input
                  type="text"
                  required
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full bg-background border border-border px-3 py-2 text-xs font-mono outline-none focus:border-foreground"
                />
              </div>
              <div>
                <label className="block text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-1">
                  Postal Code
                </label>
                <input
                  type="text"
                  required
                  value={formData.postalCode}
                  onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                  className="w-full bg-background border border-border px-3 py-2 text-xs font-mono outline-none focus:border-foreground"
                />
              </div>
              <div>
                <label className="block text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-1">
                  Country
                </label>
                <input
                  type="text"
                  required
                  value={formData.country}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                  className="w-full bg-background border border-border px-3 py-2 text-xs font-mono outline-none focus:border-foreground"
                />
              </div>
            </div>

            {/* Courier Selection */}
            <div className="p-3.5 bg-surface-subtle border border-border flex items-center justify-between text-xs font-mono">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4" />
                <div>
                  <p className="font-semibold text-foreground">DHL Express Carbon-Neutral</p>
                  <p className="text-[10px] text-muted-foreground">Signature required on arrival (2-4 Days)</p>
                </div>
              </div>
              <span className="font-bold text-foreground">
                {isFreeShippingEligible ? 'COMPLIMENTARY' : formatPrice(25)}
              </span>
            </div>

            <div className="pt-4 border-t border-border flex items-center justify-between">
              <span className="text-xs font-mono text-muted-foreground">
                Order Total: <strong className="text-foreground">{formatPrice(finalTotal)}</strong>
              </span>
              <button
                type="submit"
                className="py-3 px-6 bg-foreground text-background text-xs font-mono uppercase tracking-widest font-semibold hover:bg-neutral-800 transition-colors flex items-center gap-2"
              >
                <span>Continue to Payment</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>
        )}

        {/* Step: Payment */}
        {step === 'payment' && (
          <form onSubmit={handleSubmitOrder} className="space-y-4">
            <div className="p-4 bg-surface-subtle border border-border space-y-3">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="flex items-center gap-1.5 font-semibold text-foreground">
                  <CreditCard className="w-4 h-4" /> Credit / Debit Card
                </span>
                <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                  <Lock className="w-3 h-3 text-emerald-500" /> End-to-end 256-Bit
                </span>
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-1">
                  Card Number
                </label>
                <input
                  type="text"
                  required
                  value={formData.cardNumber}
                  onChange={(e) => setFormData({ ...formData, cardNumber: e.target.value })}
                  className="w-full bg-background border border-border px-3 py-2 text-xs font-mono outline-none focus:border-foreground"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-1">
                    Expiration
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.cardExpiry}
                    onChange={(e) => setFormData({ ...formData, cardExpiry: e.target.value })}
                    className="w-full bg-background border border-border px-3 py-2 text-xs font-mono outline-none focus:border-foreground"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-1">
                    Security CVC
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.cardCvc}
                    onChange={(e) => setFormData({ ...formData, cardCvc: e.target.value })}
                    className="w-full bg-background border border-border px-3 py-2 text-xs font-mono outline-none focus:border-foreground"
                  />
                </div>
              </div>
            </div>

            {/* Summary */}
            <div className="p-3 bg-muted/20 border border-border text-xs font-mono space-y-1">
              <div className="flex justify-between text-muted-foreground">
                <span>Total Items:</span>
                <span className="text-foreground">{items.length} silhouettes</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Shipping to:</span>
                <span className="text-foreground">{formData.city}, {formData.country}</span>
              </div>
              <div className="flex justify-between font-bold text-foreground pt-1 border-t border-border/50">
                <span>Total Charge:</span>
                <span>{formatPrice(finalTotal)}</span>
              </div>
            </div>

            <div className="pt-4 border-t border-border flex items-center justify-between">
              <button
                type="button"
                onClick={() => setStep('shipping')}
                className="py-3 px-4 border border-border text-xs font-mono uppercase tracking-widest text-foreground hover:bg-muted transition-colors flex items-center gap-1.5"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="py-3 px-6 bg-foreground text-background text-xs font-mono uppercase tracking-widest font-semibold hover:bg-neutral-800 transition-colors flex items-center gap-2 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>Authenticating...</span>
                ) : (
                  <span>Authorize {formatPrice(finalTotal)}</span>
                )}
              </button>
            </div>
          </form>
        )}

        {/* Step: Success */}
        {step === 'success' && orderSummary && (
          <div className="py-6 text-center space-y-4">
            <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
            <span className="micro-label text-muted-foreground block">
              ORDER CONFIRMATION
            </span>
            <h3 className="editorial-title text-lg font-semibold text-foreground">
              Thank You For Your Patronage
            </h3>
            <p className="text-xs text-muted-foreground font-light max-w-md mx-auto leading-relaxed">
              Your garments have entered precision preparation at the atelier. A confirmation dispatch docket has been sent to <strong>{formData.email}</strong>.
            </p>

            <div className="p-4 bg-surface-subtle border border-border text-xs font-mono text-left max-w-md mx-auto space-y-1.5">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Order Reference:</span>
                <span className="font-bold text-foreground">{orderSummary.orderId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Logistics:</span>
                <span className="text-foreground">{orderSummary.estimatedDelivery}</span>
              </div>
            </div>

            <button
              onClick={closeCheckout}
              className="mt-6 py-3 px-8 bg-foreground text-background text-xs font-mono uppercase tracking-widest font-semibold hover:bg-neutral-800 transition-colors"
            >
              Return to Atelier Flagship
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
