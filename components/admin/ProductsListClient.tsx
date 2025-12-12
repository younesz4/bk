/**
 * Admin products manager for BK Agencements
 * Client component for products list with search, filter, and actions
 */

'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import ProductForm from './ProductForm'

interface Product {
  id: string
  name: string
  slug: string
  description: string | null
  price: number
  stock: number
  isPublished: boolean
  categoryId: string
  category: {
    id: string
    name: string
    slug: string
  }
  images: Array<{
    id: string
    url: string
    alt: string | null
    order: number
  }>
}

interface Category {
  id: string
  name: string
  slug: string
}

interface ProductsListClientProps {
  initialProducts: Product[]
  categories: Category[]
}

export default function ProductsListClient({ initialProducts, categories }: ProductsListClientProps) {
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>(initialProducts)
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(false)

  // Filter products
  const filteredProducts = products.filter((product) => {
    const matchesSearch = !search || product.name.toLowerCase().includes(search.toLowerCase())
    const matchesCategory = categoryFilter === 'all' || product.category.id === categoryFilter
    return matchesSearch && matchesCategory
  })

  const handleDelete = async (id: string) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
      return
    }

    try {
      const response = await fetch(`/api/admin/products/${id}`, {
        method: 'DELETE',
      })

      const data = await response.json()

      if (data.success) {
        setProducts(products.filter((p) => p.id !== id))
        router.refresh()
      } else {
        alert('Erreur lors de la suppression')
      }
    } catch (error) {
      console.error('Error deleting product:', error)
      alert('Erreur lors de la suppression')
    }
  }

  const handleEdit = (product: Product) => {
    setEditingProduct(product)
    setIsFormOpen(true)
  }

  const handleFormSuccess = () => {
    setIsFormOpen(false)
    setEditingProduct(null)
    router.refresh()
  }

  const handleFormCancel = () => {
    setIsFormOpen(false)
    setEditingProduct(null)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1
            className="text-3xl font-light text-neutral-900 dark:text-white mb-2"
            style={{ fontFamily: 'var(--font-bodoni)' }}
          >
            Produits
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400" style={{ fontFamily: 'var(--font-raleway)' }}>
            Gérez le catalogue de BK Agencements
          </p>
        </div>
        <button
          onClick={() => {
            setEditingProduct(null)
            setIsFormOpen(true)
          }}
          className="px-6 py-3 bg-black dark:bg-white text-white dark:text-black rounded-lg hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors uppercase tracking-wider text-sm font-light"
          style={{ fontFamily: 'var(--font-raleway)' }}
        >
          Ajouter un produit
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <input
          type="text"
          placeholder="Rechercher par nom..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 px-4 py-2 border border-neutral-300 dark:border-neutral-700 rounded-lg focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent"
          style={{ fontFamily: 'var(--font-raleway)' }}
        />
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="px-4 py-2 border border-neutral-300 dark:border-neutral-700 rounded-lg focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent"
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

      {/* Products Table */}
      <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm border border-neutral-200 dark:border-neutral-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-neutral-50 dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-700">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-light text-neutral-700 dark:text-neutral-300" style={{ fontFamily: 'var(--font-raleway)' }}>
                  Image
                </th>
                <th className="px-6 py-4 text-left text-sm font-light text-neutral-700 dark:text-neutral-300" style={{ fontFamily: 'var(--font-raleway)' }}>
                  Nom
                </th>
                <th className="px-6 py-4 text-left text-sm font-light text-neutral-700 dark:text-neutral-300" style={{ fontFamily: 'var(--font-raleway)' }}>
                  Catégorie
                </th>
                <th className="px-6 py-4 text-left text-sm font-light text-neutral-700 dark:text-neutral-300" style={{ fontFamily: 'var(--font-raleway)' }}>
                  Prix
                </th>
                <th className="px-6 py-4 text-left text-sm font-light text-neutral-700 dark:text-neutral-300" style={{ fontFamily: 'var(--font-raleway)' }}>
                  Stock
                </th>
                <th className="px-6 py-4 text-left text-sm font-light text-neutral-700 dark:text-neutral-300" style={{ fontFamily: 'var(--font-raleway)' }}>
                  Statut
                </th>
                <th className="px-6 py-4 text-right text-sm font-light text-neutral-700 dark:text-neutral-300" style={{ fontFamily: 'var(--font-raleway)' }}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200 dark:divide-neutral-700">
              {filteredProducts.map((product) => (
                <tr
                  key={product.id}
                  className="hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors"
                >
                  <td className="px-6 py-4">
                    {product.images[0] ? (
                      <img
                        src={product.images[0].url}
                        alt={product.images[0].alt || product.name}
                        className="w-16 h-16 object-cover rounded"
                      />
                    ) : (
                      <div className="w-16 h-16 bg-neutral-200 dark:bg-neutral-700 rounded flex items-center justify-center">
                        <span className="text-neutral-400 text-xs">No image</span>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-neutral-900 dark:text-white" style={{ fontFamily: 'var(--font-raleway)' }}>
                      {product.name}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-neutral-600 dark:text-neutral-400" style={{ fontFamily: 'var(--font-raleway)' }}>
                      {product.category.name}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-neutral-900 dark:text-white" style={{ fontFamily: 'var(--font-raleway)' }}>
                      {(product.price / 100).toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-neutral-600 dark:text-neutral-400" style={{ fontFamily: 'var(--font-raleway)' }}>
                      {product.stock}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-light ${
                        product.isPublished
                          ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                          : 'bg-neutral-100 dark:bg-neutral-700 text-neutral-800 dark:text-neutral-200'
                      }`}
                      style={{ fontFamily: 'var(--font-raleway)' }}
                    >
                      {product.isPublished ? 'Publié' : 'Brouillon'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex gap-2 justify-end">
                      <button
                        onClick={() => handleEdit(product)}
                        className="px-3 py-1 text-sm text-neutral-700 dark:text-neutral-300 hover:text-black dark:hover:text-white transition-colors"
                        style={{ fontFamily: 'var(--font-raleway)' }}
                      >
                        Modifier
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="px-3 py-1 text-sm text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 transition-colors"
                        style={{ fontFamily: 'var(--font-raleway)' }}
                      >
                        Supprimer
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredProducts.length === 0 && (
          <div className="p-12 text-center">
            <p className="text-neutral-500 dark:text-neutral-400" style={{ fontFamily: 'var(--font-raleway)' }}>
              Aucun produit trouvé
            </p>
          </div>
        )}
      </div>

      {/* Product Form Panel */}
      <AnimatePresence>
        {isFormOpen && (
          <ProductForm
            product={editingProduct}
            categories={categories}
            onSuccess={handleFormSuccess}
            onCancel={handleFormCancel}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
