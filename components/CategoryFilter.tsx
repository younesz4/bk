'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { categories } from '@/lib/data'

export default function CategoryFilter() {
  const searchParams = useSearchParams()
  const selectedCategory = searchParams.get('category')

  return (
    <div className="flex flex-wrap gap-4 mb-12">
      <Link
        href="/boutique"
        className={`px-6 py-3 text-sm font-light border luxury-interactive min-h-[44px] flex items-center justify-center ${
          !selectedCategory
            ? 'border-walnut-800 text-walnut-800 bg-walnut-50'
            : 'border-walnut-300 text-walnut-600 hover:border-walnut-500'
        }`}
      >
        All
      </Link>
      {categories.map((category) => (
        <Link
          key={category}
          href={`/boutique?category=${encodeURIComponent(category)}`}
          className={`px-6 py-3 text-sm font-light border luxury-interactive min-h-[44px] flex items-center justify-center ${
            selectedCategory === category
              ? 'border-walnut-800 text-walnut-800 bg-walnut-50'
              : 'border-walnut-300 text-walnut-600 hover:border-walnut-500'
          }`}
        >
          {category}
        </Link>
      ))}
    </div>
  )
}

