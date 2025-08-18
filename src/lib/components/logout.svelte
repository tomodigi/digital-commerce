<script lang="ts">
  import { getSupabase } from "$lib/supabase/client";
  import { page } from "$app/stores";
  import { goto } from "$app/navigation";
  import { toast } from "svelte-sonner";

  let isLoading = false;

  async function handleLogout() {
    try {
      isLoading = true;
      const supabase = await getSupabase();
      const { error } = await supabase.auth.signOut();

      if (error) throw error;

      toast.success("Logged out successfully");
      goto("/login");
    } catch (error) {
      console.error("Error logging out:", error);
      toast.error("Failed to log out");
    } finally {
      isLoading = false;
    }
  }
</script>

<button
  on:click={handleLogout}
  disabled={isLoading}
  class="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
>
  {#if isLoading}
    Logging out...
  {:else}
    Logout
  {/if}
</button>
