'use client'

import { useState } from 'react'
import { Edit, Trash2, Phone, Mail, Bike } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Partner {
    id: string
    name: string
    phone: string
    email: string | null
    vehicleType: string | null
    vehicleNumber: string | null
    status: string
    totalDeliveries: number
    _count: {
        orders: number
    }
}

interface PartnerTableProps {
    partners: Partner[]
}

export default function PartnerTable({ partners }: PartnerTableProps) {
    const [filter, setFilter] = useState<string>('ALL')

    const filteredPartners = filter === 'ALL'
        ? partners
        : partners.filter(p => p.status === filter)

    const statusColors: Record<string, string> = {
        AVAILABLE: "bg-success/10 text-success",
        BUSY: "bg-orange-100 text-orange-600",
        OFFLINE: "bg-gray-100 text-gray-600",
    }

    const handleDelete = async (id: string, name: string) => {
        if (!confirm(`Are you sure you want to delete ${name}?`)) return

        try {
            const res = await fetch(`/api/admin/delivery-partners/${id}`, {
                method: 'DELETE'
            })

            if (res.ok) {
                window.location.reload()
            } else {
                alert('Failed to delete partner')
            }
        } catch (error) {
            alert('Error deleting partner')
        }
    }

    return (
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Filter Tabs */}
            <div className="p-6 border-b border-gray-100">
                <div className="flex items-center gap-2">
                    {['ALL', 'AVAILABLE', 'BUSY', 'OFFLINE'].map((status) => (
                        <button
                            key={status}
                            onClick={() => setFilter(status)}
                            className={cn(
                                "px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all",
                                filter === status
                                    ? "bg-gray-900 text-white"
                                    : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                            )}
                        >
                            {status}
                        </button>
                    ))}
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50/50">
                            <th className="px-8 py-5 text-xs font-bold uppercase tracking-wider text-gray-500">Partner</th>
                            <th className="px-8 py-5 text-xs font-bold uppercase tracking-wider text-gray-500">Contact</th>
                            <th className="px-8 py-5 text-xs font-bold uppercase tracking-wider text-gray-500">Vehicle</th>
                            <th className="px-8 py-5 text-xs font-bold uppercase tracking-wider text-gray-500">Status</th>
                            <th className="px-8 py-5 text-xs font-bold uppercase tracking-wider text-gray-500">Active Orders</th>
                            <th className="px-8 py-5 text-xs font-bold uppercase tracking-wider text-gray-500">Total Deliveries</th>
                            <th className="px-8 py-5 text-xs font-bold uppercase tracking-wider text-gray-500 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {filteredPartners.map((partner) => (
                            <tr key={partner.id} className="hover:bg-gray-50/50 transition-colors group">
                                <td className="px-8 py-6">
                                    <p className="text-sm font-bold text-gray-900">{partner.name}</p>
                                </td>
                                <td className="px-8 py-6">
                                    <div className="flex flex-col gap-1">
                                        <p className="text-xs text-gray-600 flex items-center gap-2">
                                            <Phone className="w-3 h-3 text-primary/60" />
                                            {partner.phone}
                                        </p>
                                        {partner.email && (
                                            <p className="text-xs text-gray-500 flex items-center gap-2">
                                                <Mail className="w-3 h-3 text-secondary/60" />
                                                {partner.email}
                                            </p>
                                        )}
                                    </div>
                                </td>
                                <td className="px-8 py-6">
                                    {partner.vehicleType ? (
                                        <div className="flex items-center gap-2 text-xs text-gray-600">
                                            <Bike className="w-4 h-4 text-primary/40" />
                                            <span>{partner.vehicleType}</span>
                                            {partner.vehicleNumber && (
                                                <span className="text-gray-400">• {partner.vehicleNumber}</span>
                                            )}
                                        </div>
                                    ) : (
                                        <span className="text-xs text-gray-400">—</span>
                                    )}
                                </td>
                                <td className="px-8 py-6">
                                    <span className={cn(
                                        "px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider inline-flex items-center gap-2",
                                        statusColors[partner.status] || 'bg-gray-100 text-gray-600'
                                    )}>
                                        <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                                        {partner.status}
                                    </span>
                                </td>
                                <td className="px-8 py-6">
                                    <span className="text-sm font-bold text-gray-900">{partner._count.orders}</span>
                                </td>
                                <td className="px-8 py-6">
                                    <span className="text-sm font-bold text-primary">{partner.totalDeliveries}</span>
                                </td>
                                <td className="px-8 py-6">
                                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <a
                                            href={`/admin/partners/edit/${partner.id}`}
                                            className="p-2.5 rounded-xl hover:bg-primary/10 text-primary transition-colors"
                                            title="Edit Partner"
                                        >
                                            <Edit className="w-4 h-4" />
                                        </a>
                                        <button
                                            onClick={() => handleDelete(partner.id, partner.name)}
                                            className="p-2.5 rounded-xl hover:bg-destructive/10 text-destructive transition-colors"
                                            title="Delete Partner"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {filteredPartners.length === 0 && (
                            <tr>
                                <td colSpan={7} className="px-8 py-24 text-center">
                                    <p className="text-gray-400 font-medium">No partners found.</p>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
