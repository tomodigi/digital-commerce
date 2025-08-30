<script lang="ts">
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";
  import { getSupabase } from "$lib/supabase/client";
  import * as Table from "$lib/components/ui/table/index.js";
  import { Button } from "$lib/components/ui/button/index.js";
  import { Badge } from "$lib/components/ui/badge/index.js";
  import * as Select from "$lib/components/ui/select/index.js";
  import { formatCurrency } from "$lib/utils.js";
  import type { Database } from "$lib/supabase/types";

  type Product = Database["public"]["Tables"]["products"]["Row"];

  let products = $state<Product[]>([]);
  let categories = $state<{ id: string; name: string }[]>([]);
  let selectedCategory = $state<string>("");
  let loading = $state(true);
  let error = $state<string | null>(null);

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

  const handleDelete = async (productId: number) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      const supabase = await getSupabase();
      const { error: deleteError } = await supabase
        .from("products")
        .delete()
        .eq("id", productId);

      if (deleteError) throw deleteError;

      products = products.filter((p) => p.id !== Number(productId));
    } catch (e) {
      error = e instanceof Error ? e.message : "Failed to delete product";
      console.error("Error deleting product:", e);
    }
  };
</script>

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
