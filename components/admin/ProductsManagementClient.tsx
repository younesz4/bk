'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'

interface Category {
  id: string
  name: string
}

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
  isPublished: boolean
}

interface ProductsManagementClientProps {
  initialProducts: Product[]
  categories: Category[]
}

type SortOption = 'name-asc' | 'name-desc' | 'price-asc' | 'price-desc' | 'newest'
type StockFilter = 'all' | 'inStock' | 'lowStock' | 'outOfStock'

export default function ProductsManagementClient({
  initialProducts,
  categories,
}: ProductsManagementClientProps) {
  const router = useRouter()
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [stockFilter, setStockFilter] = useState<StockFilter>('all')
  const [sortOption, setSortOption] = useState<SortOption>('newest')
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [productToDelete, setProductToDelete] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  // Filter and sort products
  const filteredAndSortedProducts = useMemo(() => {
    let filtered = [...initialProducts]

    // Search filter
    if (search) {
      const searchLower = search.toLowerCase()
      filtered = filtered.filter((product) =>
        product.name.toLowerCase().includes(searchLower)
      )
    }

    // Category filter
    if (categoryFilter !== 'all') {
      filtered = filtered.filter((product) => product.category.id === categoryFilter)
    }

    // Stock filter
    if (stockFilter === 'inStock') {
      filtered = filtered.filter((product) => product.stock > 0)
    } else if (stockFilter === 'lowStock') {
      filtered = filtered.filter((product) => product.stock > 0 && product.stock < 3)
    } else if (stockFilter === 'outOfStock') {
      filtered = filtered.filter((product) => product.stock === 0)
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortOption) {
        case 'name-asc':
          return a.name.localeCompare(b.name)
        case 'name-desc':
          return b.name.localeCompare(a.name)
        case 'price-asc':
          return a.price - b.price
        case 'price-desc':
          return b.price - a.price
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        default:
          return 0
      }
    })

    return filtered
  }, [initialProducts, search, categoryFilter, stockFilter, sortOption])

  const handleDeleteClick = (productId: string) => {
    setProductToDelete(productId)
    setDeleteModalOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!productToDelete) return

    setIsDeleting(true)
    try {
      const adminApiKey = process.env.NEXT_PUBLIC_ADMIN_API_KEY || ''
      const res = await fetch(`/api/admin/products/${productToDelete}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${adminApiKey}`,
        },
      })

      if (res.ok) {
        setDeleteModalOpen(false)
        setProductToDelete(null)
        router.refresh()
      } else {
        const error = await res.json()
        alert(error.error || 'Échec de la suppression du produit')
      }
    } catch (error) {
      console.error('Error deleting product:', error)
      alert('Erreur lors de la suppression du produit')
    } finally {
      setIsDeleting(false)
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
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })
  }

  const getStockStatus = (stock: number) => {
    if (stock === 0) {
      return { label: 'Rupture', color: 'bg-red-500', dotColor: 'bg-red-500' }
    } else if (stock < 3) {
      return { label: 'Stock faible', color: 'bg-orange-500', dotColor: 'bg-orange-500' }
    } else {
      return { label: 'En stock', color: 'bg-green-500', dotColor: 'bg-green-500' }
    }
  }

  return (
    <>
      {/* Header */}
      <div className="text-center mb-12">
        <div className="text-sm text-gray-500 mb-2" style={{ fontFamily: 'var(--font-raleway)' }}>
          [ 02 ]
        </div>
        <h1
          className="text-4xl font-bold text-gray-900 mb-3"
          style={{ fontFamily: 'var(--font-bodoni)' }}
        >
          PRODUITS
        </h1>
        <p
          className="text-gray-600 text-sm"
          style={{ fontFamily: 'var(--font-raleway)' }}
        >
          Gestion de tous les produits disponibles dans la boutique.
        </p>
      </div>

      {/* Actions Row */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {/* Search */}
          <div className="md:col-span-2">
            <input
              type="text"
              placeholder="Rechercher un produit..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all text-sm"
              style={{ fontFamily: 'var(--font-raleway)' }}
            />
          </div>

          {/* Category Filter */}
          <div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all text-sm bg-white"
              style={{ fontFamily: 'var(--font-raleway)' }}
            >
              <option value="all">Toutes les catégories</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Stock Filter */}
          <div>
            <select
              value={stockFilter}
              onChange={(e) => setStockFilter(e.target.value as StockFilter)}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all text-sm bg-white"
              style={{ fontFamily: 'var(--font-raleway)' }}
            >
              <option value="all">Tous</option>
              <option value="inStock">En stock</option>
              <option value="lowStock">Stock faible</option>
              <option value="outOfStock">Rupture</option>
            </select>
          </div>

          {/* Sort */}
          <div>
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value as SortOption)}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all text-sm bg-white"
              style={{ fontFamily: 'var(--font-raleway)' }}
            >
              <option value="newest">Plus récent</option>
              <option value="name-asc">Nom A-Z</option>
              <option value="name-desc">Nom Z-A</option>
              <option value="price-asc">Prix ↑</option>
              <option value="price-desc">Prix ↓</option>
            </select>
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {filteredAndSortedProducts.length === 0 ? (
          <div className="p-12 text-center text-gray-500" style={{ fontFamily: 'var(--font-raleway)' }}>
            Aucun produit trouvé
          </div>
        ) : (
          <div className="overflow-x-auto">
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
                    Statut
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
                {filteredAndSortedProducts.map((product) => {
                  const stockStatus = getStockStatus(product.stock)
                  return (
                    <tr
                      key={product.id}
                      className="hover:bg-gray-50/50 transition-colors duration-150"
                    >
                      {/* Product Image & Name */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-4">
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
                          <div>
                            <div className="text-sm font-medium text-gray-900" style={{ fontFamily: 'var(--font-raleway)' }}>
                              {product.name}
                            </div>
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
                        <div className="text-sm text-gray-600" style={{ fontFamily: 'var(--font-raleway)' }}>
                          {product.stock}
                        </div>
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${stockStatus.dotColor}`} />
                          <span className="text-sm text-gray-600" style={{ fontFamily: 'var(--font-raleway)' }}>
                            {stockStatus.label}
                          </span>
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
                            className="px-4 py-1.5 text-sm border border-red-200 rounded-lg hover:bg-red-50 transition-colors text-red-600"
                            style={{ fontFamily: 'var(--font-raleway)' }}
                          >
                            Supprimer
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Floating Add Product Button */}
      <Link
        href="/admin/products/new"
        className="fixed bottom-8 right-8 bg-gray-900 text-white px-6 py-4 rounded-full shadow-lg hover:bg-gray-800 transition-all duration-200 flex items-center gap-2 z-50"
        style={{ fontFamily: 'var(--font-raleway)' }}
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="12" y1="5" x2="12" y2="19"></line>
          <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
        <span className="font-medium">Ajouter un produit</span>
      </Link>

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={() => setDeleteModalOpen(false)}
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
                onClick={() => setDeleteModalOpen(false)}
                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                style={{ fontFamily: 'var(--font-raleway)' }}
              >
                Annuler
              </button>
              <button
                onClick={handleDeleteConfirm}
                disabled={isDeleting}
                className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                style={{ fontFamily: 'var(--font-raleway)' }}
              >
                {isDeleting ? 'Suppression...' : 'Supprimer'}
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

