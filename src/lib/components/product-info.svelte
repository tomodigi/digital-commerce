<script lang="ts">
    import { Button } from "$lib/components/ui/button";

    export let product: {
        name: string;
        price: number;
        original_price?: number;
        description?: string;
        stars?: number;
        category?: { name: string; slug: string };
        tags?: string[];
        id?: number;
        slug?: string;
        files_include?: string[];
        compatible_browser?: string[];
        compatible_with?: string[];
        file_type?: string;
        file?: string;
        version?: string;
        last_updated?: string;
        created_at?: string;
        demo_url?: string;
        features?: string[];
    };

    let quantity = 1;
    let selectedLicense = "regular";

    const licenses = [
        { id: "regular", name: "Regular License", priceMultiplier: 1 },
        { id: "extended", name: "Extended License", priceMultiplier: 2 },
    ];

    $: currentPrice = product.original_price || product.price;
    $: displayPrice =
        selectedLicense === "extended"
            ? `$${(currentPrice * 2).toFixed(2)}`
            : `$${currentPrice.toFixed(2)}`;

    function addToCart(e: MouseEvent) {
        e.preventDefault();
        console.log("Added to cart:", {
            productId: product.slug ?? String(product.id ?? ""),
            quantity,
            license: selectedLicense,
            price:
                selectedLicense === "extended"
                    ? (product.original_price || product.price) * 2
                    : product.original_price || product.price,
        });
    }

    function addToWishlist(e: MouseEvent) {
        e.preventDefault();
        console.log("Added to wishlist:", {
            productId: product.slug ?? String(product.id ?? ""),
            name: product.name,
            price:
                selectedLicense === "extended"
                    ? (product.original_price || product.price) * 2
                    : product.original_price || product.price,
        });
    }

    function increment(e: MouseEvent) {
        e.preventDefault();
        const limit = 10;
        if (quantity < limit) quantity++;
    }

    function decrement(e: MouseEvent) {
        e.preventDefault();
        if (quantity > 1) {
            quantity--;
        }
    }

    function formatDate(dateString: string) {
        if (!dateString) return "";
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    }
</script>

