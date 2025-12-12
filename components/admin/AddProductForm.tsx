'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

interface Category {
  id: string
  name: string
}

interface AddProductFormProps {
  categories: Category[]
}

interface ImagePreview {
  file: File
  preview: string
  id: string
  uploadedUrl?: string
}

/**
 * Auto-generate slug from name
 * - Lowercase
 * - Remove accents
 * - Replace spaces with hyphens
 * - Remove invalid characters
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

export default function AddProductForm({ categories }: AddProductFormProps) {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    price: '',
    stock: '0',
    categoryId: '',
  })
  const [images, setImages] = useState<ImagePreview[]>([])
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Auto-generate slug from name
  useEffect(() => {
    if (formData.name) {
      setFormData((prev) => ({ ...prev, slug: slugify(prev.name) }))
    }
  }, [formData.name])

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return

    const imageFiles = Array.from(files).filter((file) => file.type.startsWith('image/'))

    // Limit to 10 images
    const remainingSlots = 10 - images.length
    const filesToAdd = imageFiles.slice(0, remainingSlots)

    if (imageFiles.length > remainingSlots) {
      alert(`Maximum 10 images allowed. Only ${remainingSlots} image(s) will be added.`)
    }

    filesToAdd.forEach((file) => {
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
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    handleFileSelect(e.dataTransfer.files)
  }

  const handleImageRemove = (id: string) => {
    setImages(images.filter((img) => img.id !== id))
  }

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required'
    }

    if (!formData.slug.trim()) {
      newErrors.slug = 'Slug is required'
    }

    if (!formData.categoryId) {
      newErrors.categoryId = 'Category is required'
    }

    if (!formData.price || parseFloat(formData.price) <= 0) {
      newErrors.price = 'Price must be greater than 0'
    }

    if (images.length === 0) {
      newErrors.images = 'At least one image is required'
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

      // Step 1: Upload all images
      const uploadedImages: Array<{ url: string; alt: string; order: number }> = []

      for (let i = 0; i < images.length; i++) {
        const image = images[i]
        const uploadFormData = new FormData()
        uploadFormData.append('file', image.file)

        const uploadRes = await fetch('/api/admin/uploads', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${adminApiKey}`,
          },
          body: uploadFormData,
        })

        if (!uploadRes.ok) {
          const error = await uploadRes.json()
          throw new Error(error.error || `Failed to upload image ${i + 1}`)
        }

        const uploadData = await uploadRes.json()
        uploadedImages.push({
          url: uploadData.url,
          alt: (formData.name || image.file.name).trim(),
          order: i,
        })
      }

      // Step 2: Create product with uploaded images
      const productRes = await fetch('/api/admin/products', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${adminApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          slug: formData.slug.trim(),
          description: formData.description.trim() || null,
          price: Math.round(parseFloat(formData.price) * 100), // Convert to cents
          categoryId: formData.categoryId,
          images: uploadedImages,
        }),
      })

      if (!productRes.ok) {
        const error = await productRes.json()
        throw new Error(error.error || 'Failed to create product')
      }

      // Step 3: Redirect to products list
      router.push('/admin/products')
      router.refresh()
    } catch (error: any) {
      console.error('Submit error:', error)
      alert(error.message || 'Error creating product')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden">
      <div className="p-6 space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto">
        {/* Product Name */}
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700 mb-2"
            style={{ fontFamily: 'var(--font-raleway)' }}
          >
            Product Name *
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

        {/* Slug */}
        <div>
          <label
            htmlFor="slug"
            className="block text-sm font-medium text-gray-700 mb-2"
            style={{ fontFamily: 'var(--font-raleway)' }}
          >
            Slug *
          </label>
          <input
            type="text"
            id="slug"
            value={formData.slug}
            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all ${
              errors.slug ? 'border-red-300' : 'border-gray-300'
            }`}
            style={{ fontFamily: 'var(--font-raleway)' }}
            required
          />
          {errors.slug && (
            <p className="mt-1 text-sm text-red-600" style={{ fontFamily: 'var(--font-raleway)' }}>
              {errors.slug}
            </p>
          )}
          <p className="mt-1 text-xs text-gray-500" style={{ fontFamily: 'var(--font-raleway)' }}>
            Auto-generated from name (editable)
          </p>
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
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={6}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
            style={{ fontFamily: 'var(--font-raleway)' }}
          />
        </div>

        {/* Price & Stock - 2 columns on desktop */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label
              htmlFor="price"
              className="block text-sm font-medium text-gray-700 mb-2"
              style={{ fontFamily: 'var(--font-raleway)' }}
            >
              Price (EUR) *
            </label>
            <input
              type="number"
              id="price"
              step="0.01"
              min="0.01"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all ${
                errors.price ? 'border-red-300' : 'border-gray-300'
              }`}
              style={{ fontFamily: 'var(--font-raleway)' }}
              required
            />
            {errors.price && (
              <p className="mt-1 text-sm text-red-600" style={{ fontFamily: 'var(--font-raleway)' }}>
                {errors.price}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="stock"
              className="block text-sm font-medium text-gray-700 mb-2"
              style={{ fontFamily: 'var(--font-raleway)' }}
            >
              Stock Quantity
            </label>
            <input
              type="number"
              id="stock"
              min="0"
              value={formData.stock}
              onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
              style={{ fontFamily: 'var(--font-raleway)' }}
            />
          </div>
        </div>

        {/* Category */}
        <div>
          <label
            htmlFor="categoryId"
            className="block text-sm font-medium text-gray-700 mb-2"
            style={{ fontFamily: 'var(--font-raleway)' }}
          >
            Category *
          </label>
          <select
            id="categoryId"
            value={formData.categoryId}
            onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all ${
              errors.categoryId ? 'border-red-300' : 'border-gray-300'
            }`}
            style={{ fontFamily: 'var(--font-raleway)' }}
            required
          >
            <option value="">Select a category</option>
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

        {/* Image Uploader */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: 'var(--font-raleway)' }}>
            Images * {images.length > 0 && <span className="text-gray-500">({images.length}/10)</span>}
          </label>
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all ${
              isDragging
                ? 'border-gray-900 bg-gray-50'
                : 'border-gray-300 hover:border-gray-400 bg-white'
            } ${errors.images ? 'border-red-300' : ''}`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => handleFileSelect(e.target.files)}
              className="hidden"
            />
            <div className="space-y-2">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 48 48"
              >
                <path
                  d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <p className="text-sm text-gray-600" style={{ fontFamily: 'var(--font-raleway)' }}>
                Drag & drop images here or click to select
              </p>
              <p className="text-xs text-gray-400" style={{ fontFamily: 'var(--font-raleway)' }}>
                Maximum 10 images
              </p>
            </div>
          </div>
          {errors.images && (
            <p className="mt-1 text-sm text-red-600" style={{ fontFamily: 'var(--font-raleway)' }}>
              {errors.images}
            </p>
          )}

          {/* Image Previews */}
          {images.length > 0 && (
            <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {images.map((image) => (
                <div key={image.id} className="relative group aspect-square">
                  <img
                    src={image.preview}
                    alt="Preview"
                    className="w-full h-full object-cover rounded-lg border border-gray-200"
                  />
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleImageRemove(image.id)
                    }}
                    className="absolute top-2 right-2 p-1.5 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Sticky Bottom Bar */}
      <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 flex items-center justify-end gap-4 shadow-lg">
        <button
          type="button"
          onClick={() => router.push('/admin/products')}
          className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
          style={{ fontFamily: 'var(--font-raleway)' }}
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          style={{ fontFamily: 'var(--font-raleway)' }}
        >
          {isSubmitting ? 'Saving...' : 'Save Product'}
        </button>
      </div>
    </form>
  )
}

