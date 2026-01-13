'use client'

import Link from 'next/link'
import { ShoppingBag, User, Menu, X } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import { useState, useEffect } from 'react'
import { motion, useScroll, useMotionValueEvent } from 'framer-motion'
import { cn } from '@/lib/utils'

export default function Header() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const [scrolled, setScrolled] = useState(false)
    const itemCount = useCartStore((state) => state.getItemCount())
    const { scrollY } = useScroll()

    useMotionValueEvent(scrollY, "change", (latest) => {
        setScrolled(latest > 50)
    })

    return (
        <motion.header
            className={cn(
                "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
                scrolled || mobileMenuOpen ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100 py-3" : "bg-transparent py-5"
            )}
        >
            <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center">
                    {/* Logo - Serif for Luxury */}
                    <Link href="/" className="flex items-center space-x-2 group">
                        <div className={cn(
                            "text-2xl font-serif font-medium tracking-tight transition-colors",
                            scrolled || mobileMenuOpen ? "text-primary" : "text-white"
                        )}>
                            MrCake.
                        </div>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-10">
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
                                    "text-[11px] font-semibold tracking-[0.2em] uppercase transition-colors hover:text-accent",
                                    scrolled || mobileMenuOpen ? "text-gray-600" : "text-white/90 hover:text-white"
                                )}
                            >
                                {item.label}
                            </Link>
                        ))}
                    </div>

                    {/* Right Icons */}
                    <div className="flex items-center space-x-6">
                        <Link
                            href="/profile"
                            className={cn(
                                "transition-colors",
                                scrolled || mobileMenuOpen ? "text-gray-800 hover:text-primary" : "text-white hover:text-white/80"
                            )}
                            aria-label="User profile"
                        >
                            <User className="w-5 h-5" />
                        </Link>

                        <Link
                            href="/cart"
                            className={cn(
                                "relative transition-colors",
                                scrolled || mobileMenuOpen ? "text-gray-800 hover:text-primary" : "text-white hover:text-white/80"
                            )}
                            aria-label="Shopping cart"
                        >
                            <ShoppingBag className="w-5 h-5" />
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
                                scrolled || mobileMenuOpen ? "text-gray-800" : "text-white"
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