{#snippet ProductHeader()}
    <div>
        <h1 class="text-3xl font-bold">{product.name}</h1>
        {#if product.category}
            <p class="text-muted-foreground">
                Category:
                <a
                    href="/categories/{product.category.slug}"
                    class="text-primary hover:underline"
                >
                    {product.category.name}
                </a>
            </p>
        {/if}
        {#if product.demo_url}
            <p class="mt-2">
                <a
                    href={product.demo_url}
                    class="text-primary hover:underline"
                    target="_blank"
                    rel="noopener noreferrer">View Live Demo</a
                >
            </p>
        {/if}
    </div>
{/snippet}

{#snippet ProductRating()}
    <div class="flex items-center gap-2">
        <div class="flex items-center">
            {#each Array(5) as _, i}
                {#if i < Math.floor(product.stars || 0)}
                    <span class="text-yellow-400">★</span>
                {:else}
                    <span class="text-gray-300">★</span>
                {/if}
            {/each}
        </div>
        <span class="text-sm text-muted-foreground">
            ({product.stars || 0} reviews)
        </span>
    </div>
{/snippet}

{#snippet PriceDisplay()}
    <div class="space-y-4">
        <div class="flex items-center gap-4">
            <span class="text-3xl font-bold">{displayPrice}</span>
            {#if product.original_price}
                <span class="text-lg text-muted-foreground line-through">
                    ${(selectedLicense === "extended"
                        ? product.original_price * 2
                        : product.original_price
                    ).toFixed(2)}
                </span>
                <span
                    class="text-sm bg-green-100 text-green-800 px-2 py-0.5 rounded-full"
                >
                    {Math.round(
                        (1 - product.price / product.original_price) * 100,
                    )}% OFF
                </span>
            {/if}
        </div>
        <p class="text-sm text-green-600">Available for instant download</p>
    </div>
{/snippet}

{#snippet LicenseSelector()}
    <div class="space-y-2">
        <h3 class="font-medium">License</h3>
        <div class="grid gap-2">
            {#each licenses as license}
                <label
                    class="flex items-center gap-3 p-3 border rounded-md hover:bg-gray-50 cursor-pointer"
                >
                    <input
                        type="radio"
                        name="license"
                        bind:group={selectedLicense}
                        value={license.id}
                        class="text-primary focus:ring-primary"
                    />
                    <div class="flex-1">
                        <div class="font-medium">{license.name}</div>
                        <div class="text-sm text-muted-foreground">
                            {#if license.id === "extended"}
                                For commercial projects with multiple end
                                products
                            {:else}
                                For a single end product with paying users
                            {/if}
                        </div>
                    </div>
                    <div class="font-medium">
                        {license.id === "extended"
                            ? `$${(currentPrice * 2).toFixed(2)}`
                            : `$${currentPrice.toFixed(2)}`}
                    </div>
                </label>
            {/each}
        </div>
    </div>
{/snippet}

{#snippet QuantitySelector()}
    <div class="space-y-2">
        <h3 class="font-medium">Quantity</h3>
        <div class="flex items-center gap-4">
            <div class="flex items-center border rounded-md w-32">
                <button
                    type="button"
                    class="px-3 py-2 text-lg"
                    on:click={decrement}
                    disabled={quantity <= 1}
                >
                    -
                </button>
                <span class="flex-1 text-center">{quantity}</span>
                <button
                    type="button"
                    class="px-3 py-2 text-lg"
                    on:click={increment}
                    disabled={quantity >= 10}
                >
                    +
                </button>
            </div>
            <span class="text-sm text-muted-foreground">
                Buy more and save up to 30%
            </span>
        </div>
    </div>
{/snippet}

{#snippet ActionButtons()}
    <div class="flex gap-4 pt-2">
        <Button onclick={addToCart} class="flex-1" size="lg">
            Add to Cart - {displayPrice}
        </Button>
        <Button
            variant="outline"
            onclick={addToWishlist}
            size="lg"
            class="px-4"
            aria-label="Add to wishlist"
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="w-5 h-5"
            >
                <path
                    d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"
                />
            </svg>
            <span class="sr-only">Add to wishlist</span>
        </Button>
    </div>
{/snippet}

{#snippet ProductDetails()}
    <div class="pt-4 border-t">
        <div class="space-y-3 text-sm">
            {#if product.file_type}
                <div class="flex">
                    <span class="w-32 text-muted-foreground">File Type:</span>
                    <span class="font-medium">{product.file_type}</span>
                </div>
            {/if}
            {#if !product.file_type && product.file}
                <div class="flex">
                    <span class="w-32 text-muted-foreground">File Type:</span>
                    <span class="font-medium"
                        >{product.file.split(".").pop()?.toUpperCase() ||
                            "ZIP"}</span
                    >
                </div>
            {/if}
            {#if product.version}
                <div class="flex">
                    <span class="w-32 text-muted-foreground">Version:</span>
                    <span class="font-medium">{product.version}</span>
                </div>
            {/if}
            {#if product.last_updated || product.created_at}
                <div class="flex">
                    <span class="w-32 text-muted-foreground">Last Updated:</span
                    >
                    <span class="font-medium"
                        >{formatDate(
                            product.last_updated || product.created_at || "",
                        )}</span
                    >
                </div>
            {/if}
            {#if product.compatible_browser?.length}
                <div class="flex items-start">
                    <span class="w-32 text-muted-foreground pt-1">
                        Compatible Browsers:
                    </span>
                    <div class="flex-1">
                        <div class="flex flex-wrap gap-2">
                            {#each product.compatible_browser as browser}
                                <span
                                    class="px-2 py-1 bg-gray-100 rounded text-xs"
                                >
                                    {browser}
                                </span>
                            {/each}
                        </div>
                    </div>
                </div>
            {/if}
            {#if product.compatible_with?.length}
                <div class="flex items-start">
                    <span class="w-32 text-muted-foreground pt-1">
                        Compatible With:
                    </span>
                    <div class="flex-1">
                        <div class="flex flex-wrap gap-2">
                            {#each product.compatible_with as item}
                                <span
                                    class="px-2 py-1 bg-gray-100 rounded text-xs"
                                >
                                    {item}
                                </span>
                            {/each}
                        </div>
                    </div>
                </div>
            {/if}
            {#if product.files_include?.length}
                <div class="flex items-start">
                    <span class="w-32 text-muted-foreground pt-1">
                        Files Included:
                    </span>
                    <div class="flex-1">
                        <div class="flex flex-wrap gap-2">
                            {#each product.files_include as file}
                                <span
                                    class="px-2 py-1 bg-gray-100 rounded text-xs"
                                >
                                    {file}
                                </span>
                            {/each}
                        </div>
                    </div>
                </div>
            {/if}
            {#if product.features?.length}
                <div class="flex items-start">
                    <span class="w-32 text-muted-foreground pt-1"
                        >Features:</span
                    >
                    <div class="flex-1">
                        <div class="flex flex-wrap gap-2">
                            {#each product.features as feature}
                                <span
                                    class="px-2 py-1 bg-gray-100 rounded text-xs"
                                    >{feature}</span
                                >
                            {/each}
                        </div>
                    </div>
                </div>
            {/if}
        </div>
    </div>
{/snippet}

{#snippet ProductTags()}
    {#if product.tags?.length}
        <div class="pt-4 border-t">
            <h3 class="font-medium mb-2">Tags</h3>
            <div class="flex flex-wrap gap-2">
                {#each product.tags as tag}
                    <a
                        href="/products?tag={encodeURIComponent(tag)}"
                        class="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-full text-gray-700"
                    >
                        {tag}
                    </a>
                {/each}
            </div>
        </div>
    {/if}
{/snippet}

<div class="space-y-6">
    <!-- Product Header -->
    {@render ProductHeader()}

    <!-- Rating -->
    {@render ProductRating()}

    <!-- Price -->
    {@render PriceDisplay()}

    <!-- Description -->
    {#if product.description}
        <div class="prose max-w-none">
            {@html product.description}
        </div>
    {/if}

    <!-- License & Quantity Selector -->
    <div class="space-y-4">
        <!-- License Selection -->
        {@render LicenseSelector()}

        <!-- Quantity -->
        {@render QuantitySelector()}
    </div>

    <!-- Action Buttons -->
    {@render ActionButtons()}

    <!-- Product Details -->
    {@render ProductDetails()}

    <!-- Tags -->
    {@render ProductTags()}
</div>
