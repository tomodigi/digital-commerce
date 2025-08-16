<script lang="ts">
    import * as Card from "$lib/components/ui/card/index.js";
    import { Label } from "$lib/components/ui/label/index.js";
    import { Input } from "$lib/components/ui/input/index.js";
    import { Button } from "$lib/components/ui/button/index.js";
    import { cn } from "$lib/utils.js";
    import type { FormActionResult } from "../../types/form";

    let {
        id,
        class: className,
        form,
    } = $props<{
        id: string;
        class?: string;
        form: FormActionResult;
    }>();

    let password = $state("");

    const requirements = [
        {
            id: "length",
            text: "Minimum 8 characters",
            test: (p: string) => p.length >= 8,
        },
        {
            id: "lowercase",
            text: "At least 1 lowercase letter",
            test: (p: string) => /[a-z]/.test(p),
        },
        {
            id: "uppercase",
            text: "At least 1 uppercase letter",
            test: (p: string) => /[A-Z]/.test(p),
        },
        {
            id: "number",
            text: "At least 1 number",
            test: (p: string) => /\d/.test(p),
        },
    ];

    const validationResults = $derived(
        requirements.map((req) => ({
            ...req,
            isValid: password ? req.test(password) : undefined,
        })),
    );

    const passwordPattern = $derived(
        password ? "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).{8,}$" : ".*",
    );
</script>

<div class={cn("flex flex-col gap-6", className)}>
    <Card.Root class="overflow-hidden p-0">
        <Card.Content class="grid p-0">
            <div class="p-6">
                <div class="flex flex-col gap-6">
                    <div class="flex flex-col items-center text-center">
                        <h1 class="text-2xl font-bold">
                            Welcome to Digital Commerce
                        </h1>
                        <p class="text-muted-foreground text-balance">
                            Create your account
                        </p>
                    </div>

                    <div class="grid gap-1.5">
                        <div class="flex items-center gap-1">
                            <Label for="full-name-{id}">Full Name</Label>
                            <span class="text-red-500">*</span>
                        </div>
                        <Input id="full-name-{id}" name="fullName" required />
                    </div>
                    <div class="grid gap-1.5">
                        <div class="flex items-center gap-1">
                            <Label for="username-{id}">Username</Label>
                            <span class="text-red-500">*</span>
                        </div>
                        <Input id="username-{id}" name="username" required />
                    </div>
                    <div class="grid gap-1.5">
                        <div class="flex items-center gap-1">
                            <Label for="email-{id}">Email</Label>
                            <span class="text-red-500">*</span>
                        </div>
                        <Input
                            id="email-{id}"
                            name="email"
                            type="email"
                            required
                        />
                    </div>

                    <div class="grid gap-1.5">
                        <div class="flex items-center gap-1">
                            <Label for="password-{id}">Password</Label>
                            <span class="text-red-500">*</span>
                        </div>
                        <Input
                            id="password-{id}"
                            name="password"
                            type="password"
                            bind:value={password}
                            pattern={passwordPattern}
                            required
                            aria-describedby="password-help"
                        />
                        <div id="password-help" class="mt-1 space-y-1 text-xs">
                            {#each validationResults as rule (rule.id)}
                                <p
                                    class="flex items-center transition-colors"
                                    class:hidden={rule.isValid === undefined}
                                    class:text-green-500={rule.isValid === true}
                                    class:text-muted-foreground={rule.isValid ===
                                        false}
                                >
                                    <span class="mr-2 w-4 text-center">
                                        {#if rule.isValid}
                                            ✅
                                        {:else}
                                            ❌
                                        {/if}
                                    </span>
                                    {rule.text}
                                </p>
                            {/each}
                        </div>
                    </div>

                    <div class="grid gap-1.5">
                        <div class="flex items-center gap-1">
                            <Label for="confirm-password-{id}"
                                >Confirm Password</Label
                            >
                            <span class="text-red-500">*</span>
                        </div>
                        <Input
                            id="confirm-password-{id}"
                            name="confirmPassword"
                            type="password"
                            required
                        />
                    </div>

                    <Button type="submit" class="w-full">Register</Button>

                    {#if form?.message}
                        <p
                            class:text-red-500={!form.success}
                            class:text-green-500={form.success}
                            class="text-center text-sm"
                        >
                            {form.message}
                        </p>
                    {/if}
                </div>
            </div>
        </Card.Content>
    </Card.Root>
</div>
