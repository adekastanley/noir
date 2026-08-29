import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Product, WishlistItem } from '../types';

interface WishlistContextType {
  items: WishlistItem[];
  isOpen: boolean;
  openWishlist: () => void;
  closeWishlist: () => void;
  toggleWishlistDrawer: () => void;
  toggleWishlist: (product: Product) => void;
  isInWishlist: (productId: string) => boolean;
  removeFromWishlist: (productId: string) => void;
  clearWishlist: () => void;
  totalWishlistItems: number;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

const WISHLIST_STORAGE_KEY = 'noir_atelier_wishlist';

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<WishlistItem[]>(() => {
    try {
      const saved = localStorage.getItem(WISHLIST_STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // ignore
    }
    return [];
  });

  const [isOpen, setIsOpen] = useState<boolean>(false);

  useEffect(() => {
    try {
      localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(items));
    } catch {
      // ignore
    }
  }, [items]);

  const openWishlist = () => setIsOpen(true);
  const closeWishlist = () => setIsOpen(false);
  const toggleWishlistDrawer = () => setIsOpen((prev) => !prev);

  const isInWishlist = (productId: string): boolean => {
    return items.some((item) => item.productId === productId);
  };

  const toggleWishlist = (product: Product) => {
    setItems((prev) => {
      const exists = prev.some((item) => item.productId === product.id);
      if (exists) {
        return prev.filter((item) => item.productId !== product.id);
      }
      return [
        {
          productId: product.id,
          product,
          addedAt: new Date().toISOString(),
        },
        ...prev,
      ];
    });
  };

  const removeFromWishlist = (productId: string) => {
    setItems((prev) => prev.filter((item) => item.productId !== productId));
  };

  const clearWishlist = () => {
    setItems([]);
  };

  return (
    <WishlistContext.Provider
      value={{
        items,
        isOpen,
        openWishlist,
        closeWishlist,
        toggleWishlistDrawer,
        toggleWishlist,
        isInWishlist,
        removeFromWishlist,
        clearWishlist,
        totalWishlistItems: items.length,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = (): WishlistContextType => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};
