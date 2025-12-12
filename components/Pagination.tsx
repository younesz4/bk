'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

interface PaginationProps {
  currentPage?: number
  totalPages?: number
}

export default function Pagination({ currentPage = 1, totalPages = 6 }: PaginationProps) {
  const searchParams = useSearchParams()
  const category = searchParams.get('category')
  
  const buildUrl = (page: number) => {
    const params = new URLSearchParams()
    if (category) params.set('category', category)
    if (page > 1) params.set('page', page.toString())
    return `/boutique${params.toString() ? `?${params.toString()}` : ''}`
  }

  return (
    <div className="flex items-center justify-center gap-2 mt-12">
      {currentPage > 1 && (
        <Link
          href={buildUrl(currentPage - 1)}
          className="px-4 py-2 text-sm text-neutral-600 hover:text-black transition-colors"
        >
          ←
        </Link>
      )}
      
      {Array.from({ length: Math.min(totalPages, 6) }, (_, i) => {
        const page = i + 1
        const isActive = page === currentPage
        
        return (
          <Link
            key={page}
            href={buildUrl(page)}
            className={`px-4 py-2 text-sm transition-colors ${
              isActive
                ? 'text-black font-medium border-b-2 border-black'
                : 'text-neutral-600 hover:text-black'
            }`}
          >
            {page}
          </Link>
        )
      })}
      
      {currentPage < totalPages && (
        <Link
          href={buildUrl(currentPage + 1)}
          className="px-4 py-2 text-sm text-neutral-600 hover:text-black transition-colors"
        >
          →
        </Link>
      )}
    </div>
  )
}

