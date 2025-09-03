<script lang="ts">
    import { goto } from "$app/navigation";
    import { onMount } from "svelte";
    import * as Card from "$lib/components/ui/card/index.js";
    import { Label } from "$lib/components/ui/label/index.js";
    import { Input } from "$lib/components/ui/input/index.js";
    import { Button } from "$lib/components/ui/button/index.js";
    import Textarea from "$lib/components/ui/textarea/textarea.svelte";
    import type {
        Category,
        ProductState,
        SelectField,
    } from "$lib/types/product";
    import { categoryFields } from "$lib/utils/product/form-fields";
    import {
        fetchCategories,
        fetchProduct,
        updateProduct,
    } from "$lib/utils/product/product-services";

    let loading = $state(false);
    let isLoading = $state(true);
    let categories = $state<Category[]>([]);
    let errorMessage = $state("");
    let selectedCategory = $state<number | null>(null);

    let selectedThumbnail = $state<File | null>(null);
    let thumbnailPreview = $state<string | null>(null);
    let previewZipFile = $state<File | null>(null);
    let productZipFile = $state<File | null>(null);

    let feature1 = $state("");
    let feature2 = $state("");
    let feature3 = $state("");

    let tag1 = $state("");

    let product = $state<ProductState>({
        id: "",
        name: "",
        slug: "",
        category_id: null,
        compatible_browser: [],
        compatible_with: [],
        demo_url: "",
        description: "",
        features: [],
        file: "",
        files_include: [],
        high_res: false,
        layout: null,
        preview: "",
        price: 0,
        tags: [],
        thumbnail: "",
        is_active: true,
        user_id: "",
        stars: 0,
    });

    // --- Derived State ---
    const currentFields = $derived([
        ...categoryFields.default,
        ...(product.category_id
            ? categoryFields[product.category_id] || []
            : []),
    ]);

    onMount(async () => {
        try {
            const pathParts = window.location.pathname.split("/");
            const productId = pathParts[pathParts.length - 1];

            if (!productId) {
                throw new Error("Product ID is missing from URL");
            }

            const categoriesData = await fetchCategories();
            categories = categoriesData;
            const productData = await fetchProduct(productId);

            product = {
                ...productData,
                category_id: productData.category_id || null,
            };

            selectedCategory = productData.category_id;

            if (productData.features && productData.features.length > 0) {
                [feature1 = "", feature2 = "", feature3 = ""] =
                    productData.features;
            }

            if (productData.tags && productData.tags.length > 0) {
                tag1 = productData.tags.join(", ");
            }

            isLoading = false;
        } catch (error) {
            errorMessage =
                error instanceof Error
                    ? error.message
                    : "An unknown error occurred while loading product data.";
            isLoading = false;
        }
    });

    const handleThumbnailChange = (event: Event) => {
        const target = event.target as HTMLInputElement;
        const file = target.files?.[0];
        if (file) {
            selectedThumbnail = file;
            const reader = new FileReader();
            reader.onload = (e) => {
                thumbnailPreview = e.target?.result as string;
            };
            reader.readAsDataURL(file);
        }
    };

    const handlePreviewZipChange = (event: Event) => {
        try {
            const target = event.target as HTMLInputElement;
            const file = target.files?.[0];

            if (file && file.name.endsWith(".zip")) {
                previewZipFile = file;
                errorMessage = "";
            } else {
                previewZipFile = null;
                target.value = "";
                errorMessage = "Please upload a valid ZIP file.";
            }
        } catch (error) {
            console.error("Error in handlePreviewZipChange:", error);
            errorMessage = "An error occurred while processing the ZIP file.";
        }
    };

    const handleProductFileChange = (event: Event) => {
        const target = event.target as HTMLInputElement;
        const file = target.files?.[0];
        if (file && file.name.endsWith(".zip")) {
            productZipFile = file;
            errorMessage = "";
        } else {
            productZipFile = null;
            target.value = "";
            errorMessage = "Please upload a valid ZIP file.";
        }
    };

    const handleSubmit = async (event: Event) => {
        event.preventDefault();
        loading = true;
        errorMessage = "";

        const features = [feature1, feature2, feature3].filter(
            (f) => f.trim() !== "",
        );
        const tags = tag1
            .split(/[,\s]+/)
            .map((t) => t.trim())
            .filter((t) => t !== "");

        try {
            if (!product.id) {
                throw new Error("Product ID is missing");
            }

            const productUpdate = {
                ...product,
                features,
                tags,
                category_id: Number(selectedCategory),
            };

            if ("category" in productUpdate) {
                delete productUpdate.category;
            }

            await updateProduct(
                product.id.toString(),
                productUpdate,
                selectedThumbnail,
                previewZipFile,
                productZipFile,
            );

            goto("/admin/products");
        } catch (error) {
            errorMessage =
                error instanceof Error
                    ? error.message
                    : "Failed to update product. Please try again.";
            console.error("Update error:", error);
        } finally {
            loading = false;
        }
    };
</script>

