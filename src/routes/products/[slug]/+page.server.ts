import type { PageServerLoad } from './$types';
import { parsePreviewUrls } from '$lib/utils/product/product-utils';
import { error } from '@sveltejs/kit';

type DbProduct = {
  id: number;
  name: string;
  description?: string | null;
  price: number | string;
  preview?: string[] | string | null;
  stars?: number | string | null;
  category_id?: number | null;
  created_at: string;
  slug: string;
  thumbnail?: string | null;
};

export const load: PageServerLoad = async ({ locals, params }) => {
  const supabase = locals.supabase;
  const { slug } = params;

  try {
    const { data: product, error: productError } = await supabase
      .from('products')
      .select(
        `*`
      )
      .eq('slug', slug)
      .single<DbProduct>();

    if (productError || !product) throw error(404, 'Product not found');

    const parsedPreview = parsePreviewUrls(product.preview ?? []);
    const images = parsedPreview.length > 0
      ? parsedPreview
      : product.thumbnail
        ? [product.thumbnail]
        : [];

    let relatedQuery = supabase
      .from('products')
      .select(`id, name, price, stars, slug, preview, thumbnail`)
      .neq('id', product.id)
      .order('created_at', { ascending: false });

    if (product.category_id !== null && product.category_id !== undefined) {
      relatedQuery = relatedQuery.eq('category_id', product.category_id);
    }

    let { data: related, error: relatedError } = await relatedQuery.range(0, 3);

    if (relatedError || !related || related.length === 0) {
      const fallback = await supabase
        .from('products')
        .select(`id, name, price, stars, slug, preview, thumbnail`)
        .neq('id', product.id)
        .order('created_at', { ascending: false })
        .range(0, 3);

      if (!relatedError) {
        relatedError = fallback.error ?? null;
      }
      related = fallback.data ?? [];
    }

    const relatedProducts = (related ?? []).map((p) => {
      const rPrev = parsePreviewUrls(p.preview ?? []);
      return {
        ...p,
        price: Number(p.price) || 0,
        stars: Number(p.stars) || 0,
        preview: rPrev.length > 0 ? rPrev : p.thumbnail ? [p.thumbnail] : []
      };
    });

    return {
      product: {
        ...product,
        price: Number(product.price) || 0,
        stars: Number(product.stars) || 0,
        description: product.description ?? undefined,
        preview: images
      },
      relatedProducts,
      error: null
    };
  } catch (e) {
    if (e instanceof Response) throw e;
    throw error(500, 'Failed to load product');
  }
};
