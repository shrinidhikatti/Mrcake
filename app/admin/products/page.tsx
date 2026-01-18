import { prisma } from "@/lib/prisma"
import { Package, Plus, Search, Edit3, Trash2, ExternalLink } from "lucide-react"
import DeleteProductButton from "@/components/admin/DeleteProductButton"
import Link from "next/link"
import Image from "next/image"

export default async function AdminProductsPage() {
    const products = await prisma.product.findMany({
        include: { category: true },
        orderBy: { createdAt: "desc" },
    })

    return (
        <div className="space-y-10">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-display font-bold text-gray-900">Inventory</h1>
                    <p className="text-gray-500 mt-1">Manage all your bakery products and variations.</p>
                </div>
                <Link
                    href="/admin/products/new"
                    className="bg-gray-900 text-white px-8 py-3.5 rounded-2xl text-sm font-bold shadow-lg hover:bg-black transition flex items-center gap-2 group border-none shrink-0"
                >
                    <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
                    Add New Product
                </Link>
            </div>

            {/* Tool Bar */}
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search products by name or SKU..."
                        className="w-full bg-gray-50 border border-gray-100 rounded-xl pl-12 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    />
                </div>
                <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
                    <select className="bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm focus:outline-none appearance-none cursor-pointer pr-10 min-w-[140px]">
                        <option>All Categories</option>
                        <option>Cakes</option>
                        <option>Breads</option>
                    </select>
                    <button className="text-sm font-bold text-gray-500 hover:text-primary transition shrink-0 px-4">Clear Filters</button>
                </div>
            </div>

            {/* Product Table */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50/50">
                                <th className="px-8 py-5 text-xs font-bold uppercase tracking-wider text-gray-500">Product</th>
                                <th className="px-8 py-5 text-xs font-bold uppercase tracking-wider text-gray-500">Category</th>
                                <th className="px-8 py-5 text-xs font-bold uppercase tracking-wider text-gray-500">Price</th>
                                <th className="px-8 py-5 text-xs font-bold uppercase tracking-wider text-gray-500">Stock</th>
                                <th className="px-8 py-5 text-xs font-bold uppercase tracking-wider text-gray-500 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {products.map((product) => {
                                const images = JSON.parse(product.images as string || '[]')
                                const mainImage = images[0] || '/placeholder.png'

                                return (
                                    <tr key={product.id} className="hover:bg-gray-50/50 transition-colors group">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-16 h-16 rounded-xl overflow-hidden border border-gray-100 shrink-0 shadow-sm group-hover:shadow-md transition-shadow">
                                                    <Image src={mainImage} alt={product.name} width={64} height={64} className="w-full h-full object-cover" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-gray-900 group-hover:text-primary transition-colors">{product.name}</p>
                                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.1em] mt-0.5">#{product.slug}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className="text-xs font-bold uppercase tracking-wider text-secondary bg-secondary/10 px-3 py-1 rounded-full">
                                                {product.category.name}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6">
                                            <p className="text-sm font-bold text-gray-900">₹{product.price}</p>
                                            {product.weight && <p className="text-xs text-gray-400">{product.weight}</p>}
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-2">
                                                <span className={`w-2 h-2 rounded-full ${product.inStock ? 'bg-success' : 'bg-destructive'}`}></span>
                                                <span className="text-sm font-medium text-gray-700">{product.inStock ? 'In Stock' : 'Out of Stock'}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Link
                                                    href={`/products/${product.slug}`}
                                                    target="_blank"
                                                    className="p-2.5 rounded-xl hover:bg-gray-100 text-gray-500 transition-colors"
                                                    title="View on site"
                                                >
                                                    <ExternalLink className="w-4 h-4" />
                                                </Link>
                                                <Link
                                                    href={`/admin/products/edit/${product.id}`}
                                                    className="p-2.5 rounded-xl hover:bg-primary/10 text-primary transition-colors"
                                                    title="Edit product"
                                                >
                                                    <Edit3 className="w-4 h-4" />
                                                </Link>
                                                <DeleteProductButton productId={product.id} />
                                            </div>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
