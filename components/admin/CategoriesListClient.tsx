'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface Category {
  id: string
  name: string
  slug: string
  createdAt: string
  _count: {
    products: number
  }
}

interface CategoriesListClientProps {
  initialCategories: Category[]
}

export default function CategoriesListClient({ initialCategories }: CategoriesListClientProps) {
  const router = useRouter()
  const [categories, setCategories] = useState(initialCategories)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDeleteClick = (categoryId: string) => {
    setCategoryToDelete(categoryId)
    setDeleteModalOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!categoryToDelete) return

    setIsDeleting(true)
    try {
      const adminApiKey = process.env.NEXT_PUBLIC_ADMIN_API_KEY || ''
      const res = await fetch(`/api/admin/categories/${categoryToDelete}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${adminApiKey}`,
        },
      })

      if (res.ok) {
        setDeleteModalOpen(false)
        setCategoryToDelete(null)
        // Remove category from list
        setCategories((prev) => prev.filter((cat) => cat.id !== categoryToDelete))
      } else {
        const error = await res.json()
        alert(error.error || 'Échec de la suppression de la catégorie')
      }
    } catch (error) {
      console.error('Error deleting category:', error)
      alert('Erreur lors de la suppression de la catégorie')
    } finally {
      setIsDeleting(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })
  }

  return (
    <>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <h1
            className="text-3xl font-bold text-gray-900"
            style={{ fontFamily: 'var(--font-bodoni)' }}
          >
            Catégories
          </h1>
          <Link
            href="/admin/categories/add"
            className="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium"
            style={{ fontFamily: 'var(--font-raleway)' }}
          >
            Ajouter une catégorie
          </Link>
        </div>
        <p
          className="text-gray-600"
          style={{ fontFamily: 'var(--font-raleway)' }}
        >
          Gérez les familles de produits de la boutique.
        </p>
      </div>

      {/* Categories Table */}
      <div className="bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden">
        {categories.length === 0 ? (
          <div className="p-8 text-center text-gray-500" style={{ fontFamily: 'var(--font-raleway)' }}>
            Aucune catégorie trouvée
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" style={{ fontFamily: 'var(--font-raleway)' }}>
                    Nom
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" style={{ fontFamily: 'var(--font-raleway)' }}>
                    Slug
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" style={{ fontFamily: 'var(--font-raleway)' }}>
                    Produits
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" style={{ fontFamily: 'var(--font-raleway)' }}>
                    Créée le
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider" style={{ fontFamily: 'var(--font-raleway)' }}>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {categories.map((category) => (
                  <tr key={category.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900" style={{ fontFamily: 'var(--font-raleway)' }}>
                        {category.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500 font-mono" style={{ fontFamily: 'var(--font-raleway)' }}>
                        {category.slug}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500" style={{ fontFamily: 'var(--font-raleway)' }}>
                        {category._count.products}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500" style={{ fontFamily: 'var(--font-raleway)' }}>
                        {formatDate(category.createdAt)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-4">
                        <Link
                          href={`/admin/categories/${category.id}`}
                          className="text-gray-600 hover:text-gray-900 transition-colors"
                          style={{ fontFamily: 'var(--font-raleway)' }}
                        >
                          Modifier
                        </Link>
                        <button
                          onClick={() => handleDeleteClick(category.id)}
                          className="text-red-600 hover:text-red-900 transition-colors"
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
        )}
      </div>

      {/* Delete Modal */}
      {deleteModalOpen && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={() => setDeleteModalOpen(false)}
        >
          <div
            className="bg-white rounded-xl shadow-xl p-6 max-w-md w-full mx-4"
            onClick={(e) => e.stopPropagation()}
            style={{
              animation: 'fadeInScale 0.2s ease-out',
            }}
          >
            <h2
              className="text-xl font-bold text-gray-900 mb-2"
              style={{ fontFamily: 'var(--font-bodoni)' }}
            >
              Supprimer cette catégorie ?
            </h2>
            <p
              className="text-gray-600 mb-6"
              style={{ fontFamily: 'var(--font-raleway)' }}
            >
              Cette action est irréversible.
            </p>
            <div className="flex items-center justify-end gap-4">
              <button
                onClick={() => setDeleteModalOpen(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                style={{ fontFamily: 'var(--font-raleway)' }}
              >
                Annuler
              </button>
              <button
                onClick={handleDeleteConfirm}
                disabled={isDeleting}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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

