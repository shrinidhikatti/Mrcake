'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { CheckCircle, ShoppingBag, ArrowRight } from 'lucide-react'
import confetti from 'canvas-confetti'

export default function OrderSuccessPage() {
    const [mounted, setMounted] = useState(false)
    const router = useRouter()

    const [orderId, setOrderId] = useState('')

    useEffect(() => {
        // eslint-disable-next-line
        setMounted(true)
        setOrderId(`MC-${Math.floor(Math.random() * 10000)}`)
        // Run confetti animation
        const duration = 3000
        const end = Date.now() + duration

        const frame = () => {
            confetti({
                particleCount: 2,
                angle: 60,
                spread: 55,
                origin: { x: 0 },
                colors: ['#8B4513', '#DAA520', '#FFF8DC']
            })
            confetti({
                particleCount: 2,
                angle: 120,
                spread: 55,
                origin: { x: 1 },
                colors: ['#8B4513', '#DAA520', '#FFF8DC']
            })

            if (Date.now() < end) {
                requestAnimationFrame(frame)
            }
        }
        frame()
    }, [])

    if (!mounted) return null

    return (
        <div className="min-h-screen flex flex-col bg-background">
            <Header />

            <main className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-md w-full text-center">
                    <div className="mx-auto flex items-center justify-center h-24 w-24 rounded-full bg-success/10 mb-8">
                        <CheckCircle className="h-12 w-12 text-success" />
                    </div>

                    <h1 className="text-4xl font-display font-bold text-foreground mb-4">
                        Order Placed!
                    </h1>
                    <p className="text-lg text-foreground/70 mb-8">
                        Thank you for your order. We&apos;ve received it and will start baking your fresh treats right away.
                    </p>

                    <div className="bg-white p-6 rounded-xl shadow-sm border border-border mb-8 text-left">
                        <h3 className="text-sm font-semibold text-foreground mb-2">Order #{orderId}</h3>
                        <p className="text-sm text-foreground/60 mb-4">Estimated delivery: Today, 2 hours</p>
                        <div className="h-1 w-full bg-secondary rounded-full overflow-hidden">
                            <div className="h-full w-1/4 bg-primary rounded-full" />
                        </div>
                        <p className="text-xs text-right mt-1 text-primary font-medium">Preparing</p>
                    </div>

                    <div className="flex flex-col gap-4">
                        <Link
                            href="/products"
                            className="inline-flex items-center justify-center gap-2 bg-primary text-white px-8 py-3 rounded-full font-semibold hover:bg-primary-dark transition shadow-md"
                        >
                            Continue Shopping
                            <ArrowRight className="w-5 h-5" />
                        </Link>
                        <Link
                            href="/"
                            className="inline-flex items-center justify-center gap-2 text-foreground/70 hover:text-primary transition font-medium"
                        >
                            Back to Home
                        </Link>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    )
}
