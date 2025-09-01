import JSZip from 'jszip';

export function toSlug(str: string) {
    return str.toLowerCase().replace(/\s+/g, "-");
}

export interface ExtractedImage {
    name: string;
    blob: Blob;
    url: string;
}

/**
 * Parses preview URLs from various formats (stringified JSON, array, or undefined)
 * @param preview The preview data to parse
 * @returns Array of preview URLs, or empty array if parsing fails
 */
export function parsePreviewUrls(preview: unknown): string[] {
    if (!preview) return [];

    try {
        if (typeof preview === 'string') {
            const parsed = JSON.parse(preview);
            return Array.isArray(parsed) ? parsed : [];
        }
        return Array.isArray(preview) ? preview : [];
    } catch (e) {
        console.error('Error parsing preview URLs:', e);
        return [];
    }
}

export async function extractImagesFromZip(file: File): Promise<ExtractedImage[]> {
    try {
        const zip = new JSZip();
        const content = await file.arrayBuffer();
        const zipContent = await zip.loadAsync(content);

        const imageFiles = Object.entries(zipContent.files)
            .filter(([fileName]) => {
                const ext = fileName.split('.').pop()?.toLowerCase();
                return ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext || '');
            })
            .sort(([fileNameA], [fileNameB]) => {
                const numA = parseInt(fileNameA.split('_')[0]) || 0;
                const numB = parseInt(fileNameB.split('_')[0]) || 0;
                return numA - numB;
            });

        if (imageFiles.length === 0) {
            throw new Error('No image files found in the ZIP archive');
        }

        const extractedImages: ExtractedImage[] = [];

        for (const [fileName, fileData] of imageFiles) {
            const blob = await fileData.async('blob');
            const url = URL.createObjectURL(blob);

            const fileExt = fileName.split('.').pop() || '';
            const baseName = fileName.substring(0, fileName.lastIndexOf('.')) || fileName;

            const newFileName = `${baseName}.${fileExt}`;

            extractedImages.push({
                name: newFileName,
                blob,
                url
            });
        }

        return extractedImages;
    } catch (error) {
        console.error('Error extracting images from ZIP:', error);
        throw new Error(`Failed to extract images: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}