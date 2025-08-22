<script lang="ts">
    import { page } from "$app/stores";
    import Header from "$lib/components/header.svelte";
    import RegisterForm from "$lib/components/register-form.svelte";
    import ProviderAuth from "$lib/components/provider-auth.svelte";
    import type { ActionData } from "./$types";
    import * as Card from "$lib/components/ui/card/index.js";

    export let form: ActionData;
    let mobileMenuOpen = false;
</script>

<div class="min-h-svh bg-background text-foreground font-sans antialiased">
    <Header {mobileMenuOpen} />

    <main class="flex flex-col items-center justify-center bg-muted py-10">
        <div class="w-full max-w-sm space-y-6 px-4 sm:px-6 lg:px-8">
            <Card.Root class="overflow-hidden p-0">
                <Card.Content class="grid p-0">
                    <RegisterForm id="register-form" {form} />
                    <ProviderAuth />
                </Card.Content>
            </Card.Root>
        </div>
    </main>
</div>
