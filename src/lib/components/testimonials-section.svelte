<script lang="ts">
    import { Star } from "lucide-svelte";

    const testimonials = [
        {
            name: "Alice Johnson",
            handle: "@alicej",
            text: "This platform has the best digital goods I've ever seen. The quality is unmatched and the prices are fantastic!",
            imageUrl: "https://placehold.co/100x100/f97316/ffffff?text=A",
        },
        {
            name: "Ben Carter",
            handle: "@bencarter",
            text: "I purchased the productivity planner and it has completely changed my workflow. Highly recommended for everyone.",
            imageUrl: "https://placehold.co/100x100/3b82f6/ffffff?text=B",
        },
        {
            name: "Clara Dunne",
            handle: "@clarad",
            text: "As a designer, finding high-quality assets is tough. The icon set I bought here is now a staple in my toolkit.",
            imageUrl: "https://placehold.co/100x100/8b5cf6/ffffff?text=C",
        },
    ];
</script>

<section class="py-20 bg-muted/30">
    <div class="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 class="text-3xl font-bold tracking-tight text-center mb-12">
            What Our Customers Say
        </h2>
        <div class="grid md:grid-cols-3 gap-8">
            {#each testimonials as testimonial}
                <div class="bg-background rounded-lg p-6 shadow-sm">
                    <div class="flex items-center gap-3 mb-4">
                        <img
                            src={testimonial.imageUrl}
                            alt={testimonial.name}
                            class="h-12 w-12 rounded-full"
                        />
                        <div>
                            <p class="font-medium">{testimonial.name}</p>
                            <p class="text-sm text-muted-foreground">{testimonial.handle}</p>
                        </div>
                    </div>
                    <p class="text-muted-foreground mb-4">"{testimonial.text}"</p>
                    <div class="flex text-amber-400">
                        {#each Array(5) as _, i}
                            <Star
                                class={`h-4 w-4 ${i < 5 ? 'fill-current' : ''}`}
                                fill={i < 5 ? 'currentColor' : 'none'}
                            />
                        {/each}
                    </div>
                </div>
            {/each}
        </div>
    </div>
</section>
