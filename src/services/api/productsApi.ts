import { PRODUCTS } from '../../data/products';
import type { Product, ProductCategory, Collection, LookbookCampaign } from '../../types';

export interface ProductQueryParams {
  category?: ProductCategory;
  search?: string;
  sortBy?: string;
  minPrice?: number;
  maxPrice?: number;
  inStockOnly?: boolean;
  limit?: number;
}

/**
 * Abstracted API Client for Products and Collections.
 * Currently backed by mock data store; swap the internal fetch calls with REST/GraphQL endpoints when backend is live.
 */
export const productsApi = {
  /**
   * Fetch all products with optional filters and sorting
   */
  async getProducts(params?: ProductQueryParams): Promise<Product[]> {
    // Simulate slight network latency for realistic feel
    await new Promise((resolve) => setTimeout(resolve, 60));

    let result = [...PRODUCTS];

    if (!params) return result;

    if (params.category && params.category !== 'all') {
      result = result.filter((p) => p.category === params.category);
    }

    if (params.search && params.search.trim()) {
      const q = params.search.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.subtitle.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.composition.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      );
    }

    if (params.minPrice !== undefined) {
      result = result.filter((p) => p.price >= params.minPrice!);
    }

    if (params.maxPrice !== undefined) {
      result = result.filter((p) => p.price <= params.maxPrice!);
    }

    if (params.inStockOnly) {
      result = result.filter((p) => p.inStock && p.stockCount > 0);
    }

    if (params.sortBy) {
      switch (params.sortBy) {
        case 'price-asc':
          result.sort((a, b) => a.price - b.price);
          break;
        case 'price-desc':
          result.sort((a, b) => b.price - a.price);
          break;
        case 'newest':
          result.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
          break;
        case 'name-asc':
          result.sort((a, b) => a.name.localeCompare(b.name));
          break;
        case 'featured':
        default:
          result.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
          break;
      }
    }

    if (params.limit && params.limit > 0) {
      result = result.slice(0, params.limit);
    }

    return result;
  },

  /**
   * Fetch single product by its unique ID
   */
  async getProductById(id: string): Promise<Product | null> {
    await new Promise((resolve) => setTimeout(resolve, 40));
    return PRODUCTS.find((p) => p.id === id) || null;
  },

  /**
   * Fetch single product by its URL slug
   */
  async getProductBySlug(slug: string): Promise<Product | null> {
    await new Promise((resolve) => setTimeout(resolve, 40));
    return PRODUCTS.find((p) => p.slug === slug) || null;
  },

  /**
   * Fetch seasonal editorial collections
   */
  async getCollections(): Promise<Collection[]> {
    await new Promise((resolve) => setTimeout(resolve, 50));
    return [];
  },

  /**
   * Fetch lookbook campaign records
   */
  async getLookbooks(): Promise<LookbookCampaign[]> {
    await new Promise((resolve) => setTimeout(resolve, 50));
    return [];
  },

  /**
   * Search query autocomplete and quick matching
   */
  async searchProducts(query: string): Promise<Product[]> {
    if (!query || !query.trim()) return [];
    const q = query.toLowerCase().trim();
    return PRODUCTS.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.subtitle.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.composition.toLowerCase().includes(q)
    );
  }
};
