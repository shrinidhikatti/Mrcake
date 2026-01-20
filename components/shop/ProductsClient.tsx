'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { Loader2, PackageX } from 'lucide-react'
import SearchBar from './SearchBar'
import FilterPanel from './FilterPanel'
import ProductCard from './ProductCard'

interface Category {
    id: string
    name: string
    slug: string
}

interface Product {
    id: string
    name: string
    slug: string
    description: string
    price: number
    images: string
    inStock: boolean
    category: {
        id: string
        name: string
        slug: string
    }
}

interface ProductsClientProps {
    categories: Category[]
}

export default function ProductsClient({ categories }: ProductsClientProps) {
    const searchParams = useSearchParams()
    const [products, setProducts] = useState<Product[]>([])
    const [loading, setLoading] = useState(true)
    const [total, setTotal] = useState(0)

    useEffect(() => {
        loadProducts()
    }, [searchParams])

    const loadProducts = async () => {
        setLoading(true)
        try {
            const params = new URLSearchParams(searchParams.toString())
            const res = await fetch(`/api/products/search?${params.toString()}`)
            const data = await res.json()

            setProducts(data.products || [])
            setTotal(data.total || 0)
        } catch (error) {
            console.error('Failed to load products:', error)
        } finally {
            setLoading(false)
        }
    }

    // Transform products for ProductCard
    const transformedProducts = products.map((p) => {
        let imageSrc = '/placeholder.png'
        try {
            const images = JSON.parse(p.images)
            if (Array.isArray(images) && images.length > 0) {
                imageSrc = images[0]
            }
        } catch (e) {
            // Use placeholder
        }

        return {
            id: p.id,
            name: p.name,
            price: p.price,
            image: imageSrc,
            slug: p.slug,
            description: p.description,
            categoryId: p.category.id,
            categoryName: p.category.name,
        }
    })

    const query = searchParams.get('q')
    const hasFilters = Array.from(searchParams.keys()).length > 0

    return (
        <div className="max-w-7xl mx-auto py-12">
            {/* Search Bar */}
            <div className="mb-8">
                <SearchBar />
            </div>

            {/* Layout: Filters + Products */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Filters Sidebar */}
                <aside className="lg:col-span-1">
                    <div className="lg:sticky lg:top-24">
                        <FilterPanel categories={categories} />
                    </div>
                </aside>

                {/* Products Area */}
                <div className="lg:col-span-3">
                    {/* Results Header */}
                    <div className="mb-6 flex items-center justify-between">
                        <div>
                            {query && (
                                <p className="text-sm text-gray-600 mb-1">
                                    Search results for: <span className="font-bold text-gray-900">"{query}"</span>
                                </p>
                            )}
                            <p className="text-lg font-bold text-gray-900">
                                {loading ? (
                                    'Loading...'
                                ) : (
                                    <>
                                        {total} {total === 1 ? 'Product' : 'Products'} Found
                                    </>
                                )}
                            </p>
                        </div>
                    </div>

                    {/* Loading State */}
                    {loading && (
                        <div className="flex items-center justify-center py-20">
                            <Loader2 className="w-10 h-10 animate-spin text-primary" />
                        </div>
                    )}

                    {/* Empty State */}
                    {!loading && products.length === 0 && (
                        <div className="bg-white rounded-3xl p-12 text-center border border-gray-100">
                            <PackageX className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-xl font-display font-bold text-gray-900 mb-2">
                                No Products Found
                            </h3>
                            <p className="text-gray-500 mb-6">
                                {query
                                    ? `We couldn't find any products matching "${query}"`
                                    : hasFilters
                                    ? 'Try adjusting your filters to see more results'
                                    : 'No products available at the moment'}
                            </p>
                            {hasFilters && (
                                <button
                                    onClick={() => window.location.href = '/products'}
                                    className="px-6 py-3 rounded-xl bg-gray-900 text-white text-sm font-bold hover:bg-black transition"
                                >
                                    Clear All Filters
                                </button>
                            )}
                        </div>
                    )}

                    {/* Products Grid */}
                    {!loading && products.length > 0 && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {transformedProducts.map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
