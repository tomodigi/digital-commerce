<script lang="ts">
    import Header from "$lib/components/header.svelte";
    import ProductCard from "$lib/components/product-card.svelte";
    import type { PageData } from './$types';

    export let data: PageData;

    let mobileMenuOpen = false;
    let searchQuery = "";
    let sortBy = "featured";

    $: filteredProducts = data.products
        .filter(
            (product) =>
                searchQuery === "" ||
                product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                product.description.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .sort((a, b) => {
            if (sortBy === "price-asc") return a.price - b.price;
            if (sortBy === "price-desc") return b.price - a.price;
            if (sortBy === "rating") return b.rating - a.rating;
            return 0;
        });
</script>

<div class="min-h-screen bg-background text-foreground font-sans antialiased">
    <Header {mobileMenuOpen} />

    <main class="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <section class="mb-12 text-center mt-12">
            <h1 class="text-4xl font-bold tracking-tight mb-4">Our Products</h1>
            <p class="text-lg text-muted-foreground max-w-2xl mx-auto">
                Discover our collection of premium digital products designed to
                help you create amazing things.
            </p>
        </section>

        <div
            class="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
        >
            <div class="w-full md:w-1/3">
                <input
                    type="text"
                    bind:value={searchQuery}
                    placeholder="Search products..."
                    class="w-full px-4 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
            </div>
            <div class="flex flex-wrap gap-4 w-full md:w-auto">
                <select
                    bind:value={sortBy}
                    class="px-4 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                >
                    <option value="featured">Featured</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                    <option value="rating">Top Rated</option>
                </select>
            </div>
        </div>

        {#if data.error}
            <div class="bg-red-50 border-l-4 border-red-400 p-4">
                <div class="flex">
                    <div class="flex-shrink-0">
                        <svg
                            class="h-5 w-5 text-red-400"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                        >
                            <path
                                fill-rule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                clip-rule="evenodd"
                            />
                        </svg>
                    </div>
                    <div class="ml-3">
                        <p class="text-sm text-red-700">{data.error}</p>
                    </div>
                </div>
            </div>
        {:else if filteredProducts.length === 0}
            <div class="text-center py-12">
                <svg
                    class="mx-auto h-12 w-12 text-muted-foreground"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="1"
                        d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                </svg>
                <h3 class="mt-2 text-sm font-medium text-foreground">
                    No products found
                </h3>
                <p class="mt-1 text-sm text-muted-foreground">
                    {searchQuery
                        ? "Try adjusting your search to find what you're looking for."
                        : "No products are currently available."}
                </p>
            </div>
        {:else}
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {#each filteredProducts as product}
                    <ProductCard {product} />
                {/each}
            </div>
        {/if}
    </main>
</div>
