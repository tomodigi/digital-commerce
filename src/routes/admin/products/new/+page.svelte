<script lang="ts">
    import { goto } from "$app/navigation";
    import { onMount } from "svelte";
    import { getSupabase } from "$lib/supabase/client";
    import { toSlug } from "$lib/utils/product-utils";
    import * as Card from "$lib/components/ui/card/index.js";
    import { Label } from "$lib/components/ui/label/index.js";
    import { Input } from "$lib/components/ui/input/index.js";
    import { Button } from "$lib/components/ui/button/index.js";
    import Textarea from "$lib/components/ui/textarea/textarea.svelte";
    import type { Database } from "$lib/supabase/types";

    type Category = Database["public"]["Tables"]["product_categories"]["Row"];

    type FieldType =
        | "text"
        | "number"
        | "textarea"
        | "select"
        | "checkbox"
        | "url";

    interface BaseField {
        name: string;
        label: string;
        type: FieldType;
        required?: boolean;
        placeholder?: string;
    }

    interface SelectOption {
        value: string;
        label: string;
    }

    interface SelectField extends BaseField {
        type: "select";
        options: string[] | SelectOption[];
        multiple?: boolean;
    }

    interface CheckboxField extends BaseField {
        type: "checkbox";
        default?: boolean;
    }

    type Field = BaseField | SelectField | CheckboxField;

    let loading = $state(false);
    let categories = $state<Category[]>([]);
    let errorMessage = $state("");
    let selectedCategory = $state<number | null>(null);

    let browserInput = $state("");
    let compatibleInput = $state("");
    let featureInput = $state("");
    let filesInput = $state("");
    let tagInput = $state("");

    function addItem(
        fieldName:
            | "compatible_browser"
            | "compatible_with"
            | "features"
            | "files_include"
            | "tags",
    ) {
        const inputMap = {
            compatible_browser: () => {
                if (browserInput.trim()) {
                    product.compatible_browser = [
                        ...product.compatible_browser,
                        browserInput.trim(),
                    ];
                    browserInput = "";
                }
            },
            compatible_with: () => {
                if (compatibleInput.trim()) {
                    product.compatible_with = [
                        ...product.compatible_with,
                        compatibleInput.trim(),
                    ];
                    compatibleInput = "";
                }
            },
            features: () => {
                if (featureInput.trim()) {
                    product.features = [
                        ...product.features,
                        featureInput.trim(),
                    ];
                    featureInput = "";
                }
            },
            files_include: () => {
                if (filesInput.trim()) {
                    product.files_include = [
                        ...product.files_include,
                        filesInput.trim(),
                    ];
                    filesInput = "";
                }
            },
            tags: () => {
                if (tagInput.trim()) {
                    product.tags = [...product.tags, tagInput.trim()];
                    tagInput = "";
                }
            },
        };

        inputMap[fieldName]();
    }

    $effect(() => {
        const params = new URLSearchParams(window.location.search);
        const categoryId = params.get("category");
        if (categoryId && !selectedCategory) {
            selectedCategory = parseInt(categoryId, 10);
            product.category_id = selectedCategory;
        }
    });

    type ProductState = {
        name: string;
        slug: string;
        category_id: number | null;
        compatible_browser: string[];
        compatible_with: string[];
        demo_url: string;
        description: string;
        features: string[];
        file: string;
        files_include: string[];
        high_res: boolean;
        layout: string | null;
        preview: string;
        price: number;
        tags: string[];
        thumbnail: string;
        is_active: boolean;
        user_id: string;
        [key: string]:
            | string
            | number
            | boolean
            | string[]
            | null
            | undefined
            | any;
    };

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

    $effect(() => {
        if (categoryFields) {
            const multipleSelectFields = Object.values(categoryFields)
                .flat()
                .filter(
                    (field): field is SelectField =>
                        field?.type === "select" &&
                        "multiple" in field &&
                        (field as SelectField).multiple === true,
                )
                .map((field) => field.name) as (keyof ProductState)[];

            const updates = {} as Partial<ProductState>;
            for (const field of multipleSelectFields) {
                if (!Array.isArray(product[field])) {
                    updates[field] = [];
                }
            }

            if (Object.keys(updates).length > 0) {
                product = { ...product, ...updates };
            }
        }
    });

    const categoryFields: { default: Field[]; [key: number]: Field[] } = {
        default: [
            {
                name: "name",
                label: "Product Name",
                type: "text",
                required: true,
            },
            {
                name: "description",
                label: "Description",
                type: "textarea",
                required: true,
            },
            { name: "price", label: "Price", type: "number", required: true },
            {
                name: "thumbnail",
                label: "Thumbnail URL",
                type: "url",
                required: true,
            },
        ],
        1: [
            {
                name: "layout",
                label: "Layout",
                type: "select",
                options: [
                    { value: "Responsive", label: "Responsive" },
                    { value: "Fixed Width", label: "Fixed Width" },
                    { value: "Fluid", label: "Fluid" },
                ],
                required: true,
            },
            {
                name: "compatible_browser",
                label: "Compatible Browsers",
                type: "select",
                options: [
                    { value: "Chrome", label: "Chrome" },
                    { value: "Firefox", label: "Firefox" },
                    { value: "Safari", label: "Safari" },
                    { value: "Edge", label: "Edge" },
                    { value: "IE11", label: "IE11" },
                ],
                multiple: true,
            },
            {
                name: "compatible_with",
                label: "Compatible With",
                type: "select",
                options: [
                    { value: "Bootstrap 5", label: "Bootstrap 5" },
                    { value: "Tailwind CSS", label: "Tailwind CSS" },
                    { value: "React", label: "React" },
                    { value: "Vue", label: "Vue" },
                    { value: "Angular", label: "Angular" },
                ],
                multiple: true,
            },
            {
                name: "files_include",
                label: "Files Included",
                type: "select",
                options: [
                    { value: "HTML", label: "HTML" },
                    { value: "CSS", label: "CSS" },
                    { value: "JS", label: "JS" },
                    { value: "PSD", label: "PSD" },
                    { value: "Documentation", label: "Documentation" },
                ],
                multiple: true,
            },
            {
                name: "demo_url",
                label: "Demo URL",
                type: "url",
                required: true,
            },
            { name: "high_res", label: "High Resolution", type: "checkbox" },
        ],
        2: [
            {
                name: "compatible_browser",
                label: "Compatible Browsers",
                type: "select",
                options: [
                    { value: "Chrome", label: "Chrome" },
                    { value: "Firefox", label: "Firefox" },
                    { value: "Safari", label: "Safari" },
                    { value: "Edge", label: "Edge" },
                ],
                multiple: true,
            },
            {
                name: "compatible_with",
                label: "Compatible With",
                type: "select",
                options: [
                    { value: "WooCommerce", label: "WooCommerce" },
                    { value: "Elementor", label: "Elementor" },
                    { value: "Gutenberg", label: "Gutenberg" },
                    { value: "WPML", label: "WPML" },
                ],
                multiple: true,
            },
            {
                name: "files_include",
                label: "Files Included",
                type: "select",
                options: [
                    { value: "PHP", label: "PHP" },
                    { value: "CSS", label: "CSS" },
                    { value: "JS", label: "JS" },
                    { value: "PSD", label: "PSD" },
                    { value: "Documentation", label: "Documentation" },
                ],
                multiple: true,
            },
            {
                name: "demo_url",
                label: "Demo URL",
                type: "url",
                required: true,
            },
            { name: "high_res", label: "High Resolution", type: "checkbox" },
        ],
        3: [
            {
                name: "compatible_with",
                label: "Compatible With",
                type: "select",
                options: [
                    { value: "Figma", label: "Figma" },
                    { value: "Adobe XD", label: "Adobe XD" },
                    { value: "Sketch", label: "Sketch" },
                ],
                multiple: true,
            },
            {
                name: "files_include",
                label: "Files Included",
                type: "select",
                options: [
                    { value: "Figma", label: "Figma" },
                    { value: "XD", label: "XD" },
                    { value: "Sketch", label: "Sketch" },
                    { value: "SVG", label: "SVG" },
                    { value: "PDF", label: "PDF" },
                ],
                multiple: true,
            },
            {
                name: "demo_url",
                label: "Preview URL",
                type: "url",
                required: true,
            },
        ],
        4: [
            {
                name: "compatible_browser",
                label: "Compatible Browsers",
                type: "select",
                options: [
                    { value: "Chrome", label: "Chrome" },
                    { value: "Firefox", label: "Firefox" },
                    { value: "Safari", label: "Safari" },
                    { value: "Edge", label: "Edge" },
                ],
                multiple: true,
            },
            {
                name: "compatible_with",
                label: "Compatible With",
                type: "select",
                options: [
                    { value: "WordPress", label: "WordPress" },
                    { value: "Shopify", label: "Shopify" },
                    { value: "Magento", label: "Magento" },
                    { value: "React", label: "React" },
                    { value: "Vue", label: "Vue" },
                ],
                multiple: true,
            },
            {
                name: "files_include",
                label: "Files Included",
                type: "select",
                options: [
                    { value: "PHP", label: "PHP" },
                    { value: "JS", label: "JS" },
                    { value: "CSS", label: "CSS" },
                    { value: "Documentation", label: "Documentation" },
                ],
                multiple: true,
            },
            {
                name: "demo_url",
                label: "Demo URL",
                type: "url",
                required: true,
            },
        ],
        5: [
            {
                name: "files_include",
                label: "Files Included",
                type: "select",
                options: [
                    { value: "AI", label: "AI" },
                    { value: "EPS", label: "EPS" },
                    { value: "PNG", label: "PNG" },
                    { value: "SVG", label: "SVG" },
                    { value: "PDF", label: "PDF" },
                ],
                multiple: true,
            },
            { name: "high_res", label: "High Resolution", type: "checkbox" },
        ],
    };

    const currentFields = $derived([
        ...categoryFields.default,
        ...(product.category_id
            ? categoryFields[
                  product.category_id as keyof typeof categoryFields
              ] || []
            : []),
    ]);

    onMount(async () => {
        const params = new URLSearchParams(window.location.search);
        const categoryId = params.get("category");

        try {
            const supabase = await getSupabase();
            const { data: categoriesData, error } = await supabase
                .from("product_categories")
                .select("*")
                .order("name");

            if (error) throw error;
            categories = categoriesData || [];

            if (categoryId && !isNaN(parseInt(categoryId, 10))) {
                const categoryIdNum = parseInt(categoryId, 10);
                product = {
                    ...product,
                    category_id: categoryIdNum,
                    compatible_browser: product.compatible_browser || [],
                    compatible_with: product.compatible_with || [],
                    features: product.features || [],
                    files_include: product.files_include || [],
                    tags: product.tags || [],
                };
                selectedCategory = categoryIdNum;

                const url = new URL(window.location.href);
                url.searchParams.delete("category");
                window.history.replaceState({}, "", url);
            }
        } catch (error) {
            errorMessage = "Failed to load categories";
            console.error("Error loading categories:", error);
        }
    });

    const handleSubmit = async (e: Event) => {
        e.preventDefault();
        try {
            loading = true;
            errorMessage = "";

            const supabase = await getSupabase();

            const {
                data: { user },
            } = await supabase.auth.getUser();

            if (!user) {
                throw new Error("User not authenticated");
            }

            const toPgArray = (arr: any) => {
                if (!arr) return null;
                const arrayValue = Array.isArray(arr) ? arr : [arr];
                return arrayValue.length ? `{${arrayValue.join(",")}}` : null;
            };

            const payload = {
                ...product,
                slug: toSlug(product.name),
                user_id: user.id,
                category_id: product.category_id,
                features: toPgArray(product.features),
                tags: toPgArray(product.tags),
                compatible_browser: toPgArray(product.compatible_browser),
                compatible_with: toPgArray(product.compatible_with),
                files_include: toPgArray(product.files_include),
            };

            const { data, error } = await supabase
                .from("products")
                .insert([payload])
                .select()
                .single();

            if (error) throw error;

            goto("/admin/products");
        } catch (error: any) {
            errorMessage = error.message || "Failed to add product";
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
                    {#if selectedCategory}
                        <div class="space-y-2">
                            <Label>Category</Label>
                            <div class="p-2 border rounded bg-gray-50">
                                {categories.find(
                                    (c) => c.id === selectedCategory,
                                )?.name || "Loading..."}
                                <input
                                    type="hidden"
                                    name="category_id"
                                    value={selectedCategory}
                                />
                            </div>
                        </div>
                    {:else}
                        <div class="p-4 bg-yellow-50 text-yellow-800 rounded">
                            No category selected. Please add a 'category' query
                            parameter to the URL.
                        </div>
                    {/if}

                    {#each currentFields as field}
                        <div class="space-y-2">
                            <Label for={field.name}>
                                {field.label}
                                {field.required ? " *" : ""}
                            </Label>
                            {#if field.type === "text" || field.type === "url" || field.type === "number"}
                                <Input
                                    id={field.name}
                                    type={field.type}
                                    value={String(
                                        (product as any)[field.name] ??
                                            (field.type === "number"
                                                ? "0"
                                                : ""),
                                    )}
                                    oninput={(event: Event) => {
                                        const target =
                                            event.target as HTMLInputElement;
                                        (product as any)[field.name] =
                                            field.type === "number"
                                                ? target.value
                                                    ? Number(target.value)
                                                    : 0
                                                : target.value;
                                    }}
                                    placeholder={field.placeholder}
                                    required={field.required}
                                    step={field.type === "number"
                                        ? "0.01"
                                        : undefined}
                                />
                            {:else if field.type === "textarea"}
                                <Textarea
                                    id={field.name}
                                    value={String(
                                        (product as any)[field.name] ?? "",
                                    )}
                                    oninput={(event: Event) => {
                                        const target =
                                            event.target as HTMLTextAreaElement;
                                        (product as any)[field.name] =
                                            target.value;
                                    }}
                                    placeholder={field.placeholder}
                                    required={field.required}
                                    class="min-h-[100px]"
                                />
                            {:else if field.type === "select" && "options" in field}
                                {#if field.multiple}
                                    <select
                                        id={field.name}
                                        class="w-full p-2 border rounded"
                                        required={field.required}
                                        multiple
                                        onchange={(e) => {
                                            const target =
                                                e.target as HTMLSelectElement;
                                            const selected = Array.from(
                                                target.selectedOptions,
                                                (option: HTMLOptionElement) =>
                                                    option.value,
                                            );
                                            (product as any)[field.name] =
                                                selected;
                                        }}
                                    >
                                        {#each (field as SelectField).options as option}
                                            {#if typeof option === "string"}
                                                <option value={option}>
                                                    {option}
                                                </option>
                                            {:else}
                                                <option value={option.value}>
                                                    {option.label}
                                                </option>
                                            {/if}
                                        {/each}
                                    </select>
                                {:else}
                                    <select
                                        id={field.name}
                                        bind:value={product[field.name]}
                                        class="w-full p-2 border rounded"
                                        required={field.required}
                                    >
                                        {#if !field.required}
                                            <option value=""
                                                >-- Select --</option
                                            >
                                        {/if}
                                        {#each (field as SelectField).options as option}
                                            {#if typeof option === "string"}
                                                <option value={option}>
                                                    {option}
                                                </option>
                                            {:else}
                                                <option value={option.value}>
                                                    {option.label}
                                                </option>
                                            {/if}
                                        {/each}
                                    </select>
                                {/if}
                            {:else if field.type === "checkbox"}
                                <div class="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        id={field.name}
                                        checked={Boolean(
                                            (product as any)[field.name],
                                        )}
                                        onchange={(event) => {
                                            const target =
                                                event.target as HTMLInputElement;
                                            (product as any)[field.name] =
                                                target.checked;
                                        }}
                                        class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                    />
                                    <label
                                        for={field.name}
                                        class="text-sm text-gray-700"
                                    >
                                        {field.label}
                                    </label>
                                </div>
                            {/if}

                            {#if field.name === "description"}
                                <div class="text-sm text-gray-500 text-right">
                                    {String((product as any)[field.name] ?? "")
                                        .length}/1000
                                </div>
                            {/if}
                        </div>
                    {/each}

                    {#if currentFields.some((f) => f.name === "demo_url" && product.demo_url)}
                        <div class="flex items-center">
                            <a
                                href={product.demo_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                class="text-sm text-blue-600 hover:underline flex items-center gap-1"
                            >
                                <span>Open Demo in new tab</span>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    class="h-4 w-4"
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

                <div
                    class="flex flex-col sm:flex-row justify-end gap-4 pt-6 border-t"
                >
                    <Button
                        type="button"
                        variant="outline"
                        onclick={() => goto("/admin/products")}
                        disabled={loading}
                        class="w-full sm:w-auto"
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        disabled={loading}
                        class="w-full sm:w-auto bg-primary hover:bg-primary/90"
                    >
                        {#if loading}
                            <span class="inline-flex items-center gap-2">
                                <svg
                                    class="animate-spin h-4 w-4"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <circle
                                        class="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        stroke-width="4"
                                    ></circle>
                                    <path
                                        class="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                    ></path>
                                </svg>
                                Saving...
                            </span>
                        {:else}
                            Save Product
                        {/if}
                    </Button>
                </div>
            </form>
        </Card.Content>
    </Card.Root>
</div>
