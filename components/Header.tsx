'use client'

import Link from 'next/link'
import { ShoppingBag, User, Menu, X, Heart } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import { useState, useEffect } from 'react'
import { motion, useScroll, useMotionValueEvent } from 'framer-motion'
import { cn } from '@/lib/utils'
import { usePathname } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'
import { LogOut, LayoutDashboard } from 'lucide-react'

export default function Header() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const [scrolled, setScrolled] = useState(false)
    const itemCount = useCartStore((state) => state.getItemCount())
    const { scrollY } = useScroll()
    const pathname = usePathname()
    const { data: session } = useSession()

    // Pages that should always have solid header
    const solidHeaderPages = ['/cart', '/checkout', '/products', '/about', '/contact', '/menu']
    const shouldAlwaysBeVisible = solidHeaderPages.some(page => pathname?.startsWith(page))

    useMotionValueEvent(scrollY, "change", (latest) => {
        setScrolled(latest > 50)
    })

    return (
        <motion.header
            className={cn(
                "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
                shouldAlwaysBeVisible || scrolled || mobileMenuOpen
                    ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100 py-12"
                    : "bg-transparent py-10"
            )}
        >
            <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center md:grid md:grid-cols-12">
                    {/* Logo - Serif for Luxury */}
                    <Link href="/" className="flex items-center space-x-2 group z-50 md:col-span-3 md:justify-self-start">
                        <div className={cn(
                            "text-2xl font-serif font-medium tracking-tight transition-colors",
                            shouldAlwaysBeVisible || scrolled || mobileMenuOpen ? "text-gray-900" : "text-white"
                        )}>
                            MrCake.
                        </div>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center justify-center space-x-12 md:col-span-6 md:justify-self-center">
                        {[
                            { label: 'Home', href: '/' },
                            { label: 'Menu', href: '/menu' },
                            { label: 'About Us', href: '/about' },
                            { label: 'Contact', href: '/contact' }
                        ].map((item) => (
                            <Link
                                key={item.label}
                                href={item.href}
                                className={cn(
                                    "text-xs font-semibold tracking-[0.2em] uppercase transition-colors hover:text-accent py-2",
                                    shouldAlwaysBeVisible || scrolled || mobileMenuOpen ? "text-gray-800 hover:text-gray-600" : "text-white/90 hover:text-white"
                                )}
                            >
                                {item.label}
                            </Link>
                        ))}
                    </div>

                    {/* Right Icons */}
                    <div className="flex items-center space-x-8 md:col-span-3 md:justify-self-end">
                        {session ? (
                            <div className="relative group/user">
                                <button
                                    className={cn(
                                        "transition-colors p-2.5 rounded-full hover:bg-gray-100/10 flex items-center gap-2",
                                        shouldAlwaysBeVisible || scrolled || mobileMenuOpen ? "text-gray-800 hover:text-primary" : "text-white hover:text-white/80"
                                    )}
                                >
                                    {session.user?.image ? (
                                        <img src={session.user.image} alt="" className="w-6 h-6 rounded-full" />
                                    ) : (
                                        <User className="w-6 h-6" />
                                    )}
                                    <span className="hidden lg:block text-xs font-bold uppercase tracking-wider">{session.user?.name?.split(' ')[0]}</span>
                                </button>

                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-border opacity-0 invisible group-hover/user:opacity-100 group-hover/user:visible transition-all duration-200 z-[60] py-2 overflow-hidden">
                                    <Link href="/profile" className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                                        <User className="w-4 h-4" />
                                        Profile
                                    </Link>
                                    {session.user.role === 'ADMIN' && (
                                        <Link href="/admin" className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors border-t border-gray-100">
                                            <LayoutDashboard className="w-4 h-4" />
                                            Admin Panel
                                        </Link>
                                    )}
                                    <button
                                        onClick={() => signOut()}
                                        className="w-full flex items-center gap-3 px-4 py-3 text-sm text-destructive hover:bg-destructive/5 transition-colors border-t border-gray-100"
                                    >
                                        <LogOut className="w-4 h-4" />
                                        Sign Out
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <Link
                                href="/login"
                                className={cn(
                                    "transition-colors p-2.5 rounded-full hover:bg-gray-100/10",
                                    shouldAlwaysBeVisible || scrolled || mobileMenuOpen ? "text-gray-800 hover:text-primary" : "text-white hover:text-white/80"
                                )}
                                aria-label="Login"
                            >
                                <User className="w-6 h-6" />
                            </Link>
                        )}

                        <Link
                            href="/wishlist"
                            className={cn(
                                "transition-colors p-2.5 rounded-full hover:bg-gray-100/10",
                                shouldAlwaysBeVisible || scrolled || mobileMenuOpen ? "text-gray-800 hover:text-primary" : "text-white hover:text-white/80"
                            )}
                            aria-label="Wishlist"
                        >
                            <Heart className="w-6 h-6" />
                        </Link>

                        <Link
                            href="/cart"
                            className={cn(
                                "relative transition-colors p-2.5 rounded-full hover:bg-gray-100/10",
                                shouldAlwaysBeVisible || scrolled || mobileMenuOpen ? "text-gray-800 hover:text-primary" : "text-white hover:text-white/80"
                            )}
                            aria-label="Shopping cart"
                        >
                            <ShoppingBag className="w-6 h-6" />
                            {itemCount > 0 && (
                                <span className="absolute -top-2 -right-2 bg-accent text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                                    {itemCount}
                                </span>
                            )}
                        </Link>

                        {/* Mobile menu button */}
                        <button
                            className={cn(
                                "md:hidden transition-colors",
                                "md:hidden", /* Explicitly hide on desktop to be safe, though md:hidden is already there */
                                shouldAlwaysBeVisible || scrolled || mobileMenuOpen ? "text-gray-800" : "text-white"
                            )}
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            aria-label="Toggle menu"
                        >
                            {mobileMenuOpen ? (
                                <X className="w-6 h-6" />
                            ) : (
                                <Menu className="w-6 h-6" />
                            )}
                        </button>
                    </div>
                </div>

                {/* Mobile Navigation Panel */}
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="md:hidden pt-4 pb-8"
                    >
                        <div className="flex flex-col space-y-4">
                            {[
                                { label: 'Home', href: '/' },
                                { label: 'Menu', href: '/menu' },
                                { label: 'About Us', href: '/about' },
                                { label: 'Contact', href: '/contact' }
                            ].map((item) => (
                                <Link
                                    key={item.label}
                                    href={item.href}
                                    className="text-sm tracking-widest uppercase text-gray-800 hover:text-primary font-medium border-b border-gray-100 pb-2"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    {item.label}
                                </Link>
                            ))}
                        </div>
                    </motion.div>
                )}
            </nav>
        </motion.header>
    )
}
