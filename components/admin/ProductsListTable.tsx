'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'

interface Category {
  id: string
  name: string
  slug: string
}

interface ProductImage {
  id: string
  url: string
}

interface Product {
  id: string
  name: string
  slug: string
  price: number
  stock: number | null
  isPublished: boolean
  createdAt: Date
  category: Category
  images: ProductImage[]
}

interface ProductsListTableProps {
  products: Product[]
}

export default function ProductsListTable({ products }: ProductsListTableProps) {
  const router = useRouter()
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const formatPrice = (price: number) => {
    return (price / 100).toFixed(2) + ' €'
  }

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  const handleDelete = async (productId: string, productName: string) => {
    if (!confirm(`Êtes-vous sûr de vouloir supprimer "${productName}" ?`)) {
      return
    }

    setDeletingId(productId)

    try {
      const adminApiKey = process.env.NEXT_PUBLIC_ADMIN_API_KEY || ''

      const res = await fetch(`/api/admin/products/${productId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${adminApiKey}`,
        },
      })

      if (!res.ok) {
        const error = await res.json()
        alert(error.error || 'Erreur lors de la suppression')
        return
      }

      router.refresh()
    } catch (error) {
      console.error('Delete error:', error)
      alert('Erreur lors de la suppression')
    } finally {
      setDeletingId(null)
    }
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        Aucun produit trouvé
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead className="bg-gray-50 sticky top-0">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-700 border-b border-gray-200" style={{ fontFamily: 'var(--font-raleway)' }}>
                Image
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-700 border-b border-gray-200" style={{ fontFamily: 'var(--font-raleway)' }}>
                Nom
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-700 border-b border-gray-200" style={{ fontFamily: 'var(--font-raleway)' }}>
                Catégorie
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-700 border-b border-gray-200" style={{ fontFamily: 'var(--font-raleway)' }}>
                Prix
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-700 border-b border-gray-200" style={{ fontFamily: 'var(--font-raleway)' }}>
                Stock
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-700 border-b border-gray-200" style={{ fontFamily: 'var(--font-raleway)' }}>
                Images
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-700 border-b border-gray-200" style={{ fontFamily: 'var(--font-raleway)' }}>
                Créé le
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-700 border-b border-gray-200" style={{ fontFamily: 'var(--font-raleway)' }}>
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr
                key={product.id}
                className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
              >
                <td className="px-6 py-4">
                  <div className="w-15 h-15 rounded border border-gray-200 overflow-hidden bg-gray-100 flex items-center justify-center">
                    {product.images && product.images.length > 0 ? (
                      <Image
                        src={product.images[0].url}
                        alt={product.name}
                        width={60}
                        height={60}
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                        <svg
                          className="w-6 h-6 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div>
                    <p className="text-sm font-medium text-gray-900" style={{ fontFamily: 'var(--font-raleway)' }}>
                      {product.name}
                    </p>
                    <p className={`text-xs mt-1 ${
                      product.isPublished ? 'text-green-600' : 'text-gray-500'
                    }`} style={{ fontFamily: 'var(--font-raleway)' }}>
                      {product.isPublished ? 'Actif' : 'Brouillon'}
                    </p>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-900" style={{ fontFamily: 'var(--font-raleway)' }}>
                  {product.category?.name || '-'}
                </td>
                <td className="px-6 py-4 text-sm font-medium text-gray-900" style={{ fontFamily: 'var(--font-raleway)' }}>
                  {formatPrice(product.price)}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900" style={{ fontFamily: 'var(--font-raleway)' }}>
                  {product.stock ?? 0}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500" style={{ fontFamily: 'var(--font-raleway)' }}>
                  {product.images?.length || 0}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500" style={{ fontFamily: 'var(--font-raleway)' }}>
                  {formatDate(product.createdAt)}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/admin/products/${product.id}`}
                      className="px-3 py-1 bg-gray-900 text-white text-xs rounded hover:bg-gray-800 transition-colors"
                      style={{ fontFamily: 'var(--font-raleway)' }}
                    >
                      Modifier
                    </Link>
                    <button
                      onClick={() => handleDelete(product.id, product.name)}
                      disabled={deletingId === product.id}
                      className="px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      style={{ fontFamily: 'var(--font-raleway)' }}
                    >
                      {deletingId === product.id ? '...' : 'Supprimer'}
                    </button>
                    {product.category && (
                      <Link
                        href={`/boutique/${product.category.slug}/${product.slug}`}
                        target="_blank"
                        className="px-3 py-1 bg-gray-200 text-gray-700 text-xs rounded hover:bg-gray-300 transition-colors"
                        style={{ fontFamily: 'var(--font-raleway)' }}
                      >
                        Voir →
                      </Link>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}


