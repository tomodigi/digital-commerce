import { getSupabase } from '$lib/supabase/server';
import type { PageServerLoad } from './$types';
import { parsePreviewUrls } from '$lib/utils/product/product-utils';

interface Product {
  id: number;
  slug: string;
  name: string;
  category_id?: number;
  price: number | string;
  thumbnail?: string;
  preview?: string[];
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
      .select(`
        id,
        name,
        price,
        preview,
        stars,
        category_id,
        slug
      `)
      .order('created_at', { ascending: false })
      .limit(4);

    if (productsError) throw productsError;

    const categoryIds = [...new Set(products?.map(p => p.category_id).filter(Boolean))];
    const { data: categories, error: categoriesError } = categoryIds.length > 0
      ? await supabase
        .from('product_categories')
        .select('id, name')
        .in('id', categoryIds)
      : { data: [], error: null };

    if (categoriesError) throw categoriesError;

    const typedCategories = (categories || []) as Category[];
    const { data: { user } } = await supabase.auth.getUser();

    const featuredProducts = (products || []).map((product) => {
      const previewUrls = parsePreviewUrls(product.preview || []);
      const category = product.category_id
        ? typedCategories.find((c) => c.id === product.category_id)?.name || 'Uncategorized'
        : 'Uncategorized';

      return {
        id: product.id,
        name: product.name,
        price: typeof product.price === 'number' ? product.price : Number(product.price) || 0,
        category,
        imageUrl: previewUrls[0] || 'https://placehold.co/600x400/e2e8f0/94a3b8?text=No+Image',
        rating: Number(product.stars) || 0,
        slug: product.slug,
      };
    });

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
