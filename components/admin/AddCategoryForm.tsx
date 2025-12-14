'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

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

export default function AddCategoryForm() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
  })
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Auto-generate slug from name
  useEffect(() => {
    if (formData.name) {
      setFormData((prev) => ({ ...prev, slug: slugify(prev.name) }))
    }
  }, [formData.name])

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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      setImagePreview(URL.createObjectURL(file))
    }
  }


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validate()) {
      return
    }

    setIsSubmitting(true)

    try {
      // Always use FormData for file uploads
      const formDataObj = new FormData()
      const trimmedName = formData.name.trim()
      const trimmedSlug = formData.slug.trim() || slugify(trimmedName)
      
      // Ensure we have valid name and slug
      if (!trimmedName) {
        setErrors({ name: 'Le nom est requis' })
        setIsSubmitting(false)
        return
      }
      
      if (!trimmedSlug) {
        setErrors({ name: 'Impossible de générer un slug valide' })
        setIsSubmitting(false)
        return
      }
      
      formDataObj.append('name', trimmedName)
      formDataObj.append('slug', trimmedSlug)
      if (imageFile) {
        formDataObj.append('image', imageFile)
      }

      const res = await fetch('/api/admin/categories', {
        method: 'POST',
        credentials: 'include', // Include cookies (admin_session)
        body: formDataObj,
      })

      if (!res.ok) {
        const error = await res.json()
        if (error.error) {
          setErrors({ name: error.error })
        } else {
          setErrors({ name: 'Erreur lors de la création de la catégorie' })
        }
        return
      }

      // Success - redirect to categories list
      router.push('/admin/categories')
      router.refresh()
    } catch (error) {
      console.error('Submit error:', error)
      setErrors({ name: 'Erreur lors de la création de la catégorie' })
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
        <p className="mt-1 text-xs text-gray-500" style={{ fontFamily: 'var(--font-raleway)' }}>
          Laisser vide pour générer automatiquement.
        </p>
      </div>

      {/* Image Upload */}
      <div>
        <label
          htmlFor="image"
          className="block text-sm font-medium text-gray-700 mb-2"
          style={{ fontFamily: 'var(--font-raleway)' }}
        >
          Image de la catégorie
        </label>
        <input
          type="file"
          id="image"
          accept="image/*"
          onChange={handleImageChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
          style={{ fontFamily: 'var(--font-raleway)' }}
        />
        {imagePreview && (
          <div className="mt-4">
            <p className="text-xs text-gray-500 mb-2" style={{ fontFamily: 'var(--font-raleway)' }}>
              Aperçu :
            </p>
            <div className="relative w-32 h-32 border border-gray-300 rounded-lg overflow-hidden bg-gray-100">
              <img
                src={imagePreview}
                alt="Preview"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = 'none'
                }}
              />
            </div>
          </div>
        )}
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
          {isSubmitting ? 'Création...' : 'Créer la catégorie'}
        </button>
      </div>
    </form>
  )
}

