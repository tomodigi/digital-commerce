<script lang="ts">
    import { page } from "$app/stores";
    import Logout from "$lib/components/logout.svelte";
    import { Button } from "$lib/components/ui/button/index.js";
    import * as NavigationMenu from "$lib/components/ui/navigation-menu/index.js";
    import { Search, ShoppingCart, Menu } from "lucide-svelte";
    import { authLoading } from "$lib/stores/auth";

    export let mobileMenuOpen = false;

    $: user = $page.data.user;
    $: userEmail = user?.email;
</script>

<header
    class="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
>
    <div
        class="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8"
    >
        <a href="/" class="flex items-center gap-2">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="h-6 w-6 text-primary"
                ><path
                    d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
                ></path></svg
            >
            <span class="text-lg font-bold">Digital Commerce</span>
        </a>

        <NavigationMenu.Root class="hidden md:flex">
            <NavigationMenu.List class="flex items-center space-x-4">
                <NavigationMenu.Item>
                    <a
                        href="/products"
                        class="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
                        >Products</a
                    >
                </NavigationMenu.Item>
                <NavigationMenu.Item>
                    <a
                        href="/categories"
                        class="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
                        >Categories</a
                    >
                </NavigationMenu.Item>
                <NavigationMenu.Item>
                    <a
                        href="/templates"
                        class="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
                        >Templates</a
                    >
                </NavigationMenu.Item>
                <NavigationMenu.Item>
                    <a
                        href="/courses"
                        class="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
                        >Courses</a
                    >
                </NavigationMenu.Item>
                <NavigationMenu.Item>
                    <a
                        href="/about"
                        class="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
                        >About</a
                    >
                </NavigationMenu.Item>
            </NavigationMenu.List>
        </NavigationMenu.Root>

        <div class="flex items-center space-x-4">
            <Button variant="ghost" size="icon">
                <Search class="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon">
                <ShoppingCart class="h-5 w-5" />
            </Button>
            {#if $authLoading}
                <div class="hidden md:flex items-center space-x-2">
                    <svg class="h-4 w-4 animate-spin text-muted-foreground" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                    </svg>
                    <span class="text-sm text-muted-foreground">Updating…</span>
                </div>
            {:else if userEmail}
                <div class="hidden md:flex items-center space-x-2">
                    <span class="text-sm font-medium">{userEmail}</span>
                    <div class="flex items-center">
                        <Logout />
                    </div>
                </div>
            {:else}
                <div class="hidden md:flex items-center space-x-2">
                    <a
                        href="/login"
                        class="text-sm font-medium hover:text-primary"
                        >Sign in</a
                    >
                    <span class="text-muted-foreground">/</span>
                    <a
                        href="/register"
                        class="text-sm font-medium hover:text-primary"
                        >Register</a
                    >
                </div>
            {/if}
            <div class="md:hidden">
                <Button
                    onclick={() => (mobileMenuOpen = !mobileMenuOpen)}
                    variant="ghost"
                    size="icon"
                >
                    <Menu class="h-5 w-5" />
                </Button>
            </div>
        </div>
    </div>
    {#if mobileMenuOpen}
        <div class="md:hidden border-t">
            <nav class="flex flex-col space-y-2 p-4">
                <a
                    href="/products"
                    class="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
                    >Products</a
                >
                <a
                    href="/templates"
                    class="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
                    >Templates</a
                >
                <a
                    href="/courses"
                    class="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
                    >Courses</a
                >
                <a
                    href="/about"
                    class="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
                    >About</a
                >
            </nav>
        </div>
    {/if}
</header>
