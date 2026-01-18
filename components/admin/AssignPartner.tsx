'use client'

import { useState } from 'react'
import { Loader2, UserCheck } from 'lucide-react'

interface DeliveryPartner {
    id: string
    name: string
    phone: string
    status: string
    _count: {
        orders: number
    }
}

interface AssignPartnerProps {
    orderId: string
    currentPartnerId?: string | null
    currentPartnerName?: string | null
}

export default function AssignPartner({ orderId, currentPartnerId, currentPartnerName }: AssignPartnerProps) {
    const [partners, setPartners] = useState<DeliveryPartner[]>([])
    const [loading, setLoading] = useState(false)
    const [assigning, setAssigning] = useState(false)
    const [selectedPartnerId, setSelectedPartnerId] = useState(currentPartnerId || '')
    const [showDropdown, setShowDropdown] = useState(false)

    const loadPartners = async () => {
        if (partners.length > 0) {
            setShowDropdown(!showDropdown)
            return
        }

        setLoading(true)
        try {
            const res = await fetch('/api/admin/delivery-partners')
            if (res.ok) {
                const data = await res.json()
                setPartners(data)
                setShowDropdown(true)
            }
        } catch (error) {
            console.error('Failed to load partners')
        } finally {
            setLoading(false)
        }
    }

    const handleAssign = async () => {
        if (!selectedPartnerId) return

        setAssigning(true)
        try {
            const res = await fetch(`/api/admin/orders/${orderId}/assign`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ deliveryPartnerId: selectedPartnerId })
            })

            if (res.ok) {
                window.location.reload()
            } else {
                alert('Failed to assign partner')
            }
        } catch (error) {
            alert('Error assigning partner')
        } finally {
            setAssigning(false)
        }
    }

    return (
        <div className="bg-white p-6 rounded-2xl border border-gray-100">
            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500 mb-4">Delivery Partner</h3>

            {currentPartnerName ? (
                <div className="flex items-center gap-3 p-4 bg-success/5 border border-success/20 rounded-xl">
                    <UserCheck className="w-5 h-5 text-success" />
                    <div>
                        <p className="text-sm font-bold text-gray-900">{currentPartnerName}</p>
                        <p className="text-xs text-gray-500">Assigned</p>
                    </div>
                </div>
            ) : (
                <div className="space-y-4">
                    <button
                        onClick={loadPartners}
                        disabled={loading}
                        className="w-full bg-gray-50 border border-gray-200 px-4 py-3 rounded-xl text-sm font-bold text-gray-700 hover:bg-gray-100 transition disabled:opacity-50"
                    >
                        {loading ? 'Loading...' : showDropdown ? 'Hide Partners' : 'Select Partner'}
                    </button>

                    {showDropdown && (
                        <div className="space-y-2 max-h-64 overflow-y-auto">
                            {partners
                                .filter(p => p.status === 'AVAILABLE' || p.status === 'BUSY')
                                .map((partner) => (
                                    <label
                                        key={partner.id}
                                        className="flex items-center gap-3 p-3 border border-gray-100 rounded-xl hover:bg-gray-50 cursor-pointer transition"
                                    >
                                        <input
                                            type="radio"
                                            name="partner"
                                            value={partner.id}
                                            checked={selectedPartnerId === partner.id}
                                            onChange={(e) => setSelectedPartnerId(e.target.value)}
                                            className="w-4 h-4 text-primary"
                                        />
                                        <div className="flex-1">
                                            <p className="text-sm font-bold text-gray-900">{partner.name}</p>
                                            <p className="text-xs text-gray-500">{partner.phone} • {partner._count.orders} active</p>
                                        </div>
                                        <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${partner.status === 'AVAILABLE' ? 'bg-success/10 text-success' : 'bg-orange-100 text-orange-600'
                                            }`}>
                                            {partner.status}
                                        </span>
                                    </label>
                                ))}
                        </div>
                    )}

                    {selectedPartnerId && (
                        <button
                            onClick={handleAssign}
                            disabled={assigning}
                            className="w-full bg-gray-900 text-white px-6 py-3 rounded-xl text-sm font-bold hover:bg-black transition disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {assigning && <Loader2 className="w-4 h-4 animate-spin" />}
                            {assigning ? 'Assigning...' : 'Assign Partner'}
                        </button>
                    )}
                </div>
            )}
        </div>
    )
}
