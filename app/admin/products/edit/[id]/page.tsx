import { prisma } from "@/lib/prisma"
import ProductForm from "@/components/admin/ProductForm"
import { notFound } from "next/navigation"

export default async function EditProductPage({ params }: { params: { id: string } }) {
    const [product, categories] = await Promise.all([
        prisma.product.findUnique({
            where: { id: params.id },
        }),
        prisma.category.findMany({
            orderBy: { name: "asc" },
        }),
    ])

    if (!product) {
        notFound()
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-display font-bold text-gray-900">Edit Product</h1>
                <p className="text-gray-500 mt-1">Update details for {product.name}.</p>
            </div>

            <ProductForm initialData={product} categories={categories} />
        </div>
    )
}
