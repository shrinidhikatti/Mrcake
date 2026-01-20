'use client'

import { useEffect, useState } from 'react'
import { Download, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface BeforeInstallPromptEvent extends Event {
    prompt(): Promise<void>
    userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

export default function PWAInstallPrompt() {
    const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
    const [showPrompt, setShowPrompt] = useState(false)
    const [isInstalled, setIsInstalled] = useState(false)

    useEffect(() => {
        // Check if app is already installed
        if (window.matchMedia('(display-mode: standalone)').matches) {
            setIsInstalled(true)
            return
        }

        // Check if user has dismissed the prompt before
        const dismissed = localStorage.getItem('pwa-install-dismissed')
        if (dismissed) {
            const dismissedDate = new Date(dismissed)
            const daysSinceDismissed = (Date.now() - dismissedDate.getTime()) / (1000 * 60 * 60 * 24)
            if (daysSinceDismissed < 7) {
                return // Don't show for 7 days after dismissal
            }
        }

        const handleBeforeInstallPrompt = (e: Event) => {
            e.preventDefault()
            setDeferredPrompt(e as BeforeInstallPromptEvent)
            // Show prompt after 30 seconds
            setTimeout(() => {
                setShowPrompt(true)
            }, 30000)
        }

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)

        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
        }
    }, [])

    const handleInstallClick = async () => {
        if (!deferredPrompt) return

        deferredPrompt.prompt()
        const { outcome } = await deferredPrompt.userChoice

        if (outcome === 'accepted') {
            setIsInstalled(true)
        }

        setDeferredPrompt(null)
        setShowPrompt(false)
    }

    const handleDismiss = () => {
        setShowPrompt(false)
        localStorage.setItem('pwa-install-dismissed', new Date().toISOString())
    }

    if (isInstalled || !showPrompt) return null

    return (
        <AnimatePresence>
            <motion.div
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 100, opacity: 0 }}
                className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-sm z-50"
            >
                <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 p-6 relative">
                    {/* Close Button */}
                    <button
                        onClick={handleDismiss}
                        className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
                        aria-label="Dismiss"
                    >
                        <X className="w-5 h-5" />
                    </button>

                    {/* Content */}
                    <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-[#8B4513] to-[#6B3410] rounded-xl flex items-center justify-center">
                            <Download className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                            <h3 className="text-lg font-bold text-gray-900 mb-1">
                                Install MrCake App
                            </h3>
                            <p className="text-sm text-gray-600 mb-4">
                                Get faster access and work offline. Install our app for the best experience!
                            </p>
                            <div className="flex gap-2">
                                <button
                                    onClick={handleInstallClick}
                                    className="flex-1 px-4 py-2.5 bg-gray-900 text-white text-sm font-bold rounded-xl hover:bg-black transition"
                                >
                                    Install Now
                                </button>
                                <button
                                    onClick={handleDismiss}
                                    className="px-4 py-2.5 text-gray-600 text-sm font-medium hover:bg-gray-50 rounded-xl transition"
                                >
                                    Later
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Features */}
                    <div className="mt-4 pt-4 border-t border-gray-100">
                        <ul className="text-xs text-gray-500 space-y-1">
                            <li>✓ Works offline</li>
                            <li>✓ Faster loading</li>
                            <li>✓ Home screen access</li>
                        </ul>
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    )
}
