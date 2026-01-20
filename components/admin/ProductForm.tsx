"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Save, X, Plus, Trash2, Loader2, Image as ImageIcon } from "lucide-react"
import ImageUpload from "./ImageUpload"

interface Category {
    id: string
    name: string
}

interface Product {
    id?: string
    name: string
    slug: string
    description: string
    price: number
    images: string // JSON string
    categoryId: string
    inStock: boolean
    featured: boolean
    weight?: string | null
    servings?: string | null
    ingredients?: string | null
    allergens?: string | null
}

interface ProductFormProps {
    initialData?: Product | null
    categories: Category[]
}

export default function ProductForm({ initialData, categories }: ProductFormProps) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [images, setImages] = useState<string[]>(initialData ? JSON.parse(initialData.images) : [])

    const [formData, setFormData] = useState<Partial<Product>>(
        initialData || {
            name: "",
            slug: "",
            description: "",
            price: 0,
            categoryId: categories[0]?.id || "",
            inStock: true,
            featured: false,
            weight: "",
            servings: "",
            ingredients: "",
            allergens: "",
        }
    )

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            const url = initialData
                ? `/api/admin/products/${initialData.id}`
                : "/api/admin/products"
            const method = initialData ? "PUT" : "POST"

            const response = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...formData,
                    images: JSON.stringify(images.length > 0 ? images : ["/placeholder.png"]),
                }),
            })

            if (response.ok) {
                router.push("/admin/products")
                router.refresh()
            } else {
                const error = await response.json()
                alert(error.error || "Something went wrong")
            }
        } catch (error) {
            console.error("Error saving product:", error)
            alert("Failed to save product")
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Basic Information */}
                <div className="space-y-6 bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
                    <h3 className="text-lg font-bold text-gray-900 border-b border-gray-50 pb-4">Basic Details</h3>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Product Name</label>
                            <input
                                type="text"
                                required
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value, slug: e.target.value.toLowerCase().replace(/ /g, "-").replace(/[^\w-]+/g, "") })}
                                className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                placeholder="e.g. Chocolate Truffle Cake"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Slug (URL)</label>
                            <input
                                type="text"
                                required
                                value={formData.slug}
                                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-mono"
                                placeholder="chocolate-truffle-cake"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Description</label>
                            <textarea
                                required
                                rows={4}
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
                                placeholder="Describe the product deliciousness..."
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Price (₹)</label>
                                <input
                                    type="number"
                                    required
                                    min="0"
                                    value={formData.price}
                                    onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                                    className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Category</label>
                                <select
                                    required
                                    value={formData.categoryId}
                                    onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                                    className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm focus:outline-none appearance-none cursor-pointer"
                                >
                                    <option value="" disabled>Select Category</option>
                                    {categories.map((cat) => (
                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Media & Inventory */}
                <div className="space-y-6">
                    <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
                        <ImageUpload
                            images={images}
                            onImagesChange={setImages}
                            maxImages={5}
                        />
                    </div>

                    <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
                        <h3 className="text-lg font-bold text-gray-900 border-b border-gray-50 pb-4">Details & Inventory</h3>

                        <div className="mt-4 space-y-6">
                            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                                <div>
                                    <p className="text-sm font-bold text-gray-900">In Stock</p>
                                    <p className="text-xs text-gray-500">Enable if product is available for purchase</p>
                                </div>
                                <input
                                    type="checkbox"
                                    checked={formData.inStock}
                                    onChange={(e) => setFormData({ ...formData, inStock: e.target.checked })}
                                    className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary"
                                />
                            </div>

                            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                                <div>
                                    <p className="text-sm font-bold text-gray-900">Featured Product</p>
                                    <p className="text-xs text-gray-500">Show on homepage and top results</p>
                                </div>
                                <input
                                    type="checkbox"
                                    checked={formData.featured}
                                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                                    className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Weight</label>
                                    <input
                                        type="text"
                                        value={formData.weight || ""}
                                        onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                                        className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm focus:outline-none"
                                        placeholder="e.g. 500g, 1kg"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Servings</label>
                                    <input
                                        type="text"
                                        value={formData.servings || ""}
                                        onChange={(e) => setFormData({ ...formData, servings: e.target.value })}
                                        className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm focus:outline-none"
                                        placeholder="e.g. 4-6 Persons"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Additional Info */}
            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
                <h3 className="text-lg font-bold text-gray-900 border-b border-gray-50 pb-4">Ingredients & Allergens</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Ingredients</label>
                        <textarea
                            rows={3}
                            value={formData.ingredients || ""}
                            onChange={(e) => setFormData({ ...formData, ingredients: e.target.value })}
                            className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
                            placeholder="List main ingredients..."
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Allergens</label>
                        <textarea
                            rows={3}
                            value={formData.allergens || ""}
                            onChange={(e) => setFormData({ ...formData, allergens: e.target.value })}
                            className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
                            placeholder="Contain nuts, gluten, etc..."
                        />
                    </div>
                </div>
            </div>

            <div className="flex items-center justify-end gap-4 pb-10">
                <button
                    type="button"
                    onClick={() => router.back()}
                    className="px-8 py-3.5 rounded-2xl text-sm font-bold text-gray-500 hover:bg-gray-100 transition"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={loading}
                    className="bg-primary text-white px-10 py-3.5 rounded-2xl text-sm font-bold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center gap-2 disabled:opacity-50 disabled:translate-y-0"
                >
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                    {initialData ? "Save Changes" : "Create Product"}
                </button>
            </div>
        </form>
    )
}
