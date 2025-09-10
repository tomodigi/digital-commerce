<script lang="ts">
    interface Review {
        id: string;
        author: string;
        rating: number;
        date: string;
        comment: string;
    }

    interface ChangelogItem {
        version: string;
        date: string;
        changes: string[];
    }

    interface Product {
        name: string;
        description?: string;
        specifications?: Record<string, string | string[]>;
        reviews?: Review[];
        file_type?: string;
        version?: string;
        last_updated?: string;
        compatible_browser?: string[];
        compatible_with?: string[];
        files_include?: string[];
        documentation?: string;
        changelog?: ChangelogItem[];
    }

    export let product: Product = {
        name: "Product",
        description: "",
        specifications: {},
        reviews: [],
        changelog: [],
        file_type: "",
        version: "1.0.0",
        last_updated: new Date().toISOString(),
        compatible_browser: [],
        compatible_with: [],
        files_include: [],
        documentation: "",
    };

    export let activeTab = "description";

    const tabs = [
        { id: "description", label: "Description" },
        { id: "specs", label: "Specifications" },
        { id: "files", label: "Files & Compatibility" },
        { id: "documentation", label: "Documentation" },
        { id: "changelog", label: "Changelog" },
        { id: "reviews", label: "Reviews" },
    ];

    function formatDate(dateString: string) {
        if (!dateString) return "N/A";
        const options: Intl.DateTimeFormatOptions = {
            year: "numeric",
            month: "long",
            day: "numeric",
        };
        return new Date(dateString).toLocaleDateString(undefined, options);
    }

    $: reviews =
        product?.reviews && product.reviews.length > 0
            ? product.reviews
            : getDefaultReviews();
    $: specifications =
        product?.specifications &&
        Object.keys(product.specifications).length > 0
            ? product.specifications
            : getDefaultSpecs();
    $: normalizedChangelog = (() => {
        const source = Array.isArray(product?.changelog)
            ? (product?.changelog ?? [])
            : getDefaultChangelog();
        return source.map((item) => ({
            version: item.version || "1.0.0",
            date: item.date || new Date().toISOString(),
            changes: Array.isArray(item.changes) ? item.changes : [],
        }));
    })();

    function getDefaultReviews(): Review[] {
        return [
            {
                id: "1",
                author: "Alex Johnson",
                rating: 5,
                date: new Date().toISOString(),
                comment:
                    "Amazing template! Saved me so much development time. The documentation was clear and easy to follow.",
            },
            {
                id: "2",
                author: "Sarah Miller",
                rating: 4,
                date: new Date(
                    Date.now() - 7 * 24 * 60 * 60 * 1000,
                ).toISOString(),
                comment:
                    "Great product overall, but I had some issues with the mobile responsiveness that needed extra tweaking.",
            },
        ];
    }

    function getDefaultSpecs() {
        return {
            "File Type": product.file_type || "ZIP",
            Version: product.version || "1.0.0",
            "Last Updated": formatDate(
                product.last_updated || new Date().toISOString(),
            ),
            "Compatible Browsers":
                product.compatible_browser?.join(", ") || "All modern browsers",
            "Compatible With":
                product.compatible_with?.join(", ") || "WordPress 5.0+",
            "Files Included":
                product.files_include?.join(", ") ||
                "Documentation, Source files",
        };
    }

    function getDefaultChangelog(): ChangelogItem[] {
        return [
            {
                version: "1.0.0",
                date: new Date().toISOString(),
                changes: [
                    "Initial release",
                    "Added all template files",
                    "Added documentation",
                ],
            },
        ];
    }

    function selectTab(tabId: string) {
        activeTab = tabId;
    }

    $: changelog = (normalizedChangelog ?? []) as ChangelogItem[];
</script>

