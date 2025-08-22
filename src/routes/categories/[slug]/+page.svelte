<script lang="ts">
    import { page } from "$app/stores";
    import Header from "$lib/components/header.svelte";
    import ProductCard from "$lib/components/product-card.svelte";

    export let data;
    const { category, products } = data;
    let mobileMenuOpen = false;
    let searchQuery = "";
    let sortBy = "featured";

    $: filteredProducts = products
        .filter(product => 
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
            <h1 class="text-4xl font-bold tracking-tight mb-4 capitalize">{category} Collection</h1>
            <p class="text-lg text-muted-foreground max-w-2xl mx-auto">
                Browse our curated selection of {category.toLowerCase()} products
            </p>
        </section>

        <div class="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div class="w-full md:w-1/3">
                <input
                    type="text"
                    bind:value={searchQuery}
                    placeholder={`Search ${category.toLowerCase()}...`}
                    class="w-full px-4 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
            </div>
            <div class="w-full md:w-auto">
                <select
                    bind:value={sortBy}
                    class="w-full px-4 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                >
                    <option value="featured">Featured</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                    <option value="rating">Top Rated</option>
                </select>
            </div>
        </div>

        {#if filteredProducts.length > 0}
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {#each filteredProducts as product}
                    <ProductCard {product} />
                {/each}
            </div>
        {:else}
            <div class="text-center py-12">
                <p class="text-muted-foreground">No products found in this category.</p>
            </div>
        {/if}
    </main>
</div>
