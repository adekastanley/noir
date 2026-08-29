import React from 'react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useUI } from '../../context/UIContext';
import { Search, Heart, Menu, SlidersHorizontal } from 'lucide-react';
import { Link } from '@tanstack/react-router';

export const Header: React.FC = () => {
  const { totalItems, openCart } = useCart();
  const { totalWishlistItems, openWishlist } = useWishlist();
  const {
    openSearch,
    toggleMobileNav,
    openFilterDrawer,
    showToast,
  } = useUI();

  const handleLoginClick = () => {
    showToast('Private Client Atelier Portal opens for VIP presale holders.', 'info');
  };

  return (
    <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border transition-colors">
      <div className="w-full max-w-[1920px] mx-auto flex items-stretch min-h-[58px] md:min-h-[64px]">
        {/* Left Column: Brand Name */}
        <div className="flex shrink-0 items-center px-3 sm:px-6 border-r border-border">
          <a
            href="/"
            className="flex items-center gap-2 group py-2"
            aria-label="Noir Atelier Homepage"
          >
            <span className="editorial-title text-sm sm:text-base font-semibold tracking-[0.28em] text-foreground group-hover:opacity-75 transition-opacity">
              NOIR ATELIER
            </span>
          </a>
        </div>

        {/* Center Column: Segmented Category Grid Nav (Desktop) */}
        <nav
          aria-label="Main navigation"
          className="hidden md:flex flex-1 items-stretch border-r border-border overflow-x-auto no-scrollbar"
        >
          <Link
            to="/shop"
            className="flex-1 min-w-[70px] flex items-center justify-center px-3 text-[11px] uppercase tracking-[0.2em] font-mono transition-all border-r border-border text-muted-foreground hover:text-foreground hover:bg-muted/40 [&.active]:bg-foreground [&.active]:text-background [&.active]:font-semibold"
          >
            Shop
          </Link>
          <Link
            to="/lookbook"
            className="flex-1 min-w-[70px] flex items-center justify-center px-3 text-[11px] uppercase tracking-[0.2em] font-mono transition-all border-r border-border text-muted-foreground hover:text-foreground hover:bg-muted/40 [&.active]:bg-foreground [&.active]:text-background [&.active]:font-semibold"
          >
            Lookbook
          </Link>
          <Link
            to="/atelier"
            className="flex-1 min-w-[70px] flex items-center justify-center px-3 text-[11px] uppercase tracking-[0.2em] font-mono transition-all border-border text-muted-foreground hover:text-foreground hover:bg-muted/40 [&.active]:bg-foreground [&.active]:text-background [&.active]:font-semibold"
          >
            Atelier
          </Link>
        </nav>

        {/* Right Column: Actions (Search, Login, Wishlist, Cart) */}
        <div className="flex flex-1 md:flex-none items-stretch justify-end">
          {/* VIP Client Log in (Desktop) */}
          <button
            onClick={handleLoginClick}
            className="hidden lg:flex items-center justify-center px-4 text-[11px] uppercase tracking-[0.2em] font-mono text-muted-foreground hover:text-foreground border-l border-border transition-colors hover:bg-muted/40"
          >
            Log in
          </button>

          {/* Instant Search trigger */}
          <button
            onClick={openSearch}
            className="flex flex-1 md:flex-none items-center justify-center px-2.5 sm:px-4 text-[11px] uppercase tracking-[0.2em] font-mono text-muted-foreground hover:text-foreground border-l border-border transition-colors hover:bg-muted/40 group gap-1.5"
            aria-label="Open search command palette"
          >
            <Search className="w-3.5 h-3.5 opacity-70 group-hover:opacity-100 transition-opacity" />
            <span className="hidden sm:inline">Search</span>
            <kbd className="hidden xl:inline text-[9px] px-1 py-0.2 bg-muted text-muted-foreground border border-border rounded-none ml-1">
              ⌘K
            </kbd>
          </button>

          {/* Filter Drawer trigger (Mobile & Tablet quick access) */}
          <button
            onClick={openFilterDrawer}
            className="md:hidden flex flex-1 items-center justify-center px-2.5 text-muted-foreground hover:text-foreground border-l border-border transition-colors hover:bg-muted/40"
            aria-label="Filter products"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
          </button>

          {/* Wishlist Drawer trigger */}
          <button
            onClick={openWishlist}
            className="relative flex flex-1 md:flex-none items-center justify-center px-2.5 sm:px-4 text-[11px] uppercase tracking-[0.2em] font-mono text-muted-foreground hover:text-foreground border-l border-border transition-colors hover:bg-muted/40"
            aria-label={`Saved items (${totalWishlistItems})`}
          >
            <Heart className="w-3.5 h-3.5" />
            {totalWishlistItems > 0 && (
              <span className="ml-1 text-[10px] font-mono font-medium">
                [{totalWishlistItems}]
              </span>
            )}
          </button>

          {/* Bag / Cart Slideover trigger */}
          <button
            onClick={openCart}
            className="flex flex-1 md:flex-none items-center justify-center px-3 sm:px-6 text-[11px] uppercase tracking-[0.22em] font-mono bg-foreground text-background hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors border-l border-border font-medium"
            aria-label={`Shopping bag with ${totalItems} items`}
          >
            <span className="hidden sm:inline mr-1">Bag</span>
            <span>[{totalItems}]</span>
          </button>

          {/* Mobile Menu Hamburger */}
          <button
            onClick={toggleMobileNav}
            className="md:hidden flex flex-1 items-center justify-center px-2.5 text-muted-foreground hover:text-foreground border-l border-border transition-colors"
            aria-label="Toggle mobile navigation"
          >
            <Menu className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
