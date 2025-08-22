<script lang="ts">
    import Header from "$lib/components/header.svelte";
    import { page } from "$app/stores";

    let mobileMenuOpen = false;

    const categories = [
        {
            slug: 'ppt',
            name: 'PPT Templates',
            description: 'Professional PowerPoint templates for all your presentation needs',
            icon: '📊',
            count: 45
        },
        {
            slug: 'font',
            name: 'Fonts',
            description: 'Beautiful typography for your design projects',
            icon: '🔤',
            count: 32
        },
        {
            slug: 'elementor-template-kit',
            name: 'Elementor Kits',
            description: 'Complete website templates for Elementor',
            icon: '🎨',
            count: 28
        },
        {
            slug: 'icon',
            name: 'Icons',
            description: 'Icon sets for web and app design',
            icon: '✨',
            count: 67
        },
        {
            slug: 'illustration',
            name: 'Illustrations',
            description: 'Custom illustrations for your projects',
            icon: '🎨',
            count: 53
        }
    ];
</script>

<div class="min-h-screen bg-background text-foreground font-sans antialiased">
    <Header {mobileMenuOpen} />

    <main class="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <section class="text-center mb-16">
            <h1 class="text-4xl font-bold tracking-tight mb-4">Browse Categories</h1>
            <p class="text-lg text-muted-foreground max-w-2xl mx-auto">
                Explore our collection of digital products across different categories
            </p>
        </section>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {#each categories as category}
                <a 
                    href="/categories/{category.slug}" 
                    class="group block p-6 bg-card rounded-lg border border-border hover:border-primary/50 transition-colors"
                >
                    <div class="flex items-center gap-4 mb-4">
                        <div class="text-3xl">{category.icon}</div>
                        <h2 class="text-xl font-semibold group-hover:text-primary transition-colors">
                            {category.name}
                        </h2>
                    </div>
                    <p class="text-muted-foreground mb-3">{category.description}</p>
                    <div class="text-sm text-primary font-medium">
                        {category.count} {category.count === 1 ? 'product' : 'products'} available
                    </div>
                </a>
            {/each}
        </div>
    </main>
</div>
