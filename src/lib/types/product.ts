export interface Product {
    name: string;
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
    user_id: string;
}

export const initialProduct: Product = {
    name: "",
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
    user_id: ""
};
