import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import { supabase } from '$lib/supabase/client';
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

export const actions: Actions = {
    default: async ({ request }) => {
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

        const { error } = await supabase.auth.signUp({
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

        return { success: true, message: 'Registration successful' };
    }
};