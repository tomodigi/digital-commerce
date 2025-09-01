import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { z } from 'zod';

const registerSchema = z
    .object({
        fullName: z.string().min(3, 'Full name is required').max(100, 'Full name is too long'),
        username: z.string().min(3, 'Username is required').regex(/^[a-z0-9_]+$/, 'Username can only contain lowercase letters, numbers, and underscores').max(20, 'Username is too long'),
        email: z.string().email('Format email is invalid'),
        password: z.string()
            .min(8, 'Password must be at least 8 characters long')
            .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
            .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
            .regex(/[0-9]/, 'Password must contain at least one number'),
        confirmPassword: z.string()
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: 'Password does not match',
        path: ['confirmPassword']
    });

export const load: PageServerLoad = async ({ locals }) => {
    const { data: { user } } = await locals.supabase.auth.getUser();

    if (user) {
        throw redirect(303, '/');
    }

    return {};
};

export const actions: Actions = {

    register: async ({ request, locals }) => {
        const formData = Object.fromEntries(await request.formData());

        const result = registerSchema.safeParse(formData);

        if (!result.success) {
            const flattened = result.error.flatten();
            const firstError = Object.values(flattened.fieldErrors)[0]?.[0] || 'Invalid input';
            return fail(400, {
                success: false,
                message: firstError,
                errors: flattened.fieldErrors
            });
        }

        const { email, password, fullName, username } = result.data;

        const { error } = await locals.supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name: fullName,
                    username: username
                }
            }
        });

        if (error) {
            return fail(500, { success: false, message: error.message });
        }

        // Return success with form data to trigger the alert
        return {
            success: true,
            message: 'Registration successful',
            form: {
                success: true
            }
        };
    },

    registerWithGoogle: async ({ locals, url }) => {
        const { data, error } = await locals.supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${url.origin}`,
            },
        });

        if (error) {
            console.error('Error signing in with Google:', error);
            return fail(500, { success: false, message: 'Server error. Could not sign in with Google.' });
        }

        // If the URL is available, redirect the user to it.
        if (data.url) {
            throw redirect(303, data.url);
        }

        // Fallback in case the URL is not provided for some reason.
        return fail(500, { success: false, message: 'Could not get Google sign-in URL.' });
    }
};