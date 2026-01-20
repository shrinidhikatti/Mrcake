'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { WifiOff, RefreshCw, Home, ShoppingBag } from 'lucide-react'

export default function OfflinePage() {
    const [isOnline, setIsOnline] = useState(false)

    useEffect(() => {
        setIsOnline(navigator.onLine)

        const handleOnline = () => setIsOnline(true)
        const handleOffline = () => setIsOnline(false)

        window.addEventListener('online', handleOnline)
        window.addEventListener('offline', handleOffline)

        return () => {
            window.removeEventListener('online', handleOnline)
            window.removeEventListener('offline', handleOffline)
        }
    }, [])

    const handleRetry = () => {
        window.location.reload()
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#FDFBF7] to-[#F5F1E8] px-4">
            <div className="max-w-md w-full text-center">
                {/* Icon */}
                <div className="mb-8 inline-flex items-center justify-center w-24 h-24 rounded-full bg-white shadow-lg">
                    <WifiOff className="w-12 h-12 text-gray-400" />
                </div>

                {/* Title */}
                <h1 className="text-4xl font-display font-bold text-gray-900 mb-4">
                    You're Offline
                </h1>

                {/* Description */}
                <p className="text-lg text-gray-600 mb-8">
                    {isOnline
                        ? "Connection restored! Click retry to continue."
                        : "It looks like you've lost your internet connection. Please check your network and try again."}
                </p>

                {/* Status Indicator */}
                <div className="mb-8 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border-2 border-gray-200">
                    <div className={`w-3 h-3 rounded-full ${isOnline ? 'bg-green-500' : 'bg-red-500'} animate-pulse`}></div>
                    <span className="text-sm font-medium text-gray-700">
                        {isOnline ? 'Back Online' : 'No Connection'}
                    </span>
                </div>

                {/* Actions */}
                <div className="space-y-4">
                    <button
                        onClick={handleRetry}
                        className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gray-900 text-white text-base font-bold hover:bg-black transition shadow-lg hover:shadow-xl"
                    >
                        <RefreshCw className="w-5 h-5" />
                        Retry Connection
                    </button>

                    <div className="grid grid-cols-2 gap-4">
                        <Link
                            href="/"
                            className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 border-gray-200 text-gray-700 text-sm font-bold hover:bg-gray-50 transition"
                        >
                            <Home className="w-4 h-4" />
                            Home
                        </Link>
                        <Link
                            href="/cart"
                            className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 border-gray-200 text-gray-700 text-sm font-bold hover:bg-gray-50 transition"
                        >
                            <ShoppingBag className="w-4 h-4" />
                            Cart
                        </Link>
                    </div>
                </div>

                {/* Info Box */}
                <div className="mt-8 p-4 bg-white rounded-xl border border-gray-200 text-left">
                    <h3 className="text-sm font-bold text-gray-900 mb-2">While you're offline:</h3>
                    <ul className="text-sm text-gray-600 space-y-1">
                        <li>• Your cart is saved locally</li>
                        <li>• Previously viewed products are cached</li>
                        <li>• Orders will sync when you're back online</li>
                    </ul>
                </div>
            </div>
        </div>
    )
}
