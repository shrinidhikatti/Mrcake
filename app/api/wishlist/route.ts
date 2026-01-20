import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

// GET - Get user's wishlist
export async function GET() {
    try {
        const session = await auth()
        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email }
        })

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 })
        }

        const wishlist = await prisma.wishlist.findMany({
            where: { userId: user.id },
            include: {
                product: {
                    include: {
                        category: true
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        })

        return NextResponse.json({ wishlist })
    } catch (error) {
        console.error('Wishlist GET Error:', error)
        return NextResponse.json(
            { error: 'Failed to fetch wishlist' },
            { status: 500 }
        )
    }
}

// POST - Add item to wishlist
export async function POST(req: Request) {
    try {
        const session = await auth()
        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email }
        })

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 })
        }

        const { productId } = await req.json()

        if (!productId) {
            return NextResponse.json({ error: 'Product ID is required' }, { status: 400 })
        }

        // Check if product exists
        const product = await prisma.product.findUnique({
            where: { id: productId }
        })

        if (!product) {
            return NextResponse.json({ error: 'Product not found' }, { status: 404 })
        }

        // Check if already in wishlist
        const existing = await prisma.wishlist.findUnique({
            where: {
                userId_productId: {
                    userId: user.id,
                    productId: productId
                }
            }
        })

        if (existing) {
            return NextResponse.json({ error: 'Already in wishlist' }, { status: 400 })
        }

        // Add to wishlist
        const wishlistItem = await prisma.wishlist.create({
            data: {
                userId: user.id,
                productId: productId
            },
            include: {
                product: {
                    include: {
                        category: true
                    }
                }
            }
        })

        return NextResponse.json({
            message: 'Added to wishlist',
            wishlistItem
        })
    } catch (error) {
        console.error('Wishlist POST Error:', error)
        return NextResponse.json(
            { error: 'Failed to add to wishlist' },
            { status: 500 }
        )
    }
}

// DELETE - Remove item from wishlist
export async function DELETE(req: Request) {
    try {
        const session = await auth()
        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email }
        })

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 })
        }

        const { searchParams } = new URL(req.url)
        const productId = searchParams.get('productId')

        if (!productId) {
            return NextResponse.json({ error: 'Product ID is required' }, { status: 400 })
        }

        // Delete from wishlist
        await prisma.wishlist.deleteMany({
            where: {
                userId: user.id,
                productId: productId
            }
        })

        return NextResponse.json({
            message: 'Removed from wishlist'
        })
    } catch (error) {
        console.error('Wishlist DELETE Error:', error)
        return NextResponse.json(
            { error: 'Failed to remove from wishlist' },
            { status: 500 }
        )
    }
}
