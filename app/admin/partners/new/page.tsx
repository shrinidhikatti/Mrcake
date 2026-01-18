'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Loader2 } from 'lucide-react'
import Link from 'next/link'

export default function NewPartnerPage() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        const formData = new FormData(e.currentTarget)
        const data = {
            name: formData.get('name'),
            phone: formData.get('phone'),
            email: formData.get('email') || null,
            password: formData.get('password'),
            vehicleType: formData.get('vehicleType') || null,
            vehicleNumber: formData.get('vehicleNumber') || null,
        }

        try {
            const res = await fetch('/api/admin/delivery-partners', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            })

            if (res.ok) {
                router.push('/admin/partners')
            } else {
                const err = await res.json()
                setError(err.error || 'Failed to create partner')
            }
        } catch (err) {
            setError('Network error')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="space-y-10">
            <div className="flex items-center gap-4">
                <Link
                    href="/admin/partners"
                    className="p-2.5 rounded-xl hover:bg-gray-100 transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                </Link>
                <div>
                    <h1 className="text-3xl font-display font-bold text-gray-900">Add Delivery Partner</h1>
                    <p className="text-gray-500 mt-1">Create a new delivery partner account.</p>
                </div>
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 max-w-2xl">
                <form onSubmit={handleSubmit} className="space-y-6">
                    {error && (
                        <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-xl text-sm">
                            {error}
                        </div>
                    )}

                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
                            Full Name *
                        </label>
                        <input
                            type="text"
                            name="name"
                            required
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
                            placeholder="John Doe"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
                            Phone Number *
                        </label>
                        <input
                            type="tel"
                            name="phone"
                            required
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
                            placeholder="+91 98765 43210"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
                            Email (Optional)
                        </label>
                        <input
                            type="email"
                            name="email"
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
                            placeholder="john@example.com"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
                            Password *
                        </label>
                        <input
                            type="password"
                            name="password"
                            required
                            minLength={6}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
                            placeholder="Minimum 6 characters"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
                                Vehicle Type
                            </label>
                            <select
                                name="vehicleType"
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
                            >
                                <option value="">Select Type</option>
                                <option value="Bike">Bike</option>
                                <option value="Scooter">Scooter</option>
                                <option value="Car">Car</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
                                Vehicle Number
                            </label>
                            <input
                                type="text"
                                name="vehicleNumber"
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
                                placeholder="MH12AB1234"
                            />
                        </div>
                    </div>

                    <div className="flex gap-4 pt-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 bg-gray-900 text-white px-8 py-3 rounded-xl text-sm font-bold hover:bg-black transition shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                            {loading ? 'Creating...' : 'Create Partner'}
                        </button>
                        <Link
                            href="/admin/partners"
                            className="px-8 py-3 rounded-xl text-sm font-bold border border-gray-200 hover:bg-gray-50 transition"
                        >
                            Cancel
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    )
}
