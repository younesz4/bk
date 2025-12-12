'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import Image from 'next/image'

interface Product {
  id: string
  name: string
  slug: string
  price: number
  stock: number
  category: {
    id: string
    name: string
    slug: string
  }
  thumbnail: string | null
  createdAt: string
}

interface ProductsTableProps {
  products: Product[]
  deleteProduct: (id: string) => Promise<void>
}

export default function ProductsTable({ products, deleteProduct }: ProductsTableProps) {
  const [search, setSearch] = useState('')
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [productToDelete, setProductToDelete] = useState<string | null>(null)

  // Filter products based on search
  const filteredProducts = useMemo(() => {
    if (!search.trim()) {
      return products
    }

    const searchLower = search.toLowerCase()
    return products.filter((product) => {
      return (
        product.name.toLowerCase().includes(searchLower) ||
        product.category.name.toLowerCase().includes(searchLower) ||
        product.slug.toLowerCase().includes(searchLower)
      )
    })
  }, [products, search])

  const handleDeleteClick = (productId: string) => {
    setProductToDelete(productId)
    setDeleteConfirmOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!productToDelete) return

    setDeletingId(productToDelete)
    try {
      await deleteProduct(productToDelete)
      setDeleteConfirmOpen(false)
      setProductToDelete(null)
    } catch (error: any) {
      alert(error.message || 'Erreur lors de la suppression')
    } finally {
      setDeletingId(null)
    }
  }

  const formatPrice = (priceInCents: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
    }).format(priceInCents / 100)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
  }

  const getStockColor = (stock: number) => {
    if (stock === 0) {
      return 'text-red-600'
    } else if (stock <= 10) {
      return 'text-orange-600'
    } else {
      return 'text-green-600'
    }
  }

  return (
    <>
      {/* Search Bar */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Rechercher un produit..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-md px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
          style={{ fontFamily: 'var(--font-raleway)' }}
        />
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider" style={{ fontFamily: 'var(--font-raleway)' }}>
                Produit
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider" style={{ fontFamily: 'var(--font-raleway)' }}>
                Catégorie
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider" style={{ fontFamily: 'var(--font-raleway)' }}>
                Prix
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider" style={{ fontFamily: 'var(--font-raleway)' }}>
                Stock
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider" style={{ fontFamily: 'var(--font-raleway)' }}>
                Date
              </th>
              <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider" style={{ fontFamily: 'var(--font-raleway)' }}>
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-50">
            {filteredProducts.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-gray-500" style={{ fontFamily: 'var(--font-raleway)' }}>
                  Aucun produit trouvé
                </td>
              </tr>
            ) : (
              filteredProducts.map((product) => (
                <tr
                  key={product.id}
                  className="hover:bg-black/5 transition-colors duration-150"
                >
                  {/* Product Image & Name */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="relative h-10 w-10 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                        {product.thumbnail ? (
                          <Image
                            src={product.thumbnail}
                            alt={product.name}
                            fill
                            className="object-cover"
                            sizes="40px"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                            No img
                          </div>
                        )}
                      </div>
                      <div className="text-sm font-medium text-gray-900" style={{ fontFamily: 'var(--font-raleway)' }}>
                        {product.name}
                      </div>
                    </div>
                  </td>

                  {/* Category */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-600" style={{ fontFamily: 'var(--font-raleway)' }}>
                      {product.category.name}
                    </div>
                  </td>

                  {/* Price */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900" style={{ fontFamily: 'var(--font-raleway)' }}>
                      {formatPrice(product.price)}
                    </div>
                  </td>

                  {/* Stock */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`text-sm font-medium ${getStockColor(product.stock)}`} style={{ fontFamily: 'var(--font-raleway)' }}>
                      {product.stock}
                    </div>
                  </td>

                  {/* Created Date */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500" style={{ fontFamily: 'var(--font-raleway)' }}>
                      {formatDate(product.createdAt)}
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end gap-3">
                      <Link
                        href={`/admin/products/${product.id}`}
                        className="px-4 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-gray-700"
                        style={{ fontFamily: 'var(--font-raleway)' }}
                      >
                        Modifier
                      </Link>
                      <button
                        onClick={() => handleDeleteClick(product.id)}
                        disabled={deletingId === product.id}
                        className="px-4 py-1.5 text-sm border border-red-200 rounded-lg hover:bg-red-50 transition-colors text-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
                        style={{ fontFamily: 'var(--font-raleway)' }}
                      >
                        {deletingId === product.id ? 'Suppression...' : 'Supprimer'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-4">
        {filteredProducts.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center text-gray-500" style={{ fontFamily: 'var(--font-raleway)' }}>
            Aucun produit trouvé
          </div>
        ) : (
          filteredProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-4"
            >
              <div className="flex items-start gap-4 mb-4">
                {/* Product Image */}
                <div className="relative h-16 w-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                  {product.thumbnail ? (
                    <Image
                      src={product.thumbnail}
                      alt={product.name}
                      fill
                      className="object-cover"
                      sizes="64px"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                      No img
                    </div>
                  )}
                </div>

                {/* Product Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-medium text-gray-900 mb-1" style={{ fontFamily: 'var(--font-raleway)' }}>
                    {product.name}
                  </h3>
                  <p className="text-xs text-gray-500 mb-2" style={{ fontFamily: 'var(--font-raleway)' }}>
                    {product.category.name}
                  </p>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="font-medium text-gray-900" style={{ fontFamily: 'var(--font-raleway)' }}>
                      {formatPrice(product.price)}
                    </span>
                    <span className={`font-medium ${getStockColor(product.stock)}`} style={{ fontFamily: 'var(--font-raleway)' }}>
                      Stock: {product.stock}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 mt-1" style={{ fontFamily: 'var(--font-raleway)' }}>
                    {formatDate(product.createdAt)}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                <Link
                  href={`/admin/products/${product.id}`}
                  className="flex-1 px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-gray-700 text-center"
                  style={{ fontFamily: 'var(--font-raleway)' }}
                >
                  Modifier
                </Link>
                <button
                  onClick={() => handleDeleteClick(product.id)}
                  disabled={deletingId === product.id}
                  className="flex-1 px-4 py-2 text-sm border border-red-200 rounded-lg hover:bg-red-50 transition-colors text-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ fontFamily: 'var(--font-raleway)' }}
                >
                  {deletingId === product.id ? 'Suppression...' : 'Supprimer'}
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmOpen && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={() => setDeleteConfirmOpen(false)}
        >
          <div
            className="bg-white rounded-xl shadow-xl p-8 max-w-md w-full mx-4"
            onClick={(e) => e.stopPropagation()}
            style={{
              animation: 'fadeInScale 0.2s ease-out',
            }}
          >
            <h2
              className="text-xl font-bold text-gray-900 mb-3"
              style={{ fontFamily: 'var(--font-bodoni)' }}
            >
              Supprimer le produit ?
            </h2>
            <p
              className="text-gray-600 mb-6"
              style={{ fontFamily: 'var(--font-raleway)' }}
            >
              Êtes-vous sûr de vouloir supprimer ce produit ? Cette action est irréversible.
            </p>
            <div className="flex items-center justify-end gap-4">
              <button
                onClick={() => setDeleteConfirmOpen(false)}
                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                style={{ fontFamily: 'var(--font-raleway)' }}
              >
                Annuler
              </button>
              <button
                onClick={handleDeleteConfirm}
                disabled={deletingId !== null}
                className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                style={{ fontFamily: 'var(--font-raleway)' }}
              >
                {deletingId ? 'Suppression...' : 'Supprimer'}
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeInScale {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </>
  )
}
