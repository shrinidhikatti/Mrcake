'use client'

import Link from 'next/link'
import { Facebook, Instagram, Twitter, ArrowRight } from 'lucide-react'

export default function Footer() {
    return (
        <footer className="bg-amber-900 border-t border-amber-800 pt-12 pb-6">
            <div className="max-w-7xl mx-auto px-4 md:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-6 mb-8">
                    {/* 1. Brand / About */}
                    <div className="space-y-4">
                        <Link href="/" className="text-3xl font-serif font-medium text-amber-100 tracking-tight block">
                            MrCake.
                        </Link>
                        <p className="text-amber-200 font-light text-sm leading-relaxed max-w-xs">
                            Artisan baking with the finest ingredients. Bringing joy to your celebrations, one slice at a time.
                        </p>
                        <div className="flex items-center space-x-4">
                            <a href="#" className="p-2 bg-amber-800 rounded-full text-amber-200 hover:bg-amber-700 hover:text-white transition-all duration-300">
                                <Instagram size={18} />
                            </a>
                            <a href="#" className="p-2 bg-amber-800 rounded-full text-amber-200 hover:bg-amber-700 hover:text-white transition-all duration-300">
                                <Facebook size={18} />
                            </a>
                            <a href="#" className="p-2 bg-amber-800 rounded-full text-amber-200 hover:bg-amber-700 hover:text-white transition-all duration-300">
                                <Twitter size={18} />
                            </a>
                        </div>
                    </div>

                    {/* 2. Shop Links */}
                    <div>
                        <h4 className="font-display font-medium text-sm uppercase tracking-widest mb-4 text-amber-100">Shop</h4>
                        <ul className="space-y-3">
                            {['All Products', 'Cakes', 'Pastries', 'Custom Orders', 'Gift Boxes'].map((item) => (
                                <li key={item}>
                                    <Link href="/products" className="text-amber-200 hover:text-white text-sm font-light transition-colors">
                                        {item}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* 3. Company Links */}
                    <div>
                        <h4 className="font-display font-medium text-sm uppercase tracking-widest mb-4 text-amber-100">Company</h4>
                        <ul className="space-y-3">
                            {['Our Story', 'Contact', 'FAQ', 'Terms of Service', 'Privacy Policy'].map((item) => (
                                <li key={item}>
                                    <Link href={`/${item.toLowerCase().replace(/ /g, '-')}`} className="text-amber-200 hover:text-white text-sm font-light transition-colors">
                                        {item}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* 4. Newsletter */}
                    <div>
                        <h4 className="font-display font-medium text-sm uppercase tracking-widest mb-4 text-amber-100">Newsletter</h4>
                        <p className="text-amber-200 font-light text-sm mb-4">
                            Subscribe to receive updates, access to exclusive deals, and more.
                        </p>
                        <div className="flex gap-2">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="bg-amber-800 border border-amber-700 text-sm px-4 py-3 w-full focus:outline-none focus:border-amber-600 transition-colors text-white placeholder:text-amber-300"
                            />
                            <button className="bg-amber-700 text-white px-4 py-3 hover:bg-amber-600 transition-colors">
                                <ArrowRight size={18} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-6 border-t border-amber-800 flex flex-col md:flex-row justify-between items-center text-xs text-amber-300 font-light">
                    <p>© {new Date().getFullYear()} MrCake Palace & Bakers. All rights reserved.</p>
                    <p className="mt-2 md:mt-0">Designed & Built by Shrinidhi Katti.</p>
                </div>
            </div>
        </footer>
    )
}
