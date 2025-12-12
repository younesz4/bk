'use client'

import { useSearchParams } from 'next/navigation'

interface ShopFiltersProps {
  totalProducts: number
  currentPage?: number
  itemsPerPage?: number
}

export default function ShopFilters({ 
  totalProducts, 
  currentPage = 1, 
  itemsPerPage = 15 
}: ShopFiltersProps) {
  const searchParams = useSearchParams()
  const start = (currentPage - 1) * itemsPerPage + 1
  const end = Math.min(currentPage * itemsPerPage, totalProducts)
  
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
      <p className="text-sm text-neutral-600">
        Showing {start}-{end} of {totalProducts} results
      </p>
      <div className="flex items-center gap-4">
        <button className="text-sm text-neutral-700 hover:text-black transition-colors">
          Filters
        </button>
        <div className="relative">
          <select className="appearance-none bg-transparent border-none text-sm text-neutral-700 hover:text-black transition-colors cursor-pointer pr-6 focus:outline-none">
            <option>Default sorting</option>
            <option>Price: Low to High</option>
            <option>Price: High to Low</option>
            <option>Newest</option>
            <option>Name: A to Z</option>
          </select>
          <div className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none">
            <svg className="w-4 h-4 text-neutral-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  )
}

