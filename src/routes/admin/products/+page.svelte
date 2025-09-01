<script lang="ts">
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";
  import { getSupabase } from "$lib/supabase/client";
  import * as Table from "$lib/components/ui/table/index.js";
  import { Button } from "$lib/components/ui/button/index.js";
  import { Badge } from "$lib/components/ui/badge/index.js";
  import * as Select from "$lib/components/ui/select/index.js";
  import { formatCurrency } from "$lib/utils.js";
  import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
  } from "$lib/components/ui/alert-dialog";
  import type { Database } from "$lib/supabase/types";

  type Product = Database["public"]["Tables"]["products"]["Row"];

  let products = $state<Product[]>([]);
  let categories = $state<{ id: string; name: string }[]>([]);
  let selectedCategory = $state<string>("");
  let loading = $state(true);
  let error = $state<string | null>(null);
  let isDeleting = $state(false);

  onMount(async () => {
    try {
      const supabase = await getSupabase();

      const { data: categoriesData, error: categoriesError } = await supabase
        .from("product_categories")
        .select("id, name")
        .order("name");

      if (categoriesError) throw categoriesError;
      categories = categoriesData || [];

      const { data: productsData, error: productsError } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });

      if (productsError) throw productsError;
      products = productsData || [];
    } catch (e) {
      error = e instanceof Error ? e.message : "Failed to load data";
      console.error("Error:", e);
    } finally {
      loading = false;
    }
  });

  const handleEdit = (productId: number) => {
    goto(`/admin/products/edit/${productId}`);
  };

  let showDeleteDialog = $state(false);
  let productToDelete = $state<number | null>(null);

  const handleDelete = async (productId: number) => {
    productToDelete = productId;
    showDeleteDialog = true;
  };

  const confirmDelete = async () => {
    if (productToDelete === null) return;

    const productId = productToDelete;
    isDeleting = true;
    error = null;

    try {
      const supabase = await getSupabase();

      const { data: product, error: fetchError } = await supabase
        .from("products")
        .select("slug, thumbnail, preview, file")
        .eq("id", productId)
        .single();

      if (fetchError) throw fetchError;
      if (!product) throw new Error("Product not found");

      const filesToDelete: string[] = [];

      const extractPath = (url: string, basePath: string): string | null => {
        try {
          const urlObj = new URL(url);
          const pathParts = urlObj.pathname.split("/").filter(Boolean);
          const baseIndex = pathParts.findIndex(part => part === basePath);
          if (baseIndex === -1) return null;
          return `${pathParts[baseIndex]}/${pathParts.slice(baseIndex + 1).join("/")}`;
        } catch {
          return null;
        }
      };

      if (product.thumbnail) {
        const thumbnailPath = extractPath(product.thumbnail, "thumbnails");
        if (thumbnailPath) {
          filesToDelete.push(thumbnailPath);
        }
      }

      if (product.preview) {
        try {
          const previewUrls =
            typeof product.preview === "string"
              ? JSON.parse(product.preview)
              : product.preview;

          if (Array.isArray(previewUrls) && previewUrls.length > 0) {
            for (const url of previewUrls) {
              const previewPath = extractPath(url, "previews");
              if (previewPath) {
                if (!filesToDelete.includes(previewPath)) {
                  filesToDelete.push(previewPath);
                }
              }
            }
          }
        } catch (e) {
          console.error("Error processing preview URLs:", e);
        }
      }

      if (product.file) {
        const filePath = extractPath(product.file, "files");
        if (filePath) {
          filesToDelete.push(filePath);
        }
      }

      if (filesToDelete.length > 0) {
        await supabase.storage
          .from("products")
          .remove(filesToDelete);
      }

      const { error: deleteError } = await supabase
        .from("products")
        .delete()
        .eq("id", productId);

      if (deleteError) throw deleteError;

      products = products.filter((p) => p.id !== Number(productId));
      showDeleteDialog = false;
    } catch (e) {
      error = e instanceof Error ? e.message : "Failed to delete product";
      console.error("Error deleting product:", e);
    } finally {
      productToDelete = null;
      isDeleting = false;
    }
  };
</script>

<AlertDialog
  open={showDeleteDialog}
  onOpenChange={(open) => (showDeleteDialog = open)}
>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
      <AlertDialogDescription>
        This action cannot be undone. This will permanently delete the product
        and all associated files.
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>Cancel</AlertDialogCancel>
      <button
        onclick={confirmDelete}
        type="button"
        disabled={isDeleting}
        class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-destructive text-destructive-foreground hover:bg-destructive/90 h-10 px-4 py-2 disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {#if isDeleting}
          <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        {/if}
        {isDeleting ? 'Deleting...' : 'Delete'}
      </button>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>

<div class="container mx-auto py-8 px-4">
  <div class="flex flex-col space-y-4 mb-8">
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-bold">Products</h1>
      <div class="flex items-center gap-2">
        <div class="w-full max-w-xs">
          <Select.Root bind:value={selectedCategory} type="single">
            <Select.Trigger class="w-full">
              <span class="truncate">
                {#if selectedCategory}
                  {categories.find((c) => c.id === selectedCategory)?.name ||
                    "Select a category"}
                {:else}
                  Select a category
                {/if}
              </span>
            </Select.Trigger>
            <Select.Content>
              {#each categories as category (category.id)}
                <Select.Item value={category.id}>
                  {category.name}
                </Select.Item>
              {/each}
            </Select.Content>
          </Select.Root>
        </div>
        <Button
          onclick={() =>
            goto(`/admin/products/new?category=${selectedCategory}`)}
          disabled={!selectedCategory}
        >
          Add New Product
        </Button>
      </div>
    </div>
  </div>

  {#if loading}
    <div class="flex justify-center items-center h-64">
      <div
        class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"
      ></div>
    </div>
  {:else if error}
    <div class="bg-red-50 text-red-700 p-4 rounded-md mb-6">
      {error}
    </div>
  {:else if products.length === 0}
    <div class="text-center py-12">
      <p class="text-gray-500 mb-4">No products found</p>
    </div>
  {:else}
    <div class="bg-white rounded-lg border overflow-hidden">
      <Table.Root>
        <Table.Header>
          <Table.Row>
            <Table.Head>Name</Table.Head>
            <Table.Head>Category</Table.Head>
            <Table.Head class="text-right">Price</Table.Head>
            <Table.Head class="text-center">Status</Table.Head>
            <Table.Head class="w-32">Actions</Table.Head>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {#each products as product (product.id)}
            <Table.Row>
              <Table.Cell class="font-medium">
                {product.name}
              </Table.Cell>
              <Table.Cell>
                <Badge variant="outline">{product.category_id}</Badge>
              </Table.Cell>
              <Table.Cell class="text-right">
                {formatCurrency(product.price)}
              </Table.Cell>
              <Table.Cell class="text-center">
                <Badge variant="default">Active</Badge>
              </Table.Cell>
              <Table.Cell class="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onclick={() => handleEdit(product.id)}
                >
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onclick={() => handleDelete(product.id)}
                >
                  Delete
                </Button>
              </Table.Cell>
            </Table.Row>
          {/each}
        </Table.Body>
      </Table.Root>
    </div>
  {/if}
</div>
