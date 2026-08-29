import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Product, ProductCategory } from '../types';

export type GridDensity = '2-col' | '3-col' | '4-col';

interface ToastState {
  id: string;
  text: string;
  type: 'info' | 'success' | 'warning';
}

interface UIContextType {
  // Search Modal
  isSearchOpen: boolean;
  openSearch: () => void;
  closeSearch: () => void;
  toggleSearch: () => void;

  // Quick View Modal
  quickViewProduct: Product | null;
  openQuickView: (product: Product) => void;
  closeQuickView: () => void;

  // Category State
  activeCategory: ProductCategory;
  setActiveCategory: (cat: ProductCategory) => void;

  // Grid Density
  gridDensity: GridDensity;
  setGridDensity: (density: GridDensity) => void;

  // Mobile Navigation Drawer
  isMobileNavOpen: boolean;
  openMobileNav: () => void;
  closeMobileNav: () => void;
  toggleMobileNav: () => void;

  // Size Guide Modal
  isSizeGuideOpen: boolean;
  openSizeGuide: () => void;
  closeSizeGuide: () => void;

  // Checkout Flow Modal
  isCheckoutOpen: boolean;
  openCheckout: () => void;
  closeCheckout: () => void;

  // Filter Drawer
  isFilterDrawerOpen: boolean;
  openFilterDrawer: () => void;
  closeFilterDrawer: () => void;
  toggleFilterDrawer: () => void;

  // Lookbook Hotspots Toggle
  isLookbookHotspotsVisible: boolean;
  toggleLookbookHotspots: () => void;

  // Toast System
  toasts: ToastState[];
  showToast: (text: string, type?: 'info' | 'success' | 'warning') => void;
  removeToast: (id: string) => void;
}

const UIContext = createContext<UIContextType | undefined>(undefined);

export const UIProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [activeCategory, setActiveCategory] = useState<ProductCategory>('all');
  const [gridDensity, setGridDensity] = useState<GridDensity>('3-col');
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [isLookbookHotspotsVisible, setIsLookbookHotspotsVisible] = useState(true);
  const [toasts, setToasts] = useState<ToastState[]>([]);

  // Keyboard shortcut listener for ⌘K or Ctrl+K (Search) & Escape (Close)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      } else if (e.key === 'Escape') {
        if (isSearchOpen) setIsSearchOpen(false);
        if (quickViewProduct) setQuickViewProduct(null);
        if (isSizeGuideOpen) setIsSizeGuideOpen(false);
        if (isCheckoutOpen) setIsCheckoutOpen(false);
        if (isFilterDrawerOpen) setIsFilterDrawerOpen(false);
        if (isMobileNavOpen) setIsMobileNavOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchOpen, quickViewProduct, isSizeGuideOpen, isCheckoutOpen, isFilterDrawerOpen, isMobileNavOpen]);

  let toastCounter = 0;

  const showToast = (text: string, type: 'info' | 'success' | 'warning' = 'info') => {
    const id = `toast-${++toastCounter}`;
    setToasts((prev) => [...prev, { id, text, type }]);

    setTimeout(() => {
      removeToast(id);
    }, 3800);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <UIContext.Provider
      value={{
        isSearchOpen,
        openSearch: () => setIsSearchOpen(true),
        closeSearch: () => setIsSearchOpen(false),
        toggleSearch: () => setIsSearchOpen((prev) => !prev),

        quickViewProduct,
        openQuickView: (prod) => setQuickViewProduct(prod),
        closeQuickView: () => setQuickViewProduct(null),

        activeCategory,
        setActiveCategory,

        gridDensity,
        setGridDensity,

        isMobileNavOpen,
        openMobileNav: () => setIsMobileNavOpen(true),
        closeMobileNav: () => setIsMobileNavOpen(false),
        toggleMobileNav: () => setIsMobileNavOpen((prev) => !prev),

        isSizeGuideOpen,
        openSizeGuide: () => setIsSizeGuideOpen(true),
        closeSizeGuide: () => setIsSizeGuideOpen(false),

        isCheckoutOpen,
        openCheckout: () => setIsCheckoutOpen(true),
        closeCheckout: () => setIsCheckoutOpen(false),

        isFilterDrawerOpen,
        openFilterDrawer: () => setIsFilterDrawerOpen(true),
        closeFilterDrawer: () => setIsFilterDrawerOpen(false),
        toggleFilterDrawer: () => setIsFilterDrawerOpen((prev) => !prev),

        isLookbookHotspotsVisible,
        toggleLookbookHotspots: () => setIsLookbookHotspotsVisible((prev) => !prev),

        toasts,
        showToast,
        removeToast,
      }}
    >
      {children}
    </UIContext.Provider>
  );
};

export const useUI = (): UIContextType => {
  const context = useContext(UIContext);
  if (!context) {
    throw new Error('useUI must be used within a UIProvider');
  }
  return context;
};
