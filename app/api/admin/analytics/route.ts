import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
    try {
        const session = await auth()
        if (!session || session.user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        // Date ranges
        const now = new Date()
        const last7Days = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        const last30Days = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
        const last12Months = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000)

        // Revenue Analytics
        const revenueByMonth = await prisma.$queryRaw<Array<{ month: string, revenue: number }>>`
            SELECT
                strftime('%Y-%m', createdAt) as month,
                SUM(total) as revenue
            FROM Order
            WHERE status = 'DELIVERED'
                AND createdAt >= ${last12Months.toISOString()}
            GROUP BY strftime('%Y-%m', createdAt)
            ORDER BY month ASC
        `

        const revenueByDay = await prisma.$queryRaw<Array<{ day: string, revenue: number, orders: number }>>`
            SELECT
                strftime('%Y-%m-%d', createdAt) as day,
                SUM(total) as revenue,
                COUNT(*) as orders
            FROM Order
            WHERE status = 'DELIVERED'
                AND createdAt >= ${last30Days.toISOString()}
            GROUP BY strftime('%Y-%m-%d', createdAt)
            ORDER BY day ASC
        `

        // Top Selling Products
        const topProducts = await prisma.orderItem.groupBy({
            by: ['productId'],
            _sum: {
                quantity: true,
            },
            _count: {
                id: true,
            },
            orderBy: {
                _sum: {
                    quantity: 'desc',
                },
            },
            take: 10,
        })

        const topProductsWithDetails = await Promise.all(
            topProducts.map(async (item) => {
                const product = await prisma.product.findUnique({
                    where: { id: item.productId },
                    select: {
                        id: true,
                        name: true,
                        price: true,
                        images: true,
                    },
                })
                return {
                    ...product,
                    totalSold: item._sum.quantity || 0,
                    orderCount: item._count.id,
                }
            })
        )

        // Order Status Distribution
        const ordersByStatus = await prisma.order.groupBy({
            by: ['status'],
            _count: {
                id: true,
            },
        })

        // Category Performance
        const categoryStats = await prisma.$queryRaw<Array<{
            categoryId: string
            categoryName: string
            totalOrders: number
            totalRevenue: number
        }>>`
            SELECT
                p.categoryId,
                c.name as categoryName,
                COUNT(DISTINCT oi.orderId) as totalOrders,
                SUM(oi.quantity * oi.price) as totalRevenue
            FROM OrderItem oi
            JOIN Product p ON oi.productId = p.id
            JOIN Category c ON p.categoryId = c.id
            JOIN "Order" o ON oi.orderId = o.id
            WHERE o.status = 'DELIVERED'
            GROUP BY p.categoryId, c.name
            ORDER BY totalRevenue DESC
        `

        // Customer Analytics
        const totalCustomers = await prisma.user.count({
            where: { role: 'CUSTOMER' }
        })

        const newCustomersLast30Days = await prisma.user.count({
            where: {
                role: 'CUSTOMER',
                createdAt: { gte: last30Days }
            }
        })

        const repeatCustomers = await prisma.$queryRaw<Array<{ count: number }>>`
            SELECT COUNT(DISTINCT userId) as count
            FROM (
                SELECT userId, COUNT(*) as orderCount
                FROM "Order"
                WHERE status = 'DELIVERED'
                GROUP BY userId
                HAVING COUNT(*) > 1
            )
        `

        // Average Order Value
        const avgOrderValue = await prisma.order.aggregate({
            where: { status: 'DELIVERED' },
            _avg: { total: true },
        })

        // Recent Orders
        const recentOrders = await prisma.order.findMany({
            take: 10,
            orderBy: { createdAt: 'desc' },
            include: {
                user: {
                    select: { name: true, email: true }
                },
                items: {
                    include: {
                        product: {
                            select: { name: true }
                        }
                    }
                }
            }
        })

        // Revenue Summary
        const totalRevenue = await prisma.order.aggregate({
            where: { status: 'DELIVERED' },
            _sum: { total: true },
        })

        const revenueThisMonth = await prisma.order.aggregate({
            where: {
                status: 'DELIVERED',
                createdAt: {
                    gte: new Date(now.getFullYear(), now.getMonth(), 1)
                }
            },
            _sum: { total: true },
        })

        const revenueLastMonth = await prisma.order.aggregate({
            where: {
                status: 'DELIVERED',
                createdAt: {
                    gte: new Date(now.getFullYear(), now.getMonth() - 1, 1),
                    lt: new Date(now.getFullYear(), now.getMonth(), 1)
                }
            },
            _sum: { total: true },
        })

        // Growth calculation
        const revenueGrowth = revenueLastMonth._sum.total
            ? ((revenueThisMonth._sum.total || 0) - (revenueLastMonth._sum.total || 0)) / (revenueLastMonth._sum.total || 1) * 100
            : 0

        return NextResponse.json({
            revenue: {
                total: totalRevenue._sum.total || 0,
                thisMonth: revenueThisMonth._sum.total || 0,
                lastMonth: revenueLastMonth._sum.total || 0,
                growth: revenueGrowth,
                byMonth: revenueByMonth,
                byDay: revenueByDay,
            },
            products: {
                topSelling: topProductsWithDetails,
            },
            orders: {
                byStatus: ordersByStatus.map(item => ({
                    status: item.status,
                    count: item._count.id,
                })),
                recent: recentOrders,
                avgValue: avgOrderValue._avg.total || 0,
            },
            categories: categoryStats,
            customers: {
                total: totalCustomers,
                new: newCustomersLast30Days,
                repeat: repeatCustomers[0]?.count || 0,
                repeatRate: totalCustomers > 0 ? ((repeatCustomers[0]?.count || 0) / totalCustomers * 100) : 0,
            },
        })

    } catch (error) {
        console.error('Analytics Error:', error)
        return NextResponse.json(
            { error: 'Failed to fetch analytics' },
            { status: 500 }
        )
    }
}
