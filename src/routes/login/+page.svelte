<script lang="ts">
    import { page } from "$app/stores";
    import Header from "$lib/components/header.svelte";
    import LoginForm from "$lib/components/login-form.svelte";

    let mobileMenuOpen = false;
</script>

<div class="min-h-svh bg-background text-foreground font-sans antialiased">
    <Header {mobileMenuOpen} />

    <main class="flex flex-col items-center justify-center bg-muted py-10">
        <div class="w-full max-w-sm px-4 sm:px-6 lg:px-8">
            <LoginForm />
        </div>
    </main>
</div>
