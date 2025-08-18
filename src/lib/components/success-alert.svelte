<script lang="ts">
    import * as AlertDialog from "$lib/components/ui/alert-dialog";
    import { Button } from "$lib/components/ui/button";
    import { goto } from "$app/navigation";

    export let open = false;
    export let title = "Success";
    export let description = "Operation completed successfully";
    export let buttonText = "Continue";
    export let redirectTo = "/";

    const handleContinue = () => {
        open = false;
        goto(redirectTo);
    };
</script>

<AlertDialog.Root bind:open>
    <AlertDialog.Content>
        <AlertDialog.Header>
            <AlertDialog.Title>{title}</AlertDialog.Title>
            <AlertDialog.Description>
                {description}
            </AlertDialog.Description>
        </AlertDialog.Header>
        <AlertDialog.Footer>
            <Button onclick={handleContinue} type="button">
                {buttonText}
            </Button>
        </AlertDialog.Footer>
    </AlertDialog.Content>
</AlertDialog.Root>
