'use client'

import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { User, Package, MapPin, Settings, LogOut, Loader2, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

export default function ProfilePage() {
    const { data: session, status } = useSession()
    const router = useRouter()
    const [activeTab, setActiveTab] = useState('overview')
    const [stats, setStats] = useState({ orders: 0, reviews: 0 })
    const [loadingStats, setLoadingStats] = useState(true)

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/login?callbackUrl=/profile')
        }
    }, [status, router])

    useEffect(() => {
        if (session) {
            fetch('/api/user/stats')
                .then(res => res.json())
                .then(data => {
                    setStats(data)
                    setLoadingStats(false)
                })
                .catch(() => setLoadingStats(false))
        }
    }, [session])

    if (status === 'loading') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <Loader2 className="w-10 h-10 animate-spin text-primary" />
            </div>
        )
    }

    if (!session) return null

    const tabs = [
        { id: 'overview', label: 'Overview', icon: User },
        { id: 'orders', label: 'My Orders', icon: Package },
        { id: 'addresses', label: 'Addresses', icon: MapPin },
        { id: 'settings', label: 'Settings', icon: Settings },
    ]

    return (
        <div className="min-h-screen bg-[#FDFBF7] pt-32 pb-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Profile Header */}
                <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-sm border border-gray-100 mb-10 overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-32 -mt-32"></div>

                    <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
                        <div className="w-32 h-32 rounded-3xl bg-primary/10 flex items-center justify-center border-4 border-white shadow-lg overflow-hidden shrink-0">
                            {session.user?.image ? (
                                <img src={session.user.image} alt={session.user.name || ''} className="w-full h-full object-cover" />
                            ) : (
                                <User className="w-16 h-16 text-primary" />
                            )}
                        </div>

                        <div className="text-center md:text-left flex-grow">
                            <span className="text-secondary font-display text-sm tracking-widest uppercase mb-1 block">Account</span>
                            <h1 className="text-4xl font-display font-bold text-gray-900 mb-2">{session.user?.name}</h1>
                            <p className="text-gray-500 font-medium">{session.user?.email}</p>

                            <div className="mt-6 flex flex-wrap justify-center md:justify-start gap-3">
                                <Link
                                    href="/menu"
                                    className="bg-gray-900 text-white px-6 py-2.5 rounded-full text-sm font-bold hover:bg-black transition shadow-md active:scale-95"
                                >
                                    Browse Menu
                                </Link>
                                <button
                                    onClick={() => signOut()}
                                    className="bg-white text-destructive border border-destructive/20 px-6 py-2.5 rounded-full text-sm font-bold hover:bg-destructive/5 transition active:scale-95 flex items-center gap-2"
                                >
                                    <LogOut className="w-4 h-4" />
                                    Sign Out
                                </button>
                            </div>
                        </div>

                        <div className="hidden lg:grid grid-cols-2 gap-4 shrink-0">
                            <div className="bg-secondary/5 p-6 rounded-2xl border border-secondary/10 text-center">
                                <span className="block text-2xl font-display font-bold text-secondary">
                                    {loadingStats ? '...' : stats.orders}
                                </span>
                                <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Orders</span>
                            </div>
                            <div className="bg-success/5 p-6 rounded-2xl border border-success/10 text-center">
                                <span className="block text-2xl font-display font-bold text-success">
                                    {loadingStats ? '...' : stats.reviews}
                                </span>
                                <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Reviews</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-10">
                    {/* Sidebar Tabs */}
                    <aside className="lg:w-72 shrink-0">
                        <nav className="flex flex-row lg:flex-col gap-2 overflow-x-auto pb-4 lg:pb-0 scrollbar-hide">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={cn(
                                        "flex items-center gap-3 px-6 py-4 rounded-2xl text-sm font-bold transition-all shrink-0 lg:shrink",
                                        activeTab === tab.id
                                            ? "bg-white text-primary shadow-sm border border-gray-100 translate-x-1"
                                            : "text-gray-500 hover:bg-gray-50"
                                    )}
                                >
                                    <tab.icon className={cn("w-5 h-5", activeTab === tab.id ? "text-primary" : "text-gray-400")} />
                                    {tab.label}
                                </button>
                            ))}
                        </nav>
                    </aside>

                    {/* Main Content Area */}
                    <main className="flex-grow">
                        <div className="bg-white rounded-3xl p-8 sm:p-10 shadow-sm border border-gray-100 min-h-[500px]">
                            {activeTab === 'overview' && (
                                <div className="space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-500">
                                    <div>
                                        <h3 className="text-xl font-display font-bold text-gray-900 mb-6">Recent Activity</h3>
                                        <div className="text-center py-20 bg-gray-50/50 rounded-2xl border border-dashed border-gray-200">
                                            <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                                            <p className="text-gray-500 font-medium">No recent orders found.</p>
                                            <Link href="/menu" className="text-primary font-bold mt-4 inline-flex items-center hover:underline">
                                                Order your first cake <ArrowRight className="ml-2 w-4 h-4" />
                                            </Link>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="p-6 rounded-2xl border border-gray-100 bg-gray-50/30">
                                            <h4 className="font-bold text-gray-900 mb-2">Need Help?</h4>
                                            <p className="text-sm text-gray-500 mb-4">Have questions about your order or our bakery?</p>
                                            <Link href="/contact" className="text-sm font-bold text-primary hover:underline underline-offset-4">Contact Support</Link>
                                        </div>
                                        <div className="p-6 rounded-2xl border border-gray-100 bg-gray-50/30">
                                            <h4 className="font-bold text-gray-900 mb-2">Member Rewards</h4>
                                            <p className="text-sm text-gray-500 mb-4">You're currently a Silver member. 150 points to Gold.</p>
                                            <Link href="#" className="text-sm font-bold text-primary hover:underline underline-offset-4">View Rewards</Link>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'orders' && (
                                <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                                    <h3 className="text-xl font-display font-bold text-gray-900 mb-6">Order History</h3>
                                    <div className="text-center py-20 bg-gray-50/50 rounded-2xl border border-dashed border-gray-200">
                                        <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                                        <p className="text-gray-500 font-medium font-display">No orders yet.</p>
                                        <p className="text-sm text-gray-400 mt-1">Ready to try our delicious treats?</p>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'addresses' && (
                                <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                                    <div className="flex justify-between items-center mb-6">
                                        <h3 className="text-xl font-display font-bold text-gray-900">Saved Addresses</h3>
                                        <button className="bg-primary/10 text-primary px-4 py-2 rounded-xl text-xs font-bold hover:bg-primary/20 transition uppercase tracking-wider">Add New</button>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="p-6 rounded-2xl border-2 border-primary/20 bg-primary/5 relative">
                                            <div className="flex justify-between items-start mb-4">
                                                <span className="bg-primary text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-tighter">Default</span>
                                                <button className="text-gray-400 hover:text-primary transition"><Settings className="w-4 h-4" /></button>
                                            </div>
                                            <p className="font-bold text-gray-900">{session.user.name}</p>
                                            <p className="text-sm text-gray-500 mt-2 leading-relaxed">
                                                Wait for address data...<br />
                                                Please update in settings.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'settings' && (
                                <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                                    <h3 className="text-xl font-display font-bold text-gray-900 mb-6">Account Settings</h3>
                                    <div className="space-y-8 max-w-xl">
                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Full Name</label>
                                                <input type="text" defaultValue={session.user.name ?? ''} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition" />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Email</label>
                                                <input type="email" defaultValue={session.user.email ?? ''} disabled className="w-full px-4 py-3 rounded-xl border border-gray-100 bg-gray-50 text-gray-400 cursor-not-allowed" />
                                            </div>
                                        </div>
                                        <button className="bg-gray-900 text-white px-8 py-3 rounded-xl text-sm font-bold hover:bg-black transition shadow-lg active:scale-95">
                                            Save Changes
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </main>
                </div>
            </div>
        </div>
    )
}
