import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request, locals }) => {
  try {
    const body = await request.json().catch(() => ({} as any));
    const event: string | undefined = body?.event;
    const session = body?.session;

    if (event === 'SIGNED_OUT' && !session) {
      await locals.supabase.auth.signOut();
    } else if (session) {
      const access_token: string | undefined = session?.access_token;
      const refresh_token: string | undefined = session?.refresh_token;
      if (access_token && refresh_token) {
        await locals.supabase.auth.setSession({ access_token, refresh_token });
      }
    }

    return new Response(null, { status: 204 });
  } catch (error) {
    console.error('Failed to sync auth session', error);
    return new Response(null, { status: 500 });
  }
};


