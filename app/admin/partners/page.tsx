import { prisma } from "@/lib/prisma"
import { Users, Plus, Phone, Mail, Bike, CheckCircle, XCircle, Clock } from "lucide-react"
import Link from "next/link"
import PartnerTable from "@/components/admin/PartnerTable"

export default async function AdminPartnersPage() {
    const partners = await prisma.deliveryPartner.findMany({
        orderBy: { createdAt: 'desc' },
        include: {
            _count: {
                select: {
                    orders: {
                        where: {
                            status: { in: ['ASSIGNED', 'PICKED_UP', 'OUT_FOR_DELIVERY'] }
                        }
                    }
                }
            }
        }
    })

    // Count by status
    const available = partners.filter(p => p.status === 'AVAILABLE').length
    const busy = partners.filter(p => p.status === 'BUSY').length
    const offline = partners.filter(p => p.status === 'OFFLINE').length

    return (
        <div className="space-y-10">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-display font-bold text-gray-900">Delivery Partners</h1>
                    <p className="text-gray-500 mt-1">Manage your delivery team and assignments.</p>
                </div>
                <Link
                    href="/admin/partners/new"
                    className="flex items-center gap-2 bg-gray-900 text-white px-6 py-3 rounded-2xl text-sm font-bold shadow-lg hover:bg-black transition"
                >
                    <Plus className="w-4 h-4" />
                    Add Partner
                </Link>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Total Partners</p>
                            <p className="text-3xl font-display font-bold text-gray-900">{partners.length}</p>
                        </div>
                        <Users className="w-10 h-10 text-primary/20" />
                    </div>
                </div>

                <div className="bg-success/5 p-6 rounded-3xl shadow-sm border border-success/10">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs font-bold uppercase tracking-wider text-success/70 mb-1">Available</p>
                            <p className="text-3xl font-display font-bold text-success">{available}</p>
                        </div>
                        <CheckCircle className="w-10 h-10 text-success/20" />
                    </div>
                </div>

                <div className="bg-orange-50 p-6 rounded-3xl shadow-sm border border-orange-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs font-bold uppercase tracking-wider text-orange-600/70 mb-1">Busy</p>
                            <p className="text-3xl font-display font-bold text-orange-600">{busy}</p>
                        </div>
                        <Clock className="w-10 h-10 text-orange-600/20" />
                    </div>
                </div>

                <div className="bg-gray-50 p-6 rounded-3xl shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Offline</p>
                            <p className="text-3xl font-display font-bold text-gray-600">{offline}</p>
                        </div>
                        <XCircle className="w-10 h-10 text-gray-300" />
                    </div>
                </div>
            </div>

            {/* Partners Table */}
            <PartnerTable partners={partners} />
        </div>
    )
}
