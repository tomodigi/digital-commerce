import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ locals: { getSession, supabase } }) => {
    const session = await getSession();

    if (session) {
        const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', session.user.id)
            .single();

        if (profile?.role === 'admin') {
            throw redirect(303, '/admin/products');
        } else {
            // Sign out non-admin users
            await supabase.auth.signOut();
        }
    }

    return {};
};
