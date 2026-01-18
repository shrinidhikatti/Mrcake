'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { useEffect } from 'react'

export default function EditPartnerPage({ params }: { params: { id: string } }) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [fetching, setFetching] = useState(true)
    const [error, setError] = useState('')
    const [partner, setPartner] = useState<any>(null)

    useEffect(() => {
        fetch(`/api/admin/delivery-partners/${params.id}`)
            .then(res => res.json())
            .then(data => {
                setPartner(data)
                setFetching(false)
            })
            .catch(() => {
                setError('Failed to load partner')
                setFetching(false)
            })
    }, [params.id])

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        const formData = new FormData(e.currentTarget)
        const data: any = {
            name: formData.get('name'),
            phone: formData.get('phone'),
            email: formData.get('email') || null,
            vehicleType: formData.get('vehicleType') || null,
            vehicleNumber: formData.get('vehicleNumber') || null,
            status: formData.get('status'),
        }

        const password = formData.get('password') as string
        if (password) {
            data.password = password
        }

        try {
            const res = await fetch(`/api/admin/delivery-partners/${params.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            })

            if (res.ok) {
                router.push('/admin/partners')
            } else {
                const err = await res.json()
                setError(err.error || 'Failed to update partner')
            }
        } catch (err) {
            setError('Network error')
        } finally {
            setLoading(false)
        }
    }

    if (fetching) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-10 h-10 animate-spin text-primary" />
            </div>
        )
    }

    if (!partner) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-gray-500">Partner not found</p>
            </div>
        )
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
                    <h1 className="text-3xl font-display font-bold text-gray-900">Edit Delivery Partner</h1>
                    <p className="text-gray-500 mt-1">Update partner information.</p>
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
                            defaultValue={partner.name}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
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
                            defaultValue={partner.phone}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
                            Email (Optional)
                        </label>
                        <input
                            type="email"
                            name="email"
                            defaultValue={partner.email || ''}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
                            New Password (Leave blank to keep current)
                        </label>
                        <input
                            type="password"
                            name="password"
                            minLength={6}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
                            placeholder="Enter new password"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
                                Vehicle Type
                            </label>
                            <select
                                name="vehicleType"
                                defaultValue={partner.vehicleType || ''}
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
                                defaultValue={partner.vehicleNumber || ''}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
                            Status
                        </label>
                        <select
                            name="status"
                            defaultValue={partner.status}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
                        >
                            <option value="AVAILABLE">Available</option>
                            <option value="BUSY">Busy</option>
                            <option value="OFFLINE">Offline</option>
                        </select>
                    </div>

                    <div className="flex gap-4 pt-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 bg-gray-900 text-white px-8 py-3 rounded-xl text-sm font-bold hover:bg-black transition shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                            {loading ? 'Updating...' : 'Update Partner'}
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
