'use client'

import { useEffect, useState } from 'react'
import { Heart, Loader2 } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'

interface WishlistButtonProps {
    productId: string
    variant?: 'default' | 'small'
    className?: string
}

export default function WishlistButton({ productId, variant = 'default', className }: WishlistButtonProps) {
    const { data: session, status } = useSession()
    const router = useRouter()
    const [inWishlist, setInWishlist] = useState(false)
    const [loading, setLoading] = useState(false)
    const [checking, setChecking] = useState(true)

    useEffect(() => {
        checkWishlistStatus()
    }, [productId, status])

    const checkWishlistStatus = async () => {
        if (status === 'unauthenticated') {
            setChecking(false)
            return
        }

        if (status === 'authenticated') {
            try {
                const res = await fetch(`/api/wishlist/check?productId=${productId}`)
                const data = await res.json()
                setInWishlist(data.inWishlist)
            } catch (error) {
                console.error('Failed to check wishlist:', error)
            } finally {
                setChecking(false)
            }
        }
    }

    const toggleWishlist = async (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()

        console.log('toggleWishlist clicked', { status, productId, inWishlist })

        if (status === 'unauthenticated') {
            console.log('User not authenticated, redirecting to login')
            router.push('/login?callbackUrl=' + encodeURIComponent(window.location.pathname))
            return
        }

        setLoading(true)
        try {
            if (inWishlist) {
                // Remove from wishlist
                console.log('Removing from wishlist...')
                const res = await fetch(`/api/wishlist?productId=${productId}`, {
                    method: 'DELETE'
                })

                console.log('Remove response:', res.status, res.ok)
                const data = await res.json()
                console.log('Remove data:', data)

                if (res.ok) {
                    setInWishlist(false)
                }
            } else {
                // Add to wishlist
                console.log('Adding to wishlist...')
                const res = await fetch('/api/wishlist', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ productId })
                })

                console.log('Add response:', res.status, res.ok)
                const data = await res.json()
                console.log('Add data:', data)

                if (res.ok) {
                    setInWishlist(true)
                }
            }
        } catch (error) {
            console.error('Failed to toggle wishlist:', error)
        } finally {
            setLoading(false)
        }
    }

    if (checking) {
        return (
            <button
                disabled
                className={cn(
                    'flex items-center justify-center rounded-full transition',
                    variant === 'small' ? 'w-8 h-8' : 'w-10 h-10',
                    'bg-white/80 backdrop-blur-sm',
                    className
                )}
            >
                <Loader2 className={cn('animate-spin text-gray-400', variant === 'small' ? 'w-4 h-4' : 'w-5 h-5')} />
            </button>
        )
    }

    return (
        <button
            onClick={toggleWishlist}
            disabled={loading}
            className={cn(
                'flex items-center justify-center rounded-full transition',
                variant === 'small' ? 'w-8 h-8' : 'w-10 h-10',
                'bg-white/80 backdrop-blur-sm hover:bg-white',
                'border-2',
                inWishlist ? 'border-red-500' : 'border-gray-200 hover:border-red-300',
                'disabled:opacity-50 disabled:cursor-not-allowed',
                className
            )}
            title={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
        >
            {loading ? (
                <Loader2 className={cn('animate-spin', variant === 'small' ? 'w-4 h-4' : 'w-5 h-5', inWishlist ? 'text-red-500' : 'text-gray-400')} />
            ) : (
                <Heart
                    className={cn(
                        variant === 'small' ? 'w-4 h-4' : 'w-5 h-5',
                        inWishlist ? 'fill-red-500 text-red-500' : 'text-gray-600'
                    )}
                />
            )}
        </button>
    )
}
