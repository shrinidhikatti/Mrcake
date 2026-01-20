'use client'

import AddToCartButton from './AddToCartButton'
import WishlistButton from '@/components/WishlistButton'

interface ProductActionsProps {
    product: {
        id: string
        name: string
        price: number
        images: string
    }
}

export default function ProductActions({ product }: ProductActionsProps) {
    return (
        <div className="flex gap-4">
            <div className="flex-1">
                <AddToCartButton product={product} />
            </div>
            <div className="flex items-start pt-1.5">
                <WishlistButton productId={product.id} />
            </div>
        </div>
    )
}
