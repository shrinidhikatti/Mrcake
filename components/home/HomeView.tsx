'use client'

import React, { useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import ProductCard from '@/components/shop/ProductCard'
import { cn } from '@/lib/utils'

interface Product {
    id: string
    name: string
    slug: string
    description: string
    price: number
    image: string
    categoryId: string
}

interface HomeViewProps {
    featuredProducts: Product[]
}

export default function HomeView({ featuredProducts }: HomeViewProps) {
    const containerRef = useRef<HTMLDivElement>(null)

    // Parallax for Hero
    const { scrollY } = useScroll()
    const yHero = useTransform(scrollY, [0, 1000], [0, 300])
    const textOpacity = useTransform(scrollY, [0, 400], [1, 0])

    return (
        <div className="flex flex-col min-h-screen bg-white" ref={containerRef}>

            {/* 1. Cinematic Hero Section */}
            <section className="relative h-screen w-full overflow-hidden">
                <motion.div
                    style={{ y: yHero }}
                    className="absolute inset-0 z-0"
                >
                    <Image
                        src="/hero-bakery.png"
                        alt="Artisan Cakes"
                        fill
                        priority
                        className="object-cover object-center"
                    />
                    {/* Subtle dark overlay for text readability, but kept light */}
                    <div className="absolute inset-0 bg-black/30" />
                </motion.div>

                <motion.div
                    style={{ opacity: textOpacity }}
                    className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4"
                >
                    <motion.h2
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, delay: 0.2 }}
                        className="text-white text-sm md:text-base font-medium tracking-[0.2em] uppercase mb-4"
                    >
                        Est. 2020 • Bidar
                    </motion.h2>

                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, delay: 0.4 }}
                        className="text-white text-6xl md:text-8xl font-serif font-medium tracking-tight mb-8"
                    >
                        MrCake Palace <br className="md:hidden" /> & Bakers
                    </motion.h1>

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, delay: 0.6 }}
                    >
                        <Link
                            href="/products"
                            className="inline-block border border-white text-white px-8 py-3 text-sm tracking-widest uppercase hover:bg-white hover:text-black transition-all duration-300"
                        >
                            Explore Menu
                        </Link>
                    </motion.div>
                </motion.div>
            </section>

            {/* 2. Minimalist Introduction */}
            <section className="py-16 md:py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 md:px-8 text-center">
                    <motion.h3
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="text-3xl md:text-4xl font-display font-medium text-gray-900 mb-6 mx-auto max-w-3xl"
                    >
                        Crafted with intention.
                    </motion.h3>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="text-gray-500 font-light text-lg leading-relaxed text-balance mx-auto max-w-3xl"
                    >
                        We believe in the purity of ingredients. Our cakes are baked fresh daily using the finest Belgian chocolate, organic flour, and farm-fresh cream. No preservatives, just pure indulgence.
                    </motion.p>
                </div>
            </section>

            {/* 3. Featured Collection (Gallery Grid) */}
            <section className="pb-32 w-full px-4 md:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="flex justify-center items-center mb-10">
                        <h2 className="text-2xl font-display text-gray-900">Signatures</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-16">
                        {featuredProducts.map((product, idx) => (
                            <motion.div
                                key={product.id}
                                initial={{ opacity: 0, y: 40 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8, delay: idx * 0.1 }}
                            >
                                <ProductCard product={product} />
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 4. Categories (Visual) */}
            <section className="py-20 bg-gray-50 px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Link href="/products?category=cakes" className="group relative h-[400px] overflow-hidden block">
                            <Image
                                src="/chocolate-cake.png"
                                alt="Cakes"
                                fill
                                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <span className="text-white text-3xl font-display tracking-wide">Cakes</span>
                            </div>
                        </Link>
                        <Link href="/products?category=pastries" className="group relative h-[400px] overflow-hidden block">
                            <Image
                                src="/croissants.png"
                                alt="Pastries"
                                fill
                                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <span className="text-white text-3xl font-display tracking-wide">Pastries</span>
                            </div>
                        </Link>
                    </div>
                </div>
            </section>

            {/* 5. Simple Footer CTA */}
            <section className="py-32 bg-white text-center">
                <h2 className="text-4xl md:text-5xl font-display mb-8">Ready to indulge?</h2>
                <Link
                    href="/products"
                    className="inline-block bg-black text-white px-10 py-4 text-sm font-medium tracking-wider hover:bg-gray-800 transition-colors"
                >
                    ORDER ONLINE
                </Link>
            </section>

        </div>
    )
}
