import { prisma } from '@/lib/prisma'
import ProductsClient from '@/components/shop/ProductsClient'
import BackButton from '@/components/BackButton'

async function getCategories() {
    return await prisma.category.findMany({
        orderBy: { name: 'asc' }
    })
}

export default async function ProductsPage() {
    const categories = await getCategories()

    return (
        <div className="min-h-screen flex flex-col bg-[#FDFBF7]">
            <BackButton />
            <div className="bg-white pt-56 pb-12 relative overflow-hidden">
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

            <main className="flex-grow w-full px-4 sm:px-6 lg:px-8 pb-20">
                <ProductsClient categories={categories} />
            </main>
        </div>
    )
}
