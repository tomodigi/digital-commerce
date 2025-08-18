<script lang="ts">
    import { page } from "$app/stores";
    import Logout from "$lib/components/logout.svelte";

    $: user = $page.data.user;
    $: userEmail = user?.email;
</script>

<h1>Welcome to SvelteKit</h1>
{#if userEmail}
    <p>Welcome back, {userEmail}!</p>
    <Logout />
{:else}
    <p>
        Please <a href="/login">sign in</a> or <a href="/register">register</a> to
        continue.
    </p>
{/if}
<p>
    Visit <a href="https://svelte.dev/docs/kit">svelte.dev/docs/kit</a> to read the
    documentation
</p>
