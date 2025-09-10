import type { LayoutServerLoad } from './$types';
export const load: LayoutServerLoad = async ({ locals, depends }) => {
  depends('supabase:auth');
  const [session, user] = await Promise.all([
    locals.getSession(),
    locals.getUser(),
  ]);
  return {
    session: session ?? null,
    user: user ?? null,
  };
};
