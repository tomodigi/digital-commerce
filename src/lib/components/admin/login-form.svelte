<script lang="ts">
    import { goto } from "$app/navigation";
    import { getSupabase } from "$lib/supabase/client";
    import { userStore } from "$lib/components/session/store";
    import * as Card from "$lib/components/ui/card/index.js";
    import { Label } from "$lib/components/ui/label/index.js";
    import { Input } from "$lib/components/ui/input/index.js";
    import { Button } from "$lib/components/ui/button/index.js";
    import { cn } from "$lib/utils.js";
    import type { HTMLAttributes } from "svelte/elements";

    let { class: className, ...restProps }: HTMLAttributes<HTMLDivElement> =
        $props();

    const id = $props.id();

    let loading = $state(false);
    let email = $state("");
    let password = $state("");
    let errorMessage = $state("");

    const handleLogin = async (e: Event) => {
        e.preventDefault();
        try {
            loading = true;
            errorMessage = "";

            const supabase = await getSupabase();

            const { data: authData, error: authError } =
                await supabase.auth.signInWithPassword({
                    email,
                    password,
                });

            if (authError) throw authError;
            if (!authData.user)
                throw new Error("Login failed, user not found.");

            const { data: profile, error: profileError } = await supabase
                .from("profiles")
                .select("role, full_name")
                .eq("id", authData.user.id)
                .single();

            if (profileError) throw profileError;

            userStore.set({
                ...authData.user,
                ...profile,
            });

            if (profile.role === "admin") {
                goto("/admin/products");
            } else {
                await supabase.auth.signOut();
                userStore.set(null);
                errorMessage = "You are not authorized to access this page.";
            }
        } catch (error: any) {
            errorMessage =
                error.error_description || error.message || "Login failed";
            await (await getSupabase()).auth.signOut();
            userStore.set(null);
        } finally {
            loading = false;
        }
    };
</script>

<div class={cn("flex flex-col gap-6", className)} {...restProps}>
    <Card.Root class="overflow-hidden p-0">
        <Card.Content class="grid p-0">
            <form class="p-6" onsubmit={handleLogin}>
                <div class="flex flex-col gap-6">
                    <div class="flex flex-col items-center text-center">
                        <h1 class="text-2xl font-bold">Welcome back</h1>
                        <p class="text-muted-foreground text-balance">
                            Login to your admin Digital Commerce account
                        </p>
                    </div>

                    {#if errorMessage}
                        <div
                            class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded"
                        >
                            {errorMessage}
                        </div>
                    {/if}

                    <div class="grid gap-3">
                        <Label for="email-{id}">Email</Label>
                        <Input
                            id="email-{id}"
                            type="email"
                            placeholder="m@example.com"
                            bind:value={email}
                            required
                        />
                    </div>
                    <div class="grid gap-3">
                        <div class="flex items-center">
                            <Label for="password">Password</Label>
                            <a
                                href="/login/forgot"
                                class="ml-auto text-sm underline-offset-2 hover:underline"
                            >
                                Forgot your password?
                            </a>
                        </div>
                        <Input
                            id="password-{id}"
                            type="password"
                            bind:value={password}
                            required
                        />
                    </div>
                    <Button type="submit" class="w-full" disabled={loading}>
                        {loading ? "Signing in..." : "Login"}
                    </Button>
                </div>
            </form>
        </Card.Content>
    </Card.Root>
    <div
        class="text-muted-foreground *:[a]:hover:text-primary *:[a]:underline *:[a]:underline-offset-4 text-balance text-center text-xs"
    >
        By clicking continue, you agree to our <a href="##">Terms of Service</a>
        and
        <a href="##">Privacy Policy</a>.
    </div>
</div>
