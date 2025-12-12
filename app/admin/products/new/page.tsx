'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface Category {
  id: string
  name: string
  slug: string
}

interface FormErrors {
  name?: string
  price?: string
  categoryId?: string
  images?: string
}

export default function NewProductPage() {
  const router = useRouter()

  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
  const [description, setDescription] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [price, setPrice] = useState('')
  const [stock, setStock] = useState('0')
  const [images, setImages] = useState<File[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [errors, setErrors] = useState<FormErrors>({})
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  // Auto-generate slug from name
  useEffect(() => {
    if (name && !slug) {
      const generatedSlug =
        name
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)+/g, '') +
        '-' +
        Math.floor(Math.random() * 9999)
      setSlug(generatedSlug)
    }
  }, [name, slug])

  // Fetch categories
  useEffect(() => {
    fetch('/api/admin/categories')
      .then((res) => res.json())
      .then((data) => {
        if (data.categories) {
          setCategories(data.categories)
        }
      })
      .catch((err) => {
        console.error('Error fetching categories:', err)
      })
  }, [])

  // Clear errors when user types
  const clearError = (field: keyof FormErrors) => {
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    setImages(files)
    clearError('images')
  }

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    if (!name.trim()) {
      newErrors.name = 'Le nom du produit est requis'
    }

    if (!price.trim()) {
      newErrors.price = 'Le prix est requis'
    } else {
      const priceNum = parseFloat(price)
      if (isNaN(priceNum) || priceNum <= 0) {
        newErrors.price = 'Le prix doit être un nombre positif'
      }
    }

    if (!categoryId) {
      newErrors.categoryId = 'La catégorie est requise'
    }

    if (images.length === 0) {
      newErrors.images = 'Au moins une image est requise'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setLoading(true)

    try {
      const formData = new FormData()
      formData.append('name', name.trim())
      formData.append('slug', slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Math.floor(Math.random() * 9999))
      formData.append('description', description.trim())
      formData.append('price', price)
      formData.append('stock', stock || '0')
      formData.append('categoryId', categoryId)

      // Append images
      images.forEach((image) => {
        formData.append('images', image)
      })

      const res = await fetch('/api/admin/products/add', {
        method: 'POST',
        credentials: 'include', // Include cookies for auth
        body: formData,
      })

      // Check if response is JSON before parsing
      const contentType = res.headers.get('content-type')
      let data: any = {}
      
      if (contentType && contentType.includes('application/json')) {
        try {
          data = await res.json()
        } catch (jsonError) {
          console.error('Error parsing JSON response:', jsonError)
          const text = await res.text()
          console.error('Response text:', text)
          setErrors({ name: 'Erreur de réponse du serveur. Veuillez réessayer.' })
          setLoading(false)
          return
        }
      } else {
        // If not JSON, get text response
        const text = await res.text()
        console.error('Non-JSON response:', text)
        setErrors({ name: text || 'Erreur lors de la création du produit' })
        setLoading(false)
        return
      }

      if (res.ok) {
        setSuccess(true)
        setTimeout(() => {
          router.push('/admin/products?success=created')
        }, 1500)
      } else {
        setErrors({ name: data.error || data.message || 'Erreur lors de la création du produit' })
        setLoading(false)
      }
    } catch (error: any) {
      console.error('Error creating product:', error)
      setErrors({ name: error.message || 'Une erreur est survenue. Veuillez réessayer.' })
      setLoading(false)
    }
  }

  return (
    <>
      {/* Header */}
      <div className="mb-8">
        <h1
          className="text-3xl md:text-4xl mb-2"
          style={{ fontFamily: 'var(--font-bodoni)' }}
        >
          Ajouter un produit
        </h1>
        <p
          className="text-neutral-600"
          style={{ fontFamily: 'var(--font-raleway)', fontSize: '14px' }}
        >
          Créer un nouveau produit dans votre boutique.
        </p>
      </div>

      {/* Form Card */}
      <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-8 max-w-[900px]">
        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-sm">
            <p
              className="text-green-800"
              style={{ fontFamily: 'var(--font-raleway)', fontSize: '14px' }}
            >
              ✓ Produit créé avec succès ! Redirection...
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Nom du produit */}
          <div>
            <label
              htmlFor="name"
              className="block mb-2 uppercase tracking-wide"
              style={{ fontFamily: 'var(--font-raleway)', fontSize: '12px', color: '#555' }}
            >
              Nom du produit <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => {
                setName(e.target.value)
                clearError('name')
              }}
              className={`w-full px-4 py-3 border rounded-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition ${
                errors.name ? 'border-red-500' : 'border-neutral-300'
              }`}
              style={{ fontFamily: 'var(--font-raleway)', fontSize: '14px' }}
              required
            />
            {errors.name && (
              <p
                className="mt-1 text-red-500"
                style={{ fontFamily: 'var(--font-raleway)', fontSize: '12px' }}
              >
                {errors.name}
              </p>
            )}
          </div>

          {/* Description */}
          <div>
            <label
              htmlFor="description"
              className="block mb-2 uppercase tracking-wide"
              style={{ fontFamily: 'var(--font-raleway)', fontSize: '12px', color: '#555' }}
            >
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={6}
              className="w-full px-4 py-3 border border-neutral-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition resize-none"
              style={{ fontFamily: 'var(--font-raleway)', fontSize: '14px' }}
              placeholder="Description du produit..."
            />
          </div>

          {/* Catégorie */}
          <div>
            <label
              htmlFor="categoryId"
              className="block mb-2 uppercase tracking-wide"
              style={{ fontFamily: 'var(--font-raleway)', fontSize: '12px', color: '#555' }}
            >
              Catégorie <span className="text-red-500">*</span>
            </label>
            <select
              id="categoryId"
              value={categoryId}
              onChange={(e) => {
                setCategoryId(e.target.value)
                clearError('categoryId')
              }}
              className={`w-full px-4 py-3 border rounded-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition ${
                errors.categoryId ? 'border-red-500' : 'border-neutral-300'
              }`}
              style={{ fontFamily: 'var(--font-raleway)', fontSize: '14px' }}
              required
            >
              <option value="">Sélectionner une catégorie</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
            {errors.categoryId && (
              <p
                className="mt-1 text-red-500"
                style={{ fontFamily: 'var(--font-raleway)', fontSize: '12px' }}
              >
                {errors.categoryId}
              </p>
            )}
          </div>

          {/* Prix et Stock */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Prix */}
            <div>
              <label
                htmlFor="price"
                className="block mb-2 uppercase tracking-wide"
                style={{ fontFamily: 'var(--font-raleway)', fontSize: '12px', color: '#555' }}
              >
                Prix (€) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                id="price"
                step="0.01"
                min="0"
                value={price}
                onChange={(e) => {
                  setPrice(e.target.value)
                  clearError('price')
                }}
                className={`w-full px-4 py-3 border rounded-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition ${
                  errors.price ? 'border-red-500' : 'border-neutral-300'
                }`}
                style={{ fontFamily: 'var(--font-raleway)', fontSize: '14px' }}
                required
                placeholder="0.00"
              />
              {errors.price && (
                <p
                  className="mt-1 text-red-500"
                  style={{ fontFamily: 'var(--font-raleway)', fontSize: '12px' }}
                >
                  {errors.price}
                </p>
              )}
            </div>

            {/* Stock */}
            <div>
              <label
                htmlFor="stock"
                className="block mb-2 uppercase tracking-wide"
                style={{ fontFamily: 'var(--font-raleway)', fontSize: '12px', color: '#555' }}
              >
                Stock
              </label>
              <input
                type="number"
                id="stock"
                min="0"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                className="w-full px-4 py-3 border border-neutral-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition"
                style={{ fontFamily: 'var(--font-raleway)', fontSize: '14px' }}
                placeholder="0"
              />
            </div>
          </div>

          {/* Images Upload */}
          <div>
            <label
              htmlFor="images"
              className="block mb-2 uppercase tracking-wide"
              style={{ fontFamily: 'var(--font-raleway)', fontSize: '12px', color: '#555' }}
            >
              Images <span className="text-red-500">*</span>
            </label>
            <input
              type="file"
              id="images"
              accept="image/*"
              multiple
              onChange={handleImageChange}
              className={`w-full px-4 py-3 border rounded-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition ${
                errors.images ? 'border-red-500' : 'border-neutral-300'
              }`}
              style={{ fontFamily: 'var(--font-raleway)', fontSize: '14px' }}
            />
            {errors.images && (
              <p
                className="mt-1 text-red-500"
                style={{ fontFamily: 'var(--font-raleway)', fontSize: '12px' }}
              >
                {errors.images}
              </p>
            )}
            {images.length > 0 && (
              <p
                className="mt-2 text-neutral-600"
                style={{ fontFamily: 'var(--font-raleway)', fontSize: '14px' }}
              >
                {images.length} image{images.length > 1 ? 's' : ''} sélectionnée{images.length > 1 ? 's' : ''}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-black text-white rounded-md hover:bg-neutral-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
              style={{ fontFamily: 'var(--font-raleway)', fontSize: '14px' }}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg
                    className="animate-spin h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Création en cours...
                </span>
              ) : (
                'Créer le produit'
              )}
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              disabled={loading}
              className="px-6 py-3 bg-neutral-200 text-neutral-700 rounded-md hover:bg-neutral-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ fontFamily: 'var(--font-raleway)', fontSize: '14px' }}
            >
              Annuler
            </button>
          </div>
        </form>
      </div>
    </>
  )
}
