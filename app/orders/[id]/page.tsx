'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, Loader2, Package, CheckCircle, Truck, User as UserIcon, Phone, MapPin } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

interface Order {
    id: string
    orderNumber: string
    status: string
    total: number
    createdAt: string
    deliveryPartner?: {
        name: string
        phone: string
        vehicleType: string | null
        vehicleNumber: string | null
    } | null
    user: {
        name: string
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
        price: number
        product: {
            name: string
            images: string
        }
    }>
}

export default function TrackOrderPage() {
    const params = useParams()
    const router = useRouter()
    const [order, setOrder] = useState<Order | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (params.id) {
            fetch(`/api/orders/user`)
                .then(res => res.json())
                .then((orders: Order[]) => {
                    const found = orders.find(o => o.id === params.id)
                    if (found) {
                        setOrder(found)
                    }
                    setLoading(false)
                })
                .catch(() => setLoading(false))
        }
    }, [params.id])

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <Loader2 className="w-10 h-10 animate-spin text-primary" />
            </div>
        )
    }

    if (!order) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <p className="text-gray-500">Order not found</p>
                    <Link href="/profile" className="text-primary font-bold mt-4 inline-block">
                        Back to Profile
                    </Link>
                </div>
            </div>
        )
    }

    const timeline = [
        { status: 'PENDING', label: 'Order Placed', icon: Package },
        { status: 'CONFIRMED', label: 'Confirmed', icon: CheckCircle },
        { status: 'PREPARING', label: 'Preparing', icon: Package },
        { status: 'ASSIGNED', label: 'Assigned to Partner', icon: UserIcon },
        { status: 'PICKED_UP', label: 'Picked Up', icon: Package },
        { status: 'OUT_FOR_DELIVERY', label: 'Out for Delivery', icon: Truck },
        { status: 'DELIVERED', label: 'Delivered', icon: CheckCircle },
    ]

    const statusIndex = timeline.findIndex(t => t.status === order.status)

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            {/* Header */}
            <div className="bg-white border-b border-gray-100 sticky top-0 z-10">
                <div className="max-w-2xl mx-auto px-4 py-4">
                    <div className="flex items-center gap-4">
                        <Link
                            href="/profile"
                            className="p-2 rounded-xl hover:bg-gray-100 transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                        <div>
                            <h1 className="text-xl font-display font-bold text-gray-900">Track Order</h1>
                            <p className="text-sm text-gray-500">#{order.orderNumber}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-2xl mx-auto px-4 py-8 space-y-8">
                {/* Timeline */}
                <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                    <h2 className="text-lg font-display font-bold text-gray-900 mb-8">Order Status</h2>

                    <div className="space-y-6">
                        {timeline.map((step, index) => {
                            const isCompleted = index <= statusIndex
                            const isCurrent = index === statusIndex
                            const Icon = step.icon

                            return (
                                <div key={step.status} className="flex gap-4">
                                    {/* Icon */}
                                    <div className="relative">
                                        <div className={cn(
                                            "w-12 h-12 rounded-2xl flex items-center justify-center transition-all",
                                            isCompleted
                                                ? "bg-success text-white"
                                                : "bg-gray-100 text-gray-400"
                                        )}>
                                            <Icon className="w-6 h-6" />
                                        </div>
                                        {index < timeline.length - 1 && (
                                            <div className={cn(
                                                "absolute left-6 top-12 w-0.5 h-8 transition-all",
                                                isCompleted ? "bg-success" : "bg-gray-200"
                                            )} />
                                        )}
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 pt-2">
                                        <p className={cn(
                                            "font-bold transition-all",
                                            isCompleted ? "text-gray-900" : "text-gray-400"
                                        )}>
                                            {step.label}
                                        </p>
                                        {isCurrent && (
                                            <p className="text-sm text-success mt-1">Current Status</p>
                                        )}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>

                {/* Delivery Partner Info */}
                {order.deliveryPartner && (
                    <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                        <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500 mb-4">Delivery Partner</h3>
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center">
                                <UserIcon className="w-6 h-6 text-primary" />
                            </div>
                            <div className="flex-1">
                                <p className="font-bold text-gray-900">{order.deliveryPartner.name}</p>
                                {order.deliveryPartner.vehicleType && (
                                    <p className="text-sm text-gray-500">
                                        {order.deliveryPartner.vehicleType} • {order.deliveryPartner.vehicleNumber}
                                    </p>
                                )}
                            </div>
                            <a
                                href={`tel:${order.deliveryPartner.phone}`}
                                className="p-3 rounded-xl bg-success/10 text-success hover:bg-success/20 transition-colors"
                            >
                                <Phone className="w-5 h-5" />
                            </a>
                        </div>
                    </div>
                )}

                {/* Delivery Address */}
                <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500 mb-4">Delivery Address</h3>
                    <div className="flex gap-3">
                        <MapPin className="w-5 h-5 text-gray-400 mt-1 shrink-0" />
                        <div className="text-sm text-gray-700 leading-relaxed">
                            <p className="font-bold text-gray-900 mb-1">{order.address.fullName}</p>
                            <p>{order.address.address}</p>
                            <p>{order.address.city}, {order.address.pincode}</p>
                            <p className="text-gray-500 mt-2">{order.address.phone}</p>
                        </div>
                    </div>
                </div>

                {/* Order Items */}
                <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500 mb-4">Order Items</h3>
                    <div className="space-y-3">
                        {order.items.map((item) => {
                            let productImage = '/placeholder.png'
                            try {
                                const images = JSON.parse(item.product.images)
                                if (Array.isArray(images) && images.length > 0) {
                                    productImage = images[0]
                                }
                            } catch (e) {
                                // Use placeholder
                            }

                            return (
                                <div key={item.id} className="flex items-center gap-4">
                                    <img
                                        src={productImage}
                                        alt={item.product.name}
                                        className="w-16 h-16 rounded-xl object-cover"
                                    />
                                    <div className="flex-1">
                                        <p className="font-bold text-gray-900">{item.product.name}</p>
                                        <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                                    </div>
                                    <p className="font-bold text-primary">₹{item.price * item.quantity}</p>
                                </div>
                            )
                        })}
                    </div>

                    <div className="mt-6 pt-6 border-t border-gray-100">
                        <div className="flex justify-between text-lg font-bold">
                            <span>Total</span>
                            <span className="text-primary">₹{order.total}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
