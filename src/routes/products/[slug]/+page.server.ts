import type { PageServerLoad } from './$types';
import { getSupabase } from '$lib/supabase/server';

interface RelatedProduct {
  id: number;
  name: string;
  description?: string | null;
  price: number | string;
  preview?: string[] | null;
  stars?: number | string | null;
  category_id?: number | null;
  created_at: string;
  slug: string;
}

export const load = (async (event) => {
  const { params } = event;
  const supabase = getSupabase(event);

  try {
    const { data: product, error: productError } = await supabase
      .from('products')
      .select('*')
      .eq('slug', params.slug)
      .maybeSingle();

    let category = null;
    if (product?.category_id) {
      const { data: categoryData } = await supabase
        .from('product_categories')
        .select('*')
        .eq('id', product.category_id)
        .single();
      category = categoryData;
    }

    if (productError) {
      console.error('Error loading product:', productError);
      return {
        status: 404,
        error: 'Product not found'
      };
    }

    if (!product) {
      return {
        status: 404,
        error: 'Product not found'
      };
    }

    let relatedProducts: RelatedProduct[] = [];
    if (product.category_id) {
      const { data: related, error: relatedError } = await supabase
        .from('products')
        .select(`
          id,
          name,
          slug,
          price,
          preview,
          stars,
          category_id,
          created_at
        `)
        .eq('category_id', product.category_id)
        .neq('id', product.id)
        .limit(4);

      if (!relatedError) {
        relatedProducts = related;
      }
    }

    return {
      product: {
        ...product,
        category,
        price: Number(product.price),
        stars: product.stars ? Number(product.stars) : 0,
        features: Array.isArray(product.features) ? product.features : [],
        tags: Array.isArray(product.tags) ? product.tags : [],
        compatible_browser: Array.isArray(product.compatible_browser) ? product.compatible_browser : [],
        compatible_with: Array.isArray(product.compatible_with) ? product.compatible_with : [],
        files_include: Array.isArray(product.files_include) ? product.files_include : []
      },
      relatedProducts
    };
  } catch (error) {
    console.error('Error loading product:', error);
    return {
      status: 500,
      error: 'Failed to load product'
    };
  }
}) satisfies PageServerLoad;
