import { getSupabase } from '$lib/supabase/server';
import type { PageServerLoad } from './$types';

interface Product {
  id: number;
  name: string;
  category_id?: number;
  price: number | string;
  thumbnail?: string;
  rating?: number | string;
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
      .order('created_at', { ascending: false })
      .limit(4);

    const { data: categories, error: categoriesError } = await supabase
      .from('product_categories')
      .select('*');

    if (productsError) throw productsError;
    if (categoriesError) throw categoriesError;

    const typedProducts = (products || []) as Product[];
    const typedCategories = (categories || []) as Category[];

    const { data: { user } } = await supabase.auth.getUser();

    const featuredProducts = typedProducts.map((product) => ({
      id: product.id,
      name: product.name,
      category: typedCategories.find((c) => c.id === product.category_id)?.name || 'Uncategorized',
      price: typeof product.price === 'number' ? product.price : Number(product.price) || 0,
      imageUrl: product.thumbnail || 'https://placehold.co/600x400/e2e8f0/94a3b8?text=No+Image',
      rating: Math.min(5, Math.max(0, typeof product.rating === 'number' ? product.rating : Number(product.rating) || 0))
    }));

    return {
      featuredProducts,
      user: user ?? null
    } as const;
  } catch (error) {
    console.error('Error loading featured products:', error);
    return {
      featuredProducts: [],
      user: null,
      error: 'Failed to load featured products'
    };
  }
};
