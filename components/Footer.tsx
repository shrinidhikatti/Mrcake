'use client'

import Link from 'next/link'
import { Facebook, Instagram, Twitter, ArrowRight } from 'lucide-react'

export default function Footer() {
    return (
        <footer className="bg-white border-t border-gray-100 pt-20 pb-10">
            <div className="max-w-7xl mx-auto px-4 md:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8 mb-16">
                    {/* 1. Brand / About */}
                    <div className="space-y-6">
                        <Link href="/" className="text-3xl font-serif font-medium text-primary tracking-tight block">
                            MrCake.
                        </Link>
                        <p className="text-gray-500 font-light text-sm leading-relaxed max-w-xs">
                            Artisan baking with the finest ingredients. Bringing joy to your celebrations, one slice at a time.
                        </p>
                        <div className="flex items-center space-x-4">
                            <a href="#" className="p-2 bg-gray-50 rounded-full text-gray-600 hover:bg-black hover:text-white transition-all duration-300">
                                <Instagram size={18} />
                            </a>
                            <a href="#" className="p-2 bg-gray-50 rounded-full text-gray-600 hover:bg-black hover:text-white transition-all duration-300">
                                <Facebook size={18} />
                            </a>
                            <a href="#" className="p-2 bg-gray-50 rounded-full text-gray-600 hover:bg-black hover:text-white transition-all duration-300">
                                <Twitter size={18} />
                            </a>
                        </div>
                    </div>

                    {/* 2. Shop Links */}
                    <div>
                        <h4 className="font-display font-medium text-sm uppercase tracking-widest mb-6 text-gray-900">Shop</h4>
                        <ul className="space-y-4">
                            {['All Products', 'Cakes', 'Pastries', 'Custom Orders', 'Gift Boxes'].map((item) => (
                                <li key={item}>
                                    <Link href="/products" className="text-gray-500 hover:text-black text-sm font-light transition-colors">
                                        {item}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* 3. Company Links */}
                    <div>
                        <h4 className="font-display font-medium text-sm uppercase tracking-widest mb-6 text-gray-900">Company</h4>
                        <ul className="space-y-4">
                            {['Our Story', 'Contact', 'FAQ', 'Terms of Service', 'Privacy Policy'].map((item) => (
                                <li key={item}>
                                    <Link href={`/${item.toLowerCase().replace(/ /g, '-')}`} className="text-gray-500 hover:text-black text-sm font-light transition-colors">
                                        {item}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* 4. Newsletter */}
                    <div>
                        <h4 className="font-display font-medium text-sm uppercase tracking-widest mb-6 text-gray-900">Newsletter</h4>
                        <p className="text-gray-500 font-light text-sm mb-4">
                            Subscribe to receive updates, access to exclusive deals, and more.
                        </p>
                        <div className="flex gap-2">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="bg-gray-50 border border-gray-200 text-sm px-4 py-3 w-full focus:outline-none focus:border-black transition-colors"
                            />
                            <button className="bg-black text-white px-4 py-3 hover:bg-gray-800 transition-colors">
                                <ArrowRight size={18} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center text-xs text-gray-400 font-light">
                    <p>© {new Date().getFullYear()} MrCake Palace & Bakers. All rights reserved.</p>
                    <p className="mt-2 md:mt-0">Designed & Built in Bidar.</p>
                </div>
            </div>
        </footer>
    )
}
