<script lang="ts">
    import { Button } from "$lib/components/ui/button/index.js";
    import * as Card from "$lib/components/ui/card/index.js";
    import { Star } from "lucide-svelte";

    export let product: {
        id: number;
        name: string;
        slug: string;
        category?: string;
        price: number;
        imageUrl: string;
        stars: number;
        description: string;
    };

    $: displayCategory = product.category || "Uncategorized";

    function addToCart(event: MouseEvent) {
        event.preventDefault();
    }
</script>

<Card.Root class="group hover:shadow-lg transition-shadow overflow-hidden">
    <a href={`/products/${product.slug}`} class="block">
        <div class="aspect-video overflow-hidden bg-muted">
            <img
                src={product.imageUrl}
                alt={product.name}
                class="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
        </div>
        <Card.Header class="p-6">
            <span class="text-sm text-muted-foreground mb-2 block"
                >{displayCategory}</span
            >
            <div class="flex items-center gap-1">
                {#each Array(5) as _, i}
                    <Star
                        class={`h-4 w-4 ${i < product.stars ? "text-amber-400 fill-current" : "text-muted-foreground"}`}
                    />
                {/each}
                <span class="text-sm text-muted-foreground ml-1">
                    ({product.stars})
                </span>
            </div>
            <Card.Title
                class="text-xl font-semibold hover:text-primary transition-colors"
            >
                {product.name}
            </Card.Title>
            <p class="text-muted-foreground mb-4">
                {product.category}
            </p>
            <div class="flex justify-between items-center">
                <span class="text-lg font-bold">
                    ${product.price.toFixed(2)}
                </span>
                <Button size="sm" onclick={(e) => addToCart(e)}
                    >Add to Cart</Button
                >
            </div>
        </Card.Header>
    </a>
</Card.Root>
