'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface Category {
  id: string
  name: string
  slug: string
  imageUrl?: string | null
  createdAt: Date
  updatedAt: Date
}

interface EditCategoryFormProps {
  category: Category
}

/**
 * Auto-generate slug from name
 */
function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove accents
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove invalid characters
    .replace(/[\s_-]+/g, '-') // Replace spaces/underscores with hyphens
    .replace(/^-+|-+$/g, '') // Remove leading/trailing hyphens
}

export default function EditCategoryForm({ category }: EditCategoryFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: category.name,
    slug: category.slug,
    imageUrl: category.imageUrl || '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Auto-generate slug from name when name changes
  useEffect(() => {
    if (formData.name && formData.name !== category.name) {
      setFormData((prev) => ({ ...prev, slug: slugify(prev.name) }))
    }
  }, [formData.name, category.name])

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    })
  }

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Le nom est requis'
    } else if (formData.name.trim().length <= 2) {
      newErrors.name = 'Le nom doit contenir plus de 2 caractères'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validate()) {
      return
    }

    setIsSubmitting(true)

    try {
      const res = await fetch(`/api/admin/categories/${category.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Include cookies for auth
        body: JSON.stringify({
          name: formData.name.trim(),
          slug: formData.slug.trim() || undefined,
          imageUrl: formData.imageUrl?.trim() || undefined,
        }),
      })

      if (!res.ok) {
        const error = await res.json()
        if (error.error) {
          setErrors({ name: error.error })
        } else {
          setErrors({ name: 'Erreur lors de la mise à jour de la catégorie' })
        }
        return
      }

      // Success - redirect to categories list
      router.push('/admin/categories')
      router.refresh()
    } catch (error) {
      console.error('Submit error:', error)
      setErrors({ name: 'Erreur lors de la mise à jour de la catégorie' })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-frost rounded-xl shadow-sm border border-neutral-200 p-6 space-y-6">
      {/* Name Field */}
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700 mb-2"
          style={{ fontFamily: 'var(--font-raleway)' }}
        >
          Nom de la catégorie *
        </label>
        <input
          type="text"
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all ${
            errors.name ? 'border-red-300' : 'border-gray-300'
          }`}
          style={{ fontFamily: 'var(--font-raleway)' }}
          required
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-600" style={{ fontFamily: 'var(--font-raleway)' }}>
            {errors.name}
          </p>
        )}
      </div>

      {/* Slug Field */}
      <div>
        <label
          htmlFor="slug"
          className="block text-sm font-medium text-gray-700 mb-2"
          style={{ fontFamily: 'var(--font-raleway)' }}
        >
          Slug
        </label>
        <input
          type="text"
          id="slug"
          value={formData.slug}
          onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
          style={{ fontFamily: 'var(--font-raleway)' }}
        />
      </div>

      {/* Image URL Field */}
      <div>
        <label
          htmlFor="imageUrl"
          className="block text-sm font-medium text-gray-700 mb-2"
          style={{ fontFamily: 'var(--font-raleway)' }}
        >
          URL de l'image (ex: /chaise.jpg)
        </label>
        <input
          type="text"
          id="imageUrl"
          value={formData.imageUrl}
          onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
          style={{ fontFamily: 'var(--font-raleway)' }}
          placeholder="/path/to/image.jpg"
        />
        <p className="mt-1 text-xs text-gray-500" style={{ fontFamily: 'var(--font-raleway)' }}>
          Chemin relatif depuis le dossier public.
        </p>
      </div>

      {/* Read-only Info */}
      <div className="pt-4 border-t border-gray-200">
        <p className="text-sm text-gray-500" style={{ fontFamily: 'var(--font-raleway)' }}>
          Créée le {formatDate(category.createdAt)}
        </p>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-4 pt-4 border-t border-gray-200">
        <Link
          href="/admin/categories"
          className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
          style={{ fontFamily: 'var(--font-raleway)' }}
        >
          Annuler
        </Link>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          style={{ fontFamily: 'var(--font-raleway)' }}
        >
          {isSubmitting ? 'Enregistrement...' : 'Enregistrer les modifications'}
        </button>
      </div>
    </form>
  )
}

