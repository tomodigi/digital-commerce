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
        addProduct,
    } from "$lib/utils/product/product-services";

    let loading = $state(false);
    let isLoading = $state(true);
    let categories = $state<Category[]>([]);
    let errorMessage = $state("");
    let selectedCategory = $state<number | null>(null);

    let selectedThumbnail = $state<File | null>(null);
    let thumbnailPreview = $state<string | null>(null);
    let previewZipFile = $state<File | null>(null);

    let product = $state<ProductState>({
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
            categories = await fetchCategories();
            isLoading = false;

            const params = new URLSearchParams(window.location.search);
            const categoryId = params.get("category");
            if (categoryId) {
                const categoryIdNum = parseInt(categoryId, 10);
                if (
                    !isNaN(categoryIdNum) &&
                    categories.some((c) => c.id === categoryIdNum)
                ) {
                    selectedCategory = categoryIdNum;
                    product.category_id = categoryIdNum;
                }

                const url = new URL(window.location.href);
                url.searchParams.delete("category");
                window.history.replaceState({}, "", url);
            }
        } catch (error) {
            errorMessage =
                error instanceof Error
                    ? error.message
                    : "An unknown error occurred.";
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
    };

    const handleSubmit = async (event: Event) => {
        event.preventDefault();
        loading = true;
        errorMessage = "";
        try {
            await addProduct(product, selectedThumbnail, previewZipFile);
            goto("/admin/products");
        } catch (error: any) {
            errorMessage =
                error.message ||
                "Failed to add product. Please check the console for details.";
            console.error("Error adding product:", error);
        } finally {
            loading = false;
        }
    };
</script>

<div class="container mx-auto py-8 px-4">
    <div class="flex items-center justify-between mb-8">
        <h1 class="text-2xl font-bold">Add New Product</h1>
        <Button variant="outline" onclick={() => goto("/admin/products")}>
            Back to Products
        </Button>
    </div>

    <Card.Root class="max-w-3xl mx-auto">
        <Card.Header>
            <Card.Title>Product Information</Card.Title>
            <Card.Description
                >Fill in the details of your new product</Card.Description
            >
        </Card.Header>
        <Card.Content>
            {#if errorMessage}
                <div
                    class="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded"
                >
                    {errorMessage}
                </div>
            {/if}

            <form onsubmit={handleSubmit} class="space-y-6">
                <div class="grid grid-cols-1 gap-6">
                    {#if isLoading}
                        <div class="flex justify-center py-8">
                            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                        </div>
                    {:else if selectedCategory}
                        <div class="space-y-2">
                            <Label>Category</Label>
                            <div class="p-2 border rounded bg-gray-50">
                                {categories.find(
                                    (c) => c.id === selectedCategory,
                                )?.name || "Loading..."}
                            </div>
                        </div>
                    {:else}
                        <div class="p-4 bg-yellow-50 text-yellow-800 rounded">
                            No category selected. Go back and select a category
                            to begin.
                        </div>
                    {/if}

                    <!-- Dynamic Form Fields -->
                    {#if selectedCategory}
                        {#each currentFields as field (field.name)}
                            <div class="space-y-2">
                                <Label for={field.name}>
                                    {field.label}
                                    {field.required ? " *" : ""}
                                </Label>

                                {#if field.type === "text" || field.type === "url" || field.type === "number"}
                                    <Input
                                        id={field.name}
                                        type={field.type}
                                        bind:value={product[field.name]}
                                        placeholder={field.placeholder}
                                        required={field.required}
                                        step={field.type === "number"
                                            ? "0.01"
                                            : undefined}
                                    />
                                {:else if field.type === "textarea"}
                                    <Textarea
                                        id={field.name}
                                        bind:value={
                                            product[field.name] as string
                                        }
                                        placeholder={field.placeholder}
                                        required={field.required}
                                        class="min-h-[120px]"
                                    />
                                    {#if field.name === "description"}
                                        <p
                                            class="text-sm text-gray-500 text-right"
                                        >
                                            {String(product.description ?? "")
                                                .length}/1000
                                        </p>
                                    {/if}
                                {:else if field.type === "select"}
                                    {@const sf = field as SelectField}
                                    {#if sf.multiple}
                                        <select
                                            id={sf.name}
                                            bind:value={product[sf.name]}
                                            required={sf.required}
                                            multiple
                                            class="flex min-h-content w-full items-start justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                        >
                                            {#each sf.options as option}
                                                <option
                                                    value={typeof option ===
                                                    "string"
                                                        ? option
                                                        : option.value}
                                                >
                                                    {typeof option === "string"
                                                        ? option
                                                        : option.label}
                                                </option>
                                            {/each}
                                        </select>
                                    {:else}
                                        <select
                                            id={sf.name}
                                            bind:value={product[sf.name]}
                                            required={sf.required}
                                            class="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                        >
                                            {#if !sf.required}
                                                <option value=""
                                                    >-- Select an option --</option
                                                >
                                            {/if}
                                            {#each sf.options as option}
                                                <option
                                                    value={typeof option ===
                                                    "string"
                                                        ? option
                                                        : option.value}
                                                >
                                                    {typeof option === "string"
                                                        ? option
                                                        : option.label}
                                                </option>
                                            {/each}
                                        </select>
                                    {/if}
                                {:else if field.type === "file"}
                                    <Input
                                        id={field.name}
                                        type="file"
                                        accept={field.accept}
                                        required={field.required}
                                        onchange={field.name === "thumbnail"
                                            ? handleThumbnailChange
                                            : handlePreviewZipChange}
                                    />
                                    {#if field.name === "thumbnail" && thumbnailPreview}
                                        <img
                                            src={thumbnailPreview}
                                            alt="Thumbnail preview"
                                            class="mt-2 h-32 w-32 object-cover rounded border"
                                        />
                                    {/if}
                                {:else if field.type === "checkbox"}
                                    <div class="flex items-center gap-2">
                                        <input
                                            id={field.name}
                                            type="checkbox"
                                            bind:checked={
                                                product[field.name] as boolean
                                            }
                                            class="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                                        />
                                        <Label
                                            for={field.name}
                                            class="font-normal"
                                            >{field.label}</Label
                                        >
                                    </div>
                                {/if}
                            </div>
                        {/each}
                    {/if}
                </div>

                <!-- Form Actions -->
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
                    <Button
                        type="submit"
                        disabled={loading || !selectedCategory}
                    >
                        {#if loading}
                            <span>Saving...</span>
                        {:else}
                            Save Product
                        {/if}
                    </Button>
                </div>
            </form>
        </Card.Content>
    </Card.Root>
</div>
