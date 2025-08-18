<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import { onMount } from 'svelte'
  import { invalidate } from '$app/navigation'
  import { getSupabase } from '$lib/supabase/client'
  import type { LayoutData } from './$types'
  import type { AuthChangeEvent, Session } from '@supabase/supabase-js'
  
  export let data: LayoutData
  
  $: user = data.user
  
  onMount(() => {
    let subscription: { unsubscribe: () => void } | null = null
    getSupabase().then((supabase) => {
      const {
        data: { subscription: sub },
      } = supabase.auth.onAuthStateChange((event: AuthChangeEvent, newSession: Session | null) => {
        fetch('/auth/session', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ event, session: newSession }),
        }).finally(() => {
          invalidate('supabase:auth')
        })
      })
      subscription = sub
    })

    return () => {
      subscription?.unsubscribe()
    }
  })
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<slot {user} />

