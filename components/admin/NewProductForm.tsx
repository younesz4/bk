'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'

interface Category {
  id: string
  name: string
}

interface NewProductFormProps {
  categories: Category[]
}

interface ImagePreview {
  file: File
  preview: string
  id: string
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export default function NewProductForm({ categories }: NewProductFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    categoryId: '',
    price: '',
    stock: '0',
    description: '',
  })
  const [images, setImages] = useState<ImagePreview[]>([])
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleNameChange = (name: string) => {
    setFormData({
      ...formData,
      name,
      slug: slugify(name),
    })
  }

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    
    files.forEach((file) => {
      if (!file.type.startsWith('image/')) {
        alert('Veuillez sélectionner uniquement des images')
        return
      }

      const reader = new FileReader()
      reader.onloadend = () => {
        setImages((prev) => [
          ...prev,
          {
            file,
            preview: reader.result as string,
            id: Math.random().toString(36).substring(7),
          },
        ])
      }
      reader.readAsDataURL(file)
    })

    e.target.value = ''
  }

  const handleImageRemove = (id: string) => {
    setImages(images.filter((img) => img.id !== id))
  }

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Le nom est requis'
    }

    if (!formData.categoryId) {
      newErrors.categoryId = 'La catégorie est requise'
    }

    if (!formData.price || parseFloat(formData.price) <= 0) {
      newErrors.price = 'Le prix doit être supérieur à 0'
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
      const adminApiKey = process.env.NEXT_PUBLIC_ADMIN_API_KEY || ''

      const productRes = await fetch('/api/admin/products', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${adminApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          slug: formData.slug || slugify(formData.name),
          categoryId: formData.categoryId,
          price: Math.round(parseFloat(formData.price) * 100),
          stock: parseInt(formData.stock, 10) || 0,
          description: formData.description,
        }),
      })

      if (!productRes.ok) {
        const error = await productRes.json()
        alert(error.error || 'Erreur lors de la création du produit')
        return
      }

      const product = await productRes.json()

      for (const image of images) {
        const formData = new FormData()
        formData.append('image', image.file)

        const imageRes = await fetch(`/api/admin/products/${product.id}/images`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${adminApiKey}`,
          },
          body: formData,
        })

        if (!imageRes.ok) {
          console.error('Failed to upload image:', image.file.name)
        }
      }

      router.refresh()
      router.push('/admin/products')
    } catch (error) {
      console.error('Submit error:', error)
      alert('Erreur lors de la création du produit')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      onSubmit={handleSubmit}
      className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-6"
    >
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: 'var(--font-raleway)' }}>
          Nom du produit *
        </label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => handleNameChange(e.target.value)}
          className={`w-full px-4 py-2 border rounded focus:ring-2 focus:ring-gray-900 focus:border-transparent ${
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

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: 'var(--font-raleway)' }}>
          Slug
        </label>
        <input
          type="text"
          value={formData.slug}
          onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-gray-900 focus:border-transparent"
          style={{ fontFamily: 'var(--font-raleway)' }}
        />
        <p className="mt-1 text-xs text-gray-500" style={{ fontFamily: 'var(--font-raleway)' }}>
          Généré automatiquement à partir du nom
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: 'var(--font-raleway)' }}>
          Catégorie *
        </label>
        <select
          value={formData.categoryId}
          onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
          className={`w-full px-4 py-2 border rounded focus:ring-2 focus:ring-gray-900 focus:border-transparent ${
            errors.categoryId ? 'border-red-300' : 'border-gray-300'
          }`}
          style={{ fontFamily: 'var(--font-raleway)' }}
        >
          <option value="">Sélectionner une catégorie</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
        {errors.categoryId && (
          <p className="mt-1 text-sm text-red-600" style={{ fontFamily: 'var(--font-raleway)' }}>
            {errors.categoryId}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: 'var(--font-raleway)' }}>
            Prix (€) *
          </label>
          <input
            type="number"
            step="0.01"
            min="0.01"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            className={`w-full px-4 py-2 border rounded focus:ring-2 focus:ring-gray-900 focus:border-transparent ${
              errors.price ? 'border-red-300' : 'border-gray-300'
            }`}
            style={{ fontFamily: 'var(--font-raleway)' }}
          />
          {errors.price && (
            <p className="mt-1 text-sm text-red-600" style={{ fontFamily: 'var(--font-raleway)' }}>
              {errors.price}
            </p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: 'var(--font-raleway)' }}>
            Stock
          </label>
          <input
            type="number"
            min="0"
            value={formData.stock}
            onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-gray-900 focus:border-transparent"
            style={{ fontFamily: 'var(--font-raleway)' }}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: 'var(--font-raleway)' }}>
          Description
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={4}
          className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-gray-900 focus:border-transparent"
          style={{ fontFamily: 'var(--font-raleway)' }}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: 'var(--font-raleway)' }}>
          Images
        </label>
        {images.length > 0 && (
          <div className="grid grid-cols-4 gap-4 mb-4">
            {images.map((image) => (
              <div key={image.id} className="relative group">
                <img
                  src={image.preview}
                  alt="Preview"
                  className="w-full aspect-square object-cover rounded border border-gray-200"
                />
                <button
                  type="button"
                  onClick={() => handleImageRemove(image.id)}
                  className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}
        <label className="block">
          <span className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors cursor-pointer inline-block text-sm" style={{ fontFamily: 'var(--font-raleway)' }}>
            Ajouter des images
          </span>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageSelect}
            className="hidden"
          />
        </label>
      </div>

      <div className="pt-4 border-t border-gray-200">
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full md:w-auto px-6 py-3 bg-gray-900 text-white rounded hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
          style={{ fontFamily: 'var(--font-raleway)' }}
        >
          {isSubmitting ? 'Création...' : 'Créer le produit'}
        </button>
      </div>
    </motion.form>
  )
}


