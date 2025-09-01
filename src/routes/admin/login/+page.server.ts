import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ locals: { supabase } }) => {
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
        const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single();

        if (profile?.role === 'admin') {
            throw redirect(303, '/admin/products');
        } else {
            await supabase.auth.signOut();
        }
    }

    return {};
};
