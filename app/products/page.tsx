import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { prisma } from '@/lib/prisma'
import ProductGrid from '@/components/shop/ProductGrid'

async function getProducts() {
    return await prisma.product.findMany({
        include: { category: true },
        orderBy: { createdAt: 'desc' },
    })
}

async function getCategories() {
    return await prisma.category.findMany()
}

export default async function ProductsPage() {
    const productsRaw = await getProducts()
    const categories = await getCategories()

    // Transform data
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const products = productsRaw.map((p: any) => {
        let imageSrc = '/placeholder.png'
        try {
            const images = JSON.parse(p.images as string);
            if (Array.isArray(images) && images.length > 0) {
                imageSrc = images[0];
            }
        } catch (e) { }

        return {
            id: p.id,
            name: p.name,
            price: p.price,
            image: imageSrc,
            slug: p.slug,
            description: p.description,
            categoryId: p.categoryId,
            categoryName: p.category?.name
        };
    });

    return (
        <div className="min-h-screen flex flex-col bg-[#FDFBF7]">
            <Header />

            <div className="bg-white pt-24 pb-12 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/20 rounded-full blur-3xl -mr-20 -mt-20"></div>
                <div className="absolute top-0 left-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -ml-20 -mt-20"></div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                    <span className="text-secondary font-display text-xl mb-2 block">Our Collection</span>
                    <h1 className="text-5xl font-display font-bold text-gray-900 mb-6">Menu</h1>
                    <p className="text-gray-600 max-w-2xl mx-auto text-lg">
                        Explore our wide range of freshly baked delicacies. From custom cakes to artisanal breads, we have something for every taste.
                    </p>
                </div>
            </div>

            <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
                <ProductGrid initialProducts={products} categories={categories} />
            </main>

            <Footer />
        </div>
    )
}
