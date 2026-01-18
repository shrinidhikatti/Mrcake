import { prisma } from "@/lib/prisma"
import { ShoppingBag, Search, Eye, RefreshCw, Filter, Calendar, MapPin, Phone } from "lucide-react"
import Link from "next/link"

export default async function AdminOrdersPage() {
    const orders = await prisma.order.findMany({
        include: {
            user: true,
            address: true,
            items: {
                include: { product: true }
            }
        },
        orderBy: { createdAt: "desc" },
    })

    // Status color mapping
    const statusColors: Record<string, string> = {
        PENDING: "bg-orange-100 text-orange-600",
        CONFIRMED: "bg-blue-100 text-blue-600",
        PREPARING: "bg-purple-100 text-purple-600",
        OUT_FOR_DELIVERY: "bg-indigo-100 text-indigo-600",
        DELIVERED: "bg-success/10 text-success",
        CANCELLED: "bg-destructive/10 text-destructive",
    }

    return (
        <div className="space-y-10">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-display font-bold text-gray-900">Order Management</h1>
                    <p className="text-gray-500 mt-1">Track, fulfill, and manage your customer orders.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 bg-white border border-gray-100 px-6 py-3 rounded-2xl text-sm font-bold text-gray-600 hover:bg-gray-50 transition shadow-sm">
                        <Calendar className="w-4 h-4" />
                        Last 30 Days
                    </button>
                    <button className="flex items-center gap-2 bg-gray-900 text-white px-6 py-3 rounded-2xl text-sm font-bold shadow-lg hover:bg-black transition">
                        Export Data
                    </button>
                </div>
            </div>

            {/* Filter Bar */}
            <div className="bg-white p-4 rounded-3xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search by Order ID or Customer..."
                        className="w-full bg-gray-50 border border-gray-100 rounded-xl pl-12 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    />
                </div>
                <div className="flex items-center gap-3 w-full md:w-auto">
                    <div className="flex items-center gap-2 px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl">
                        <Filter className="w-4 h-4 text-gray-400" />
                        <select className="bg-transparent border-none text-sm font-bold text-gray-700 focus:outline-none appearance-none cursor-pointer pr-6">
                            <option>All Statuses</option>
                            <option>Pending</option>
                            <option>Delivered</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Orders Table */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50/50">
                                <th className="px-8 py-5 text-xs font-bold uppercase tracking-wider text-gray-500">Order</th>
                                <th className="px-8 py-5 text-xs font-bold uppercase tracking-wider text-gray-500">Customer</th>
                                <th className="px-8 py-5 text-xs font-bold uppercase tracking-wider text-gray-500">Items</th>
                                <th className="px-8 py-5 text-xs font-bold uppercase tracking-wider text-gray-500">Total</th>
                                <th className="px-8 py-5 text-xs font-bold uppercase tracking-wider text-gray-500">Status</th>
                                <th className="px-8 py-5 text-xs font-bold uppercase tracking-wider text-gray-500 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {orders.map((order) => (
                                <tr key={order.id} className="hover:bg-gray-50/50 transition-colors group">
                                    <td className="px-8 py-6">
                                        <div>
                                            <p className="text-sm font-bold text-gray-900">#{order.orderNumber}</p>
                                            <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                                                <Clock className="w-3 h-3" />
                                                {new Date(order.createdAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex flex-col">
                                            <p className="text-sm font-bold text-gray-900">{order.user.name}</p>
                                            <div className="flex flex-col gap-1 mt-1">
                                                <p className="text-xs text-gray-500 flex items-center gap-1">
                                                    <Phone className="w-3 h-3 text-primary/60" />
                                                    {order.address.phone}
                                                </p>
                                                <p className="text-xs text-gray-400 flex items-center gap-1">
                                                    <MapPin className="w-3 h-3 text-secondary/60" />
                                                    {order.address.city}, {order.address.pincode}
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex -space-x-3">
                                            {order.items.slice(0, 3).map((item, idx) => {
                                                const images = JSON.parse(item.product.images as string || '[]')
                                                return (
                                                    <div key={idx} className="w-10 h-10 rounded-lg border-2 border-white overflow-hidden shadow-sm bg-gray-100" title={item.product.name}>
                                                        <img src={images[0] || '/placeholder.png'} alt="" className="w-full h-full object-cover" />
                                                    </div>
                                                )
                                            })}
                                            {order.items.length > 3 && (
                                                <div className="w-10 h-10 rounded-lg border-2 border-white bg-gray-100 flex items-center justify-center text-[10px] font-bold text-gray-500 shadow-sm">
                                                    +{order.items.length - 3}
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-sm font-bold text-primary">
                                        ₹{order.total}
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="relative inline-block group/status">
                                            <span className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-2 ${statusColors[order.status] || 'bg-gray-100 text-gray-600'}`}>
                                                <span className={`w-1.5 h-1.5 rounded-full bg-current`}></span>
                                                {order.status.replace(/_/g, ' ')}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Link
                                                href={`/admin/orders/${order.id}`}
                                                className="p-2.5 rounded-xl hover:bg-primary/10 text-primary transition-colors"
                                                title="View Details"
                                            >
                                                <Eye className="w-4 h-4" />
                                            </Link>
                                            <button
                                                className="p-2.5 rounded-xl hover:bg-success/10 text-success transition-colors"
                                                title="Update Status"
                                            >
                                                <RefreshCw className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {orders.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="px-8 py-24 text-center">
                                        <ShoppingBag className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                                        <p className="text-gray-400 font-medium">No orders found.</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
