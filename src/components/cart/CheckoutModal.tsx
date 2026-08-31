import React, { useState } from 'react';
import { useUI } from '../../context/UIContext';
import { useCart } from '../../context/CartContext';
import { useCurrency } from '../../context/CurrencyContext';
import { cartApi } from '../../services/api/cartApi';
import { X, CheckCircle2, Lock, ArrowRight, Truck } from 'lucide-react';

export const CheckoutModal: React.FC = () => {
  const { isCheckoutOpen, closeCheckout, showToast } = useUI();
  const { items, total, isFreeShippingEligible, clearCart } = useCart();
  const { formatPrice } = useCurrency();

  const [step, setStep] = useState<'shipping' | 'success'>('shipping');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSummary, setOrderSummary] = useState<{ orderId: string; estimatedDelivery: string } | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    address: '',
    city: '',
    postalCode: '',
    country: '',
  });

  if (!isCheckoutOpen) return null;

  const shippingCost = isFreeShippingEligible ? 0 : 25;
  const finalTotal = total + shippingCost;

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // 1. Discover gateways
      const gateways = await cartApi.getGateways();
      const paystackGateway = gateways.data?.find((g: any) => g.id === 'paystack');
      const paystackKey = paystackGateway?.public_key;

      if (!paystackKey) {
        throw new Error('Payment gateway not configured');
      }

      // 2. Initialize payment
      const payment = await cartApi.initializePayment({
        gateway: 'paystack',
        billing: { 
          first_name: formData.fullName.split(' ')[0] || formData.fullName, 
          last_name: formData.fullName.split(' ').slice(1).join(' ') || '',
          email: formData.email,
          address_1: formData.address,
          city: formData.city,
          postcode: formData.postalCode,
          country: formData.country
        },
        line_items: items.map(item => ({ product_id: parseInt(item.id) || 0, quantity: item.quantity })),
        return_url: window.location.href
      });

      if (!payment.success || !payment.data) {
        throw new Error('Failed to initialize payment');
      }

      // 3. Open Paystack Inline Popup
      const paystack = (window as any).PaystackPop.setup({
        key: paystackKey,
        email: formData.email,
        amount: Math.round(payment.data.total * 100),
        ref: payment.data.reference,
        currency: 'NGN',
        callback: function(response: any) {
          (async () => {
            try {
              // 4. Verify payment
              const verification = await cartApi.verifyPayment(payment.data.order_id, payment.data.reference);
              
              if (verification.success && verification.data?.verified) {
                setOrderSummary({
                  orderId: payment.data.order_id,
                  estimatedDelivery: verification.data?.estimated_delivery || '3-4 Business Days',
                });
                setStep('success');
                clearCart();
                showToast('Order confirmed. Archival dispatch underway.', 'success');
              } else {
                showToast('Payment verification failed. Please contact support.', 'warning');
              }
            } catch (err) {
              showToast('Error verifying payment. Please contact support.', 'warning');
            } finally {
              setIsSubmitting(false);
            }
          })();
        },
        onClose: () => {
          showToast('Payment cancelled.', 'warning');
          setIsSubmitting(false);
        }
      });

      paystack.openIframe();
    } catch (err: any) {
      console.error('Checkout error:', err);
      showToast('Error initializing payment. Please try again.', 'warning');
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
            {step === 'success' && 'Order Authenticated'}
          </h2>
        </div>

        {/* Step: Shipping & Payment Trigger */}
        {step === 'shipping' && (
          <form
            onSubmit={handleSubmitOrder}
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

            {/* Summary */}
            <div className="p-3 bg-muted/20 border border-border text-xs font-mono space-y-1">
              <div className="flex justify-between text-muted-foreground">
                <span>Total Items:</span>
                <span className="text-foreground">{items.length} silhouettes</span>
              </div>
              <div className="flex justify-between font-bold text-foreground pt-1 border-t border-border/50">
                <span>Total Charge:</span>
                <span>{formatPrice(finalTotal)}</span>
              </div>
            </div>

            <div className="pt-4 border-t border-border flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
                <Lock className="w-4 h-4" />
                <span>Secure Checkout</span>
              </div>
              <button
                type="submit"
                disabled={isSubmitting || items.length === 0}
                className="py-3 px-6 bg-foreground text-background text-xs font-mono uppercase tracking-widest font-semibold hover:bg-neutral-800 transition-colors flex items-center gap-2 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>Authenticating...</span>
                ) : (
                  <>
                    <span>Pay {formatPrice(finalTotal)}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
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
