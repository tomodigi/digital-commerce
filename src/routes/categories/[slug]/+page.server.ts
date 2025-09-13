import { error } from '@sveltejs/kit';

const sampleProducts = {
    ppt: [
        {
            id: 101,
            name: 'Business Presentation Template',
            slug: 'business-presentation-template',
            category: 'PPT',
            price: 24.99,
            imageUrl: 'https://placehold.co/600x400/7c3aed/ffffff?text=PPT+Template',
            stars: 5,
            rating: 5,
            description: 'Professional business presentation template with modern design.'
        },
    ],
    font: [
        {
            id: 201,
            name: 'Modern Sans Serif Font',
            slug: 'modern-sans-serif-font',
            category: 'Font',
            price: 19.99,
            imageUrl: 'https://placehold.co/600x400/16a34a/ffffff?text=Font',
            stars: 4,
            rating: 4,
            description: 'Clean and modern sans serif font family.'
        },
    ],
    'elementor-template-kit': [
        {
            id: 301,
            name: 'Agency Template Kit',
            slug: 'agency-template-kit',
            category: 'Elementor Template Kit',
            price: 39.99,
            imageUrl: 'https://placehold.co/600x400/0284c7/ffffff?text=Elementor',
            stars: 5,
            rating: 5,
            description: 'Complete Elementor template kit for agencies.'
        },
    ],
    icon: [
        {
            id: 401,
            name: 'Minimal Line Icons',
            slug: 'minimal-line-icons',
            category: 'Icon',
            price: 14.99,
            imageUrl: 'https://placehold.co/600x400/db2777/ffffff?text=Icons',
            stars: 4,
            rating: 4,
            description: 'Set of 200+ minimal line icons.'
        },
    ],
    illustration: [
        {
            id: 501,
            name: 'Business Illustrations Pack',
            slug: 'business-illustrations-pack',
            category: 'Illustration',
            price: 29.99,
            imageUrl: 'https://placehold.co/600x400/f59e0b/ffffff?text=Illustration',
            stars: 5,
            rating: 5,
            description: 'Collection of business-themed illustrations.'
        },
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

    const products = sampleProducts[slug as keyof typeof sampleProducts] || [];

    return {
        category,
        products
    };
}
