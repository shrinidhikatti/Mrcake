import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

// Get all products (Admin version)
export async function GET() {
    try {
        const session = await auth()
        if (!session || session.user.role !== 'ADMIN') {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const products = await prisma.product.findMany({
            include: { category: true },
            orderBy: { createdAt: 'desc' }
        })

        return NextResponse.json(products)
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}

// Create Product
export async function POST(req: Request) {
    try {
        const session = await auth()
        if (!session || session.user.role !== 'ADMIN') {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const data = await req.json()

        // Basic validation
        if (!data.name || !data.price || !data.categoryId || !data.slug) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
        }

        const product = await prisma.product.create({
            data: {
                name: data.name,
                slug: data.slug,
                description: data.description || "",
                price: parseFloat(data.price),
                images: data.images || JSON.stringify(['/placeholder.png']),
                categoryId: data.categoryId,
                inStock: data.inStock ?? true,
                featured: data.featured ?? false,
                weight: data.weight,
                servings: data.servings,
                ingredients: data.ingredients,
                allergens: data.allergens,
            }
        })

        return NextResponse.json(product)

    } catch (error) {
        console.error("Admin Product Create Error:", error)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}

// Update / Delete Product (Placeholder for logic, typically uses [id] route)
