'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useCartStore } from '@/store/cartStore'
import { Trash2, Plus, Minus, ArrowRight, ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function CartPage() {
    const { items, removeItem, updateQuantity, getTotal, clearCart } = useCartStore()
    const router = useRouter()
    const [mounted, setMounted] = React.useState(false)

    React.useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) {
        return null
    }

    const subtotal = getTotal()
    const deliveryFee = subtotal > 500 ? 0 : 50
    const total = subtotal + deliveryFee

    if (items.length === 0) {
        return (
            <div className="min-h-screen flex flex-col bg-background pt-56">
                <main className="flex-grow flex flex-col items-center justify-center p-4">
                    <div className="text-center max-w-md">
                        <Image
                            src="/placeholder.png" // Ideally an empty cart illustration
                            alt="Empty Cart"
                            width={200}
                            height={200}
                            className="mx-auto mb-6 opacity-50"
                        />
                        <h1 className="text-3xl font-display font-bold mb-4">Your cart is empty</h1>
                        <p className="text-foreground/70 mb-8">
                            Looks like you haven&apos;t added any sweet treats yet. Check out our menu to satisfy your cravings!
                        </p>
                        <Link
                            href="/products"
                            className="inline-flex items-center gap-2 bg-primary text-white px-8 py-3 rounded-full font-semibold hover:bg-primary-dark transition shadow-lg"
                        >
                            <ArrowLeft className="w-5 h-5" />
                            Browse Menu
                        </Link>
                    </div>
                </main>
            </div>
        )
    }

    return (
        <div className="min-h-screen flex flex-col bg-background pt-56">
            <main className="flex-grow py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="flex justify-between items-center mb-8">
                        <h1 className="text-3xl font-display font-bold">Shopping Cart</h1>
                        <Link
                            href="/products"
                            className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors font-medium"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Continue Shopping
                        </Link>
                    </div>

                    <div className="lg:grid lg:grid-cols-12 lg:gap-x-12 lg:items-start">
                        {/* Cart Items */}
                        <section className="lg:col-span-7 bg-white rounded-xl shadow-sm border border-border overflow-hidden">
                            <ul className="divide-y divide-gray-100">
                                {items.map((item) => (
                                    <li key={item.productId} className="flex p-6">
                                        <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                                            <Image
                                                src={item.image}
                                                alt={item.name}
                                                width={96}
                                                height={96}
                                                className="h-full w-full object-cover object-center"
                                            />
                                        </div>

                                        <div className="ml-4 flex flex-1 flex-col justify-between">
                                            <div className="flex justify-between text-base font-medium text-foreground">
                                                <h3>
                                                    <Link href={`/products/${item.productId}`} className="hover:text-primary transition">
                                                        {item.name}
                                                    </Link>
                                                </h3>
                                                <p className="ml-4">₹{item.price * item.quantity}</p>
                                            </div>
                                            <p className="mt-1 text-sm text-foreground/60">₹{item.price} each</p>

                                            <div className="flex flex-1 items-end justify-between text-sm">
                                                <div className="flex items-center border border-border rounded-lg">
                                                    <button
                                                        onClick={() => updateQuantity(item.productId, Math.max(0, item.quantity - 1))}
                                                        className="p-1 hover:bg-secondary transition"
                                                    >
                                                        <Minus className="w-4 h-4" />
                                                    </button>
                                                    <span className="w-8 text-center font-medium">{item.quantity}</span>
                                                    <button
                                                        onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                                                        className="p-1 hover:bg-secondary transition"
                                                    >
                                                        <Plus className="w-4 h-4" />
                                                    </button>
                                                </div>

                                                <button
                                                    type="button"
                                                    onClick={() => removeItem(item.productId)}
                                                    className="font-medium text-error hover:text-error/80 flex items-center gap-1 transition"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                    <span>Remove</span>
                                                </button>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </section>

                        {/* Order Summary */}
                        <section className="lg:col-span-5 mt-16 lg:mt-0 bg-white rounded-xl shadow-sm border border-border p-6 sm:p-8">
                            <h2 className="text-lg font-medium text-foreground mb-6">Order Summary</h2>

                            <dl className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <dt className="text-sm text-foreground/70">Subtotal</dt>
                                    <dd className="text-sm font-medium text-foreground">₹{subtotal}</dd>
                                </div>
                                <div className="flex items-center justify-between">
                                    <dt className="text-sm text-foreground/70">Delivery Estimate</dt>
                                    <dd className="text-sm font-medium text-foreground">
                                        {deliveryFee === 0 ? 'Free' : `₹${deliveryFee}`}
                                    </dd>
                                </div>
                                <div className="border-t border-border pt-4 flex items-center justify-between">
                                    <dt className="text-base font-bold text-foreground">Order Total</dt>
                                    <dd className="text-xl font-bold text-primary">₹{total}</dd>
                                </div>
                            </dl>

                            {deliveryFee > 0 && (
                                <div className="mt-4 p-3 bg-secondary rounded-lg text-xs text-primary text-center">
                                    Add items worth ₹{500 - subtotal} more for free delivery
                                </div>
                            )}

                            <button
                                onClick={() => router.push('/checkout')}
                                className="w-full mt-8 flex items-center justify-center gap-2 bg-accent hover:bg-accent/90 text-white px-8 py-4 rounded-lg text-lg font-semibold transition shadow-md"
                            >
                                Proceed to Checkout
                                <ArrowRight className="w-5 h-5" />
                            </button>

                            <button
                                onClick={clearCart}
                                className="w-full mt-4 text-sm text-foreground/60 hover:text-error transition text-center"
                            >
                                Clear Cart
                            </button>
                        </section>
                    </div>
                </div>
            </main>
        </div>
    )
}
