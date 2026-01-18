"use client"

import { Trash2, Loader2 } from "lucide-react"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function DeleteProductButton({ productId }: { productId: string }) {
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete this product?")) return

        setLoading(true)
        try {
            const res = await fetch(`/api/admin/products/${productId}`, {
                method: "DELETE",
            })

            if (res.ok) {
                router.refresh()
            } else {
                alert("Failed to delete product")
            }
        } catch (error) {
            console.error("Delete Error:", error)
            alert("Error deleting product")
        } finally {
            setLoading(false)
        }
    }

    return (
        <button
            onClick={handleDelete}
            disabled={loading}
            className="p-2.5 rounded-xl hover:bg-destructive/10 text-destructive transition-colors disabled:opacity-50"
            title="Delete product"
        >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
        </button>
    )
}
