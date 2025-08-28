// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
import type { SupabaseClient, Session, User } from "@supabase/supabase-js"

declare global {
	declare namespace App {
		interface Locals {
			supabase: SupabaseClient
			getSession: () => Promise<Session | null>
			user: User | null
		}
		interface PageData {
			session: Session | null
			user: User | null
			featuredProducts?: Array<{
        id: number;
        name: string;
        category: string;
        price: number;
        imageUrl: string;
        rating: number;
      }>;
      error?: string;
		}
	}
}