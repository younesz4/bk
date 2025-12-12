'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { formatDate } from '@/lib/utils'

interface ProductImage {
  id: string
  url: string
  alt: string | null
  order: number
}

interface Category {
  id: string
  name: string
  slug: string
}

interface Product {
  id: string
  name: string
  price: number
  stock: number
  createdAt: Date
  category: Category
  images: ProductImage[]
}

interface ProductsListClientProps {
  products: Product[]
}

export default function ProductsListClient({ products }: ProductsListClientProps) {
  const [searchQuery, setSearchQuery] = useState('')

  // Filter products based on search
  const filteredProducts = useMemo(() => {
    if (!searchQuery.trim()) {
      return products
    }

    const query = searchQuery.toLowerCase().trim()
    return products.filter(
      (product) =>
        product.name.toLowerCase().includes(query) ||
        product.category.name.toLowerCase().includes(query)
    )
  }, [products, searchQuery])

  // Format price helper
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
    }).format(price / 100)
  }

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="bg-white border border-neutral-200 rounded-lg p-4">
        <input
          type="text"
          placeholder="Rechercher par nom de produit ou catégorie..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-2 border border-neutral-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition"
          style={{ fontFamily: 'var(--font-raleway)', fontSize: '14px' }}
        />
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block bg-white border border-neutral-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-neutral-200 bg-neutral-50">
                <th
                  className="px-6 py-4 text-left font-medium text-neutral-700"
                  style={{ fontFamily: 'var(--font-raleway)', fontSize: '14px' }}
                >
                  Image
                </th>
                <th
                  className="px-6 py-4 text-left font-medium text-neutral-700"
                  style={{ fontFamily: 'var(--font-raleway)', fontSize: '14px' }}
                >
                  Nom
                </th>
                <th
                  className="px-6 py-4 text-left font-medium text-neutral-700"
                  style={{ fontFamily: 'var(--font-raleway)', fontSize: '14px' }}
                >
                  Catégorie
                </th>
                <th
                  className="px-6 py-4 text-left font-medium text-neutral-700"
                  style={{ fontFamily: 'var(--font-raleway)', fontSize: '14px' }}
                >
                  Prix
                </th>
                <th
                  className="px-6 py-4 text-left font-medium text-neutral-700"
                  style={{ fontFamily: 'var(--font-raleway)', fontSize: '14px' }}
                >
                  Stock
                </th>
                <th
                  className="px-6 py-4 text-left font-medium text-neutral-700"
                  style={{ fontFamily: 'var(--font-raleway)', fontSize: '14px' }}
                >
                  Date ajout
                </th>
                <th
                  className="px-6 py-4 text-left font-medium text-neutral-700"
                  style={{ fontFamily: 'var(--font-raleway)', fontSize: '14px' }}
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-12 text-center text-neutral-500"
                    style={{ fontFamily: 'var(--font-raleway)', fontSize: '14px' }}
                  >
                    {searchQuery ? 'Aucun produit trouvé' : 'Aucun produit pour le moment'}
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => (
                  <tr
                    key={product.id}
                    className="border-b border-neutral-100 hover:bg-neutral-50 transition-colors"
                  >
                    {/* Image */}
                    <td className="px-6 py-4">
                      {product.images?.[0] ? (
                        <div className="relative w-[60px] h-[60px] rounded-sm overflow-hidden bg-neutral-100">
                          <Image
                            src={product.images[0].url}
                            alt={product.images[0].alt || product.name}
                            width={60}
                            height={60}
                            className="object-cover"
                            quality={75}
                          />
                        </div>
                      ) : (
                        <div className="w-[60px] h-[60px] bg-neutral-200 rounded-sm flex items-center justify-center">
                          <span
                            className="text-xs text-neutral-400"
                            style={{ fontFamily: 'var(--font-raleway)' }}
                          >
                            —
                          </span>
                        </div>
                      )}
                    </td>

                    {/* Name */}
                    <td className="px-6 py-4">
                      <span
                        className="text-neutral-900"
                        style={{ fontFamily: 'var(--font-raleway)', fontSize: '14px' }}
                      >
                        {product.name}
                      </span>
                    </td>

                    {/* Category */}
                    <td className="px-6 py-4">
                      <span
                        className="text-neutral-600"
                        style={{ fontFamily: 'var(--font-raleway)', fontSize: '14px' }}
                      >
                        {product.category.name}
                      </span>
                    </td>

                    {/* Price */}
                    <td className="px-6 py-4">
                      <span
                        className="text-neutral-900"
                        style={{ fontFamily: 'var(--font-raleway)', fontSize: '14px' }}
                      >
                        {formatPrice(product.price)}
                      </span>
                    </td>

                    {/* Stock */}
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          product.stock > 0
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                        style={{ fontFamily: 'var(--font-raleway)' }}
                      >
                        {product.stock}
                      </span>
                    </td>

                    {/* Date */}
                    <td className="px-6 py-4">
                      <span
                        className="text-neutral-600"
                        style={{ fontFamily: 'var(--font-raleway)', fontSize: '14px' }}
                      >
                        {formatDate(product.createdAt)}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4">
                      <Link
                        href={`/admin/products/${product.id}/edit`}
                        className="inline-flex items-center px-3 py-1.5 text-neutral-700 hover:text-black hover:bg-neutral-100 rounded-sm transition-colors"
                        style={{ fontFamily: 'var(--font-raleway)', fontSize: '14px' }}
                      >
                        Modifier
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-4">
        {filteredProducts.length === 0 ? (
          <div className="bg-white border border-neutral-200 rounded-lg p-6 text-center">
            <p
              className="text-neutral-500"
              style={{ fontFamily: 'var(--font-raleway)', fontSize: '14px' }}
            >
              {searchQuery ? 'Aucun produit trouvé' : 'Aucun produit pour le moment'}
            </p>
          </div>
        ) : (
          filteredProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white border border-neutral-200 rounded-lg p-4"
            >
              <div className="flex gap-4">
                {/* Image */}
                <div className="flex-shrink-0">
                  {product.images?.[0] ? (
                    <div className="relative w-20 h-20 rounded-sm overflow-hidden bg-neutral-100">
                      <Image
                        src={product.images[0].url}
                        alt={product.images[0].alt || product.name}
                        width={80}
                        height={80}
                        className="object-cover"
                        quality={75}
                      />
                    </div>
                  ) : (
                    <div className="w-20 h-20 bg-neutral-200 rounded-sm flex items-center justify-center">
                      <span
                        className="text-xs text-neutral-400"
                        style={{ fontFamily: 'var(--font-raleway)' }}
                      >
                        —
                      </span>
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h3
                    className="text-base font-medium text-neutral-900 mb-1"
                    style={{ fontFamily: 'var(--font-bodoni)' }}
                  >
                    {product.name}
                  </h3>
                  <p
                    className="text-neutral-600 mb-2"
                    style={{ fontFamily: 'var(--font-raleway)', fontSize: '14px' }}
                  >
                    {product.category.name}
                  </p>
                  <div className="flex items-center gap-4 mb-2">
                    <span
                      className="text-neutral-900"
                      style={{ fontFamily: 'var(--font-raleway)', fontSize: '14px' }}
                    >
                      {formatPrice(product.price)}
                    </span>
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                        product.stock > 0
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                      style={{ fontFamily: 'var(--font-raleway)' }}
                    >
                      Stock: {product.stock}
                    </span>
                  </div>
                  <p
                    className="text-neutral-500 mb-3"
                    style={{ fontFamily: 'var(--font-raleway)', fontSize: '12px' }}
                  >
                    {formatDate(product.createdAt)}
                  </p>
                  <Link
                    href={`/admin/products/${product.id}/edit`}
                    className="inline-flex items-center px-3 py-1.5 bg-black text-white rounded-sm hover:opacity-80 transition-opacity"
                    style={{ fontFamily: 'var(--font-raleway)', fontSize: '14px' }}
                  >
                    Modifier
                  </Link>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

