<script lang="ts">
  import "../app.css";
  import favicon from "$lib/assets/favicon.svg";
  import { onMount } from "svelte";
  import { invalidate, invalidateAll } from "$app/navigation";
  import { getSupabase } from "$lib/supabase/client";
  import { authLoading } from "$lib/stores/auth";
  import type { LayoutData } from "./$types";
  import type { AuthChangeEvent, Session, User } from "@supabase/supabase-js";

  export let data: LayoutData;

  let session: Session | null = null;
  let user: User | null = null;

  $: session = data.session;
  $: user = (data.user as User | null) || session?.user || null;

  onMount(() => {
    let unsubscribe: (() => void) | null = null;
    getSupabase().then(async (supabase) => {
      try {
        authLoading.set(true);
        const {
          data: { session: current },
        } = await supabase.auth.getSession();
        if (current) {
          await fetch("/auth/session", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({
              event: "INITIAL_SESSION",
              session: current,
            }),
          });
          await invalidate("supabase:auth");
        }
      } catch {
      } finally {
        authLoading.set(false);
      }

      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange(
        async (event: AuthChangeEvent, newSession: Session | null) => {
          session = newSession ?? null;
          user = newSession?.user ?? null;

          try {
            authLoading.set(true);
            await fetch("/auth/session", {
              method: "POST",
              headers: { "content-type": "application/json" },
              body: JSON.stringify({ event, session: newSession }),
            });
          } finally {
            await invalidate("supabase:auth");
            await invalidateAll();
            authLoading.set(false);
          }
        },
      );
      unsubscribe = subscription.unsubscribe;
    });

    return () => {
      unsubscribe?.();
    };
  });
</script>

<svelte:head>
  <link rel="icon" href={favicon} />
</svelte:head>

<slot {user} />
