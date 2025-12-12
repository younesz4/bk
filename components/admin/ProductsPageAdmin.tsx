'use client'

import { useState, useTransition } from 'react'
import Image from 'next/image'
import Link from 'next/link'
// Removed import - getProducts doesn't exist, products are fetched directly in page

interface Product {
  id: string
  name: string
  price: number
  stock: number
  category: {
    id: string
    name: string
  } | null
  images: Array<{
    url: string
  }>
}

interface Category {
  id: string
  name: string
}

interface ProductsData {
  products: Product[]
  total: number
  categories: Category[]
  pageSize: number
  page: number
}

interface ProductsPageAdminProps {
  initialData: ProductsData
}

export default function ProductsPageAdmin({ initialData }: ProductsPageAdminProps) {
  const [data, setData] = useState(initialData)
  const [isPending, startTransition] = useTransition()

  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('all')

  const handleFilter = () => {
    startTransition(async () => {
      // Use API endpoint instead
      const params = new URLSearchParams()
      params.set('page', '1')
      if (search) params.set('search', search)
      if (category !== 'all') params.set('category', category)
      
      const res = await fetch(`/api/admin/products?${params.toString()}`)
      const result = await res.json()
      setData(result)
    })
  }

  const handlePageChange = (page: number) => {
    startTransition(async () => {
      // Use API endpoint instead
      const params = new URLSearchParams()
      params.set('page', page.toString())
      if (search) params.set('search', search)
      if (category !== 'all') params.set('category', category)
      
      const res = await fetch(`/api/admin/products?${params.toString()}`)
      const result = await res.json()
      setData(result)
    })
  }

  const totalPages = Math.ceil(data.total / data.pageSize)

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f7f7f5' }}>
      <div className="max-w-7xl mx-auto px-6 py-12">
        <h1
          className="text-4xl font-bold text-gray-900 mb-8"
          style={{ fontFamily: 'var(--font-bodoni)' }}
        >
          Produits
        </h1>

        {/* Filters */}
        <div className="flex flex-col md:flex-row items-center gap-4 mb-6">
          <input
            type="text"
            placeholder="Rechercher un produit..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleFilter()
              }
            }}
            className="border border-neutral-300 px-4 py-2.5 w-full md:w-64 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
            style={{ fontFamily: 'var(--font-raleway)' }}
          />

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="border border-neutral-300 px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all bg-white"
            style={{ fontFamily: 'var(--font-raleway)' }}
          >
            <option value="all">Toutes les catégories</option>
            {data.categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>

          <button
            onClick={handleFilter}
            disabled={isPending}
            className="px-6 py-2.5 bg-black text-white uppercase tracking-[0.2em] text-xs hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ fontFamily: 'var(--font-raleway)' }}
          >
            {isPending ? 'Chargement...' : 'Filtrer'}
          </button>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-neutral-100 border-b border-neutral-200">
                <tr>
                  <th className="p-4 text-xs font-semibold text-gray-600 uppercase tracking-wider" style={{ fontFamily: 'var(--font-raleway)' }}>
                    Image
                  </th>
                  <th className="p-4 text-xs font-semibold text-gray-600 uppercase tracking-wider" style={{ fontFamily: 'var(--font-raleway)' }}>
                    Nom
                  </th>
                  <th className="p-4 text-xs font-semibold text-gray-600 uppercase tracking-wider" style={{ fontFamily: 'var(--font-raleway)' }}>
                    Catégorie
                  </th>
                  <th className="p-4 text-xs font-semibold text-gray-600 uppercase tracking-wider" style={{ fontFamily: 'var(--font-raleway)' }}>
                    Prix
                  </th>
                  <th className="p-4 text-xs font-semibold text-gray-600 uppercase tracking-wider" style={{ fontFamily: 'var(--font-raleway)' }}>
                    Stock
                  </th>
                  <th className="p-4 text-xs font-semibold text-gray-600 uppercase tracking-wider" style={{ fontFamily: 'var(--font-raleway)' }}>
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {data.products.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-gray-500" style={{ fontFamily: 'var(--font-raleway)' }}>
                      Aucun produit trouvé
                    </td>
                  </tr>
                ) : (
                  data.products.map((product) => (
                    <tr key={product.id} className="border-t border-neutral-100 hover:bg-black/5 transition-colors">
                      <td className="p-4">
                        {product.images?.[0] ? (
                          <div className="relative w-[60px] h-[60px] rounded-lg overflow-hidden bg-gray-100">
                            <Image
                              src={product.images[0].url}
                              alt={product.name}
                              fill
                              className="object-cover"
                              sizes="60px"
                            />
                          </div>
                        ) : (
                          <div className="w-[60px] h-[60px] bg-neutral-200 rounded-lg" />
                        )}
                      </td>

                      <td className="p-4" style={{ fontFamily: 'var(--font-raleway)' }}>
                        <div className="text-sm font-medium text-gray-900">
                          {product.name}
                        </div>
                      </td>

                      <td className="p-4">
                        <div className="text-sm text-gray-600" style={{ fontFamily: 'var(--font-raleway)' }}>
                          {product.category?.name || '-'}
                        </div>
                      </td>

                      <td className="p-4">
                        <div className="text-sm font-medium text-gray-900" style={{ fontFamily: 'var(--font-raleway)' }}>
                          {new Intl.NumberFormat('fr-FR', {
                            style: 'currency',
                            currency: 'EUR',
                          }).format(product.price / 100)}
                        </div>
                      </td>

                      <td className="p-4">
                        {product.stock > 0 ? (
                          <span className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded font-medium" style={{ fontFamily: 'var(--font-raleway)' }}>
                            En stock
                          </span>
                        ) : (
                          <span className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded font-medium" style={{ fontFamily: 'var(--font-raleway)' }}>
                            Rupture
                          </span>
                        )}
                      </td>

                      <td className="p-4">
                        <div className="flex gap-3">
                          <Link
                            href={`/admin/products/${product.id}`}
                            className="text-xs uppercase tracking-[0.2em] text-gray-700 hover:text-gray-900 hover:underline transition-colors"
                            style={{ fontFamily: 'var(--font-raleway)' }}
                          >
                            Modifier
                          </Link>

                          <button
                            className="text-xs uppercase tracking-[0.2em] text-red-600 hover:text-red-800 hover:underline transition-colors"
                            onClick={() => console.log('Open delete modal')}
                            style={{ fontFamily: 'var(--font-raleway)' }}
                          >
                            Supprimer
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-6">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
              <button
                key={pageNum}
                onClick={() => handlePageChange(pageNum)}
                disabled={isPending}
                className={`px-4 py-2 border rounded-lg transition-colors ${
                  data.page === pageNum
                    ? 'bg-black text-white border-black'
                    : 'bg-white text-gray-700 border-neutral-300 hover:bg-gray-50'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
                style={{ fontFamily: 'var(--font-raleway)' }}
              >
                {pageNum}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

