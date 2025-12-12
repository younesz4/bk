/**
 * Admin products manager for BK Agencements
 * Product form component for create/edit
 */

'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'

interface Product {
  id: string
  name: string
  slug: string
  description: string | null
  price: number
  stock: number
  isPublished: boolean
  categoryId: string
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

interface ProductFormProps {
  product: Product | null
  categories: Category[]
  onSuccess: () => void
  onCancel: () => void
}

export default function ProductForm({ product, categories, onSuccess, onCancel }: ProductFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    price: '',
    stock: '0',
    categoryId: '',
    isPublished: false,
    images: [] as Array<{ url: string; alt: string }>,
  })

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        slug: product.slug,
        description: product.description || '',
        price: (product.price / 100).toString(),
        stock: product.stock.toString(),
        categoryId: product.categoryId,
        isPublished: product.isPublished,
        images: product.images.map((img) => ({ url: img.url, alt: img.alt || '' })),
      })
    }
  }, [product])

  // Auto-generate slug from name
  useEffect(() => {
    if (!product && formData.name) {
      const slug = formData.name
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
      setFormData((prev) => ({ ...prev, slug }))
    }
  }, [formData.name, product])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const payload = {
        name: formData.name.trim(),
        slug: formData.slug.trim(),
        description: formData.description.trim() || null,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock) || 0,
        categoryId: formData.categoryId,
        isPublished: formData.isPublished,
        images: formData.images,
      }

      const url = product ? `/api/admin/products/${product.id}` : '/api/admin/products'
      const method = product ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      const data = await response.json()

      if (data.success) {
        onSuccess()
      } else {
        setError(data.error || 'Erreur lors de l\'enregistrement')
      }
    } catch (err) {
      setError('Erreur de connexion')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const addImage = () => {
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, { url: '', alt: '' }],
    }))
  }

  const removeImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }))
  }

  const updateImage = (index: number, field: 'url' | 'alt', value: string) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.map((img, i) => (i === index ? { ...img, [field]: value } : img)),
    }))
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-end">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onCancel}
        className="absolute inset-0 bg-black/50"
      />

      {/* Panel */}
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        className="relative w-full md:w-[500px] h-full md:h-auto md:max-h-[90vh] bg-white dark:bg-neutral-800 shadow-xl overflow-y-auto"
      >
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-700 pb-4">
            <h2
              className="text-2xl font-light text-neutral-900 dark:text-white"
              style={{ fontFamily: 'var(--font-bodoni)' }}
            >
              {product ? 'Modifier le produit' : 'Nouveau produit'}
            </h2>
            <button
              onClick={onCancel}
              className="text-neutral-500 hover:text-neutral-900 dark:hover:text-white"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-sm text-red-600 dark:text-red-400" style={{ fontFamily: 'var(--font-raleway)' }}>
                {error}
              </p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name */}
            <div>
              <label className="block text-sm font-light text-neutral-700 dark:text-neutral-300 mb-2" style={{ fontFamily: 'var(--font-raleway)' }}>
                Nom *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-700 rounded-lg focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent"
                style={{ fontFamily: 'var(--font-raleway)' }}
              />
            </div>

            {/* Slug */}
            <div>
              <label className="block text-sm font-light text-neutral-700 dark:text-neutral-300 mb-2" style={{ fontFamily: 'var(--font-raleway)' }}>
                Slug *
              </label>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                required
                className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-700 rounded-lg focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent"
                style={{ fontFamily: 'var(--font-raleway)' }}
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-light text-neutral-700 dark:text-neutral-300 mb-2" style={{ fontFamily: 'var(--font-raleway)' }}>
                Catégorie *
              </label>
              <select
                value={formData.categoryId}
                onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                required
                className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-700 rounded-lg focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent"
                style={{ fontFamily: 'var(--font-raleway)' }}
              >
                <option value="">Sélectionner une catégorie</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Price */}
            <div>
              <label className="block text-sm font-light text-neutral-700 dark:text-neutral-300 mb-2" style={{ fontFamily: 'var(--font-raleway)' }}>
                Prix (€) *
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                required
                className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-700 rounded-lg focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent"
                style={{ fontFamily: 'var(--font-raleway)' }}
              />
            </div>

            {/* Stock */}
            <div>
              <label className="block text-sm font-light text-neutral-700 dark:text-neutral-300 mb-2" style={{ fontFamily: 'var(--font-raleway)' }}>
                Stock
              </label>
              <input
                type="number"
                min="0"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-700 rounded-lg focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent"
                style={{ fontFamily: 'var(--font-raleway)' }}
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-light text-neutral-700 dark:text-neutral-300 mb-2" style={{ fontFamily: 'var(--font-raleway)' }}>
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-700 rounded-lg focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent"
                style={{ fontFamily: 'var(--font-raleway)' }}
              />
            </div>

            {/* Published Toggle */}
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="isPublished"
                checked={formData.isPublished}
                onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                className="w-4 h-4 text-black border-neutral-300 rounded focus:ring-black"
              />
              <label htmlFor="isPublished" className="text-sm font-light text-neutral-700 dark:text-neutral-300" style={{ fontFamily: 'var(--font-raleway)' }}>
                Publier le produit
              </label>
            </div>

            {/* Images */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-light text-neutral-700 dark:text-neutral-300" style={{ fontFamily: 'var(--font-raleway)' }}>
                  Images
                </label>
                <button
                  type="button"
                  onClick={addImage}
                  className="text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
                  style={{ fontFamily: 'var(--font-raleway)' }}
                >
                  + Ajouter une image
                </button>
              </div>
              <div className="space-y-2">
                {formData.images.map((img, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="URL de l'image"
                      value={img.url}
                      onChange={(e) => updateImage(index, 'url', e.target.value)}
                      className="flex-1 px-4 py-2 border border-neutral-300 dark:border-neutral-700 rounded-lg focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent"
                      style={{ fontFamily: 'var(--font-raleway)' }}
                    />
                    <input
                      type="text"
                      placeholder="Alt"
                      value={img.alt}
                      onChange={(e) => updateImage(index, 'alt', e.target.value)}
                      className="w-24 px-4 py-2 border border-neutral-300 dark:border-neutral-700 rounded-lg focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent"
                      style={{ fontFamily: 'var(--font-raleway)' }}
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="px-3 py-2 text-red-600 hover:text-red-800"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4 border-t border-neutral-200 dark:border-neutral-700">
              <button
                type="button"
                onClick={onCancel}
                className="flex-1 px-6 py-3 border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors uppercase tracking-wider text-sm font-light"
                style={{ fontFamily: 'var(--font-raleway)' }}
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-6 py-3 bg-black dark:bg-white text-white dark:text-black rounded-lg hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors uppercase tracking-wider text-sm font-light disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ fontFamily: 'var(--font-raleway)' }}
              >
                {loading ? 'Enregistrement...' : product ? 'Mettre à jour' : 'Créer'}
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  )
}
