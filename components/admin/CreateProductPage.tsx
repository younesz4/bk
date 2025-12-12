'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'

interface Category {
  id: string
  name: string
}

interface CreateProductPageProps {
  categories: Category[]
}

export default function CreateProductPage({ categories }: CreateProductPageProps) {
  const router = useRouter()
  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [stock, setStock] = useState(1)
  const [categoryId, setCategoryId] = useState(categories[0]?.id || '')
  const [images, setImages] = useState<string[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Auto-generate slug
  const handleNameChange = (value: string) => {
    setName(value)
    setSlug(
      value
        .toLowerCase()
        .trim()
        .replaceAll(' ', '-')
        .replace(/[^a-z0-9-]/g, '')
    )
  }

  // Upload image
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (images.length >= 6) {
      alert('Maximum 6 images autorisées')
      return
    }

    setIsUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)

      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      })

      const data = await res.json()

      if (data.url) {
        setImages([...images, data.url])
      } else {
        alert(data.error || 'Erreur lors de l\'upload')
      }
    } catch (err) {
      console.error('Upload error:', err)
      alert('Erreur lors de l\'upload de l\'image')
    } finally {
      setIsUploading(false)
      // Reset input
      if (e.target) {
        e.target.value = ''
      }
    }
  }

  // Delete image
  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index))
  }

  // Reorder images (move up)
  const moveImageUp = (index: number) => {
    if (index === 0) return
    const newImages = [...images]
    const temp = newImages[index]
    newImages[index] = newImages[index - 1]
    newImages[index - 1] = temp
    setImages(newImages)
  }

  // Reorder images (move down)
  const moveImageDown = (index: number) => {
    if (index === images.length - 1) return
    const newImages = [...images]
    const temp = newImages[index]
    newImages[index] = newImages[index + 1]
    newImages[index + 1] = temp
    setImages(newImages)
  }

  // Save product
  const handleSave = async () => {
    setError(null)

    // Validation
    if (!name.trim()) {
      setError('Le nom du produit est requis')
      return
    }

    if (!slug.trim()) {
      setError('Le slug est requis')
      return
    }

    if (!categoryId) {
      setError('La catégorie est requise')
      return
    }

    if (!price || parseFloat(price) <= 0) {
      setError('Le prix doit être supérieur à 0')
      return
    }

    if (images.length === 0) {
      setError('Au moins une image est requise')
      return
    }

    setIsSaving(true)

    try {
      const res = await fetch('/api/admin/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_ADMIN_API_KEY || ''}`,
        },
        body: JSON.stringify({
          name,
          slug,
          description,
          price: Math.round(parseFloat(price) * 100), // Convert to cents
          stock,
          categoryId,
          images: images.map((url, index) => ({
            url,
            alt: name,
            order: index,
          })),
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Erreur lors de la création du produit')
        return
      }

      // Success - redirect to products list
      router.push('/admin/products')
      router.refresh()
    } catch (err: any) {
      console.error('Save error:', err)
      setError('Erreur lors de la création du produit')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f7f7f5' }}>
      <div className="max-w-3xl mx-auto px-6 py-12">
        <div className="mb-8">
          <Link
            href="/admin/products"
            className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4 transition-colors"
            style={{ fontFamily: 'var(--font-raleway)' }}
          >
            ← Retour aux produits
          </Link>
          <h1
            className="text-4xl font-bold text-gray-900 mb-3"
            style={{ fontFamily: 'var(--font-bodoni)' }}
          >
            Ajouter un Produit
          </h1>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-8 space-y-6">
          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm p-4 rounded-lg">
              {error}
            </div>
          )}

          {/* Name */}
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-2"
              style={{ fontFamily: 'var(--font-raleway)' }}
            >
              Nom du produit *
            </label>
            <input
              id="name"
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              className="w-full border border-neutral-300 px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
              style={{ fontFamily: 'var(--font-raleway)' }}
              required
            />
          </div>

          {/* Slug */}
          <div>
            <label
              htmlFor="slug"
              className="block text-sm font-medium text-gray-700 mb-2"
              style={{ fontFamily: 'var(--font-raleway)' }}
            >
              Slug (URL) *
            </label>
            <input
              id="slug"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className="w-full border border-neutral-300 px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all font-mono"
              style={{ fontFamily: 'var(--font-raleway)' }}
              required
            />
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
              className="w-full border border-neutral-300 px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all resize-none h-32"
              style={{ fontFamily: 'var(--font-raleway)' }}
            />
          </div>

          {/* Price and Stock */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="price"
                className="block text-sm font-medium text-gray-700 mb-2"
                style={{ fontFamily: 'var(--font-raleway)' }}
              >
                Prix (€) *
              </label>
              <input
                id="price"
                type="number"
                step="0.01"
                min="0.01"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full border border-neutral-300 px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
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
                onChange={(e) => setStock(Number(e.target.value))}
                className="input w-full border border-neutral-300 px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
                style={{ fontFamily: 'var(--font-raleway)' }}
                required
              />
            </div>
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
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full border border-neutral-300 px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all bg-white"
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

          {/* Image Upload */}
          <div>
            <label
              className="block text-sm font-medium text-gray-700 mb-2"
              style={{ fontFamily: 'var(--font-raleway)' }}
            >
              Images (max: 6) {images.length > 0 && <span className="text-gray-500">({images.length}/6)</span>}
            </label>

            <div className="grid grid-cols-3 gap-4">
              {images.map((url, i) => (
                <div key={i} className="relative group">
                  <div className="relative w-full aspect-square rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
                    <Image
                      src={url}
                      alt={`Image ${i + 1}`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 33vw, 200px"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeImage(i)}
                    className="absolute top-2 right-2 bg-black/70 text-white px-2 py-1 text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ fontFamily: 'var(--font-raleway)' }}
                  >
                    X
                  </button>
                  {/* Reorder buttons */}
                  <div className="absolute bottom-2 left-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {i > 0 && (
                      <button
                        type="button"
                        onClick={() => moveImageUp(i)}
                        className="bg-black/70 text-white px-2 py-1 text-xs rounded"
                        title="Déplacer vers le haut"
                      >
                        ↑
                      </button>
                    )}
                    {i < images.length - 1 && (
                      <button
                        type="button"
                        onClick={() => moveImageDown(i)}
                        className="bg-black/70 text-white px-2 py-1 text-xs rounded"
                        title="Déplacer vers le bas"
                      >
                        ↓
                      </button>
                    )}
                  </div>
                  {/* Order indicator */}
                  <div className="absolute top-2 left-2 bg-black/70 text-white px-2 py-1 text-xs rounded">
                    #{i + 1}
                  </div>
                </div>
              ))}

              {images.length < 6 && (
                <label className="border-2 border-dashed border-neutral-300 rounded-lg p-4 flex items-center justify-center cursor-pointer hover:border-neutral-400 transition-colors aspect-square">
                  <div className="text-center">
                    <span className="text-sm text-gray-600 block mb-1" style={{ fontFamily: 'var(--font-raleway)' }}>
                      + Ajouter
                    </span>
                    {isUploading && (
                      <span className="text-xs text-gray-400" style={{ fontFamily: 'var(--font-raleway)' }}>
                        Upload...
                      </span>
                    )}
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                    disabled={isUploading}
                  />
                </label>
              )}
            </div>
          </div>

          {/* Save button */}
          <div className="flex items-center justify-end gap-4 pt-6 border-t border-gray-200">
            <Link
              href="/admin/products"
              className="px-6 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              style={{ fontFamily: 'var(--font-raleway)' }}
            >
              Annuler
            </Link>
            <button
              onClick={handleSave}
              disabled={isSaving || isUploading}
              className="px-6 py-2.5 bg-black text-white uppercase tracking-[0.2em] text-xs hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed rounded-lg"
              style={{ fontFamily: 'var(--font-raleway)' }}
            >
              {isSaving ? 'Enregistrement...' : 'Enregistrer'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

