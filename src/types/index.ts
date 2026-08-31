export type ProductCategory = 
  | 'all' 
  | 'outerwear' 
  | 'tailoring' 
  | 'knitwear' 
  | 'bottoms' 
  | 'objects' 
  | 'footwear';

export interface ProductColorway {
  name: string;
  hex: string;
  imageIndex?: number;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  subtitle: string;
  category: ProductCategory;
  price: number; // in EUR (base currency)
  compareAtPrice?: number;
  colorName: string;
  colorways: ProductColorway[];
  sizes: string[];
  inStock: boolean;
  stockCount: number;
  isNew?: boolean;
  isFeatured?: boolean;
  isLimited?: boolean;
  images: {
    primary: string;
    secondary?: string;
    detail?: string;
    flatLay?: string;
  };
  placeholderColor?: string;
  composition: string;
  origin: string;
  description: string;
  features: string[];
  careInstructions: string[];
  measurements?: {
    fit: 'Relaxed' | 'Oversized' | 'Tailored' | 'Architectural';
    modelStats?: string;
  };
  lookbookId?: string;
}

export interface Collection {
  id: string;
  slug: string;
  title: string;
  season: string;
  year: string;
  tagline: string;
  description: string;
  coverImage: string;
  heroQuote?: string;
  productIds: string[];
}

export interface LookbookHotspot {
  id: string;
  xPercent: number; // 0 to 100
  yPercent: number; // 0 to 100
  productId: string;
  label: string;
  detail: string;
}

export interface LookbookCampaign {
  id: string;
  title: string;
  subtitle: string;
  season: string;
  location: string;
  image: string;
  aspectRatio?: string;
  tagline: string;
  hotspots: LookbookHotspot[];
}

export interface CartItem {
  id: string; // generated unique id (productId + size + color)
  product: Product;
  selectedSize: string;
  selectedColor: string;
  quantity: number;
  unitPrice: number;
}

export interface WishlistItem {
  productId: string;
  product: Product;
  addedAt: string;
}

export type CurrencyCode = 'EUR' | 'USD' | 'GBP' | 'JPY' | 'CAD' | 'AUD' | 'CHF' | 'NGN';

export interface CurrencyConfig {
  code: CurrencyCode;
  symbol: string;
  rate: number; // multiplier relative to EUR
  position: 'prefix' | 'suffix';
  decimalPlaces: number;
}

export type SortOption = 
  | 'featured' 
  | 'newest' 
  | 'price-asc' 
  | 'price-desc' 
  | 'name-asc';

export interface ProductFilterState {
  category: ProductCategory;
  searchQuery: string;
  selectedSizes: string[];
  selectedColors: string[];
  minPrice: number;
  maxPrice: number;
  inStockOnly: boolean;
  sortBy: SortOption;
}

export interface NewsletterSubscription {
  email: string;
  categoryPreference?: string;
  clientTier?: 'standard' | 'vip' | 'atelier_private';
}

export interface CheckoutPayload {
  items: CartItem[];
  currency: CurrencyCode;
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  shippingAddress: {
    fullName: string;
    email: string;
    addressLine: string;
    city: string;
    postalCode: string;
    country: string;
  };
  paymentMethod: 'card' | 'apple_pay' | 'klarna';
}
