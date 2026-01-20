import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

// GET - Check if product is in wishlist
export async function GET(req: Request) {
    try {
        const session = await auth()
        if (!session?.user?.email) {
            return NextResponse.json({ inWishlist: false })
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email }
        })

        if (!user) {
            return NextResponse.json({ inWishlist: false })
        }

        const { searchParams } = new URL(req.url)
        const productId = searchParams.get('productId')

        if (!productId) {
            return NextResponse.json({ error: 'Product ID is required' }, { status: 400 })
        }

        const wishlistItem = await prisma.wishlist.findUnique({
            where: {
                userId_productId: {
                    userId: user.id,
                    productId: productId
                }
            }
        })

        return NextResponse.json({ inWishlist: !!wishlistItem })
    } catch (error) {
        console.error('Wishlist Check Error:', error)
        return NextResponse.json({ inWishlist: false })
    }
}
