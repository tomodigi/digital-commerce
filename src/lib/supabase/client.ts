// src/lib/supabaseClient.ts

import { createClient } from '@supabase/supabase-js';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';

// Inisialisasi Supabase client
export const supabase = createClient(
    PUBLIC_SUPABASE_URL,
    PUBLIC_SUPABASE_ANON_KEY,
    {
        auth: {
            autoRefreshToken: true,
            persistSession: true,
            detectSessionInUrl: true,
        }
    }
);