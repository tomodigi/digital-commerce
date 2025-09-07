<script lang="ts">
    import { Card, CardContent } from "$lib/components/ui/card";
    import { Button } from "$lib/components/ui/button";
    import { Image as ImageIcon, AlertCircle, Loader2 } from "lucide-svelte";
    import { cubicOut } from "svelte/easing";
    import { crossfade } from "svelte/transition";

    export let images: string[] = [];
    export let alt: string = "";

    let mainImageIndex = 0;
    let loadedImages: boolean[] = [];
    let errorImages: boolean[] = [];
    let isTransitioning = false;

    const [send, receive] = crossfade({
        duration: 200,
        easing: cubicOut,
    });

    $: if (images) {
        loadedImages = Array(images.length).fill(false);
        errorImages = Array(images.length).fill(false);
    }

    async function setMainImage(index: number) {
        if (
            isTransitioning ||
            index < 0 ||
            index >= images.length ||
            index === mainImageIndex
        ) {
            return;
        }

        isTransitioning = true;

        if (images[index]) {
            await new Promise<void>((resolve) => {
                const img = new Image();
                img.src = images[index];
                img.onload = () => {
                    loadedImages[index] = true;
                    errorImages[index] = false;
                    resolve();
                };
                img.onerror = () => {
                    errorImages[index] = true;
                    loadedImages[index] = false;
                    resolve();
                };
            });
        }

        setTimeout(() => {
            mainImageIndex = index;
            isTransitioning = false;
        }, 50);
    }

    function handleImageLoad(index: number) {
        loadedImages = [...loadedImages];
        loadedImages[index] = true;
        errorImages = [...errorImages];
        errorImages[index] = false;
    }

    function handleImageError(index: number) {
        errorImages = [...errorImages];
        errorImages[index] = true;
        loadedImages = [...loadedImages];
        loadedImages[index] = false;
    }
</script>

{#snippet MainImage()}
    <Card class="w-full overflow-hidden">
        <CardContent class="p-0">
            <div class="relative aspect-square bg-muted">
                {#if !images || images.length === 0}
                    <div
                        class="flex h-full w-full flex-col items-center justify-center gap-2 p-4 text-muted-foreground"
                    >
                        <ImageIcon class="h-12 w-12 opacity-40" />
                        <span class="text-sm">No image available</span>
                    </div>
                {:else if errorImages[mainImageIndex]}
                    <div
                        class="flex h-full w-full flex-col items-center justify-center gap-2 p-4 text-destructive"
                    >
                        <AlertCircle class="h-12 w-12" />
                        <span class="text-sm">Failed to load image</span>
                    </div>
                {:else}
                    <div class="relative h-full w-full">
                        {#each images as image, i (i)}
                            {#if i === mainImageIndex}
                                <div
                                    in:receive={{ key: i }}
                                    out:send={{ key: i }}
                                    class="absolute inset-0"
                                >
                                    <img
                                        src={image}
                                        alt={`${alt} - Image ${i + 1}`}
                                        class="h-full w-full object-contain transition-opacity duration-200"
                                        class:opacity-100={loadedImages[i] &&
                                            !errorImages[i]}
                                        class:opacity-0={!loadedImages[i] ||
                                            errorImages[i]}
                                        on:load={() => handleImageLoad(i)}
                                        on:error={() => handleImageError(i)}
                                    />
                                    {#if !loadedImages[i] && !errorImages[i]}
                                        <div
                                            class="absolute inset-0 flex items-center justify-center bg-background/80"
                                        >
                                            <Loader2
                                                class="h-6 w-6 animate-spin text-muted-foreground"
                                            />
                                        </div>
                                    {/if}
                                </div>
                            {/if}
                        {/each}
                    </div>
                {/if}
            </div>
        </CardContent>
    </Card>
{/snippet}

{#snippet Thumbnails()}
    {#if images && images.length > 1}
        <div class="flex gap-2 overflow-x-auto py-1">
            {#each images as image, i}
                <Button
                    variant="ghost"
                    size="icon"
                    class="h-16 w-16 shrink-0 overflow-hidden rounded-md p-0 transition-all duration-200 ease-in-out {i ===
                    mainImageIndex
                        ? 'ring-2 ring-primary scale-105'
                        : 'opacity-70 hover:opacity-100'}"
                    onclick={() => setMainImage(i)}
                    aria-label={`View image ${i + 1} of ${images.length}`}
                    aria-current={i === mainImageIndex ? "true" : undefined}
                >
                    {#if errorImages[i]}
                        <div
                            class="flex h-full w-full items-center justify-center bg-destructive/10 text-destructive"
                        >
                            <AlertCircle class="h-5 w-5" />
                        </div>
                    {:else}
                        <img
                            src={image}
                            alt=""
                            loading="lazy"
                            class="h-full w-full object-cover"
                            class:opacity-70={i !== mainImageIndex}
                            on:load={() => handleImageLoad(i)}
                            on:error={() => handleImageError(i)}
                        />
                    {/if}
                </Button>
            {/each}
        </div>
    {/if}
{/snippet}

<div class="flex w-full flex-col gap-4 p-4">
    <!-- Main Image -->
    {@render MainImage()}

    <!-- Thumbnails -->
    {@render Thumbnails()}
</div>
