'use client'

import { useState, useEffect } from 'react'
import { Search, X } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'

export default function SearchBar() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [query, setQuery] = useState(searchParams.get('q') || '')

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            updateSearch(query)
        }, 500) // Wait 500ms after user stops typing

        return () => clearTimeout(timer)
    }, [query])

    const updateSearch = (value: string) => {
        const params = new URLSearchParams(searchParams.toString())

        if (value) {
            params.set('q', value)
        } else {
            params.delete('q')
        }

        router.push(`/products?${params.toString()}`)
    }

    const clearSearch = () => {
        setQuery('')
        const params = new URLSearchParams(searchParams.toString())
        params.delete('q')
        router.push(`/products?${params.toString()}`)
    }

    return (
        <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search for cakes, pastries, breads..."
                className="w-full pl-12 pr-12 py-4 rounded-2xl border-2 border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm bg-white"
            />
            {query && (
                <button
                    onClick={clearSearch}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full transition"
                    title="Clear search"
                >
                    <X className="w-4 h-4 text-gray-400" />
                </button>
            )}
        </div>
    )
}
