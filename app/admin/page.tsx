import { prisma } from "@/lib/prisma"
import { ShoppingBag, Package, Users, TrendingUp, Clock, CheckCircle2, ChevronRight } from "lucide-react"
import Link from "next/link"

export default async function AdminDashboard() {
    const stats = [
        { label: "Total Orders", value: "124", icon: ShoppingBag, color: "text-blue-600", bg: "bg-blue-50" },
        { label: "Active Products", value: "18", icon: Package, color: "text-orange-600", bg: "bg-orange-50" },
        { label: "Total Customers", value: "842", icon: Users, color: "text-green-600", bg: "bg-green-50" },
        { label: "Revenue (Mtd)", value: "₹42,350", icon: TrendingUp, color: "text-purple-600", bg: "bg-purple-50" },
    ]

    const recentOrders = await prisma.order.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: { user: true }
    })

    return (
        <div className="space-y-10">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-display font-bold text-gray-900">Dashboard Overview</h1>
                    <p className="text-gray-500 mt-1">Here's what's happening at MrCake today.</p>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat) => (
                    <div key={stat.label} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-6 hover:shadow-md transition-shadow">
                        <div className={`${stat.bg} ${stat.color} p-4 rounded-2xl`}>
                            <stat.icon className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-xs font-bold uppercase tracking-wider text-gray-400">{stat.label}</p>
                            <p className="text-2xl font-display font-bold text-gray-900 mt-1">{stat.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
                {/* Recent Orders */}
                <div className="xl:col-span-2 bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-8 border-b border-gray-50 flex items-center justify-between">
                        <h2 className="text-xl font-display font-bold text-gray-900">Recent Orders</h2>
                        <Link href="/admin/orders" className="text-sm font-bold text-primary hover:underline flex items-center group">
                            View All <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50/50">
                                    <th className="px-8 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">Order ID</th>
                                    <th className="px-8 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">Customer</th>
                                    <th className="px-8 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">Total</th>
                                    <th className="px-8 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {recentOrders.length > 0 ? recentOrders.map((order) => (
                                    <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-8 py-5 text-sm font-bold text-gray-900">#{order.orderNumber}</td>
                                        <td className="px-8 py-5">
                                            <p className="text-sm font-bold text-gray-900">{order.user.name}</p>
                                            <p className="text-xs text-gray-500">{order.user.email}</p>
                                        </td>
                                        <td className="px-8 py-5 text-sm font-bold text-primary">₹{order.total}</td>
                                        <td className="px-8 py-5">
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${order.status === 'DELIVERED' ? 'bg-success/10 text-success' : 'bg-orange-100 text-orange-600'
                                                }`}>
                                                {order.status}
                                            </span>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan={4} className="px-8 py-20 text-center text-gray-400 font-medium">No recent orders yet.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Quick Actions / Status */}
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 space-y-8">
                    <h2 className="text-xl font-display font-bold text-gray-900">Quick Actions</h2>
                    <div className="grid gap-4">
                        <Link href="/admin/products/new" className="flex items-center gap-4 p-4 rounded-2xl border border-gray-100 hover:border-primary/20 hover:bg-primary/5 transition-all group">
                            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                                <Package className="w-6 h-6" />
                            </div>
                            <div className="flex-grow">
                                <p className="font-bold text-gray-900">Add Product</p>
                                <p className="text-xs text-gray-500">List a new bakery item</p>
                            </div>
                            <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-primary transition-colors" />
                        </Link>

                        <Link href="/admin/orders" className="flex items-center gap-4 p-4 rounded-2xl border border-gray-100 hover:border-secondary/20 hover:bg-secondary/5 transition-all group">
                            <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary">
                                <Clock className="w-6 h-6" />
                            </div>
                            <div className="flex-grow">
                                <p className="font-bold text-gray-900">Pending Orders</p>
                                <p className="text-xs text-gray-500">Check orders to fulfill</p>
                            </div>
                            <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-secondary transition-colors" />
                        </Link>
                    </div>

                    <div className="pt-8 border-t border-gray-50">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-bold text-gray-900">System Health</h3>
                            <span className="flex items-center gap-1.5 text-xs font-bold text-success uppercase tracking-widest">
                                <span className="w-2 h-2 rounded-full bg-success animate-pulse"></span>
                                Active
                            </span>
                        </div>
                        <div className="space-y-3">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Database (SQLite)</span>
                                <span className="text-gray-900 font-bold">Stable</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Next.js Edge Runtime</span>
                                <span className="text-gray-900 font-bold">Optimized</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
