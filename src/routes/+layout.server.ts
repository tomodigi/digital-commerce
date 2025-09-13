import type { LayoutServerLoad } from './$types';
export const load: LayoutServerLoad = async ({ locals, depends }) => {
  depends('supabase:auth');
  const user = await locals.getUser();
  return {
    session: null,
    user: user ?? null,
  };
};
