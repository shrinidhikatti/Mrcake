'use client'

import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'

export default function BackButton() {
  const router = useRouter()

  return (
    <button
      onClick={() => router.back()}
      className="fixed top-20 left-4 z-40 bg-white/90 backdrop-blur-sm text-gray-800 p-3 rounded-full shadow-lg hover:bg-white hover:scale-110 transition-all duration-300 border border-gray-200"
      aria-label="Go back"
    >
      <ArrowLeft size={20} />
    </button>
  )
}
