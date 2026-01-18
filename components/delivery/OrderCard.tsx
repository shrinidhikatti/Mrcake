'use client'

import { useState } from 'react'
import { Package, Phone, MapPin, Navigation, Loader2, CheckCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

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

interface OrderCardProps {
    order: Order
    onUpdate: () => void
}

export default function OrderCard({ order, onUpdate }: OrderCardProps) {
    const [updating, setUpdating] = useState(false)

    const getNextStatus = () => {
        switch (order.status) {
            case 'ASSIGNED':
                return { status: 'PICKED_UP', label: 'Mark as Picked Up', icon: Package }
            case 'PICKED_UP':
                return { status: 'OUT_FOR_DELIVERY', label: 'Start Delivery', icon: Navigation }
            case 'OUT_FOR_DELIVERY':
                return { status: 'DELIVERED', label: 'Mark as Delivered', icon: CheckCircle }
            default:
                return null
        }
    }

    const handleUpdateStatus = async () => {
        const next = getNextStatus()
        if (!next) return

        setUpdating(true)
        try {
            const token = localStorage.getItem('delivery_token')
            const res = await fetch(`/api/delivery/orders/${order.id}/status`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ status: next.status })
            })

            if (res.ok) {
                onUpdate()
            } else {
                alert('Failed to update status')
            }
        } catch (error) {
            alert('Error updating status')
        } finally {
            setUpdating(false)
        }
    }

    const nextAction = getNextStatus()
    const statusColors: Record<string, string> = {
        ASSIGNED: 'bg-blue-100 text-blue-600',
        PICKED_UP: 'bg-purple-100 text-purple-600',
        OUT_FOR_DELIVERY: 'bg-orange-100 text-orange-600',
    }

    // Get first product image
    const firstItem = order.items[0]
    let productImage = '/placeholder.png'
    try {
        const images = JSON.parse(firstItem.product.images)
        if (Array.isArray(images) && images.length > 0) {
            productImage = images[0]
        }
    } catch (e) {
        // Use placeholder
    }

    return (
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Order Header */}
            <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between mb-3">
                    <div>
                        <p className="text-xs text-gray-500 mb-1">Order ID</p>
                        <p className="font-bold text-gray-900">#{order.orderNumber}</p>
                    </div>
                    <span className={cn(
                        "px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider",
                        statusColors[order.status] || 'bg-gray-100 text-gray-600'
                    )}>
                        {order.status.replace(/_/g, ' ')}
                    </span>
                </div>

                {/* Items Preview */}
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                    <img
                        src={productImage}
                        alt=""
                        className="w-12 h-12 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                        <p className="text-sm font-bold text-gray-900">{firstItem.product.name}</p>
                        {order.items.length > 1 && (
                            <p className="text-xs text-gray-500">+{order.items.length - 1} more item{order.items.length > 2 ? 's' : ''}</p>
                        )}
                    </div>
                    <p className="font-bold text-primary">₹{order.total}</p>
                </div>
            </div>

            {/* Customer & Address */}
            <div className="p-6 space-y-4">
                <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Customer</p>
                    <div className="flex items-center gap-3">
                        <div className="flex-1">
                            <p className="text-sm font-bold text-gray-900">{order.address.fullName}</p>
                        </div>
                        <a
                            href={`tel:${order.address.phone}`}
                            className="p-3 rounded-xl bg-success/10 text-success hover:bg-success/20 transition-colors"
                            title="Call Customer"
                        >
                            <Phone className="w-5 h-5" />
                        </a>
                    </div>
                </div>

                <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Delivery Address</p>
                    <div className="flex gap-3">
                        <MapPin className="w-4 h-4 text-gray-400 mt-1 shrink-0" />
                        <div className="flex-1">
                            <p className="text-sm text-gray-700 leading-relaxed">
                                {order.address.address}, {order.address.city}
                            </p>
                            <p className="text-sm text-gray-500">{order.address.pincode}</p>
                        </div>
                        <a
                            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                                `${order.address.address}, ${order.address.city}, ${order.address.pincode}`
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-3 rounded-xl bg-primary/10 text-primary hover:bg-primary/20 transition-colors shrink-0"
                            title="Open in Maps"
                        >
                            <Navigation className="w-5 h-5" />
                        </a>
                    </div>
                </div>
            </div>

            {/* Action Button */}
            {nextAction && (
                <div className="p-6 pt-0">
                    <button
                        onClick={handleUpdateStatus}
                        disabled={updating}
                        className="w-full bg-gray-900 text-white py-4 rounded-2xl text-base font-bold hover:bg-black transition shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                    >
                        {updating ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Updating...
                            </>
                        ) : (
                            <>
                                <nextAction.icon className="w-5 h-5" />
                                {nextAction.label}
                            </>
                        )}
                    </button>
                </div>
            )}
        </div>
    )
}
