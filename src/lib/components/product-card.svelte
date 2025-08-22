<script lang="ts">
    import { Button } from "$lib/components/ui/button/index.js";
    import * as Card from "$lib/components/ui/card/index.js";
    import { Star } from "lucide-svelte";

    export let product: {
        id: number;
        name: string;
        category: string;
        price: number;
        imageUrl: string;
        rating: number;
        description: string;
    };

    function addToCart(event: MouseEvent) {
        event.preventDefault();
        console.log("Added to cart:", product.name);
    }
</script>

<Card.Root class="group hover:shadow-lg transition-shadow overflow-hidden">
    <div class="aspect-video overflow-hidden bg-muted">
        <img
            src={product.imageUrl}
            alt={product.name}
            class="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
    </div>
    <Card.Header class="p-6">
        <div class="flex items-center gap-1 mb-2">
            {#each Array(5) as _, i}
                <Star
                    class={`h-4 w-4 ${i < product.rating ? "text-amber-400 fill-current" : "text-muted-foreground"}`}
                />
            {/each}
            <span class="text-sm text-muted-foreground ml-1">
                ({product.rating})
            </span>
        </div>
        <Card.Title class="text-xl font-semibold">
            {product.name}
        </Card.Title>
        <p class="text-muted-foreground mb-4">
            {product.category}
        </p>
        <div class="flex justify-between items-center">
            <span class="text-lg font-bold">
                ${product.price.toFixed(2)}
            </span>
            <Button size="sm" onclick={(e) => addToCart(e)}>Add to Cart</Button>
        </div>
    </Card.Header>
</Card.Root>
