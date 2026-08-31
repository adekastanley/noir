import { useQuery } from '@tanstack/react-query';
import { apiClient } from './client';
import type { Product, ProductCategory } from '../types';

export const useCMSContent = (slug: string) => {
  return useQuery({
    queryKey: ['cms-content', slug],
    queryFn: async () => {
      const response = await apiClient.get(`/content/${slug}`);
      return response.data;
    },
  });
};

const mapWcProduct = (wcProduct: any): Product => {
  // Parse sizes and colors from WooCommerce attributes
  const sizes: string[] = [];
  const colorways: any[] = [];
  let colorName = 'Default';

  if (Array.isArray(wcProduct.attributes)) {
    wcProduct.attributes.forEach((attr: any) => {
      const name = (attr.name || '').toLowerCase();
      if (name.includes('size')) {
        if (Array.isArray(attr.options)) {
          attr.options.forEach((opt: string) => sizes.push(opt));
        }
      }
      if (name.includes('color') || name.includes('colour')) {
        if (Array.isArray(attr.options) && attr.options.length > 0) {
          colorName = attr.options[0];
          attr.options.forEach((opt: string) => {
            colorways.push({ name: opt, hex: '' });
          });
        }
      }
    });
  }

  // Fallback if no sizes found
  if (sizes.length === 0) {
    sizes.push('One Size');
  }

  const salePrice = parseFloat(wcProduct.sale_price || '0');
  const regularPrice = parseFloat(wcProduct.regular_price || wcProduct.price || '0');

  return {
    id: wcProduct.id.toString(),
    slug: wcProduct.slug,
    name: wcProduct.name,
    subtitle: '', 
    category: (wcProduct.categories?.[0]?.slug || 'all') as ProductCategory,
    price: salePrice > 0 ? salePrice : regularPrice,
    compareAtPrice: salePrice > 0 ? regularPrice : undefined,
    colorName,
    colorways,
    sizes,
    inStock: wcProduct.stock_status === 'instock',
    stockCount: wcProduct.stock_quantity || 10,
    images: {
      primary: wcProduct.images?.[0]?.src || '',
      secondary: wcProduct.images?.[1]?.src || undefined,
    },
    composition: '',
    origin: '',
    description: wcProduct.description?.replace(/<[^>]+>/g, '') || '', 
    features: [],
    careInstructions: [],
  };
};

export const useProducts = (categorySlug?: string) => {
  return useQuery({
    queryKey: ['products', categorySlug],
    queryFn: async () => {
      const url = categorySlug && categorySlug !== 'all' 
        ? `/wc/products?category=${categorySlug}` 
        : '/wc/products';
      const response = await apiClient.get(url);
      return (response.data || []).map(mapWcProduct) as Product[];
    },
  });
};

export const useCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await apiClient.get('/wc/products/categories');
      return response.data;
    },
  });
};

export const useGlobalAttributes = () => {
  return useQuery({
    queryKey: ['global-attributes'],
    queryFn: async () => {
      // 1. Fetch all attributes
      const { data: attributes } = await apiClient.get('/wc/products/attributes');
      
      const sizes: string[] = [];
      const colors: { name: string; hex: string }[] = [];

      // Attempt to roughly map string colors to hex where possible, else fallback to dark grey
      const getHexForColor = (name: string) => {
        const lower = name.toLowerCase();
        if (lower.includes('black') || lower.includes('obsidian') || lower.includes('carbon')) return '#121212';
        if (lower.includes('white') || lower.includes('cream') || lower.includes('alabaster')) return '#f0ece1';
        if (lower.includes('sand') || lower.includes('oatmeal') || lower.includes('bone')) return '#d9d0c1';
        if (lower.includes('grey') || lower.includes('gray') || lower.includes('charcoal')) return '#2c2d30';
        if (lower.includes('red')) return '#7a1f1f';
        if (lower.includes('blue') || lower.includes('navy')) return '#1f2937';
        return '#888888';
      };

      // 2. For each attribute, fetch its terms if it's size or color
      if (Array.isArray(attributes)) {
        await Promise.all(attributes.map(async (attr: any) => {
          const name = (attr.name || '').toLowerCase();
          const slug = (attr.slug || '').toLowerCase();
          
          if (name.includes('size') || slug.includes('size')) {
            const { data: terms } = await apiClient.get(`/wc/products/attributes/${attr.id}/terms`);
            if (Array.isArray(terms)) {
              terms.forEach((term: any) => sizes.push(term.name));
            }
          }
          
          if (name.includes('color') || name.includes('colour') || slug.includes('color')) {
            const { data: terms } = await apiClient.get(`/wc/products/attributes/${attr.id}/terms`);
            if (Array.isArray(terms)) {
              terms.forEach((term: any) => {
                colors.push({
                  name: term.name,
                  hex: getHexForColor(term.name) // We approximate the hex or you can use ACF for color hex in WP
                });
              });
            }
          }
        }));
      }

      return {
        sizes: Array.from(new Set(sizes)).sort(),
        colors: colors.sort((a, b) => a.name.localeCompare(b.name))
      };
    },
  });
};
