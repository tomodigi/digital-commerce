import type { PageServerLoad } from './$types';
import { parsePreviewUrls } from '$lib/utils/product/product-utils';
import { getSupabase } from '$lib/supabase/server';

interface Product {
  id: number;
  name: string;
  description?: string;
  price: number | string;
  preview?: string[];
  rating?: number | string;
  category_id?: number;
  created_at: string;
}

interface Category {
  id: number;
  name: string;
}

export const load: PageServerLoad = async (event) => {
  const supabase = getSupabase(event);

  try {
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });
    const { data: categories, error: categoriesError } = await supabase
      .from('product_categories')
      .select('*');

    if (productsError) throw productsError;
    if (categoriesError) throw categoriesError;

    const { data: { user } } = await supabase.auth.getUser();

    const mappedProducts = (products || [] as Product[]).map((product: Product) => {
      const previewUrls = parsePreviewUrls(product.preview);

      return {
        id: product.id,
        name: product.name,
        description: product.description || '',
        price: Number(product.price) || 0,
        category: (categories as Category[])?.find((c: Category) => c.id === product.category_id)?.name || 'Uncategorized',
        imageUrl: previewUrls.length > 0 ? previewUrls[0] : 'https://placehold.co/600x400/e2e8f0/94a3b8?text=No+Image',
        rating: Math.min(5, Math.max(0, Number(product.rating) || 0)),
        created_at: product.created_at,
        preview: previewUrls
      };
    });

    return {
      products: mappedProducts,
      categories: categories || [],
      user: user ?? null
    };
  } catch (error) {
    console.error('Error in products page server load:', error);
    return {
      products: [],
      categories: [],
      error: 'Failed to load products. Please try again later.'
    };
  }
};
