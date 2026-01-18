import { prisma } from "@/lib/prisma"
import ProductForm from "@/components/admin/ProductForm"

export default async function NewProductPage() {
    const categories = await prisma.category.findMany({
        orderBy: { name: "asc" },
    })

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-display font-bold text-gray-900">Add New Product</h1>
                <p className="text-gray-500 mt-1">Fill in the details to create a new bakery item.</p>
            </div>

            <ProductForm categories={categories} />
        </div>
    )
}
