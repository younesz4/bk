'use client'

import { useEffect, useState, useMemo } from 'react'
import { notFound, useParams } from 'next/navigation'
import ProductImageGallery from '@/components/ProductImageGallery'
import VariantSelector, { type Variant } from '@/components/VariantSelector'
import DimensionsTable from '@/components/DimensionsTable'
import MaterialsList from '@/components/MaterialsList'

export default function ProductPage() {
  const [product, setProduct] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const resolvedParams = useParams()
  const slug = resolvedParams?.slug as string

  useEffect(() => {
    async function fetchProduct() {
      if (!slug) return
      
      setLoading(true)
      try {
        const res = await fetch(`/api/products/${slug}`)
        const data = await res.json()
        
        if (data.ok && data.product) {
          setProduct(data.product)
        } else {
          setError(true)
        }
      } catch (err) {
        console.error('Error fetching product:', err)
        setError(true)
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [slug])

  if (loading) {
    return (
      <div className="pt-32 pb-24 px-6 md:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-neutral-600">Chargement du produit...</p>
        </div>
      </div>
    )
  }

  if (error || !product) {
    notFound()
  }

  // Transform product images
  const productImages = product.images?.map((img: any) => ({
    url: img.url,
    alt: img.alt || product.name,
  })) || []

  // Transform variants
  const variants: Variant[] = useMemo(() => {
    if (product.variants && product.variants.length > 0) {
      return product.variants.map((v: any) => ({
        id: v.id,
        size: v.size,
        fabric: v.fabric,
        color: v.color,
        finish: v.finish,
        price: v.price ? v.price / 100 : null, // Convert from cents
        stock: v.stock || 0,
        sku: v.sku,
        isDefault: v.isDefault || false,
      }))
    }
    // Default variant if none exist
    return [
      {
        id: 'default',
        size: null,
        fabric: null,
        color: null,
        finish: null,
        price: null,
        stock: product.stock || 0,
        sku: null,
        isDefault: true,
      },
    ]
  }, [product])

  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(variants[0])

  // Calculate display price
  const basePrice = product.price / 100 // Convert from cents
  const displayPrice = selectedVariant?.price ?? basePrice

  // Transform materials
  const materials = useMemo(() => {
    if (product.materials && product.materials.length > 0) {
      return product.materials.map((mat: any) => ({
        id: mat.id,
        name: mat.name,
        order: mat.order || 0,
      }))
    }
    return []
  }, [product])

  // Get dimensions
  const dimensions = {
    width: product.width ? product.width / 10 : null, // Convert from mm to cm
    depth: product.depth ? product.depth / 10 : null,
    height: product.height ? product.height / 10 : null,
  }

  // Get category name
  const categoryName = product.categories?.[0]?.category?.name || 'Produit'

  return (
    <div className="pt-32 pb-24 px-6 md:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 mb-16">
          {/* Image Gallery */}
          <ProductImageGallery images={productImages} productName={product.name} />

          {/* Product Details */}
          <div>
            <p className="text-sm text-walnut-500 font-light mb-4">{categoryName}</p>
            <h1 className="text-4xl md:text-5xl text-walnut-800 mb-6">{product.name}</h1>
            
            <div className="border-t border-walnut-200 pt-8 mb-8">
              <p className="text-walnut-700 font-light leading-relaxed mb-8">
                {product.description || 'Aucune description disponible.'}
              </p>
            </div>

            {/* Price */}
            <div className="mb-8">
              <p className="text-3xl text-walnut-800 font-light">
                {new Intl.NumberFormat('fr-FR', {
                  style: 'currency',
                  currency: 'EUR',
                }).format(displayPrice)}
              </p>
            </div>

            {/* Variant Selector */}
            {variants.length > 0 && (
              <div className="mb-8">
                <VariantSelector
                  variants={variants}
                  basePrice={basePrice}
                  onVariantChange={setSelectedVariant}
                />
              </div>
            )}

            {/* Dimensions Table */}
            {(dimensions.width || dimensions.depth || dimensions.height) && (
              <div className="mb-8">
                <DimensionsTable
                  width={dimensions.width}
                  depth={dimensions.depth}
                  height={dimensions.height}
                />
              </div>
            )}

            {/* Materials List */}
            {materials.length > 0 && (
              <div className="mb-8">
                <MaterialsList materials={materials} />
              </div>
            )}

            <button
              disabled={!selectedVariant || selectedVariant.stock === 0}
              className="w-full md:w-auto px-12 py-4 bg-walnut-800 text-cream-50 font-light hover:bg-walnut-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {selectedVariant && selectedVariant.stock > 0
                ? 'Ajouter au panier'
                : 'Rupture de stock'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