<div class="container mx-auto py-8 px-4">
    <div class="flex items-center justify-between mb-8">
        <h1 class="text-2xl font-bold">Edit Product</h1>
        <Button variant="outline" onclick={() => goto("/admin/products")}>
            Back to Products
        </Button>
    </div>

    <Card.Root class="max-w-3xl mx-auto">
        <Card.Header>
            <Card.Title>Edit Product Information</Card.Title>
            <Card.Description>
                Update the details of your product
            </Card.Description>
        </Card.Header>
        <Card.Content>
            {#if errorMessage}
                <div
                    class="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded"
                >
                    {errorMessage}
                </div>
            {/if}

            {#if isLoading}
                <div class="flex justify-center py-8">
                    <div
                        class="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"
                    ></div>
                </div>
            {:else}
                <form onsubmit={handleSubmit} class="space-y-6">
                    <div class="grid grid-cols-1 gap-6">
                        <div class="space-y-2">
                            <Label for="category">Category *</Label>
                            <select
                                id="category"
                                class="flex h-10 w-full rounded-md border border-input bg-muted/50 px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                bind:value={selectedCategory}
                                disabled
                            >
                                <option value="">Select a category</option>
                                {#each categories as category}
                                    <option
                                        value={category.id}
                                        selected={category.id ===
                                            selectedCategory}
                                    >
                                        {category.name}
                                    </option>
                                {/each}
                            </select>
                        </div>

                        {#if selectedCategory}
                            {#each currentFields as field (field.name)}
                                <div class="space-y-2">
                                    <Label for={field.name}>
                                        {field.label}
                                        {field.required ? " *" : ""}
                                    </Label>

                                    {#if field.type === "text" || field.type === "number" || field.type === "url"}
                                        <Input
                                            type={field.type}
                                            id={field.name}
                                            name={field.name}
                                            bind:value={product[field.name]}
                                            required={field.required}
                                            placeholder={field.placeholder}
                                        />
                                    {:else if field.type === "textarea"}
                                        <Textarea
                                            id={field.name}
                                            name={field.name}
                                            bind:value={
                                                product[field.name] as string
                                            }
                                            required={field.required}
                                            placeholder={field.placeholder}
                                            rows={4}
                                        />
                                    {:else if field.type === "select"}
                                        {@const sf = field as SelectField}
                                        {#if sf.multiple}
                                            <select
                                                id={sf.name}
                                                name={sf.name}
                                                multiple
                                                class="flex h-16 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                                bind:value={
                                                    product[sf.name] as string[]
                                                }
                                            >
                                                {#each sf.options as option}
                                                    <option
                                                        value={typeof option ===
                                                        "object"
                                                            ? option.value
                                                            : option}
                                                    >
                                                        {typeof option ===
                                                        "object"
                                                            ? option.label
                                                            : option}
                                                    </option>
                                                {/each}
                                            </select>
                                        {:else}
                                            <select
                                                id={sf.name}
                                                name={sf.name}
                                                class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                                bind:value={product[sf.name]}
                                            >
                                                {#each sf.options as option}
                                                    <option
                                                        value={typeof option ===
                                                        "object"
                                                            ? option.value
                                                            : option}
                                                    >
                                                        {typeof option ===
                                                        "object"
                                                            ? option.label
                                                            : option}
                                                    </option>
                                                {/each}
                                            </select>
                                        {/if}
                                    {:else if field.type === "checkbox"}
                                        <div class="flex items-center gap-2">
                                            <input
                                                id={field.name}
                                                type="checkbox"
                                                class="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                                                bind:checked={
                                                    product[
                                                        field.name
                                                    ] as boolean
                                                }
                                            />
                                            <Label
                                                for={field.name}
                                                class="text-sm font-medium"
                                            >
                                                {field.label}
                                            </Label>
                                        </div>
                                    {:else if field.type === "file"}
                                        <Input
                                            id={field.name}
                                            type="file"
                                            accept={field.accept}
                                            required={field.required}
                                            onchange={field.name === "thumbnail"
                                                ? handleThumbnailChange
                                                : field.name === "file"
                                                  ? handleProductFileChange
                                                  : handlePreviewZipChange}
                                            class="block w-full h-fit text-sm text-gray-500
                                                file:mr-4 file:mb-1 file:py-2 file:px-4
                                                file:rounded-md file:border-0
                                                file:text-sm file:font-semibold
                                                file:bg-primary file:text-white
                                                hover:file:bg-primary-dark"
                                        />
                                        {#if field.name === "thumbnail" && thumbnailPreview}
                                            <img
                                                src={thumbnailPreview}
                                                alt="Thumbnail preview"
                                                class="mt-2 h-32 w-32 object-cover rounded border"
                                            />
                                        {/if}
                                    {:else if field.type === "features"}
                                        <div class="space-y-4">
                                            <div class="grid grid-cols-1 gap-4">
                                                <div class="space-y-2">
                                                    <Input
                                                        id="feature1"
                                                        type="text"
                                                        placeholder="Enter feature 1"
                                                        bind:value={feature1}
                                                    />
                                                </div>
                                                <div class="space-y-2">
                                                    <Input
                                                        id="feature2"
                                                        type="text"
                                                        placeholder="Enter feature 2"
                                                        bind:value={feature2}
                                                    />
                                                </div>
                                                <div class="space-y-2">
                                                    <Input
                                                        id="feature3"
                                                        type="text"
                                                        placeholder="Enter feature 3"
                                                        bind:value={feature3}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    {:else if field.type === "tags"}
                                        <div class="space-y-4">
                                            <div class="space-y-2">
                                                <Input
                                                    id="tags"
                                                    type="text"
                                                    placeholder="Enter tags separated by spaces or commas (e.g., web design, responsive modern)"
                                                    bind:value={tag1}
                                                />
                                            </div>
                                        </div>
                                    {/if}
                                </div>
                            {/each}
                        {/if}
                    </div>

                    <div
                        class="flex flex-col sm:flex-row justify-end gap-4 pt-6 border-t"
                    >
                        <Button
                            type="button"
                            variant="outline"
                            onclick={() => goto("/admin/products")}
                            disabled={loading}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={loading}>
                            {#if loading}
                                <span class="mr-2">Updating...</span>
                            {:else}
                                Update Product
                            {/if}
                        </Button>
                    </div>
                </form>
            {/if}
        </Card.Content>
    </Card.Root>
</div>
