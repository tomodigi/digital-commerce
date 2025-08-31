import { getSupabase } from "$lib/supabase/client";
import { toSlug, extractImagesFromZip } from "$lib/utils/product/product-utils";
import type { ProductState } from "$lib/types/product";

/**
 * Fetches all product categories from the database.
 * @returns A promise that resolves to an array of categories.
 */
export async function fetchCategories() {
    const supabase = await getSupabase();
    const { data, error } = await supabase
        .from("product_categories")
        .select("*")
        .order("name");

    if (error) {
        console.error("Error fetching categories:", error);
        throw new Error("Failed to load categories.");
    }
    return data || [];
}

/**
 * Uploads a thumbnail image to Supabase Storage.
 * @param file - The thumbnail image file.
 * @param productId - The ID of the product to associate the thumbnail with.
 * @returns The public URL of the uploaded thumbnail.
 */
async function uploadThumbnail(file: File, productId: string): Promise<string> {
    const supabase = await getSupabase();
    const fileExt = file.name.split(".").pop();
    const fileName = `${productId}-${Date.now()}.${fileExt}`;
    const filePath = `thumbnails/${fileName}`;

    const { error: uploadError } = await supabase.storage
        .from("products")
        .upload(filePath, file, {
            cacheControl: "3600",
            upsert: false,
            contentType: file.type,
        });

    if (uploadError) {
        console.error("Thumbnail upload error:", uploadError);
        throw new Error(`Upload failed: ${uploadError.message}`);
    }

    const { data } = supabase.storage.from("products").getPublicUrl(filePath);
    return data.publicUrl;
}

/**
 * Extracts images from a ZIP file and uploads them to Supabase Storage.
 * @param zipFile - The ZIP file containing preview images.
 * @param productName - The name of the product.
 * @returns An array of public URLs for the uploaded images.
 */
async function uploadPreviewImages(zipFile: File, productName: string): Promise<string[]> {
    const supabase = await getSupabase();
    const extractedImages = await extractImagesFromZip(zipFile, productName);

    if (extractedImages.length === 0) {
        throw new Error("No valid images found in the ZIP file.");
    }

    const uploadPromises = extractedImages.map(async (image, index) => {
        const extension = image.name.split('.').pop() || 'jpg';
        const baseName = productName.toLowerCase().replace(/\s+/g, '');
        const fileName = index === 0
            ? `${baseName}.${extension}`
            : `${baseName}-${index + 1}.${extension}`;

        const filePath = `previews/${fileName}`;
        const imageFile = new File([image.blob], fileName, { type: image.blob.type });

        const { error } = await supabase.storage.from("products").upload(filePath, imageFile, {
            cacheControl: "3600",
            upsert: true,
        });

        if (error) {
            console.error(`Upload error for ${fileName}:`, error);
            return null;
        }

        const { data } = supabase.storage.from("products").getPublicUrl(filePath);
        return data.publicUrl;
    });

    const urls = (await Promise.all(uploadPromises)).filter((url): url is string => url !== null);

    if (urls.length === 0) {
        throw new Error("Failed to upload any preview images.");
    }

    return urls.sort((a, b) => {
        const numA = parseInt(a.match(/-?(\d+)\./)?.[1] || '0');
        const numB = parseInt(b.match(/-?(\d+)\./)?.[1] || '0');
        return numA - numB;
    });
}


/**
 * Converts a JavaScript array to a PostgreSQL array literal string.
 * e.g., ['a', 'b'] => '{a,b}'
 */
function toPgArray(arr: unknown): string | null {
    if (!Array.isArray(arr) || arr.length === 0) return null;
    return `{${arr.join(",")}}`;
}


/**
 * Adds a new product to the database and handles file uploads.
 * @param product - The product state object.
 * @param thumbnailFile - The optional thumbnail file.
 * @param previewZip - The optional preview ZIP file.
 */
export async function addProduct(
    product: ProductState,
    thumbnailFile: File | null,
    previewZip: File | null
) {
    const supabase = await getSupabase();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        throw new Error("User not authenticated.");
    }

    const payload = {
        ...product,
        slug: toSlug(product.name),
        user_id: user.id,
        features: toPgArray(product.features),
        tags: toPgArray(product.tags),
        compatible_browser: toPgArray(product.compatible_browser),
        compatible_with: toPgArray(product.compatible_with),
        files_include: toPgArray(product.files_include),
    };

    const { data: productData, error: productError } = await supabase
        .from("products")
        .insert([payload])
        .select()
        .single();

    if (productError) {
        console.error("Product insertion error:", productError);
        throw productError;
    }

    const updates: Partial<ProductState> = {};

    if (thumbnailFile) {
        updates.thumbnail = await uploadThumbnail(thumbnailFile, productData.id);
    }

    if (previewZip) {
        const previewUrls = await uploadPreviewImages(previewZip, product.name);
        updates.preview = JSON.stringify(previewUrls);
    }

    if (Object.keys(updates).length > 0) {
        const { error: updateError } = await supabase
            .from("products")
            .update(updates)
            .eq("id", productData.id);

        if (updateError) {
            console.error("Failed to update product with file URLs:", updateError);
        }
    }
}