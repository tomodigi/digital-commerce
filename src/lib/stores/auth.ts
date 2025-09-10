import { writable } from 'svelte/store'

// Global auth loading state to smooth UI during OAuth redirects and session sync
export const authLoading = writable<boolean>(false)
