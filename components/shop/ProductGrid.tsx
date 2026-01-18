'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ProductCard from './ProductCard'
import { cn } from '@/lib/utils'

interface Product {
    id: string
    name: string
    price: number
    image: string
    slug: string
    description: string
    categoryId: string
    categoryName?: string // Optional for filtering
}

interface Category {
    id: string
    name: string
    slug: string
}

interface ProductGridProps {
    initialProducts: Product[]
    categories: Category[]
}

export default function ProductGrid({ initialProducts, categories }: ProductGridProps) {
    const [filter, setFilter] = useState('all')

    const filteredProducts = filter === 'all'
        ? initialProducts
        : initialProducts.filter(p => p.categoryId === filter)

    return (
        <>
            {/* Categories Filter */}
            <div className="py-8 mb-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-center items-center gap-5 overflow-x-auto flex-wrap">
                        <button
                            onClick={() => setFilter('all')}
                            className={cn(
                                "text-sm font-medium rounded-full transition-all duration-200",
                                filter === 'all'
                                    ? "bg-gray-900 text-white px-7 py-3"
                                    : "bg-gray-100 text-gray-700 hover:bg-gray-200 px-6 py-2.5"
                            )}
                        >
                            All Treats
                        </button>
                        {categories.map((category) => (
                            <button
                                key={category.id}
                                onClick={() => setFilter(category.id)}
                                className={cn(
                                    "text-sm font-medium rounded-full transition-all duration-200",
                                    filter === category.id
                                        ? "bg-gray-900 text-white px-7 py-3"
                                        : "bg-gray-100 text-gray-700 hover:bg-gray-200 px-6 py-2.5"
                                )}
                            >
                                {category.name}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Grid */}
            <motion.div
                layout
                className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 max-w-[1400px] mx-auto"
            >
                <AnimatePresence>
                    {filteredProducts.map((product) => (
                        <motion.div
                            key={product.id}
                            layout
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ duration: 0.3 }}
                        >
                            <ProductCard product={product} />
                        </motion.div>
                    ))}
                </AnimatePresence>
            </motion.div>

            {filteredProducts.length === 0 && (
                <div className="text-center py-20">
                    <p className="text-xl text-gray-500">No items found in this category.</p>
                    <button
                        onClick={() => setFilter('all')}
                        className="mt-4 text-primary hover:underline font-medium"
                    >
                        View all products
                    </button>
                </div>
            )}
        </>
    )
}
