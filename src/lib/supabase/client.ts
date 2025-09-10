// src/lib/supabase/client.ts

import { browser } from '$app/environment'
import type { SupabaseClient } from '@supabase/supabase-js'
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public'

let client: SupabaseClient | null = null

export async function getSupabase(): Promise<SupabaseClient> {
  if (!browser) {
    throw new Error('Supabase client is only available in the browser')
  }
  if (!client) {
    // Use ESM import to avoid require in the browser
    const { createBrowserClient } = await import('@supabase/ssr')
    client = createBrowserClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true, // Enable URL session detection so OAuth redirects update state immediately
      },
    }) as unknown as SupabaseClient
  }
  return client
}