'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'

interface Category {
  id: string
  name: string
}

interface ProductImage {
  id: string
  url: string
  alt: string | null
  order: number
}

interface Product {
  id: string
  name: string
  slug: string
  description: string
  price: string
  stock: number
  categoryId: string
  category: {
    id: string
    name: string
    slug: string
  }
  images: ProductImage[]
}

interface EditProductFormProps {
  product: Product
  categories: Category[]
  updateProduct: (formData: {
    id: string
    name: string
    description: string
    price: string
    stock: number
    category: string
    newImages: string[]
    removedImages: string[]
    existingImagesCount: number
  }) => Promise<void>
}

export default function EditProductForm({
  product,
  categories,
  updateProduct,
}: EditProductFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [name, setName] = useState(product.name)
  const [price, setPrice] = useState(product.price)
  const [stock, setStock] = useState(product.stock)
  const [category, setCategory] = useState(product.categoryId)
  const [description, setDescription] = useState(product.description)

  const [existingImages, setExistingImages] = useState(product.images)
  const [newImages, setNewImages] = useState<string[]>([])
  const [removedImages, setRemovedImages] = useState<string[]>([])

  const removeExistingImage = (imageId: string) => {
    setRemovedImages([...removedImages, imageId])
    setExistingImages(existingImages.filter((img) => img.id !== imageId))
  }

  const removeNewImage = (index: number) => {
    setNewImages(newImages.filter((_, i) => i !== index))
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    // Calculate total images (existing + new)
    const totalImages = existingImages.length + newImages.length
    const remainingSlots = 6 - totalImages
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
          setNewImages((prev) => [...prev, data.url])
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

    const totalImages = existingImages.length + newImages.length
    if (totalImages === 0) {
      setError('Au moins une image est requise')
      return false
    }

    if (totalImages > 6) {
      setError('Maximum 6 images autorisées')
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
      await updateProduct({
        id: product.id,
        name,
        description,
        price,
        stock,
        category,
        newImages,
        removedImages,
        existingImagesCount: existingImages.length,
      })
      // Redirect happens in server action - if we reach here, redirect was successful
      // The redirect will cause a navigation, so we don't need to do anything
    } catch (err: any) {
      // Check if this is a redirect error (NEXT_REDIRECT) - if so, it's not an error
      if (err && typeof err === 'object' && ('digest' in err || err.message?.includes('NEXT_REDIRECT'))) {
        // This is a redirect, not an error - let it propagate
        return
      }
      setError(err.message || 'Erreur lors de la mise à jour du produit')
      setIsSubmitting(false)
    }
  }

  const totalImages = existingImages.length + newImages.length

  return (
    <form onSubmit={handleSubmit} className="bg-frost rounded-xl shadow-sm border border-gray-200 p-8 space-y-8">
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
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all bg-frost"
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
            id="stock"
            min="0"
            value={stock}
            onChange={(e) => setStock(parseInt(e.target.value, 10) || 0)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
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

      {/* Images Section */}
      <div>
        <label
          className="block text-sm font-medium text-gray-700 mb-2"
          style={{ fontFamily: 'var(--font-raleway)' }}
        >
          Images * {totalImages > 0 && <span className="text-gray-500">({totalImages}/6)</span>}
        </label>

        {/* Existing Images */}
        {existingImages.length > 0 && (
          <div className="mb-6">
            <p className="text-xs text-gray-500 mb-3" style={{ fontFamily: 'var(--font-raleway)' }}>
              Images existantes
            </p>
            <div className="grid grid-cols-3 gap-4">
              {existingImages.map((img) => (
                <div key={img.id} className="relative group">
                  <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-gray-100">
                    <Image
                      src={img.url}
                      alt={img.alt || product.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 33vw, 120px"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeExistingImage(img.id)}
                    className="absolute top-2 right-2 bg-black/60 text-white px-2 py-1 text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ fontFamily: 'var(--font-raleway)' }}
                  >
                    Supprimer
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Upload New Images */}
        {totalImages < 6 && (
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
                Ajouter des images ({6 - totalImages} restantes)
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

        {/* New Image Previews */}
        {newImages.length > 0 && (
          <div>
            <p className="text-xs text-gray-500 mb-3" style={{ fontFamily: 'var(--font-raleway)' }}>
              Nouvelles images
            </p>
            <div className="grid grid-cols-3 gap-4">
              {newImages.map((url, index) => (
                <div key={index} className="relative group">
                  <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-gray-100">
                    <Image
                      src={url}
                      alt={`Nouvelle image ${index + 1}`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 33vw, 120px"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeNewImage(index)}
                    className="absolute top-2 right-2 bg-black/60 text-white px-2 py-1 text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ fontFamily: 'var(--font-raleway)' }}
                  >
                    Supprimer
                  </button>
                </div>
              ))}
            </div>
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
          {isSubmitting ? 'Enregistrement...' : 'Enregistrer les modifications'}
        </button>
      </div>
    </form>
  )
}
