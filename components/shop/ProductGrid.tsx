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
            <div className="bg-secondary/30 py-4 sticky top-[72px] z-20 backdrop-blur-md border-b border-white/50 mb-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-center items-center gap-4 overflow-x-auto no-scrollbar pb-2 sm:pb-0">
                        <button
                            onClick={() => setFilter('all')}
                            className={cn(
                                "px-6 py-2 rounded-full font-medium transition-all duration-300 whitespace-nowrap text-sm tracking-wide",
                                filter === 'all'
                                    ? "bg-primary text-white shadow-lg scale-105"
                                    : "bg-white text-gray-600 hover:bg-white/80 border border-transparent hover:border-gray-200"
                            )}
                        >
                            All Treats
                        </button>
                        {categories.map((category) => (
                            <button
                                key={category.id}
                                onClick={() => setFilter(category.id)}
                                className={cn(
                                    "px-6 py-2 rounded-full font-medium transition-all duration-300 whitespace-nowrap text-sm tracking-wide",
                                    filter === category.id
                                        ? "bg-primary text-white shadow-lg scale-105"
                                        : "bg-white text-gray-600 hover:bg-white/80 border border-transparent hover:border-gray-200"
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
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
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
