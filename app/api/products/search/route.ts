import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url)

        // Get query parameters
        const query = searchParams.get('q') || ''
        const category = searchParams.get('category')
        const minPrice = searchParams.get('minPrice')
        const maxPrice = searchParams.get('maxPrice')
        const sortBy = searchParams.get('sortBy') || 'name'
        const inStock = searchParams.get('inStock')

        // Build where clause
        const where: any = {}

        // Search query - search in name, description, ingredients
        if (query) {
            where.OR = [
                { name: { contains: query, mode: 'insensitive' } },
                { description: { contains: query, mode: 'insensitive' } },
                { ingredients: { contains: query, mode: 'insensitive' } },
            ]
        }

        // Category filter
        if (category && category !== 'all') {
            where.categoryId = category
        }

        // Price range filter
        if (minPrice || maxPrice) {
            where.price = {}
            if (minPrice) where.price.gte = parseFloat(minPrice)
            if (maxPrice) where.price.lte = parseFloat(maxPrice)
        }

        // Stock filter
        if (inStock === 'true') {
            where.inStock = true
        }

        // Build orderBy clause
        let orderBy: any = {}
        switch (sortBy) {
            case 'price-asc':
                orderBy = { price: 'asc' }
                break
            case 'price-desc':
                orderBy = { price: 'desc' }
                break
            case 'name':
                orderBy = { name: 'asc' }
                break
            case 'newest':
                orderBy = { createdAt: 'desc' }
                break
            case 'featured':
                orderBy = [{ featured: 'desc' }, { name: 'asc' }]
                break
            default:
                orderBy = { name: 'asc' }
        }

        // Fetch products with filters
        const products = await prisma.product.findMany({
            where,
            orderBy,
            include: {
                category: {
                    select: {
                        id: true,
                        name: true,
                        slug: true,
                    }
                }
            }
        })

        // Get total count for the query
        const total = await prisma.product.count({ where })

        // Get price range for current filters
        const priceStats = await prisma.product.aggregate({
            where,
            _min: { price: true },
            _max: { price: true },
        })

        return NextResponse.json({
            products,
            total,
            priceRange: {
                min: priceStats._min.price || 0,
                max: priceStats._max.price || 1000,
            },
            filters: {
                query,
                category,
                minPrice,
                maxPrice,
                sortBy,
                inStock,
            }
        })

    } catch (error) {
        console.error('Search Error:', error)
        return NextResponse.json(
            { error: 'Failed to search products' },
            { status: 500 }
        )
    }
}
