'use client'

import { useEffect, useState } from 'react'
import { Heart, Loader2, ShoppingCart, Trash2, PackageX } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import BackButton from '@/components/BackButton'
import { useCartStore } from '@/store/cartStore'

interface WishlistItem {
    id: string
    productId: string
    createdAt: string
    product: {
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
        }
    }
}

export default function WishlistPage() {
    const { data: session, status } = useSession()
    const router = useRouter()
    const addItem = useCartStore((state) => state.addItem)
    const [wishlist, setWishlist] = useState<WishlistItem[]>([])
    const [loading, setLoading] = useState(true)
    const [removingId, setRemovingId] = useState<string | null>(null)

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/login?callbackUrl=/wishlist')
        } else if (status === 'authenticated') {
            loadWishlist()
        }
    }, [status, router])

    const loadWishlist = async () => {
        try {
            const res = await fetch('/api/wishlist')
            const data = await res.json()
            setWishlist(data.wishlist || [])
        } catch (error) {
            console.error('Failed to load wishlist:', error)
        } finally {
            setLoading(false)
        }
    }

    const removeFromWishlist = async (productId: string) => {
        try {
            setRemovingId(productId)
            const res = await fetch(`/api/wishlist?productId=${productId}`, {
                method: 'DELETE'
            })

            if (res.ok) {
                setWishlist(wishlist.filter(item => item.productId !== productId))
            }
        } catch (error) {
            console.error('Failed to remove from wishlist:', error)
        } finally {
            setRemovingId(null)
        }
    }

    const addToCart = (item: WishlistItem) => {
        let imageSrc = '/placeholder.png'
        try {
            const images = JSON.parse(item.product.images)
            if (Array.isArray(images) && images.length > 0) {
                imageSrc = images[0]
            }
        } catch (e) {
            // Use placeholder
        }

        addItem({
            id: item.product.id,
            productId: item.product.id,
            name: item.product.name,
            price: item.product.price,
            image: imageSrc,
            quantity: 1
        })
    }

    if (status === 'loading' || loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="w-10 h-10 animate-spin text-primary" />
            </div>
        )
    }

    return (
        <div className="min-h-screen flex flex-col bg-[#FDFBF7]">
            <BackButton />

            {/* Header */}
            <div className="bg-white pt-56 pb-12 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/20 rounded-full blur-3xl -mr-20 -mt-20"></div>
                <div className="absolute top-0 left-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -ml-20 -mt-20"></div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                    <div className="inline-flex items-center gap-3 mb-4">
                        <Heart className="w-10 h-10 text-primary fill-primary" />
                    </div>
                    <h1 className="text-5xl font-display font-bold text-gray-900 mb-4">My Wishlist</h1>
                    <p className="text-gray-600 max-w-2xl mx-auto text-lg">
                        Your favorite products saved for later
                    </p>
                </div>
            </div>

            {/* Content */}
            <main className="flex-grow w-full px-4 sm:px-6 lg:px-8 pb-20">
                <div className="max-w-7xl mx-auto py-12">
                    {wishlist.length === 0 ? (
                        <div className="bg-white rounded-3xl p-12 text-center border border-gray-100">
                            <PackageX className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-xl font-display font-bold text-gray-900 mb-2">
                                Your Wishlist is Empty
                            </h3>
                            <p className="text-gray-500 mb-6">
                                Start adding products you love to your wishlist
                            </p>
                            <Link
                                href="/products"
                                className="inline-block px-6 py-3 rounded-xl bg-gray-900 text-white text-sm font-bold hover:bg-black transition"
                            >
                                Browse Products
                            </Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {wishlist.map((item) => {
                                let imageSrc = '/placeholder.png'
                                try {
                                    const images = JSON.parse(item.product.images)
                                    if (Array.isArray(images) && images.length > 0) {
                                        imageSrc = images[0]
                                    }
                                } catch (e) {
                                    // Use placeholder
                                }

                                return (
                                    <div key={item.id} className="bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-lg transition group">
                                        {/* Image */}
                                        <Link href={`/products/${item.product.slug}`} className="block relative aspect-square overflow-hidden bg-gray-100">
                                            <img
                                                src={imageSrc}
                                                alt={item.product.name}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                            />
                                            {!item.product.inStock && (
                                                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                                    <span className="bg-white px-4 py-2 rounded-full text-sm font-bold text-gray-900">
                                                        Out of Stock
                                                    </span>
                                                </div>
                                            )}
                                        </Link>

                                        {/* Content */}
                                        <div className="p-4">
                                            <span className="text-xs font-bold text-primary uppercase tracking-wider">
                                                {item.product.category.name}
                                            </span>
                                            <Link href={`/products/${item.product.slug}`}>
                                                <h3 className="text-lg font-display font-bold text-gray-900 mt-1 mb-2 hover:text-primary transition">
                                                    {item.product.name}
                                                </h3>
                                            </Link>
                                            <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                                                {item.product.description}
                                            </p>
                                            <div className="flex items-center justify-between mb-4">
                                                <span className="text-2xl font-display font-bold text-gray-900">
                                                    ₹{item.product.price.toFixed(2)}
                                                </span>
                                            </div>

                                            {/* Actions */}
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => addToCart(item)}
                                                    disabled={!item.product.inStock}
                                                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gray-900 text-white text-sm font-bold hover:bg-black transition disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    <ShoppingCart className="w-4 h-4" />
                                                    Add to Cart
                                                </button>
                                                <button
                                                    onClick={() => removeFromWishlist(item.productId)}
                                                    disabled={removingId === item.productId}
                                                    className="p-2.5 rounded-xl border-2 border-red-200 text-red-600 hover:bg-red-50 transition disabled:opacity-50"
                                                    title="Remove from wishlist"
                                                >
                                                    {removingId === item.productId ? (
                                                        <Loader2 className="w-5 h-5 animate-spin" />
                                                    ) : (
                                                        <Trash2 className="w-5 h-5" />
                                                    )}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    )}
                </div>
            </main>
        </div>
    )
}
