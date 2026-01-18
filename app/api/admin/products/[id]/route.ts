import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

// Get single product
export async function GET(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const session = await auth()
        if (!session || session.user.role !== 'ADMIN') {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const product = await prisma.product.findUnique({
            where: { id: params.id },
            include: { category: true }
        })

        if (!product) {
            return NextResponse.json({ error: "Product not found" }, { status: 404 })
        }

        return NextResponse.json(product)
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}

// Update product
export async function PUT(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const session = await auth()
        if (!session || session.user.role !== 'ADMIN') {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const data = await req.json()

        const product = await prisma.product.update({
            where: { id: params.id },
            data: {
                name: data.name,
                slug: data.slug,
                description: data.description,
                price: parseFloat(data.price),
                images: data.images,
                categoryId: data.categoryId,
                inStock: data.inStock,
                featured: data.featured,
                weight: data.weight,
                servings: data.servings,
                ingredients: data.ingredients,
                allergens: data.allergens,
            }
        })

        return NextResponse.json(product)
    } catch (error) {
        console.error("Admin Product UPDATE Error:", error)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}

// Delete product
export async function DELETE(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const session = await auth()
        if (!session || session.user.role !== 'ADMIN') {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        await prisma.product.delete({
            where: { id: params.id }
        })

        return NextResponse.json({ message: "Product deleted successfully" })
    } catch (error) {
        console.error("Admin Product DELETE Error:", error)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}
