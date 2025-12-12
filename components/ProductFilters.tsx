'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'

interface ProductFiltersProps {
  categorySlug: string
  currentFilters: {
    minPrice?: string
    maxPrice?: string
    material?: string
    color?: string
    inStock?: string
  }
}

const MATERIALS = ['Chêne', 'Noyer', 'Hêtre', 'Frêne']
const PRICE_RANGES = [
  { label: 'Tous les prix', min: '', max: '' },
  { label: 'Moins de 500 €', min: '0', max: '500' },
  { label: '500 € - 1 000 €', min: '500', max: '1000' },
  { label: '1 000 € - 2 500 €', min: '1000', max: '2500' },
  { label: '2 500 € - 5 000 €', min: '2500', max: '5000' },
  { label: 'Plus de 5 000 €', min: '5000', max: '' },
]

export default function ProductFilters({ categorySlug, currentFilters }: ProductFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [selectedMaterial, setSelectedMaterial] = useState(currentFilters.material || '')
  const [selectedPriceRange, setSelectedPriceRange] = useState(
    currentFilters.minPrice && currentFilters.maxPrice
      ? `${currentFilters.minPrice}-${currentFilters.maxPrice}`
      : ''
  )
  const [inStockOnly, setInStockOnly] = useState(currentFilters.inStock === 'true')

  const updateFilters = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString())
    
    Object.entries(updates).forEach(([key, value]) => {
      if (value) {
        params.set(key, value)
      } else {
        params.delete(key)
      }
    })

    router.push(`/boutique/${categorySlug}?${params.toString()}`)
  }

  const handleMaterialChange = (material: string) => {
    const newMaterial = selectedMaterial === material ? '' : material
    setSelectedMaterial(newMaterial)
    updateFilters({ material: newMaterial || null })
  }

  const handlePriceRangeChange = (range: string) => {
    setSelectedPriceRange(range)
    if (range) {
      const [min, max] = range.split('-')
      updateFilters({
        minPrice: min || null,
        maxPrice: max || null,
      })
    } else {
      updateFilters({
        minPrice: null,
        maxPrice: null,
      })
    }
  }

  const handleStockChange = (checked: boolean) => {
    setInStockOnly(checked)
    updateFilters({ inStock: checked ? 'true' : null })
  }

  const clearFilters = () => {
    setSelectedMaterial('')
    setSelectedPriceRange('')
    setInStockOnly(false)
    router.push(`/boutique/${categorySlug}`)
  }

  return (
    <div className="bg-white p-6 rounded-lg border border-neutral-200 sticky top-8">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-serif">Filtres</h3>
        <button
          onClick={clearFilters}
          className="text-sm text-neutral-600 hover:text-black transition-colors"
        >
          Réinitialiser
        </button>
      </div>

      {/* Price Range */}
      <div className="mb-6">
        <h4 className="text-sm uppercase tracking-wider text-neutral-600 mb-3">Prix</h4>
        <select
          value={selectedPriceRange}
          onChange={(e) => handlePriceRangeChange(e.target.value)}
          className="w-full px-3 py-2 border border-neutral-300 rounded text-sm focus:outline-none focus:border-black"
        >
          {PRICE_RANGES.map((range) => (
            <option key={range.label} value={range.min && range.max ? `${range.min}-${range.max}` : ''}>
              {range.label}
            </option>
          ))}
        </select>
      </div>

      {/* Materials */}
      <div className="mb-6">
        <h4 className="text-sm uppercase tracking-wider text-neutral-600 mb-3">Matériau</h4>
        <div className="space-y-2">
          {MATERIALS.map((material) => (
            <label key={material} className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={selectedMaterial === material}
                onChange={() => handleMaterialChange(material)}
                className="w-4 h-4 text-black border-neutral-300 rounded focus:ring-black"
              />
              <span className="ml-2 text-sm text-neutral-700">{material}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Stock Filter */}
      <div>
        <label className="flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={inStockOnly}
            onChange={(e) => handleStockChange(e.target.checked)}
            className="w-4 h-4 text-black border-neutral-300 rounded focus:ring-black"
          />
          <span className="ml-2 text-sm text-neutral-700">En stock uniquement</span>
        </label>
      </div>
    </div>
  )
}

