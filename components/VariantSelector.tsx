'use client'

import { useState, useMemo } from 'react'

export interface Variant {
  id: string
  size?: string | null
  fabric?: string | null
  color?: string | null
  finish?: string | null
  price?: number | null
  stock: number
  sku?: string | null
  isDefault: boolean
}

interface VariantSelectorProps {
  variants: Variant[]
  basePrice: number
  onVariantChange?: (variant: Variant) => void
}

export default function VariantSelector({
  variants,
  basePrice,
  onVariantChange,
}: VariantSelectorProps) {
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(
    variants.find((v) => v.isDefault) || variants[0] || null
  )

  // Extract unique options
  const sizes = useMemo(() => {
    const unique = Array.from(new Set(variants.map((v) => v.size).filter(Boolean)))
    return unique.filter((s): s is string => s !== null)
  }, [variants])

  const fabrics = useMemo(() => {
    const unique = Array.from(new Set(variants.map((v) => v.fabric).filter(Boolean)))
    return unique.filter((f): f is string => f !== null)
  }, [variants])

  const finishes = useMemo(() => {
    const unique = Array.from(new Set(variants.map((v) => v.finish).filter(Boolean)))
    return unique.filter((f): f is string => f !== null)
  }, [variants])

  const [selectedSize, setSelectedSize] = useState<string | null>(
    selectedVariant?.size || (sizes.length > 0 ? sizes[0] : null)
  )
  const [selectedFabric, setSelectedFabric] = useState<string | null>(
    selectedVariant?.fabric || (fabrics.length > 0 ? fabrics[0] : null)
  )
  const [selectedFinish, setSelectedFinish] = useState<string | null>(
    selectedVariant?.finish || (finishes.length > 0 ? finishes[0] : null)
  )

  // Find matching variant based on selections
  const currentVariant = useMemo(() => {
    return variants.find(
      (v) =>
        (selectedSize === null || v.size === selectedSize) &&
        (selectedFabric === null || v.fabric === selectedFabric) &&
        (selectedFinish === null || v.finish === selectedFinish)
    )
  }, [variants, selectedSize, selectedFabric, selectedFinish])

  // Update selected variant when current variant changes
  useMemo(() => {
    if (currentVariant && currentVariant.id !== selectedVariant?.id) {
      setSelectedVariant(currentVariant)
      onVariantChange?.(currentVariant)
    }
  }, [currentVariant, selectedVariant, onVariantChange])

  const displayPrice = currentVariant?.price ?? basePrice
  const stock = currentVariant?.stock ?? 0

  return (
    <div className="space-y-6">
      {/* Size Selector */}
      {sizes.length > 0 && (
        <div>
          <label className="text-sm font-light text-walnut-500 mb-2 block">
            Taille
          </label>
          <div className="flex flex-wrap gap-2">
            {sizes.map((size) => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                className={`px-4 py-2 text-sm font-light border transition-colors ${
                  selectedSize === size
                    ? 'border-walnut-800 text-walnut-800 bg-walnut-50'
                    : 'border-walnut-300 text-walnut-600 hover:border-walnut-500'
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Fabric Selector */}
      {fabrics.length > 0 && (
        <div>
          <label className="text-sm font-light text-walnut-500 mb-2 block">
            Tissu
          </label>
          <div className="flex flex-wrap gap-2">
            {fabrics.map((fabric) => (
              <button
                key={fabric}
                onClick={() => setSelectedFabric(fabric)}
                className={`px-4 py-2 text-sm font-light border transition-colors ${
                  selectedFabric === fabric
                    ? 'border-walnut-800 text-walnut-800 bg-walnut-50'
                    : 'border-walnut-300 text-walnut-600 hover:border-walnut-500'
                }`}
              >
                {fabric}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Finish Selector */}
      {finishes.length > 0 && (
        <div>
          <label className="text-sm font-light text-walnut-500 mb-2 block">
            Finition
          </label>
          <div className="flex flex-wrap gap-2">
            {finishes.map((finish) => (
              <button
                key={finish}
                onClick={() => setSelectedFinish(finish)}
                className={`px-4 py-2 text-sm font-light border transition-colors ${
                  selectedFinish === finish
                    ? 'border-walnut-800 text-walnut-800 bg-walnut-50'
                    : 'border-walnut-300 text-walnut-600 hover:border-walnut-500'
                }`}
              >
                {finish}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Price Display */}
      <div className="border-t border-walnut-200 pt-4">
        <div className="flex items-baseline justify-between">
          <span className="text-sm font-light text-walnut-500">Prix</span>
          <span className="text-3xl text-walnut-700 font-light">
            {new Intl.NumberFormat('fr-FR', {
              style: 'currency',
              currency: 'EUR',
            }).format(displayPrice)}
          </span>
        </div>
      </div>

      {/* Stock Indicator */}
      <div className="flex items-center gap-2">
        <span className="text-sm font-light text-walnut-500">Stock:</span>
        {stock > 0 ? (
          <span className="text-sm text-walnut-700">
            {stock} {stock === 1 ? 'article disponible' : 'articles disponibles'}
          </span>
        ) : (
          <span className="text-sm text-red-600">Rupture de stock</span>
        )}
      </div>
    </div>
  )
}


