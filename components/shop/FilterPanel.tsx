'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { SlidersHorizontal, X, DollarSign, Package } from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'

interface Category {
    id: string
    name: string
    slug: string
}

interface FilterPanelProps {
    categories: Category[]
}

export default function FilterPanel({ categories }: FilterPanelProps) {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [showMobileFilters, setShowMobileFilters] = useState(false)

    const currentCategory = searchParams.get('category') || 'all'
    const currentSort = searchParams.get('sortBy') || 'name'
    const currentMinPrice = searchParams.get('minPrice') || ''
    const currentMaxPrice = searchParams.get('maxPrice') || ''
    const currentInStock = searchParams.get('inStock') === 'true'

    const updateFilter = (key: string, value: string) => {
        const params = new URLSearchParams(searchParams.toString())

        if (value && value !== 'all') {
            params.set(key, value)
        } else {
            params.delete(key)
        }

        router.push(`/products?${params.toString()}`)
    }

    const updatePriceFilter = (min: string, max: string) => {
        const params = new URLSearchParams(searchParams.toString())

        if (min) {
            params.set('minPrice', min)
        } else {
            params.delete('minPrice')
        }

        if (max) {
            params.set('maxPrice', max)
        } else {
            params.delete('maxPrice')
        }

        router.push(`/products?${params.toString()}`)
    }

    const toggleInStock = () => {
        const params = new URLSearchParams(searchParams.toString())

        if (currentInStock) {
            params.delete('inStock')
        } else {
            params.set('inStock', 'true')
        }

        router.push(`/products?${params.toString()}`)
    }

    const clearAllFilters = () => {
        const params = new URLSearchParams()
        const query = searchParams.get('q')
        if (query) params.set('q', query)
        router.push(`/products?${params.toString()}`)
    }

    const hasActiveFilters = currentCategory !== 'all' || currentSort !== 'name' || currentMinPrice || currentMaxPrice || currentInStock

    const filterContent = (
        <div className="space-y-6">
            {/* Sort By */}
            <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-gray-700 mb-3 flex items-center gap-2">
                    <SlidersHorizontal className="w-4 h-4" />
                    Sort By
                </h3>
                <select
                    value={currentSort}
                    onChange={(e) => updateFilter('sortBy', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition text-sm bg-white"
                >
                    <option value="name">Name (A-Z)</option>
                    <option value="price-asc">Price (Low to High)</option>
                    <option value="price-desc">Price (High to Low)</option>
                    <option value="newest">Newest First</option>
                    <option value="featured">Featured</option>
                </select>
            </div>

            {/* Category Filter */}
            <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-gray-700 mb-3">
                    Category
                </h3>
                <div className="space-y-2">
                    <button
                        onClick={() => updateFilter('category', 'all')}
                        className={cn(
                            "w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium transition",
                            currentCategory === 'all'
                                ? "bg-primary text-white"
                                : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                        )}
                    >
                        All Products
                    </button>
                    {categories.map((category) => (
                        <button
                            key={category.id}
                            onClick={() => updateFilter('category', category.id)}
                            className={cn(
                                "w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium transition",
                                currentCategory === category.id
                                    ? "bg-primary text-white"
                                    : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                            )}
                        >
                            {category.name}
                        </button>
                    ))}
                </div>
            </div>

            {/* Price Range */}
            <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-gray-700 mb-3 flex items-center gap-2">
                    <DollarSign className="w-4 h-4" />
                    Price Range
                </h3>
                <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                        <input
                            type="number"
                            placeholder="Min ₹"
                            value={currentMinPrice}
                            onChange={(e) => updatePriceFilter(e.target.value, currentMaxPrice)}
                            className="px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm"
                        />
                        <input
                            type="number"
                            placeholder="Max ₹"
                            value={currentMaxPrice}
                            onChange={(e) => updatePriceFilter(currentMinPrice, e.target.value)}
                            className="px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm"
                        />
                    </div>

                    {/* Quick price filters */}
                    <div className="flex flex-wrap gap-2">
                        <button
                            onClick={() => updatePriceFilter('', '100')}
                            className="px-3 py-1.5 rounded-full text-xs font-bold bg-gray-100 hover:bg-gray-200 transition"
                        >
                            Under ₹100
                        </button>
                        <button
                            onClick={() => updatePriceFilter('100', '500')}
                            className="px-3 py-1.5 rounded-full text-xs font-bold bg-gray-100 hover:bg-gray-200 transition"
                        >
                            ₹100 - ₹500
                        </button>
                        <button
                            onClick={() => updatePriceFilter('500', '')}
                            className="px-3 py-1.5 rounded-full text-xs font-bold bg-gray-100 hover:bg-gray-200 transition"
                        >
                            Above ₹500
                        </button>
                    </div>
                </div>
            </div>

            {/* Availability */}
            <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-gray-700 mb-3 flex items-center gap-2">
                    <Package className="w-4 h-4" />
                    Availability
                </h3>
                <label className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 cursor-pointer hover:bg-gray-100 transition">
                    <input
                        type="checkbox"
                        checked={currentInStock}
                        onChange={toggleInStock}
                        className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <span className="text-sm font-medium text-gray-700">In Stock Only</span>
                </label>
            </div>

            {/* Clear Filters */}
            {hasActiveFilters && (
                <button
                    onClick={clearAllFilters}
                    className="w-full px-4 py-3 rounded-xl border-2 border-destructive/20 text-destructive text-sm font-bold hover:bg-destructive/5 transition flex items-center justify-center gap-2"
                >
                    <X className="w-4 h-4" />
                    Clear All Filters
                </button>
            )}
        </div>
    )

    return (
        <>
            {/* Mobile Filter Button */}
            <div className="lg:hidden mb-6">
                <button
                    onClick={() => setShowMobileFilters(!showMobileFilters)}
                    className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-gray-900 text-white font-bold text-sm hover:bg-black transition"
                >
                    <SlidersHorizontal className="w-5 h-5" />
                    Filters & Sort
                    {hasActiveFilters && (
                        <span className="px-2 py-0.5 rounded-full bg-primary text-white text-xs">
                            Active
                        </span>
                    )}
                </button>
            </div>

            {/* Mobile Filter Panel (Slide-in) */}
            {showMobileFilters && (
                <div className="lg:hidden fixed inset-0 z-50 bg-black/50" onClick={() => setShowMobileFilters(false)}>
                    <div
                        className="absolute right-0 top-0 bottom-0 w-80 bg-white p-6 overflow-y-auto"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-display font-bold text-gray-900">Filters</h2>
                            <button
                                onClick={() => setShowMobileFilters(false)}
                                className="p-2 hover:bg-gray-100 rounded-xl transition"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        {filterContent}
                    </div>
                </div>
            )}

            {/* Desktop Filter Panel */}
            <div className="hidden lg:block">
                {filterContent}
            </div>
        </>
    )
}
