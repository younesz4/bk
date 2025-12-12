'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import ShopFilters from './ShopFilters'
import ProductGrid from './ProductGrid'
import Pagination from './Pagination'
import { Product } from '@/types/product'

export default function ShopContent() {
  const searchParams = useSearchParams()
  const selectedCategory = searchParams.get('category')
  const page = parseInt(searchParams.get('page') || '1')
  
  const [products, setProducts] = useState<Product[]>([])
  const [totalProducts, setTotalProducts] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true)
      try {
        const params = new URLSearchParams()
        params.set('page', page.toString())
        params.set('limit', '15')
        if (selectedCategory) {
          params.set('category', selectedCategory)
        }
        
        const res = await fetch(`/api/products?${params.toString()}`)
        const data = await res.json()
        
        if (data.ok && data.products) {
          // Transform API products to match ProductGrid expected format
          const transformedProducts = data.products.map((p: any) => ({
            id: p.id,
            slug: p.slug,
            name: p.name,
            category: {
              name: p.categories?.[0]?.category?.name || p.category?.name || 'Uncategorized',
              slug: p.categories?.[0]?.category?.slug || p.category?.slug || 'uncategorized',
            },
            price: p.price, // Price is already in cents from API
            description: p.description,
            stock: p.stock || 0,
            images: p.images?.map((img: any) => ({
              url: img.url,
              alt: img.alt || p.name,
            })) || [],
          }))
          
          setProducts(transformedProducts)
          setTotalProducts(data.pagination?.total || data.total || transformedProducts.length)
        }
      } catch (error) {
        console.error('Error fetching products:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [page, selectedCategory])

  const itemsPerPage = 15
  const totalPages = Math.ceil(totalProducts / itemsPerPage)

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-neutral-600">Chargement des produits...</p>
      </div>
    )
  }

  return (
    <>
      <ShopFilters 
        totalProducts={totalProducts} 
        currentPage={page}
        itemsPerPage={itemsPerPage}
      />
      {products.length > 0 ? (
        <>
          <ProductGrid products={products} />
          {totalPages > 1 && (
            <Pagination 
              currentPage={page} 
              totalPages={totalPages} 
            />
          )}
        </>
      ) : (
        <div className="text-center py-12">
          <p className="text-neutral-600">Aucun produit trouvé.</p>
        </div>
      )}
    </>
  )
}

