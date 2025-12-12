'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import type { ProductWithRelationsResponse } from '@/lib/schemas'

interface ProductListProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  onCreate: () => void
  onEdit: (product: ProductWithRelationsResponse) => void
}

export default function ProductList({
  searchQuery,
  onSearchChange,
  onCreate,
  onEdit,
}: ProductListProps) {
  const [products, setProducts] = useState<ProductWithRelationsResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/products?limit=100')
      const data = await response.json()
      
      if (data.ok) {
        setProducts(data.products || [])
      } else {
        setError(data.message || 'Erreur lors du chargement des produits')
      }
    } catch (err) {
      setError('Erreur de connexion')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const filteredProducts = useMemo(() => {
    if (!searchQuery.trim()) return products
    
    const query = searchQuery.toLowerCase()
    return products.filter(
      (product) =>
        product.name.toLowerCase().includes(query) ||
        product.slug.toLowerCase().includes(query) ||
        product.description?.toLowerCase().includes(query)
    )
  }, [products, searchQuery])

  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
      return
    }

    try {
      const response = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
      })

      const data = await response.json()

      if (data.ok) {
        fetchProducts()
        setDeleteConfirm(null)
      } else {
        alert(data.message || 'Erreur lors de la suppression')
      }
    } catch (err) {
      alert('Erreur de connexion')
      console.error(err)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-walnut-600 font-light">Chargement...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded p-4">
        <p className="text-red-700">{error}</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-light text-walnut-800 mb-2">Produits</h1>
          <p className="text-sm text-walnut-600 font-light">
            {filteredProducts.length} produit{filteredProducts.length !== 1 ? 's' : ''}
          </p>
        </div>
        <button
          onClick={onCreate}
          className="px-6 py-2 bg-walnut-800 text-cream-50 font-light hover:bg-walnut-700 transition-colors"
        >
          + Nouveau produit
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Rechercher un produit..."
          className="w-full px-4 py-2 border border-walnut-300 bg-white text-walnut-800 font-light focus:outline-none focus:border-walnut-500"
        />
        <svg
          className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-walnut-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>

      {/* Products Table */}
      <div className="bg-white border border-walnut-200">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-cream-100 border-b border-walnut-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-light text-walnut-600 uppercase tracking-wider">
                  Image
                </th>
                <th className="px-4 py-3 text-left text-xs font-light text-walnut-600 uppercase tracking-wider">
                  Nom
                </th>
                <th className="px-4 py-3 text-left text-xs font-light text-walnut-600 uppercase tracking-wider">
                  Prix
                </th>
                <th className="px-4 py-3 text-left text-xs font-light text-walnut-600 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-4 py-3 text-left text-xs font-light text-walnut-600 uppercase tracking-wider">
                  Variants
                </th>
                <th className="px-4 py-3 text-right text-xs font-light text-walnut-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-walnut-200">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-walnut-600 font-light">
                    {searchQuery ? 'Aucun produit trouvé' : 'Aucun produit'}
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-cream-50 transition-colors">
                    <td className="px-4 py-3">
                      {product.images && product.images.length > 0 ? (
                        <div className="relative w-16 h-16 bg-cream-100">
                          <Image
                            src={product.images[0].url}
                            alt={product.name}
                            fill
                            className="object-cover"
                            sizes="64px"
                          />
                        </div>
                      ) : (
                        <div className="w-16 h-16 bg-cream-100 flex items-center justify-center">
                          <span className="text-walnut-400 text-xs">No image</span>
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div>
                        <p className="text-walnut-800 font-light">{product.name}</p>
                        <p className="text-xs text-walnut-500 font-light">{product.slug}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-walnut-700 font-light">
                        {new Intl.NumberFormat('fr-FR', {
                          style: 'currency',
                          currency: 'EUR',
                        }).format(product.price)}
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-light ${
                          product.published
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {product.published ? 'Publié' : 'Brouillon'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-walnut-600 text-sm font-light">
                        {product.variants?.length || 0} variant{product.variants?.length !== 1 ? 's' : ''}
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/shop/${product.slug}`}
                          target="_blank"
                          className="text-walnut-600 hover:text-walnut-800 transition-colors"
                          title="Voir le produit"
                        >
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                            />
                          </svg>
                        </Link>
                        <button
                          onClick={() => onEdit(product)}
                          className="text-walnut-600 hover:text-walnut-800 transition-colors"
                          title="Modifier"
                        >
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                            />
                          </svg>
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(product.id)}
                          className="text-red-600 hover:text-red-800 transition-colors"
                          title="Supprimer"
                        >
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
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

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-light text-walnut-800 mb-4">
              Confirmer la suppression
            </h3>
            <p className="text-walnut-600 font-light mb-6">
              Êtes-vous sûr de vouloir supprimer ce produit ? Cette action est irréversible.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 border border-walnut-300 text-walnut-700 font-light hover:bg-cream-50 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="px-4 py-2 bg-red-600 text-white font-light hover:bg-red-700 transition-colors"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}


