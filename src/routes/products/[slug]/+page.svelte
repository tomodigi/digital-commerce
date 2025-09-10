<script lang="ts">
    import ProductGallery from "$lib/components/product-gallery.svelte";
    import ProductInfo from "$lib/components/product-info.svelte";
    import ProductTabs from "$lib/components/product-tabs.svelte";
    import { Card } from "$lib/components/ui/card";
    import type { PageData } from "./$types";

    export let data: PageData;
    const error = data?.error;
    const product = data?.product;
    const relatedProducts = data?.relatedProducts || [];
    const images = product?.preview ?? [];
</script>

<div class="bg-gray-50 min-h-screen">
    <div class="container mx-auto px-4 py-8">
        {#if !product && !error}
            <div class="flex justify-center items-center h-64">
                <div
                    class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"
                ></div>
            </div>
        {:else if error}
            <div
                class="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded mb-6"
                role="alert"
            >
                <p>{error}</p>
            </div>
        {:else if product}
            <nav class="text-sm mb-6">
                <ol class="flex flex-wrap items-center gap-2">
                    <li>
                        <a data-sveltekit-preload-data href="/" class="text-primary hover:underline">Home</a>
                    </li>
                    <li class="text-gray-400">/</li>
                    <li>
                        <a data-sveltekit-preload-data href="/products" class="text-primary hover:underline">Products</a>
                    </li>
                    <li class="text-gray-400">/</li>
                    <li class="text-gray-600 line-clamp-1">{product.name}</li>
                </ol>
            </nav>

            <div class="bg-white rounded-xl shadow-sm overflow-hidden mb-8">
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6">
                    <div class="lg:sticky lg:top-6">
                        <ProductGallery {images} alt={product.name} />
                    </div>

                    <div>
                        <ProductInfo {product} />
                    </div>
                </div>

                <div class="border-t border-gray-200 px-6 py-8">
                    <ProductTabs {product} />
                </div>
            </div>

            {#if relatedProducts.length > 0}
                <div class="mb-12">
                    <h2 class="text-2xl font-bold mb-6">You May Also Like</h2>
                    <div
                        class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
                    >
                        {#each relatedProducts as relatedProduct}
                            <a data-sveltekit-preload-data href="/products/{relatedProduct.slug}" class="group">
                                <Card
                                    class="h-full overflow-hidden transition-shadow hover:shadow-md"
                                >
                                    <div
                                        class="aspect-square bg-gray-100 overflow-hidden"
                                    >
                                        {#if relatedProduct.preview?.[0]}
                                            <img
                                                src={relatedProduct.preview[0]}
                                                alt={relatedProduct.name}
                                                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                loading="lazy"
                                            />
                                        {:else}
                                            <div
                                                class="w-full h-full flex items-center justify-center text-gray-400"
                                            >
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    class="h-12 w-12"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                >
                                                    <path
                                                        stroke-linecap="round"
                                                        stroke-linejoin="round"
                                                        stroke-width="1"
                                                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                                    />
                                                </svg>
                                            </div>
                                        {/if}
                                    </div>
                                    <div class="p-4">
                                        <h3
                                            class="font-medium text-gray-900 group-hover:text-primary transition-colors line-clamp-2 mb-1"
                                        >
                                            {relatedProduct.name}
                                        </h3>
                                        <div
                                            class="flex items-center justify-between"
                                        >
                                            <span
                                                class="text-primary font-semibold"
                                            >
                                                ${Number(relatedProduct.price).toFixed(2)}
                                            </span>
                                            {#if relatedProduct.stars && Number(relatedProduct.stars) > 0}
                                                <div class="flex items-center">
                                                    <span
                                                        class="text-yellow-400"
                                                        >★</span
                                                    >
                                                    <span
                                                        class="text-sm text-gray-600 ml-1"
                                                    >
                                                        {Number(relatedProduct.stars).toFixed(1)}
                                                    </span>
                                                </div>
                                            {/if}
                                        </div>
                                    </div>
                                </Card>
                            </a>
                        {/each}
                    </div>
                </div>
            {/if}
        {/if}
    </div>
</div>
