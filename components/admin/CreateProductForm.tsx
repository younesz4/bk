'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'

interface Category {
  id: string
  name: string
}

interface CreateProductFormProps {
  categories: Category[]
  createProduct: (formData: {
    name: string
    description: string
    price: string
    stock: number
    category: string
    images: string[]
  }) => Promise<void>
}

export default function CreateProductForm({ categories, createProduct }: CreateProductFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [name, setName] = useState('')
  const [price, setPrice] = useState('')
  const [stock, setStock] = useState(0)
  const [category, setCategory] = useState('')
  const [description, setDescription] = useState('')
  const [images, setImages] = useState<string[]>([])

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index))
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    // Limit to 6 images total
    const remainingSlots = 6 - images.length
    const filesToUpload = Array.from(files).slice(0, remainingSlots)

    if (files.length > remainingSlots) {
      alert(`Maximum 6 images autorisées. Seulement ${remainingSlots} image(s) seront ajoutées.`)
    }

    for (const file of filesToUpload) {
      try {
        const formData = new FormData()
        formData.append('file', file)

        const adminApiKey = process.env.NEXT_PUBLIC_ADMIN_API_KEY || ''
        const res = await fetch('/api/admin/uploads', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${adminApiKey}`,
          },
          body: formData,
        })

        if (res.ok) {
          const data = await res.json()
          setImages((prev) => [...prev, data.url])
        } else {
          const errorData = await res.json()
          alert(`Erreur lors de l'upload: ${errorData.error || 'Erreur inconnue'}`)
        }
      } catch (err) {
        console.error('Upload error:', err)
        alert('Erreur lors de l\'upload de l\'image')
      }
    }
  }

  const validate = (): boolean => {
    if (!name.trim()) {
      setError('Le nom du produit est requis')
      return false
    }

    if (!category) {
      setError('La catégorie est requise')
      return false
    }

    if (!price || parseFloat(price) <= 0) {
      setError('Le prix doit être supérieur à 0')
      return false
    }

    if (stock < 0) {
      setError('Le stock ne peut pas être négatif')
      return false
    }

    if (images.length === 0) {
      setError('Au moins une image est requise')
      return false
    }

    setError(null)
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validate()) {
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      await createProduct({
        name,
        description,
        price,
        stock,
        category,
        images,
      })
      // Redirect happens in server action
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la création du produit')
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 space-y-8">
      {/* Error Message */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600" style={{ fontFamily: 'var(--font-raleway)' }}>
            {error}
          </p>
        </div>
      )}

      {/* Product Name */}
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700 mb-2"
          style={{ fontFamily: 'var(--font-raleway)' }}
        >
          Nom du produit *
        </label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
          style={{ fontFamily: 'var(--font-raleway)' }}
          required
        />
      </div>

      {/* Category */}
      <div>
        <label
          htmlFor="category"
          className="block text-sm font-medium text-gray-700 mb-2"
          style={{ fontFamily: 'var(--font-raleway)' }}
        >
          Catégorie *
        </label>
        <select
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all bg-white"
          style={{ fontFamily: 'var(--font-raleway)' }}
          required
        >
          <option value="">Sélectionner une catégorie</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {/* Price and Stock - Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label
            htmlFor="price"
            className="block text-sm font-medium text-gray-700 mb-2"
            style={{ fontFamily: 'var(--font-raleway)' }}
          >
            Prix (EUR) *
          </label>
          <input
            type="number"
            id="price"
            step="0.01"
            min="0.01"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
            style={{ fontFamily: 'var(--font-raleway)' }}
            required
          />
        </div>

        <div>
          <label
            htmlFor="stock"
            className="block text-sm font-medium text-gray-700 mb-2"
            style={{ fontFamily: 'var(--font-raleway)' }}
          >
            Stock *
          </label>
          <input
            type="number"
            name="stock"
            id="stock"
            placeholder="Stock"
            min="0"
            value={stock}
            onChange={(e) => setStock(parseInt(e.target.value, 10) || 0)}
            className="input w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
            style={{ fontFamily: 'var(--font-raleway)' }}
            required
          />
        </div>
      </div>

      {/* Description */}
      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-700 mb-2"
          style={{ fontFamily: 'var(--font-raleway)' }}
        >
          Description
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={6}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all resize-none"
          style={{ fontFamily: 'var(--font-raleway)' }}
        />
      </div>

      {/* Image Upload */}
      <div>
        <label
          className="block text-sm font-medium text-gray-700 mb-2"
          style={{ fontFamily: 'var(--font-raleway)' }}
        >
          Images * {images.length > 0 && <span className="text-gray-500">({images.length}/6)</span>}
        </label>

        {images.length < 6 && (
          <div className="mb-4">
            <label
              htmlFor="image-upload"
              className="inline-flex items-center px-6 py-3 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400 transition-colors"
            >
              <svg
                className="w-5 h-5 mr-2 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              <span className="text-sm text-gray-600" style={{ fontFamily: 'var(--font-raleway)' }}>
                Ajouter des images
              </span>
            </label>
            <input
              id="image-upload"
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileUpload}
              className="hidden"
            />
          </div>
        )}

        {/* Image Previews */}
        {images.length > 0 && (
          <div className="grid grid-cols-3 gap-4 mt-4">
            {images.map((url, index) => (
              <div key={index} className="relative group">
                <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-gray-100">
                  <Image
                    src={url}
                    alt={`Preview ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 33vw, 120px"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-2 right-2 bg-black/60 text-white px-2 py-1 text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ fontFamily: 'var(--font-raleway)' }}
                >
                  Supprimer
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-4 pt-6 border-t border-gray-200">
        <Link
          href="/admin/products"
          className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          style={{ fontFamily: 'var(--font-raleway)' }}
        >
          Annuler
        </Link>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
          style={{ fontFamily: 'var(--font-raleway)' }}
        >
          {isSubmitting ? 'Création...' : 'Créer le produit'}
        </button>
      </div>
    </form>
  )
}
