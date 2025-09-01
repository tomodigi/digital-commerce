import type { PageServerLoad } from './$types';
import { parsePreviewUrls } from '$lib/utils/product/product-utils';
import { getSupabase } from '$lib/supabase/server';

interface Product {
  id: number;
  name: string;
  description?: string | null;
  price: number | string;
  preview?: string[] | null;
  stars?: number | string | null;
  category_id?: number | null;
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
        description,
        price,
        preview,
        stars,
        category_id,
        created_at
      `)
      .order('created_at', { ascending: false })
      .range(0, 24);

    const categoryIds = [...new Set(products?.map(p => p.category_id).filter(Boolean))];
    const { data: categories, error: categoriesError } = categoryIds.length > 0
      ? await supabase
        .from('product_categories')
        .select('id, name')
        .in('id', categoryIds)
      : { data: [], error: null };

    if (productsError) throw productsError;
    if (categoriesError) throw categoriesError;

    const { data: { user } } = await supabase.auth.getUser();

    const mappedProducts = (products || [] as Product[]).map((product: Product) => {
      const previewUrls = parsePreviewUrls(product.preview || []);
      const category = product.category_id
        ? (categories as Category[])?.find((c: Category) => c.id === product.category_id)?.name
        : 'Uncategorized';

      return {
        id: product.id,
        name: product.name,
        description: product.description || '',
        price: Number(product.price) || 0,
        category,
        imageUrl: previewUrls[0] || 'https://placehold.co/600x400/e2e8f0/94a3b8?text=No+Image',
        stars: Number(product.stars) || 0,
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
