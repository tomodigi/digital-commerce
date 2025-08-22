<script lang="ts">
    import { page } from "$app/stores";
    import Header from "$lib/components/header.svelte";
    import ProductCard from "$lib/components/product-card.svelte";

    let mobileMenuOpen = false;

    const products = [
        {
            id: 1,
            name: "Digital Art Masterclass",
            category: "Online Course",
            price: 49.99,
            imageUrl:
                "https://placehold.co/600x400/7c3aed/ffffff?text=Art+Course",
            rating: 5,
            description:
                "Learn digital art from industry professionals with this comprehensive course.",
        },
        {
            id: 2,
            name: "Productivity Planner Pro",
            category: "Digital Template",
            price: 14.99,
            imageUrl: "https://placehold.co/600x400/16a34a/ffffff?text=Planner",
            rating: 4,
            description:
                "Organize your life and boost productivity with our premium planner.",
        },
        {
            id: 3,
            name: "Minimalist Icon Set",
            category: "Design Asset",
            price: 24.0,
            imageUrl: "https://placehold.co/600x400/0284c7/ffffff?text=Icons",
            rating: 5,
            description:
                "A clean and modern icon set for your next design project.",
        },
        {
            id: 4,
            name: "E-book: The Future of AI",
            category: "E-book",
            price: 9.99,
            imageUrl: "https://placehold.co/600x400/db2777/ffffff?text=E-book",
            rating: 4,
            description:
                "Explore the future of artificial intelligence in this comprehensive guide.",
        },
        {
            id: 5,
            name: "Web Development Starter Kit",
            category: "Template",
            price: 29.99,
            imageUrl: "https://placehold.co/600x400/f59e0b/ffffff?text=Web+Dev",
            rating: 5,
            description: "Everything you need to start your next web project.",
        },
        {
            id: 6,
            name: "Mobile UI Kit",
            category: "Design Asset",
            price: 34.99,
            imageUrl:
                "https://placehold.co/600x400/10b981/ffffff?text=Mobile+UI",
            rating: 4,
            description:
                "Beautiful UI components for your next mobile app design.",
        },
    ];

    let searchQuery = "";
    let selectedCategory = "all";
    let sortBy = "featured";

    const categories = ["all", ...new Set(products.map((p) => p.category))];

    $: filteredProducts = products
        .filter(
            (product) =>
                (selectedCategory === "all" ||
                    product.category === selectedCategory) &&
                (searchQuery === "" ||
                    product.name
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase()) ||
                    product.description
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase())),
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
                    bind:value={selectedCategory}
                    class="px-4 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                >
                    {#each categories as category}
                        <option value={category}>
                            {category.charAt(0).toUpperCase() +
                                category.slice(1)}
                        </option>
                    {/each}
                </select>
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

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {#each filteredProducts as product}
                <ProductCard {product} />
            {/each}
        </div>
    </main>
</div>
