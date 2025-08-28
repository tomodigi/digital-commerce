<script lang="ts">
    import { Star } from "lucide-svelte";
    import * as Card from "$lib/components/ui/card/index.js";
    import { Button } from "$lib/components/ui/button/index.js";

    export let products: Array<{
        id: number;
        name: string;
        category: string;
        price: number;
        imageUrl: string;
        rating: number;
    }> = [];

    $: isLoading = products.length === 0;
    $: error = '';
</script>

<section class="py-20">
    <div class="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-12">
            <h2 class="text-3xl font-bold tracking-tight mb-4">
                Featured Products
            </h2>
            <p class="text-muted-foreground max-w-2xl mx-auto">
                Discover our hand-picked selection of premium digital products
                for creators and professionals.
            </p>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {#each products as product (product.id)}
                <Card.Root
                    class="group hover:shadow-md transition-shadow h-full flex flex-col"
                >
                    <div
                        class="aspect-video overflow-hidden rounded-t-lg bg-muted"
                    >
                        <img
                            src={product.imageUrl}
                            alt={product.name}
                            class="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                            loading="lazy"
                        />
                    </div>
                    <div class="flex-grow">
                        <Card.Header class="p-4">
                            <div class="flex items-center gap-1 mb-1">
                                {#each Array(5) as _, i}
                                    <Star
                                        class={`h-4 w-4 ${i < product.rating ? "text-amber-400 fill-current" : "text-muted-foreground"}`}
                                    />
                                {/each}
                            </div>
                            <Card.Title class="text-lg font-medium">{product.name}</Card.Title>
                            <Card.Description class="text-sm text-muted-foreground">
                                {product.category}
                            </Card.Description>
                        </Card.Header>
                    </div>
                    <Card.Footer class="flex justify-between items-center p-4 pt-0 mt-auto">
                        <span class="text-lg font-semibold">${product.price.toFixed(2)}</span>
                        <Button size="sm">Add to Cart</Button>
                    </Card.Footer>
                </Card.Root>
            {/each}
        </div>
        <div class="mt-12 text-center">
            <a
                href="/products"
                class="inline-flex items-center justify-center px-6 py-3 text-base font-medium rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground transition-colors"
            >
                View All Products
            </a>
        </div>
    </div>
</section>
