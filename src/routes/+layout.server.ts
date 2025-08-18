import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals, depends }) => {
  depends('supabase:auth');
  const {
    data: { user },
  } = await locals.supabase.auth.getUser();
  return {
    session: null,
    user: user ?? null,
  };
};


