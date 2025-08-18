<script lang="ts">
    import RegisterForm from "$lib/components/register-form.svelte";
    import ProviderAuth from "$lib/components/provider-auth.svelte";
    import type { ActionData } from "./$types";
    import * as Card from "$lib/components/ui/card/index.js";

    export let form: ActionData;
</script>

<div
    class="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10"
>
    <div class="w-full max-w-sm space-y-6 md:max-w-3xl">
        <Card.Root class="overflow-hidden p-0">
            <Card.Content class="grid p-0">
                <RegisterForm id="register-form" {form} />
                <ProviderAuth />
            </Card.Content>
        </Card.Root>
    </div>
</div>
