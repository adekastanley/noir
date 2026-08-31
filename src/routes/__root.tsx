import { createRootRoute, Outlet } from '@tanstack/react-router';
import { CurrencyProvider } from '../context/CurrencyContext';
import { CartProvider } from '../context/CartContext';
import { WishlistProvider } from '../context/WishlistContext';
import { UIProvider } from '../context/UIContext';
import { AnnouncementBar } from '../components/header/AnnouncementBar';
import { Header } from '../components/header/Header';
import { MobileNav } from '../components/header/MobileNav';
import { Footer } from '../components/footer/Footer';
import { CartDrawer } from '../components/cart/CartDrawer';
import { WishlistDrawer } from '../components/wishlist/WishlistDrawer';
import { SearchCommandModal } from '../components/search/SearchCommandModal';
import { ProductQuickViewModal } from '../components/products/ProductQuickViewModal';
import { SizeGuideModal } from '../components/products/SizeGuideModal';
import { CheckoutModal } from '../components/cart/CheckoutModal';
import { ToastContainer } from '../components/ui/ToastContainer';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

const RootLayout = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <CurrencyProvider>
        <CartProvider>
        <WishlistProvider>
          <UIProvider>
            {/* Skip Link for Accessibility */}
            <a
              href="#main-content"
              className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 z-50 px-4 py-2 bg-foreground text-background font-mono text-xs uppercase tracking-widest outline-none border border-background shadow-xl"
            >
              Skip to main atelier content
            </a>

            <div className="min-h-screen flex flex-col bg-background text-foreground selection:bg-foreground selection:text-background font-sans antialiased">
              {/* Header Group */}
              <AnnouncementBar />
              <Header />

              {/* Main Content Area */}
              <main id="main-content" className="flex-1 flex flex-col">
                <Outlet />
              </main>

              {/* Footer */}
              <Footer />

              {/* Global Modals & Drawers */}
              <MobileNav />
              <CartDrawer />
              <WishlistDrawer />
              <SearchCommandModal />
              <ProductQuickViewModal />
              <SizeGuideModal />
              <CheckoutModal />
              <ToastContainer />
            </div>
          </UIProvider>
        </WishlistProvider>
      </CartProvider>
    </CurrencyProvider>
    <ReactQueryDevtools initialIsOpen={false} position="bottom" />
  </QueryClientProvider>
  );
};

export const Route = createRootRoute({ component: RootLayout });