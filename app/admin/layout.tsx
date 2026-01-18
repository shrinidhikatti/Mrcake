import { auth } from "@/auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import { LayoutDashboard, ShoppingBag, Users, Package, Settings, Home, ArrowLeft } from "lucide-react"

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const session = await auth()

    if (!session || session.user.role !== "ADMIN") {
        redirect("/profile")
    }

    const navItems = [
        { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
        { label: "Orders", href: "/admin/orders", icon: ShoppingBag },
        { label: "Products", href: "/admin/products", icon: Package },
        { label: "Users", href: "/admin/users", icon: Users },
        { label: "Settings", href: "/admin/settings", icon: Settings },
    ]

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col lg:flex-row">
            {/* Sidebar - Desktop */}
            <aside className="w-72 bg-white border-r border-gray-200 hidden lg:flex flex-col h-screen sticky top-0">
                <div className="p-8">
                    <Link href="/" className="flex items-center gap-2 text-primary font-display font-bold text-2xl tracking-tight">
                        MrCake<span className="text-secondary text-3xl">.</span>
                    </Link>
                    <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-400 mt-1">Admin Control Room</p>
                </div>

                <nav className="flex-grow px-4 space-y-2">
                    {navItems.map((item) => (
                        <Link
                            key={item.label}
                            href={item.href}
                            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-50 hover:text-primary transition-all group"
                        >
                            <item.icon className="w-5 h-5 text-gray-400 group-hover:text-primary" />
                            {item.label}
                        </Link>
                    ))}
                </nav>

                <div className="p-6 border-t border-gray-100">
                    <Link
                        href="/"
                        className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-gray-500 hover:bg-gray-50 transition-all"
                    >
                        <Home className="w-5 h-5" />
                        Back to Site
                    </Link>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-grow flex flex-col min-h-screen overflow-hidden">
                {/* Top Header */}
                <header className="bg-white border-b border-gray-200 py-4 px-8 flex items-center justify-between sticky top-0 z-40">
                    <div className="flex items-center gap-4">
                        <Link href="/admin" className="lg:hidden text-primary font-display font-bold text-xl">MrCake.</Link>
                        <h2 className="text-lg font-display font-bold text-gray-900 hidden sm:block">Control Panel</h2>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="text-right hidden sm:block">
                            <p className="text-sm font-bold text-gray-900">{session.user.name}</p>
                            <p className="text-xs text-secondary font-medium uppercase tracking-tighter">Administrator</p>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center border-2 border-white shadow-sm overflow-hidden">
                            {session.user.image ? (
                                <img src={session.user.image} alt="" className="w-full h-full object-cover" />
                            ) : (
                                <span className="text-primary font-bold">{session.user.name?.[0]}</span>
                            )}
                        </div>
                    </div>
                </header>

                <div className="p-6 sm:p-10 max-w-[1600px] mx-auto w-full">
                    {children}
                </div>
            </main>
        </div>
    )
}
