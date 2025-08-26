
import { writable } from 'svelte/store';
import type { User } from '@supabase/supabase-js';

export interface UserSession extends User {
    role?: string;
    full_name?: string;
}

export const userStore = writable<UserSession | null>(null);