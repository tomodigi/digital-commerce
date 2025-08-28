<script lang="ts">
    import { Button } from "$lib/components/ui/button/index.js";
    import type { PageData } from "./$types";

    import Header from "$lib/components/header.svelte";
    import HeroSection from "$lib/components/hero-section.svelte";
    import FeaturedProducts from "$lib/components/featured-products.svelte";
    import TestimonialsSection from "$lib/components/testimonials-section.svelte";
    import Footer from "$lib/components/footer.svelte";

    export let data: PageData;
    $: ({ featuredProducts = [], error = null } = data || {});

    let mobileMenuOpen = false;
</script>

<div class="bg-background text-foreground font-sans antialiased">
    <Header {mobileMenuOpen} />

    <main>
        <HeroSection />
        {#if error}
            <div
                class="bg-red-50 border-l-4 border-red-400 p-4 mb-8 max-w-7xl mx-auto"
            >
                <p class="text-red-700">{error}</p>
            </div>
        {/if}
        <FeaturedProducts products={featuredProducts} />
        <TestimonialsSection />

        <section class="py-16 bg-primary text-primary-foreground">
            <div
                class="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center"
            >
                <h2 class="text-3xl font-bold tracking-tight">
                    Stay Ahead of the Curve
                </h2>
                <p class="mt-2 max-w-2xl mx-auto">
                    Subscribe to our newsletter for the latest product updates,
                    deals, and insights.
                </p>
                <form class="mt-8 flex max-w-md mx-auto gap-2">
                    <input
                        type="email"
                        placeholder="Enter your email"
                        class="flex-1 bg-background text-foreground rounded-md px-4 py-2 border border-input"
                    />
                    <Button type="submit" variant="secondary">Subscribe</Button>
                </form>
            </div>
        </section>
    </main>

    <Footer />
</div>
