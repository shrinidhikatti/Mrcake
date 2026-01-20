'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Plus } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import { cn } from '@/lib/utils'
import WishlistButton from '@/components/WishlistButton'

export interface ProductCardProps {
    id: string
    name: string
    price: number
    image: string
    slug: string
    description: string
    categoryId: string
}

export default function ProductCard({ product }: { product: ProductCardProps }) {
    const { addItem } = useCartStore()
    const [isAdded, setIsAdded] = useState(false)

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        addItem({
            id: product.id,
            productId: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: 1,
        })
        setIsAdded(true)
        setTimeout(() => setIsAdded(false), 2000)
    }

    return (
        <motion.div
            className="group relative"
        >
            <div className="relative aspect-[4/5] overflow-hidden bg-secondary/20 rounded-sm">
                <Link href={`/products/${product.slug}`} className="block w-full h-full">
                    <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover transition-transform duration-700 ease-in-out group-hover:scale-105"
                    />
                </Link>

                {/* Wishlist Button - top right */}
                <div className="absolute top-4 right-4 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300 z-10">
                    <WishlistButton productId={product.id} variant="small" />
                </div>

                {/* Minimal Add Button - shows on hover for Desktop, always on mobile if needed */}
                <button
                    onClick={handleAddToCart}
                    className={cn(
                        "absolute bottom-4 right-4 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 shadow-md translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 z-10",
                        isAdded ? "bg-black text-white" : "bg-white text-black hover:bg-black hover:text-white"
                    )}
                >
                    <Plus className="w-5 h-5" />
                </button>
            </div>

            <div className="mt-3 text-left">
                <Link href={`/products/${product.slug}`}>
                    <h3 className="text-sm md:text-base font-medium text-gray-900 tracking-tight hover:text-gray-600 transition-colors line-clamp-1">{product.name}</h3>
                </Link>
                <p className="text-sm md:text-base text-gray-900 font-semibold mt-1">₹{product.price}</p>
            </div>
        </motion.div>
    )
}
