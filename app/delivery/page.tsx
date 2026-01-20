'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'
import { Loader2, LogOut, Package, CheckCircle, Bike } from 'lucide-react'
import OrderCard from '@/components/delivery/OrderCard'

interface Order {
    id: string
    orderNumber: string
    status: string
    total: number
    createdAt: string
    user: {
        name: string
        phone: string | null
    }
    address: {
        fullName: string
        phone: string
        address: string
        city: string
        pincode: string
    }
    items: Array<{
        id: string
        quantity: number
        product: {
            name: string
            images: string
        }
    }>
}

export default function DeliveryDashboard() {
    const router = useRouter()
    const { data: session, status } = useSession()
    const [orders, setOrders] = useState<Order[]>([])
    const [loading, setLoading] = useState(true)
    const [tab, setTab] = useState<'active' | 'completed'>('active')
    const [totalDeliveries, setTotalDeliveries] = useState(0)

    useEffect(() => {
        if (status === 'loading') return

        if (status === 'unauthenticated' || !session) {
            router.push('/login?callbackUrl=/delivery')
            return
        }

        if (session.user.role !== 'DELIVERY_PARTNER') {
            router.push('/')
            return
        }

        loadOrders()
        loadPartnerStats()
    }, [status, session, router])

    const loadPartnerStats = async () => {
        try {
            const res = await fetch('/api/delivery/stats')
            if (res.ok) {
                const data = await res.json()
                setTotalDeliveries(data.totalDeliveries || 0)
            }
        } catch (error) {
            console.error('Failed to load stats')
        }
    }

    const loadOrders = async () => {
        try {
            const res = await fetch('/api/delivery/orders')

            if (res.ok) {
                const data = await res.json()
                setOrders(data)
            } else if (res.status === 401) {
                router.push('/login')
            }
        } catch (error) {
            console.error('Failed to load orders')
        } finally {
            setLoading(false)
        }
    }

    const handleLogout = () => {
        signOut({ callbackUrl: '/login' })
    }

    const handleRefresh = () => {
        setLoading(true)
        loadOrders()
        loadPartnerStats()
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <Loader2 className="w-10 h-10 animate-spin text-primary" />
            </div>
        )
    }

    const activeOrders = orders.filter(o => ['ASSIGNED', 'PICKED_UP', 'OUT_FOR_DELIVERY'].includes(o.status))
    const displayOrders = tab === 'active' ? activeOrders : []

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            {/* Header */}
            <div className="bg-white border-b border-gray-100 sticky top-0 z-10">
                <div className="max-w-2xl mx-auto px-4 py-4">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center">
                                <Bike className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                                <p className="text-xs text-gray-500">Welcome back,</p>
                                <p className="font-bold text-gray-900">{session?.user?.name}</p>
                            </div>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="p-2.5 rounded-xl hover:bg-gray-100 transition-colors"
                            title="Logout"
                        >
                            <LogOut className="w-5 h-5 text-gray-600" />
                        </button>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-3">
                        <div className="bg-success/5 p-4 rounded-2xl border border-success/10">
                            <p className="text-xs text-success/70 font-bold uppercase tracking-wider mb-1">Active</p>
                            <p className="text-2xl font-display font-bold text-success">{activeOrders.length}</p>
                        </div>
                        <div className="bg-primary/5 p-4 rounded-2xl border border-primary/10">
                            <p className="text-xs text-primary/70 font-bold uppercase tracking-wider mb-1">Completed</p>
                            <p className="text-2xl font-display font-bold text-primary">{totalDeliveries}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="max-w-2xl mx-auto px-4 py-4">
                <div className="flex gap-2">
                    <button
                        onClick={() => setTab('active')}
                        className={`flex-1 py-3 rounded-xl text-sm font-bold uppercase tracking-wider transition-all ${tab === 'active'
                                ? 'bg-gray-900 text-white'
                                : 'bg-white text-gray-600 border border-gray-100'
                            }`}
                    >
                        Active Orders
                    </button>
                    <button
                        onClick={handleRefresh}
                        className="px-4 py-3 rounded-xl bg-white border border-gray-100 hover:bg-gray-50 transition-colors"
                        title="Refresh"
                    >
                        <Package className="w-5 h-5 text-gray-600" />
                    </button>
                </div>
            </div>

            {/* Orders List */}
            <div className="max-w-2xl mx-auto px-4 space-y-4">
                {displayOrders.length === 0 ? (
                    <div className="bg-white rounded-3xl p-12 text-center border border-gray-100">
                        <CheckCircle className="w-16 h-16 text-gray-200 mx-auto mb-4" />
                        <p className="text-gray-500 font-medium">No active deliveries</p>
                        <p className="text-sm text-gray-400 mt-1">You're all caught up!</p>
                    </div>
                ) : (
                    displayOrders.map((order) => (
                        <OrderCard key={order.id} order={order} onUpdate={handleRefresh} />
                    ))
                )}
            </div>
        </div>
    )
}
