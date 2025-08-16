<script lang="ts">
    import RegisterForm from "$lib/components/register-form.svelte";
    import { enhance } from "$app/forms";
    import type { ActionData } from "./$types";
    import * as AlertDialog from "$lib/components/ui/alert-dialog";
    import { Button } from "$lib/components/ui/button";
    import { goto } from "$app/navigation";

    export let form: ActionData;

    let showSuccessAlert = false;
</script>

<AlertDialog.Root bind:open={showSuccessAlert}>
    <AlertDialog.Content>
        <AlertDialog.Header>
            <AlertDialog.Title>Register Success</AlertDialog.Title>
            <AlertDialog.Description>
                Welcome to Digital Commerce, please login to continue
            </AlertDialog.Description>
        </AlertDialog.Header>
        <AlertDialog.Footer>
            <Button
                onclick={() => {
                    goto("/login");
                }}>Login</Button
            >
        </AlertDialog.Footer>
    </AlertDialog.Content>
</AlertDialog.Root>

<div
    class="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10"
>
    <div class="w-full max-w-sm md:max-w-3xl">
        <form
            method="POST"
            use:enhance={() => {
                return async ({ result, update }) => {
                    await update();

                    if (result.type === "success" && form?.success) {
                        showSuccessAlert = true;
                    }
                };
            }}
        >
            <RegisterForm id="register-form" {form} />
        </form>
    </div>
</div>
