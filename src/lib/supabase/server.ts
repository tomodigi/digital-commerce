import { createServerClient } from '@supabase/ssr'
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public'
import type { Cookies } from '@sveltejs/kit'

type CookieOptions = {
  path: string
  maxAge?: number
  domain?: string
  secure?: boolean
  httpOnly?: boolean
  sameSite?: 'lax' | 'strict' | 'none' | boolean
}

type CookieMethods = {
  get: (key: string) => string | undefined
  set: (key: string, value: string, options: CookieOptions) => void
  delete: (key: string, options: CookieOptions) => void
}

export function getSupabase(event: { cookies: Cookies }) {
  const cookieOptions: CookieOptions = {
    path: '/',
    sameSite: 'lax',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production'
  }

  return createServerClient(
    PUBLIC_SUPABASE_URL,
    PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        get: (key) => {
          return event.cookies.get(key)
        },
        set: (key, value, options) => {
          event.cookies.set(key, value, {
            ...cookieOptions,
            ...options
          })
        },
        remove: (key, options) => {
          event.cookies.delete(key, {
            ...cookieOptions,
            ...options
          })
        }
      }
    }
  )
}

export async function getSession(supabase: ReturnType<typeof getSupabase>) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null
  
  // For backward compatibility, return a session-like object
  return {
    user,
    access_token: (await supabase.auth.getSession()).data.session?.access_token
  }
}

export async function getUser(supabase: ReturnType<typeof getSupabase>) {
  const { data: { user } } = await supabase.auth.getUser()
  return user
}