<!-- Main Template -->
<div class="tabs-container">
    <!-- Tab Navigation -->
    <div class="border-b border-gray-200 mb-6">
        <nav
            class="-mb-px flex space-x-8 overflow-x-auto"
            aria-label="Product information tabs"
        >
            {#each tabs as tab}
                <button
                    type="button"
                    class="whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
                        {activeTab === tab.id
                        ? 'border-primary text-primary'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}"
                    on:click={() => selectTab(tab.id)}
                    aria-current={activeTab === tab.id ? "page" : undefined}
                >
                    {tab.label}
                </button>
            {/each}
        </nav>
    </div>

    <!-- Tab Content -->
    <div class="tab-content">
        {#if activeTab === "description"}
            <div class="prose max-w-none">
                {#if product.description}
                    {@html product.description}
                {:else}
                    <p class="text-gray-500">No description available.</p>
                {/if}

                {#if product.documentation}
                    <div class="mt-6 p-4 bg-blue-50 rounded-lg">
                        <h3 class="text-lg font-medium text-blue-800">
                            Documentation
                        </h3>
                        <p class="text-blue-700 mt-2">
                            Need help with setup or customization? Check out our
                            detailed documentation.
                        </p>
                        <a
                            href={product.documentation}
                            target="_blank"
                            rel="noopener noreferrer"
                            class="inline-flex items-center mt-2 text-blue-600 hover:text-blue-800 font-medium"
                        >
                            View Documentation
                            <svg
                                class="ml-1 h-4 w-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                                />
                            </svg>
                        </a>
                    </div>
                {/if}
            </div>
        {:else if activeTab === "specs"}
            <div class="space-y-6">
                <div>
                    <h3 class="text-lg font-medium mb-4">
                        Product Specifications
                    </h3>
                    <dl class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        {#each Object.entries(specifications || {}) as [key, value]}
                            <div class="bg-gray-50 p-4 rounded-lg">
                                <dt class="text-sm font-medium text-gray-500">
                                    {key}
                                </dt>
                                <dd class="mt-1 text-sm text-gray-900">
                                    {#if Array.isArray(value)}
                                        <ul class="list-disc pl-5 space-y-1">
                                            {#each value as item}
                                                <li>{item}</li>
                                            {/each}
                                        </ul>
                                    {:else}
                                        {value}
                                    {/if}
                                </dd>
                            </div>
                        {/each}
                    </dl>
                </div>
            </div>
        {:else if activeTab === "files"}
            <div class="space-y-6">
                <div>
                    <h3 class="text-lg font-medium mb-4">Files Included</h3>
                    <div class="bg-gray-50 p-4 rounded-lg">
                        {#if product.files_include && product.files_include.length > 0}
                            <ul class="space-y-2">
                                {#each product.files_include as file}
                                    <li class="flex items-center text-sm">
                                        <svg
                                            class="h-5 w-5 text-gray-400 mr-2"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                stroke-linecap="round"
                                                stroke-linejoin="round"
                                                stroke-width="2"
                                                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                            />
                                        </svg>
                                        {file}
                                    </li>
                                {/each}
                            </ul>
                        {:else}
                            <p class="text-gray-500">
                                No files information available.
                            </p>
                        {/if}
                    </div>
                </div>

                <div>
                    <h3 class="text-lg font-medium mb-4">Compatibility</h3>
                    <div class="bg-gray-50 p-4 rounded-lg">
                        <div class="space-y-4">
                            <div>
                                <h4 class="text-sm font-medium text-gray-500">
                                    Compatible Browsers
                                </h4>
                                <p class="mt-1 text-sm text-gray-900">
                                    {product.compatible_browser?.join(", ") ||
                                        "All modern browsers"}
                                </p>
                            </div>
                            <div>
                                <h4 class="text-sm font-medium text-gray-500">
                                    Compatible With
                                </h4>
                                <p class="mt-1 text-sm text-gray-900">
                                    {product.compatible_with?.join(", ") ||
                                        "WordPress 5.0+"}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        {:else if activeTab === "documentation"}
            <div class="prose max-w-none">
                {#if product.documentation}
                    <div
                        class="bg-blue-50 p-6 rounded-lg border border-blue-100"
                    >
                        <div class="flex">
                            <div class="flex-shrink-0">
                                <svg
                                    class="h-5 w-5 text-blue-400"
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                >
                                    <path
                                        fill-rule="evenodd"
                                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h2a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                                        clip-rule="evenodd"
                                    />
                                </svg>
                            </div>
                            <div class="ml-3">
                                <h3 class="text-lg font-medium text-blue-800">
                                    Documentation Available
                                </h3>
                                <div class="mt-2 text-sm text-blue-700">
                                    <p>
                                        Detailed documentation is available for
                                        this product, including setup
                                        instructions, customization guides, and
                                        troubleshooting tips.
                                    </p>
                                </div>
                                <div class="mt-4">
                                    <a
                                        href={product.documentation}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        class="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-500"
                                    >
                                        View Documentation
                                        <svg
                                            class="ml-1 h-4 w-4"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                stroke-linecap="round"
                                                stroke-linejoin="round"
                                                stroke-width="2"
                                                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                                            />
                                        </svg>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                {:else}
                    <div class="text-center py-12">
                        <svg
                            class="mx-auto h-12 w-12 text-gray-400"
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
                        <h3 class="mt-2 text-sm font-medium text-gray-900">
                            No documentation available
                        </h3>
                        <p class="mt-1 text-sm text-gray-500">
                            This product doesn't have any documentation yet.
                        </p>
                    </div>
                {/if}
            </div>
        {:else if activeTab === "changelog"}
            <div class="space-y-6">
                <div>
                    <h3 class="text-lg font-medium">Version History</h3>
                    <p class="text-sm text-gray-500 mt-1">
                        See what's new and improved in each version
                    </p>
                </div>

                <div class="flow-root">
                    <ul class="-mb-8">
                        {#if changelog.length === 0}
                            <li class="text-center py-8 text-gray-500">
                                No changelog available
                            </li>
                        {:else}
                            {#each changelog as item, i}
                                <li>
                                    <div class="relative pb-8">
                                        {#if i !== changelog.length - 1}
                                            <span
                                                class="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                                                aria-hidden="true"
                                            ></span>
                                        {/if}
                                        <div class="relative flex space-x-3">
                                            <div>
                                                <span
                                                    class="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center ring-8 ring-white"
                                                >
                                                    <svg
                                                        class="h-5 w-5 text-white"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        viewBox="0 0 20 20"
                                                        fill="currentColor"
                                                    >
                                                        <path
                                                            fill-rule="evenodd"
                                                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                                            clip-rule="evenodd"
                                                        />
                                                    </svg>
                                                </span>
                                            </div>
                                            <div class="min-w-0 flex-1 pt-1.5">
                                                <p
                                                    class="text-sm text-gray-500"
                                                >
                                                    Version <span
                                                        class="font-medium text-gray-900"
                                                        >{item.version}</span
                                                    >
                                                    <span
                                                        class="whitespace-nowrap"
                                                        >released on {formatDate(
                                                            item.date,
                                                        )}</span
                                                    >
                                                </p>
                                                <div
                                                    class="mt-2 text-sm text-gray-700"
                                                >
                                                    <ul
                                                        class="list-disc pl-5 space-y-1"
                                                    >
                                                        {#each item.changes as change}
                                                            <li>{change}</li>
                                                        {/each}
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </li>
                            {/each}
                        {/if}
                    </ul>
                </div>
            </div>
        {:else if activeTab === "reviews"}
            <div class="space-y-6">
                {#if reviews && reviews.length > 0}
                    <div>
                        <div class="flex items-center justify-between">
                            <h3 class="text-lg font-medium">
                                Customer Reviews
                            </h3>
                            <div class="flex items-center">
                                <div class="flex items-center">
                                    {#each [1, 2, 3, 4, 5] as star}
                                        <svg
                                            class="h-5 w-5 {star <=
                                            Math.round(
                                                reviews.reduce(
                                                    (acc, review) =>
                                                        acc + review.rating,
                                                    0,
                                                ) / reviews.length,
                                            )
                                                ? 'text-yellow-400'
                                                : 'text-gray-300'}"
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 20 20"
                                            fill="currentColor"
                                        >
                                            <path
                                                d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                                            />
                                        </svg>
                                    {/each}
                                    <span class="ml-2 text-sm text-gray-600">
                                        {(
                                            reviews.reduce(
                                                (acc, review) =>
                                                    acc + review.rating,
                                                0,
                                            ) / reviews.length
                                        ).toFixed(1)} out of 5
                                    </span>
                                </div>
                                <span class="mx-2 text-gray-300">•</span>
                                <span class="text-sm text-gray-600">
                                    {reviews.length}
                                    {reviews.length === 1
                                        ? "review"
                                        : "reviews"}
                                </span>
                            </div>
                        </div>

                        <div class="mt-8 space-y-8">
                            {#each reviews as review}
                                <div class="border-t border-gray-200 pt-8">
                                    <div class="flex items-center">
                                        <div
                                            class="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 font-medium"
                                        >
                                            {review.author
                                                .charAt(0)
                                                .toUpperCase()}
                                        </div>
                                        <div class="ml-4">
                                            <p
                                                class="text-sm font-medium text-gray-900"
                                            >
                                                {review.author}
                                            </p>
                                            <div class="mt-1 flex items-center">
                                                {#each [1, 2, 3, 4, 5] as star}
                                                    <svg
                                                        class="h-4 w-4 {star <=
                                                        review.rating
                                                            ? 'text-yellow-400'
                                                            : 'text-gray-300'}"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        viewBox="0 0 20 20"
                                                        fill="currentColor"
                                                    >
                                                        <path
                                                            d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                                                        />
                                                    </svg>
                                                {/each}
                                            </div>
                                        </div>
                                        <div
                                            class="ml-auto text-sm text-gray-500"
                                        >
                                            {formatDate(review.date)}
                                        </div>
                                    </div>
                                    <p class="mt-4 text-sm text-gray-600">
                                        {review.comment}
                                    </p>
                                </div>
                            {/each}
                        </div>
                    </div>
                {:else}
                    <div class="text-center py-12">
                        <svg
                            class="mx-auto h-12 w-12 text-gray-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="1"
                                d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                            />
                        </svg>
                        <h3 class="mt-2 text-sm font-medium text-gray-900">
                            No reviews yet
                        </h3>
                        <p class="mt-1 text-sm text-gray-500">
                            Be the first to review this product
                        </p>
                    </div>
                {/if}

                <div class="mt-8 border-t border-gray-200 pt-8">
                    <h3 class="text-lg font-medium text-gray-900">
                        Write a review
                    </h3>
                    <p class="mt-1 text-sm text-gray-600">
                        Share your thoughts with other customers
                    </p>
                    <button
                        type="button"
                        class="mt-4 inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                    >
                        Write a Review
                    </button>
                </div>
            </div>
        {/if}
    </div>
</div>
