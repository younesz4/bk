'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

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
  slug: string
  price: number
  stock: number
  category: Category
  images: ProductImage[]
}

interface ProductsTableProps {
  products: Product[]
}

export default function ProductsTable({ products }: ProductsTableProps) {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null)

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

  // Handle delete
  const handleDelete = async (productId: string) => {
    if (confirmDelete !== productId) {
      setConfirmDelete(productId)
      return
    }

    setDeletingId(productId)
    setConfirmDelete(null)

    try {
      const res = await fetch(`/api/admin/products/${productId}`, {
        method: 'DELETE',
      })

      if (res.ok) {
        // Refresh the page to show updated list
        router.refresh()
      } else {
        const data = await res.json()
        alert(data.error || 'Erreur lors de la suppression')
        setDeletingId(null)
      }
    } catch (error) {
      console.error('Error deleting product:', error)
      alert('Une erreur est survenue')
      setDeletingId(null)
    }
  }

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="bg-white border border-neutral-200 rounded-lg p-4">
        <input
          type="text"
          placeholder="Rechercher par nom ou catégorie..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-2 border border-neutral-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition"
          style={{ fontFamily: 'var(--font-raleway)', fontSize: '14px' }}
        />
      </div>

      {/* Table */}
      <div className="bg-white border border-neutral-200 rounded-lg overflow-hidden">
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
                  Catégorie
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
                    colSpan={6}
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

                    {/* Nom */}
                    <td className="px-6 py-4">
                      <span
                        className="text-neutral-900"
                        style={{ fontFamily: 'var(--font-raleway)', fontSize: '14px' }}
                      >
                        {product.name}
                      </span>
                    </td>

                    {/* Prix */}
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

                    {/* Catégorie */}
                    <td className="px-6 py-4">
                      <span
                        className="text-neutral-600"
                        style={{ fontFamily: 'var(--font-raleway)', fontSize: '14px' }}
                      >
                        {product.category.name}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <Link
                          href={`/admin/products/${product.id}`}
                          className="inline-flex items-center px-3 py-1.5 text-neutral-700 hover:text-black hover:bg-neutral-100 rounded-sm transition-colors"
                          style={{ fontFamily: 'var(--font-raleway)', fontSize: '14px' }}
                        >
                          Éditer
                        </Link>
                        <button
                          onClick={() => handleDelete(product.id)}
                          disabled={deletingId === product.id}
                          className={`inline-flex items-center px-3 py-1.5 rounded-sm transition-colors ${
                            confirmDelete === product.id
                              ? 'bg-red-600 text-white hover:bg-red-700'
                              : 'text-red-600 hover:text-red-700 hover:bg-red-50'
                          } disabled:opacity-50 disabled:cursor-not-allowed`}
                          style={{ fontFamily: 'var(--font-raleway)', fontSize: '14px' }}
                        >
                          {deletingId === product.id
                            ? 'Suppression...'
                            : confirmDelete === product.id
                            ? 'Confirmer'
                            : 'Supprimer'}
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
    </div>
  )
}

