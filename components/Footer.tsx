'use client'

import Link from 'next/link'
import { Facebook, Instagram, Twitter, MapPin, Phone, Mail } from 'lucide-react'

export default function Footer() {
    return (
        <footer className="bg-gray-100 border-t border-gray-200">
            {/* Main Footer Content */}
            <div className="max-w-7xl mx-auto px-6 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                    {/* Brand Section */}
                    <div className="space-y-4">
                        <Link href="/" className="text-4xl font-serif font-bold text-amber-900 tracking-tight block">
                            MrCake.
                        </Link>
                        <p className="text-gray-700 text-sm leading-relaxed">
                            Creating sweet memories since 2020. Handcrafted with love, baked to perfection.
                        </p>
                        <div className="flex items-center space-x-3 pt-2">
                            <a
                                href="#"
                                className="w-10 h-10 flex items-center justify-center bg-amber-600 rounded-full text-white hover:bg-amber-700 transition-all duration-300 hover:scale-110"
                                aria-label="Instagram"
                            >
                                <Instagram size={18} />
                            </a>
                            <a
                                href="#"
                                className="w-10 h-10 flex items-center justify-center bg-amber-600 rounded-full text-white hover:bg-amber-700 transition-all duration-300 hover:scale-110"
                                aria-label="Facebook"
                            >
                                <Facebook size={18} />
                            </a>
                            <a
                                href="#"
                                className="w-10 h-10 flex items-center justify-center bg-amber-600 rounded-full text-white hover:bg-amber-700 transition-all duration-300 hover:scale-110"
                                aria-label="Twitter"
                            >
                                <Twitter size={18} />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="font-bold text-lg text-amber-900 mb-4">Quick Links</h4>
                        <ul className="space-y-3">
                            {[
                                { label: 'Home', href: '/' },
                                { label: 'Menu', href: '/menu' },
                                { label: 'About Us', href: '/about' },
                                { label: 'Contact', href: '/contact' },
                            ].map((item) => (
                                <li key={item.label}>
                                    <Link
                                        href={item.href}
                                        className="text-gray-700 hover:text-amber-700 text-sm transition-colors flex items-center gap-2 group"
                                    >
                                        <span className="w-1 h-1 bg-amber-600 rounded-full group-hover:w-2 transition-all"></span>
                                        {item.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Products */}
                    <div>
                        <h4 className="font-bold text-lg text-amber-900 mb-4">Our Products</h4>
                        <ul className="space-y-3">
                            {['Cakes', 'Pastries', 'Breads', 'Cookies'].map((item) => (
                                <li key={item}>
                                    <Link
                                        href="/products"
                                        className="text-gray-700 hover:text-amber-700 text-sm transition-colors flex items-center gap-2 group"
                                    >
                                        <span className="w-1 h-1 bg-amber-600 rounded-full group-hover:w-2 transition-all"></span>
                                        {item}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h4 className="font-bold text-lg text-amber-900 mb-4">Get in Touch</h4>
                        <ul className="space-y-3">
                            <li className="flex items-start gap-3 text-sm text-gray-700">
                                <MapPin size={18} className="text-amber-600 mt-0.5 flex-shrink-0" />
                                <span>123 Bakery Street,<br />Sweet Town, ST 12345</span>
                            </li>
                            <li className="flex items-center gap-3 text-sm text-gray-700">
                                <Phone size={18} className="text-amber-600 flex-shrink-0" />
                                <span>+91 98765 43210</span>
                            </li>
                            <li className="flex items-center gap-3 text-sm text-gray-700">
                                <Mail size={18} className="text-amber-600 flex-shrink-0" />
                                <span>hello@mrcake.com</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="bg-amber-900 py-6">
                <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-2">
                    <p className="text-amber-100 text-sm">
                        © {new Date().getFullYear()} MrCake Palace & Bakers. All rights reserved.
                    </p>
                    <p className="text-amber-100 text-sm">
                        Crafted with passion by <span className="font-bold text-white">Shrinidhi Katti</span>
                    </p>
                </div>
            </div>
        </footer>
    )
}
