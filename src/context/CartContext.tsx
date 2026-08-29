import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import type { Product, CartItem } from '../types';
import { cartApi, type PromoValidationResult } from '../services/api/cartApi';

interface CartContextType {
  items: CartItem[];
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  addToCart: (product: Product, size: string, color: string, quantity?: number) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  updateItemSize: (itemId: string, newSize: string) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
  discountPercentage: number;
  discountAmount: number;
  total: number;
  promoCode: string | null;
  promoMessage: string | null;
  isApplyingPromo: boolean;
  applyPromo: (code: string) => Promise<PromoValidationResult>;
  removePromo: () => void;
  freeShippingThreshold: number;
  freeShippingProgress: number; // 0 to 100
  amountNeededForFreeShipping: number;
  isFreeShippingEligible: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'noir_atelier_cart';
const PROMO_STORAGE_KEY = 'noir_atelier_promo';
const FREE_SHIPPING_THRESHOLD_EUR = 250;

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // ignore
    }
    return [];
  });

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [promoCode, setPromoCode] = useState<string | null>(() => {
    try {
      return localStorage.getItem(PROMO_STORAGE_KEY);
    } catch {
      return null;
    }
  });
  const [discountPercentage, setDiscountPercentage] = useState<number>(0);
  const [promoMessage, setPromoMessage] = useState<string | null>(null);
  const [isApplyingPromo, setIsApplyingPromo] = useState<boolean>(false);

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch {
      // ignore
    }
  }, [items]);

  // Re-verify initial promo on mount if present
  useEffect(() => {
    if (promoCode) {
      cartApi.validatePromoCode(promoCode).then((res) => {
        if (res.valid) {
          setDiscountPercentage(res.discountPercentage);
          setPromoMessage(res.message);
        } else {
          setPromoCode(null);
          setDiscountPercentage(0);
          try {
            localStorage.removeItem(PROMO_STORAGE_KEY);
          } catch {
            // ignore
          }
        }
      });
    }
  }, [promoCode]);

  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);
  const toggleCart = () => setIsOpen((prev) => !prev);

  const addToCart = (product: Product, size: string, color: string, quantity: number = 1) => {
    setItems((prevItems) => {
      const safeSize = size || product.sizes[0] || 'One Size';
      const safeColor = color || product.colorName;
      const itemId = `${product.id}-${safeSize}-${safeColor}`;
      const existingIndex = prevItems.findIndex((item) => item.id === itemId);

      if (existingIndex > -1) {
        const updated = [...prevItems];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + quantity,
        };
        return updated;
      }

      const newItem: CartItem = {
        id: itemId,
        product,
        selectedSize: safeSize,
        selectedColor: safeColor,
        quantity,
        unitPrice: product.price,
      };

      return [newItem, ...prevItems];
    });

    setIsOpen(true);
  };

  const removeFromCart = (itemId: string) => {
    setItems((prev) => prev.filter((item) => item.id !== itemId));
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    setItems((prev) =>
      prev.map((item) => (item.id === itemId ? { ...item, quantity } : item))
    );
  };

  const updateItemSize = (itemId: string, newSize: string) => {
    setItems((prev) => {
      const target = prev.find((i) => i.id === itemId);
      if (!target) return prev;

      const newId = `${target.product.id}-${newSize}-${target.selectedColor}`;
      // check if an item with newId already exists
      const existingTarget = prev.find((i) => i.id === newId);

      if (existingTarget && existingTarget.id !== itemId) {
        return prev
          .filter((i) => i.id !== itemId)
          .map((i) => (i.id === newId ? { ...i, quantity: i.quantity + target.quantity } : i));
      }

      return prev.map((i) =>
        i.id === itemId ? { ...i, id: newId, selectedSize: newSize } : i
      );
    });
  };

  const clearCart = () => {
    setItems([]);
  };

  const applyPromo = async (code: string): Promise<PromoValidationResult> => {
    setIsApplyingPromo(true);
    try {
      const result = await cartApi.validatePromoCode(code);
      if (result.valid) {
        setPromoCode(result.code);
        setDiscountPercentage(result.discountPercentage);
        setPromoMessage(result.message);
        try {
          localStorage.setItem(PROMO_STORAGE_KEY, result.code);
        } catch {
          // ignore
        }
      } else {
        setPromoMessage(result.message);
      }
      return result;
    } finally {
      setIsApplyingPromo(false);
    }
  };

  const removePromo = () => {
    setPromoCode(null);
    setDiscountPercentage(0);
    setPromoMessage(null);
    try {
      localStorage.removeItem(PROMO_STORAGE_KEY);
    } catch {
      // ignore
    }
  };

  const totalItems = useMemo(
    () => items.reduce((acc, item) => acc + item.quantity, 0),
    [items]
  );

  const subtotal = useMemo(
    () => items.reduce((acc, item) => acc + item.unitPrice * item.quantity, 0),
    [items]
  );

  const discountAmount = useMemo(
    () => (subtotal * discountPercentage) / 100,
    [subtotal, discountPercentage]
  );

  const total = useMemo(
    () => Math.max(0, subtotal - discountAmount),
    [subtotal, discountAmount]
  );

  const freeShippingThreshold = FREE_SHIPPING_THRESHOLD_EUR;
  const isFreeShippingEligible = subtotal >= freeShippingThreshold;
  const amountNeededForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);
  const freeShippingProgress = Math.min(100, (subtotal / freeShippingThreshold) * 100);

  return (
    <CartContext.Provider
      value={{
        items,
        isOpen,
        openCart,
        closeCart,
        toggleCart,
        addToCart,
        removeFromCart,
        updateQuantity,
        updateItemSize,
        clearCart,
        totalItems,
        subtotal,
        discountPercentage,
        discountAmount,
        total,
        promoCode,
        promoMessage,
        isApplyingPromo,
        applyPromo,
        removePromo,
        freeShippingThreshold,
        freeShippingProgress,
        amountNeededForFreeShipping,
        isFreeShippingEligible,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
