'use client'

import { useState, useMemo, useTransition } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { deleteCategory } from '@/app/admin/categories/actions'

interface Category {
  id: string
  name: string
  slug: string
  thumbnail: string | null
  productCount: number
  createdAt: string
}

interface CategoriesTableProps {
  categories: Category[]
}

function DeleteCategoryModal({ category, onClose }: { category: Category; onClose: () => void }) {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  function onConfirm() {
    setError(null)

    startTransition(async () => {
      const formData = new FormData()
      formData.append('id', category.id)

      const result = await deleteCategory(formData)
      if (result && result.ok === false && result.error) {
        setError(result.error)
      }
    })
  }

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center px-4">
      <div className="bg-frost p-8 max-w-md w-full border border-neutral-200">
        <h2
          className="text-xl mb-4"
          style={{ fontFamily: 'var(--font-bodoni)' }}
        >
          Supprimer la catégorie ?
        </h2>

        <p
          className="text-sm text-neutral-700 mb-6"
          style={{ fontFamily: 'var(--font-raleway)' }}
        >
          Confirmez la suppression de :
          <br />
          <strong className="font-medium">{category.name}</strong>
        </p>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm p-3 mb-4 rounded">
            {error}
          </div>
        )}

        <div className="flex items-center justify-end gap-4">
          <button
            onClick={onClose}
            className="text-xs uppercase tracking-[0.2em] text-neutral-500 hover:text-neutral-800 transition-colors"
            style={{ fontFamily: 'var(--font-raleway)' }}
          >
            Annuler
          </button>

          <button
            onClick={onConfirm}
            disabled={isPending}
            className="px-5 py-2.5 text-xs uppercase tracking-[0.25em] bg-red-600 text-white hover:bg-red-700 transition disabled:opacity-50"
            style={{ fontFamily: 'var(--font-raleway)' }}
          >
            {isPending ? 'Suppression...' : 'Supprimer'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function CategoriesTable({ categories }: CategoriesTableProps) {
  const [search, setSearch] = useState('')
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null)

  // Filter categories based on search
  const filteredCategories = useMemo(() => {
    if (!search.trim()) {
      return categories
    }

    const searchLower = search.toLowerCase()
    return categories.filter((category) => {
      return (
        category.name.toLowerCase().includes(searchLower) ||
        category.slug.toLowerCase().includes(searchLower)
      )
    })
  }, [categories, search])


  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
  }

  return (
    <>
      {/* Search Bar */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Rechercher une catégorie..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-md px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
          style={{ fontFamily: 'var(--font-raleway)' }}
        />
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block bg-frost rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider" style={{ fontFamily: 'var(--font-raleway)' }}>
                Catégorie
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider" style={{ fontFamily: 'var(--font-raleway)' }}>
                Produits
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider" style={{ fontFamily: 'var(--font-raleway)' }}>
                Slug
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider" style={{ fontFamily: 'var(--font-raleway)' }}>
                Date
              </th>
              <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider" style={{ fontFamily: 'var(--font-raleway)' }}>
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-frost divide-y divide-gray-50">
            {filteredCategories.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-gray-500" style={{ fontFamily: 'var(--font-raleway)' }}>
                  Aucune catégorie trouvée
                </td>
              </tr>
            ) : (
              filteredCategories.map((category) => (
                <tr
                  key={category.id}
                  className="hover:bg-black/5 transition-colors duration-150"
                >
                  {/* Category Image & Name */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="relative h-10 w-10 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                        {category.thumbnail ? (
                          <Image
                            src={category.thumbnail}
                            alt={category.name}
                            fill
                            className="object-cover"
                            sizes="40px"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                            <svg
                              className="w-6 h-6"
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
                      <div className="text-sm font-medium text-gray-900" style={{ fontFamily: 'var(--font-raleway)' }}>
                        {category.name}
                      </div>
                    </div>
                  </td>

                  {/* Product Count */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-600" style={{ fontFamily: 'var(--font-raleway)' }}>
                      {category.productCount}
                    </div>
                  </td>

                  {/* Slug */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500 font-mono" style={{ fontFamily: 'var(--font-raleway)' }}>
                      {category.slug}
                    </div>
                  </td>

                  {/* Created Date */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500" style={{ fontFamily: 'var(--font-raleway)' }}>
                      {formatDate(category.createdAt)}
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end gap-3">
                      <Link
                        href={`/admin/categories/${category.id}`}
                        className="px-4 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-gray-700"
                        style={{ fontFamily: 'var(--font-raleway)' }}
                      >
                        Modifier
                      </Link>
                      <button
                        type="button"
                        onClick={() => setDeleteTarget(category)}
                        className="text-xs uppercase tracking-[0.2em] text-red-600 hover:text-red-800 transition-colors"
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

      {/* Mobile Cards */}
      <div className="md:hidden space-y-4">
        {filteredCategories.length === 0 ? (
          <div className="bg-frost rounded-xl shadow-sm border border-gray-100 p-8 text-center text-gray-500" style={{ fontFamily: 'var(--font-raleway)' }}>
            Aucune catégorie trouvée
          </div>
        ) : (
          filteredCategories.map((category) => (
            <div
              key={category.id}
              className="bg-frost rounded-xl shadow-sm border border-gray-100 p-4"
            >
              <div className="flex items-start gap-4 mb-4">
                {/* Category Image */}
                <div className="relative h-16 w-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                  {category.thumbnail ? (
                    <Image
                      src={category.thumbnail}
                      alt={category.name}
                      fill
                      className="object-cover"
                      sizes="64px"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <svg
                        className="w-8 h-8"
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

                {/* Category Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-medium text-gray-900 mb-1" style={{ fontFamily: 'var(--font-raleway)' }}>
                    {category.name}
                  </h3>
                  <p className="text-xs text-gray-500 font-mono mb-2" style={{ fontFamily: 'var(--font-raleway)' }}>
                    {category.slug}
                  </p>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-gray-600" style={{ fontFamily: 'var(--font-raleway)' }}>
                      {category.productCount} produit{category.productCount !== 1 ? 's' : ''}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 mt-1" style={{ fontFamily: 'var(--font-raleway)' }}>
                    {formatDate(category.createdAt)}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                <Link
                  href={`/admin/categories/${category.id}`}
                  className="flex-1 px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-gray-700 text-center"
                  style={{ fontFamily: 'var(--font-raleway)' }}
                >
                  Modifier
                </Link>
                <button
                  type="button"
                  onClick={() => setDeleteTarget(category)}
                  className="flex-1 px-4 py-2 text-sm border border-red-200 rounded-lg hover:bg-red-50 transition-colors text-red-600"
                  style={{ fontFamily: 'var(--font-raleway)' }}
                >
                  Supprimer
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <DeleteCategoryModal
          category={deleteTarget}
          onClose={() => setDeleteTarget(null)}
        />
      )}
    </>
  )
}

