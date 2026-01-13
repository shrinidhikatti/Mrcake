'use client'

import { ShoppingCart, Plus, Minus } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import { useState } from 'react'

interface ProductProps {
    id: string
    name: string
    price: number
    images: string
}

export default function AddToCartButton({ product }: { product: ProductProps }) {
    const addItem = useCartStore((state) => state.addItem)
    const [quantity, setQuantity] = useState(1)
    const [isAdded, setIsAdded] = useState(false)

    const handleAddToCart = () => {
        // Parse images safely
        let image = '/placeholder.png'
        try {
            const parsedImages = JSON.parse(product.images)
            if (Array.isArray(parsedImages) && parsedImages.length > 0) {
                image = parsedImages[0]
            }
        } catch (err) {
            console.error('Error parsing images', err)
        }

        addItem({
            id: product.id,
            productId: product.id,
            name: product.name,
            price: product.price,
            image: image,
            quantity: quantity
        })

        setIsAdded(true)
        setTimeout(() => setIsAdded(false), 2000)
    }

    return (
        <div className="flex flex-col sm:flex-row gap-4 w-full">
            <div className="flex items-center border border-border rounded-lg bg-white w-fit">
                <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-3 hover:bg-secondary transition text-foreground"
                >
                    <Minus className="w-4 h-4" />
                </button>
                <span className="w-12 text-center font-medium">{quantity}</span>
                <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-3 hover:bg-secondary transition text-foreground"
                >
                    <Plus className="w-4 h-4" />
                </button>
            </div>

            <button
                onClick={handleAddToCart}
                className={`flex-1 flex items-center justify-center gap-2 px-8 py-3 rounded-lg text-lg font-semibold shadow-md transition ${isAdded
                        ? 'bg-success text-white'
                        : 'bg-primary text-white hover:bg-primary-dark hover:shadow-lg'
                    }`}
            >
                <ShoppingCart className="w-5 h-5" />
                {isAdded ? 'Added to Cart' : 'Add to Cart'}
            </button>
        </div>
    )
}
