import { error } from '@sveltejs/kit';

// Sample product data - replace with your actual data source
const sampleProducts = {
    ppt: [
        {
            id: 101,
            name: 'Business Presentation Template',
            category: 'PPT',
            price: 24.99,
            imageUrl: 'https://placehold.co/600x400/7c3aed/ffffff?text=PPT+Template',
            rating: 5,
            description: 'Professional business presentation template with modern design.'
        },
        // Add more PPT products
    ],
    font: [
        {
            id: 201,
            name: 'Modern Sans Serif Font',
            category: 'Font',
            price: 19.99,
            imageUrl: 'https://placehold.co/600x400/16a34a/ffffff?text=Font',
            rating: 4,
            description: 'Clean and modern sans serif font family.'
        },
        // Add more Font products
    ],
    'elementor-template-kit': [
        {
            id: 301,
            name: 'Agency Template Kit',
            category: 'Elementor Template Kit',
            price: 39.99,
            imageUrl: 'https://placehold.co/600x400/0284c7/ffffff?text=Elementor',
            rating: 5,
            description: 'Complete Elementor template kit for agencies.'
        },
        // Add more Elementor Template Kits
    ],
    icon: [
        {
            id: 401,
            name: 'Minimal Line Icons',
            category: 'Icon',
            price: 14.99,
            imageUrl: 'https://placehold.co/600x400/db2777/ffffff?text=Icons',
            rating: 4,
            description: 'Set of 200+ minimal line icons.'
        },
        // Add more Icon products
    ],
    illustration: [
        {
            id: 501,
            name: 'Business Illustrations Pack',
            category: 'Illustration',
            price: 29.99,
            imageUrl: 'https://placehold.co/600x400/f59e0b/ffffff?text=Illustration',
            rating: 5,
            description: 'Collection of business-themed illustrations.'
        },
        // Add more Illustration products
    ]
};

export function load({ params }) {
    const slug = params.slug.toLowerCase();
    const categoryMap = {
        'ppt': 'PPT',
        'font': 'Font',
        'elementor-template-kit': 'Elementor Template Kit',
        'icon': 'Icon',
        'illustration': 'Illustration'
    };

    const category = categoryMap[slug as keyof typeof categoryMap];

    if (!category) {
        throw error(404, 'Category not found');
    }

    // For demo purposes, we're using sample data
    // In a real app, you would fetch this from your database
    const products = sampleProducts[slug as keyof typeof sampleProducts] || [];

    return {
        category,
        products
    };
}
