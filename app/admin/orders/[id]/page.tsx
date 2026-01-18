import { prisma } from "@/lib/prisma"
import { ArrowLeft, Package, MapPin, Phone, User, Calendar, CreditCard } from "lucide-react"
import Link from "next/link"
import AssignPartner from "@/components/admin/AssignPartner"
import { notFound } from "next/navigation"

export default async function OrderDetailsPage({ params }: { params: { id: string } }) {
    const order = await prisma.order.findUnique({
        where: { id: params.id },
        include: {
            user: true,
            address: true,
            deliveryPartner: true,
            items: {
                include: { product: true }
            }
        }
    })

    if (!order) {
        notFound()
    }

    const statusColors: Record<string, string> = {
        PENDING: "bg-orange-100 text-orange-600",
        CONFIRMED: "bg-blue-100 text-blue-600",
        PREPARING: "bg-purple-100 text-purple-600",
        ASSIGNED: "bg-indigo-100 text-indigo-600",
        PICKED_UP: "bg-cyan-100 text-cyan-600",
        OUT_FOR_DELIVERY: "bg-teal-100 text-teal-600",
        DELIVERED: "bg-success/10 text-success",
        CANCELLED: "bg-destructive/10 text-destructive",
    }

    return (
        <div className="space-y-10">
            <div className="flex items-center gap-4">
                <Link
                    href="/admin/orders"
                    className="p-2.5 rounded-xl hover:bg-gray-100 transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                </Link>
                <div>
                    <h1 className="text-3xl font-display font-bold text-gray-900">Order #{order.orderNumber}</h1>
                    <p className="text-gray-500 mt-1">Placed on {new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column - Order Details */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Status */}
                    <div className="bg-white p-6 rounded-2xl border border-gray-100">
                        <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500 mb-4">Order Status</h3>
                        <span className={`px-6 py-2 rounded-full text-xs font-bold uppercase tracking-wider inline-flex items-center gap-2 ${statusColors[order.status] || 'bg-gray-100 text-gray-600'
                            }`}>
                            <span className="w-2 h-2 rounded-full bg-current"></span>
                            {order.status.replace(/_/g, ' ')}
                        </span>
                    </div>

                    {/* Items */}
                    <div className="bg-white p-6 rounded-2xl border border-gray-100">
                        <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500 mb-4">Order Items</h3>
                        <div className="space-y-4">
                            {order.items.map((item) => {
                                const images = JSON.parse(item.product.images as string || '[]')
                                return (
                                    <div key={item.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                                        <img
                                            src={images[0] || '/placeholder.png'}
                                            alt={item.product.name}
                                            className="w-16 h-16 rounded-lg object-cover"
                                        />
                                        <div className="flex-1">
                                            <p className="font-bold text-gray-900">{item.product.name}</p>
                                            <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                                            {item.customization && (
                                                <p className="text-xs text-gray-400 mt-1">{item.customization}</p>
                                            )}
                                        </div>
                                        <p className="font-bold text-primary">₹{item.price * item.quantity}</p>
                                    </div>
                                )
                            })}
                        </div>

                        {/* Totals */}
                        <div className="mt-6 pt-6 border-t border-gray-100 space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Subtotal</span>
                                <span className="font-bold">₹{order.subtotal}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Delivery Fee</span>
                                <span className="font-bold">₹{order.deliveryFee}</span>
                            </div>
                            <div className="flex justify-between text-lg font-bold pt-2 border-t border-gray-100">
                                <span>Total</span>
                                <span className="text-primary">₹{order.total}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column - Customer & Delivery Info */}
                <div className="space-y-6">
                    {/* Customer Info */}
                    <div className="bg-white p-6 rounded-2xl border border-gray-100">
                        <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500 mb-4">Customer</h3>
                        <div className="space-y-3">
                            <div className="flex items-center gap-3">
                                <User className="w-4 h-4 text-gray-400" />
                                <span className="text-sm text-gray-900">{order.user.name}</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Phone className="w-4 h-4 text-gray-400" />
                                <span className="text-sm text-gray-900">{order.address.phone}</span>
                            </div>
                        </div>
                    </div>

                    {/* Delivery Address */}
                    <div className="bg-white p-6 rounded-2xl border border-gray-100">
                        <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500 mb-4">Delivery Address</h3>
                        <div className="flex gap-3">
                            <MapPin className="w-4 h-4 text-gray-400 mt-1 shrink-0" />
                            <div className="text-sm text-gray-700 leading-relaxed">
                                <p className="font-bold text-gray-900 mb-1">{order.address.fullName}</p>
                                <p>{order.address.address}</p>
                                <p>{order.address.city}, {order.address.state}</p>
                                <p>{order.address.pincode}</p>
                            </div>
                        </div>
                    </div>

                    {/* Delivery Partner Assignment */}
                    <AssignPartner
                        orderId={order.id}
                        currentPartnerId={order.deliveryPartnerId}
                        currentPartnerName={order.deliveryPartner?.name}
                    />

                    {/* Payment Info */}
                    <div className="bg-white p-6 rounded-2xl border border-gray-100">
                        <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500 mb-4">Payment</h3>
                        <div className="flex items-center gap-3">
                            <CreditCard className="w-4 h-4 text-gray-400" />
                            <span className={`text-sm font-bold ${order.paymentStatus === 'PAID' ? 'text-success' : 'text-orange-600'
                                }`}>
                                {order.paymentStatus}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
