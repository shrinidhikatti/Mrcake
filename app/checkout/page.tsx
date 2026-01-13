'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { useCartStore } from '@/store/cartStore'
import { loadRazorpay } from '@/lib/razorpay'
import { ArrowLeft, CreditCard, Loader2 } from 'lucide-react'

declare global {
    interface Window {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        Razorpay: any
    }
}

export default function CheckoutPage() {
    const router = useRouter()
    const { items, getTotal, clearCart } = useCartStore()
    const [loading, setLoading] = useState(false)

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        pincode: '',
    })

    // Calculate totals
    const subtotal = getTotal()
    const deliveryFee = subtotal > 500 ? 0 : 50
    const total = subtotal + deliveryFee

    if (items.length === 0) {
        router.push('/cart')
        return null
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    const handlePayment = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            // 1. Load Razorpay SDK
            const isLoaded = await loadRazorpay()
            if (!isLoaded) {
                alert('Razorpay SDK failed to load')
                return
            }

            // 2. Create Order (Using API route in a proper app, but direct for now/demo)
            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_placeholder', // Mock key
                amount: total * 100,
                currency: 'INR',
                name: 'MrCake Bakery',
                description: 'Order Payment',
                image: '/icons/icon-192x192.png',
                handler: function (response: unknown) {
                    console.log(response)
                    // Success handler
                    clearCart()
                    router.push('/order-success')
                },
                prefill: {
                    name: formData.name,
                    email: formData.email,
                    contact: formData.phone,
                },
                theme: {
                    color: '#8B4513',
                },
            }

            // 3. Open Razorpay Interface
            const paymentObject = new window.Razorpay(options)
            paymentObject.open()

        } catch (error) {
            console.error('Payment Error:', error)
            alert('Something went wrong with payment initiation')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex flex-col bg-background">
            <Header />

            <main className="flex-grow py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="mb-8">
                        <button
                            onClick={() => router.back()}
                            className="flex items-center text-sm text-foreground/60 hover:text-primary transition"
                        >
                            <ArrowLeft className="w-4 h-4 mr-1" />
                            Back to Cart
                        </button>
                        <h1 className="text-3xl font-display font-bold mt-4">Checkout</h1>
                    </div>

                    <div className="lg:grid lg:grid-cols-12 lg:gap-x-12 lg:items-start">
                        {/* Checkout Form */}
                        <section className="lg:col-span-7 bg-white rounded-xl shadow-sm border border-border p-6 sm:p-8">
                            <h2 className="text-xl font-semibold mb-6">Shipping Details</h2>

                            <form id="checkout-form" onSubmit={handlePayment} className="space-y-6">
                                <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
                                    <div className="sm:col-span-2">
                                        <label htmlFor="name" className="block text-sm font-medium text-foreground">
                                            Full Name
                                        </label>
                                        <input
                                            type="text"
                                            name="name"
                                            id="name"
                                            required
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-3 border"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="email" className="block text-sm font-medium text-foreground">
                                            Email Address
                                        </label>
                                        <input
                                            type="email"
                                            name="email"
                                            id="email"
                                            required
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-3 border"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="phone" className="block text-sm font-medium text-foreground">
                                            Phone Number
                                        </label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            id="phone"
                                            required
                                            value={formData.phone}
                                            onChange={handleInputChange}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-3 border"
                                        />
                                    </div>

                                    <div className="sm:col-span-2">
                                        <label htmlFor="address" className="block text-sm font-medium text-foreground">
                                            Delivery Address
                                        </label>
                                        <textarea
                                            name="address"
                                            id="address"
                                            rows={3}
                                            required
                                            value={formData.address}
                                            onChange={handleInputChange}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-3 border"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="city" className="block text-sm font-medium text-foreground">
                                            City
                                        </label>
                                        <input
                                            type="text"
                                            name="city"
                                            id="city"
                                            required
                                            value={formData.city}
                                            onChange={handleInputChange}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-3 border"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="pincode" className="block text-sm font-medium text-foreground">
                                            Initial Pincode
                                        </label>
                                        <input
                                            type="text"
                                            name="pincode"
                                            id="pincode"
                                            required
                                            value={formData.pincode}
                                            onChange={handleInputChange}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-3 border"
                                        />
                                    </div>
                                </div>
                            </form>
                        </section>

                        {/* Order Preview */}
                        <section className="lg:col-span-5 mt-16 lg:mt-0 bg-secondary/30 rounded-xl border border-border p-6 sm:p-8">
                            <h2 className="text-xl font-semibold mb-6">Your Order</h2>

                            <ul className="divide-y divide-gray-200 mb-6">
                                {items.map((item) => (
                                    <li key={item.productId} className="flex py-4">
                                        <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                                            <Image
                                                src={item.image}
                                                alt={item.name}
                                                width={64}
                                                height={64}
                                                className="h-full w-full object-cover object-center"
                                            />
                                        </div>
                                        <div className="ml-4 flex flex-1 flex-col">
                                            <div>
                                                <div className="flex justify-between text-base font-medium text-foreground">
                                                    <h3>{item.name}</h3>
                                                    <p className="ml-4">₹{item.price * item.quantity}</p>
                                                </div>
                                                <p className="mt-1 text-sm text-foreground/60">Qty {item.quantity}</p>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>

                            <div className="border-t border-gray-200 pt-4 space-y-4">
                                <div className="flex items-center justify-between">
                                    <dt className="text-sm text-foreground/70">Subtotal</dt>
                                    <dd className="text-sm font-medium text-foreground">₹{subtotal}</dd>
                                </div>
                                <div className="flex items-center justify-between">
                                    <dt className="text-sm text-foreground/70">Delivery</dt>
                                    <dd className="text-sm font-medium text-foreground">
                                        {deliveryFee === 0 ? 'Free' : `₹${deliveryFee}`}
                                    </dd>
                                </div>
                                <div className="border-t border-gray-200 pt-4 flex items-center justify-between">
                                    <dt className="text-base font-bold text-foreground">Total to Pay</dt>
                                    <dd className="text-xl font-bold text-primary">₹{total}</dd>
                                </div>
                            </div>

                            <button
                                type="submit"
                                form="checkout-form"
                                disabled={loading}
                                className="w-full mt-8 flex items-center justify-center gap-2 bg-success hover:bg-success/90 text-white px-8 py-4 rounded-lg text-lg font-semibold transition shadow-md disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Processing...
                                    </>
                                ) : (
                                    <>
                                        <CreditCard className="w-5 h-5" />
                                        Pay ₹{total}
                                    </>
                                )}
                            </button>

                            <p className="mt-4 text-xs text-center text-foreground/50 flex items-center justify-center gap-1">
                                <span className="w-2 h-2 rounded-full bg-success"></span>
                                SSL Secured Payment
                            </p>
                        </section>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    )
}
