import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
    try {
        const session = await auth()

        if (!session || !session.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        // Fetch user statistics
        const [orderCount, reviewCount] = await Promise.all([
            prisma.order.count({
                where: { userId: session.user.id }
            }),
            prisma.review.count({
                where: { userId: session.user.id }
            })
        ])

        return NextResponse.json({
            orders: orderCount,
            reviews: reviewCount
        })

    } catch (error) {
        console.error('User Stats Error:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
