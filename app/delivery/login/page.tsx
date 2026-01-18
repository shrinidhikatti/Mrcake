'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Bike, Loader2, Lock, Phone } from 'lucide-react'

export default function DeliveryLoginPage() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        const formData = new FormData(e.currentTarget)
        const data = {
            phone: formData.get('phone'),
            password: formData.get('password'),
        }

        try {
            const res = await fetch('/api/delivery/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            })

            if (res.ok) {
                const { token, partner } = await res.json()
                // Store token in localStorage
                localStorage.setItem('delivery_token', token)
                localStorage.setItem('delivery_partner', JSON.stringify(partner))
                router.push('/delivery')
            } else {
                const err = await res.json()
                setError(err.error || 'Login failed')
            }
        } catch (err) {
            setError('Network error')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary/5 via-white to-secondary/5 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Logo/Brand */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-primary rounded-3xl mb-4 shadow-lg">
                        <Bike className="w-10 h-10 text-white" />
                    </div>
                    <h1 className="text-3xl font-display font-bold text-gray-900 mb-2">MrCake Delivery</h1>
                    <p className="text-gray-500">Partner Login</p>
                </div>

                {/* Login Form */}
                <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-xl text-sm text-center">
                                {error}
                            </div>
                        )}

                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
                                Phone Number
                            </label>
                            <div className="relative">
                                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="tel"
                                    name="phone"
                                    required
                                    className="w-full pl-12 pr-4 py-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition text-lg"
                                    placeholder="+91 98765 43210"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="password"
                                    name="password"
                                    required
                                    className="w-full pl-12 pr-4 py-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition text-lg"
                                    placeholder="Enter your password"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gray-900 text-white py-4 rounded-xl text-lg font-bold hover:bg-black transition shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                        >
                            {loading && <Loader2 className="w-5 h-5 animate-spin" />}
                            {loading ? 'Signing In...' : 'Sign In'}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-xs text-gray-500">
                            Having trouble? Contact your manager
                        </p>
                    </div>
                </div>

                <div className="mt-6 text-center text-xs text-gray-400">
                    <p>MrCake Palace & Bakers © 2024</p>
                </div>
            </div>
        </div>
    )
}
