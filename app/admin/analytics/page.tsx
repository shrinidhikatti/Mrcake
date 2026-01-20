'use client'

import { useEffect, useState } from 'react'
import {
    TrendingUp,
    Users,
    ShoppingBag,
    DollarSign,
    Loader2,
    ArrowUp,
    ArrowDown,
    Package
} from 'lucide-react'
import {
    LineChart,
    Line,
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from 'recharts'

interface AnalyticsData {
    revenue: {
        total: number
        thisMonth: number
        lastMonth: number
        growth: number
        byMonth: Array<{ month: string; revenue: number }>
        byDay: Array<{ day: string; revenue: number; orders: number }>
    }
    products: {
        topSelling: Array<{
            id: string
            name: string
            price: number
            images: string
            totalSold: number
            orderCount: number
        }>
    }
    orders: {
        byStatus: Array<{ status: string; count: number }>
        recent: any[]
        avgValue: number
    }
    categories: Array<{
        categoryId: string
        categoryName: string
        totalOrders: number
        totalRevenue: number
    }>
    customers: {
        total: number
        new: number
        repeat: number
        repeatRate: number
    }
}

const COLORS = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F']

export default function AnalyticsPage() {
    const [data, setData] = useState<AnalyticsData | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        loadAnalytics()
    }, [])

    const loadAnalytics = async () => {
        try {
            const res = await fetch('/api/admin/analytics')
            if (!res.ok) throw new Error('Failed to fetch analytics')
            const analytics = await res.json()
            setData(analytics)
        } catch (err: any) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="w-10 h-10 animate-spin text-primary" />
            </div>
        )
    }

    if (error || !data) {
        return (
            <div className="p-8 text-center">
                <p className="text-red-600">Error: {error || 'No data available'}</p>
            </div>
        )
    }

    return (
        <div className="p-8 bg-gray-50 min-h-screen">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Analytics Dashboard</h1>

            {/* Key Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {/* Total Revenue */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 rounded-xl bg-green-50">
                            <DollarSign className="w-6 h-6 text-green-600" />
                        </div>
                        <div className={`flex items-center gap-1 text-sm font-bold ${data.revenue.growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {data.revenue.growth >= 0 ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
                            {Math.abs(data.revenue.growth).toFixed(1)}%
                        </div>
                    </div>
                    <h3 className="text-gray-500 text-sm font-medium mb-1">Total Revenue</h3>
                    <p className="text-2xl font-bold text-gray-900">₹{data.revenue.total.toFixed(2)}</p>
                    <p className="text-xs text-gray-400 mt-2">This month: ₹{data.revenue.thisMonth.toFixed(2)}</p>
                </div>

                {/* Total Customers */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 rounded-xl bg-blue-50">
                            <Users className="w-6 h-6 text-blue-600" />
                        </div>
                        <div className="text-sm font-bold text-blue-600">
                            +{data.customers.new} new
                        </div>
                    </div>
                    <h3 className="text-gray-500 text-sm font-medium mb-1">Total Customers</h3>
                    <p className="text-2xl font-bold text-gray-900">{data.customers.total}</p>
                    <p className="text-xs text-gray-400 mt-2">Repeat rate: {data.customers.repeatRate.toFixed(1)}%</p>
                </div>

                {/* Average Order Value */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 rounded-xl bg-purple-50">
                            <ShoppingBag className="w-6 h-6 text-purple-600" />
                        </div>
                    </div>
                    <h3 className="text-gray-500 text-sm font-medium mb-1">Avg Order Value</h3>
                    <p className="text-2xl font-bold text-gray-900">₹{data.orders.avgValue.toFixed(2)}</p>
                    <p className="text-xs text-gray-400 mt-2">Per completed order</p>
                </div>

                {/* Total Orders */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 rounded-xl bg-orange-50">
                            <Package className="w-6 h-6 text-orange-600" />
                        </div>
                    </div>
                    <h3 className="text-gray-500 text-sm font-medium mb-1">Total Orders</h3>
                    <p className="text-2xl font-bold text-gray-900">
                        {data.orders.byStatus.reduce((sum, item) => sum + item.count, 0)}
                    </p>
                    <p className="text-xs text-gray-400 mt-2">All statuses</p>
                </div>
            </div>

            {/* Charts Row 1 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                {/* Revenue by Month */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Revenue by Month</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={data.revenue.byMonth}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip formatter={(value: any) => `₹${value.toFixed(2)}`} />
                            <Legend />
                            <Line type="monotone" dataKey="revenue" stroke="#FF6B6B" strokeWidth={2} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                {/* Revenue by Day (Last 30 Days) */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Daily Revenue (Last 30 Days)</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={data.revenue.byDay}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="day" />
                            <YAxis />
                            <Tooltip formatter={(value: any) => `₹${value.toFixed(2)}`} />
                            <Legend />
                            <Line type="monotone" dataKey="revenue" stroke="#4ECDC4" strokeWidth={2} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Charts Row 2 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                {/* Top Selling Products */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Top Selling Products</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={data.products.topSelling}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="totalSold" fill="#FF6B6B" name="Units Sold" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Order Status Distribution */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Order Status Distribution</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={data.orders.byStatus}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ status, count }) => `${status}: ${count}`}
                                outerRadius={100}
                                fill="#8884d8"
                                dataKey="count"
                            >
                                {data.orders.byStatus.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Category Performance */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Category Performance</h3>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={data.categories}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="categoryName" />
                        <YAxis />
                        <Tooltip formatter={(value: any) => `₹${value.toFixed(2)}`} />
                        <Legend />
                        <Bar dataKey="totalRevenue" fill="#4ECDC4" name="Revenue" />
                        <Bar dataKey="totalOrders" fill="#FFA07A" name="Orders" />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {/* Top Products Table */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Top 10 Products Details</h3>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-gray-200">
                                <th className="text-left py-3 px-4 text-sm font-bold text-gray-700">Product</th>
                                <th className="text-left py-3 px-4 text-sm font-bold text-gray-700">Price</th>
                                <th className="text-right py-3 px-4 text-sm font-bold text-gray-700">Units Sold</th>
                                <th className="text-right py-3 px-4 text-sm font-bold text-gray-700">Orders</th>
                                <th className="text-right py-3 px-4 text-sm font-bold text-gray-700">Revenue</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.products.topSelling.map((product) => (
                                <tr key={product.id} className="border-b border-gray-100 hover:bg-gray-50">
                                    <td className="py-3 px-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-lg bg-gray-100 overflow-hidden">
                                                <img
                                                    src={JSON.parse(product.images)[0] || '/placeholder.png'}
                                                    alt={product.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <span className="font-medium text-gray-900">{product.name}</span>
                                        </div>
                                    </td>
                                    <td className="py-3 px-4 text-gray-700">₹{product.price.toFixed(2)}</td>
                                    <td className="py-3 px-4 text-right font-bold text-gray-900">{product.totalSold}</td>
                                    <td className="py-3 px-4 text-right text-gray-700">{product.orderCount}</td>
                                    <td className="py-3 px-4 text-right font-bold text-green-600">
                                        ₹{(product.price * product.totalSold).toFixed(2)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
