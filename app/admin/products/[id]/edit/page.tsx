'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Image from 'next/image'
import Toast from '@/components/Toast'
import ConfirmModal from '@/components/ConfirmModal'

interface Category {
  id: string
  name: string
  slug: string
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
  description: string | null
  price: number
  stock: number
  categoryId: string
  images: ProductImage[]
}

interface ImagePreview {
  file: File
  preview: string
  order: number
}

export default function EditProductPage() {
  const router = useRouter()
  const params = useParams()
  const productId = params.id as string

  const [product, setProduct] = useState<Product | null>(null)
  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [stock, setStock] = useState('0')
  const [categoryId, setCategoryId] = useState('')
  const [categories, setCategories] = useState<Category[]>([])
  const [existingImages, setExistingImages] = useState<ProductImage[]>([])
  const [newImages, setNewImages] = useState<ImagePreview[]>([])
  const [deletedImageIds, setDeletedImageIds] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [deleting, setDeleting] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  // Fetch product and categories
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productRes, categoriesRes] = await Promise.all([
          fetch(`/api/admin/products/${productId}`, {
            credentials: 'include', // Include cookies for auth
          }),
          fetch('/api/admin/categories', {
            credentials: 'include', // Include cookies for auth
          }),
        ])

        if (!productRes.ok) {
          throw new Error('Failed to fetch product')
        }

        const productData = await productRes.json()
        const categoriesData = await categoriesRes.json()

        // Handle different response formats
        const p = productData.data || productData.product
        if (p) {
          setProduct(p)
          setName(p.name)
          setSlug(p.slug)
          setDescription(p.description || '')
          setPrice((p.price / 100).toFixed(2))
          setStock((p.stock || 0).toString())
          setCategoryId(p.categoryId)
          setExistingImages(p.images || [])
        }

        if (categoriesData.categories) {
          setCategories(categoriesData.categories)
        }
      } catch (error) {
        console.error('Error fetching data:', error)
        setToast({ message: 'Failed to load product data', type: 'error' })
      } finally {
        setFetching(false)
      }
    }

    if (productId) {
      fetchData()
    }
  }, [productId])

  // Auto-regenerate slug from name (only if slug hasn't been manually edited)
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false)
  useEffect(() => {
    if (name && !slugManuallyEdited) {
      const generatedSlug = name
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '')
      setSlug(generatedSlug)
    }
  }, [name, slugManuallyEdited])

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSlug(e.target.value)
    setSlugManuallyEdited(true)
  }

  const handleNewImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    const currentMaxOrder = Math.max(
      ...existingImages.map((img) => img.order),
      ...newImages.map((img) => img.order),
      -1
    )
    const newImagePreviews: ImagePreview[] = files.map((file, index) => ({
      file,
      preview: URL.createObjectURL(file),
      order: currentMaxOrder + index + 1,
    }))
    setNewImages([...newImages, ...newImagePreviews])
  }

  const removeExistingImage = (imageId: string) => {
    setExistingImages(existingImages.filter((img) => img.id !== imageId))
    setDeletedImageIds([...deletedImageIds, imageId])
  }

  const removeNewImage = (index: number) => {
    const image = newImages[index]
    URL.revokeObjectURL(image.preview)
    setNewImages(newImages.filter((_, i) => i !== index))
  }

  const moveImageUp = (type: 'existing' | 'new', index: number) => {
    if (type === 'existing') {
      if (index === 0) return
      const newImages = [...existingImages]
      ;[newImages[index - 1], newImages[index]] = [newImages[index], newImages[index - 1]]
      setExistingImages(newImages)
    } else {
      if (index === 0) return
      const newImagesList = [...newImages]
      ;[newImagesList[index - 1], newImagesList[index]] = [newImagesList[index], newImagesList[index - 1]]
      setNewImages(newImagesList)
    }
  }

  const moveImageDown = (type: 'existing' | 'new', index: number) => {
    if (type === 'existing') {
      if (index === existingImages.length - 1) return
      const newImages = [...existingImages]
      ;[newImages[index], newImages[index + 1]] = [newImages[index + 1], newImages[index]]
      setExistingImages(newImages)
    } else {
      if (index === newImages.length - 1) return
      const newImagesList = [...newImages]
      ;[newImagesList[index], newImagesList[index + 1]] = [newImagesList[index + 1], newImagesList[index]]
      setNewImages(newImagesList)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Validation
    if (!name || !slug || !price || !categoryId) {
      setToast({ message: 'Please fill in all required fields', type: 'error' })
      setLoading(false)
      return
    }

    if (existingImages.length + newImages.length === 0) {
      setToast({ message: 'Please keep at least one image', type: 'error' })
      setLoading(false)
      return
    }

    try {
      const formData = new FormData()
      formData.append('name', name)
      formData.append('slug', slug)
      formData.append('description', description)
      formData.append('price', price)
      formData.append('stock', stock)
      formData.append('categoryId', categoryId)
      formData.append('deletedImageIds', JSON.stringify(deletedImageIds))

      // Build image orders object
      const imageOrders: Record<string, number> = {}
      existingImages.forEach((img, index) => {
        imageOrders[img.id] = index
      })
      formData.append('imageOrders', JSON.stringify(imageOrders))

      // Append new images
      newImages.forEach((img) => {
        formData.append('newImages', img.file)
      })

      const res = await fetch(`/api/admin/products/${productId}`, {
        method: 'PUT',
        credentials: 'include', // Include cookies for auth
        body: formData,
      })

      const data = await res.json()

      if (res.ok) {
        setToast({ message: 'Product updated successfully!', type: 'success' })
        setTimeout(() => {
          router.push('/admin/products')
        }, 1500)
      } else {
        setToast({ message: data.error || 'Error updating product', type: 'error' })
        setLoading(false)
      }
    } catch (error) {
      console.error('Error submitting form:', error)
      setToast({ message: 'An error occurred. Please try again.', type: 'error' })
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    setDeleting(true)
    try {
      const res = await fetch(`/api/admin/products/${productId}`, {
        method: 'DELETE',
      })

      const data = await res.json()

      if (res.ok) {
        setToast({ message: 'Produit supprimé avec succès.', type: 'success' })
        setTimeout(() => {
          router.push('/admin/products')
        }, 1500)
      } else {
        setToast({ message: data.error || 'Erreur lors de la suppression', type: 'error' })
        setDeleting(false)
      }
    } catch (error) {
      console.error('Error deleting product:', error)
      setToast({ message: 'Une erreur est survenue. Veuillez réessayer.', type: 'error' })
      setDeleting(false)
    }
  }

  if (fetching) {
    return (
      <div className="min-h-screen bg-gray-50 p-8 flex items-center justify-center">
        <div className="text-lg text-gray-600">Loading...</div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 p-8 flex items-center justify-center">
        <div className="text-lg text-red-600">Product not found</div>
      </div>
    )
  }

  const allImages = [...existingImages, ...newImages]

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-frost rounded-lg shadow-sm p-8">
          <h1 className="text-3xl font-semibold mb-8">Edit Product</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition"
                required
                placeholder="e.g., Modern Chair"
              />
            </div>

            {/* Slug */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                URL Slug <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={slug}
                onChange={handleSlugChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition"
                required
                placeholder="e.g., modern-chair"
              />
              <p className="mt-1 text-xs text-gray-500">Auto-generated from name. You can edit it.</p>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={6}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition resize-none"
                placeholder="Product description..."
              />
            </div>

            {/* Price and Stock */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price (€) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition"
                  required
                  placeholder="0.00"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Stock Quantity
                </label>
                <input
                  type="number"
                  min="0"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition"
                  placeholder="0"
                />
              </div>
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition"
                required
              >
                <option value="">Select a category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Images Section */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Images <span className="text-red-500">*</span>
              </label>

              {/* Existing Images */}
              {existingImages.length > 0 && (
                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-2">Existing Images</p>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {existingImages.map((img, index) => (
                      <div
                        key={img.id}
                        className="relative border border-gray-200 rounded-lg overflow-hidden bg-gray-100"
                      >
                        <div className="aspect-square relative">
                          <Image
                            src={img.url}
                            alt={img.alt || `Image ${index + 1}`}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="absolute top-2 right-2 flex gap-1">
                          <button
                            type="button"
                            onClick={() => moveImageUp('existing', index)}
                            disabled={index === 0}
                            className="bg-black/70 text-white px-2 py-1 rounded text-xs hover:bg-black transition disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Move up"
                          >
                            ↑
                          </button>
                          <button
                            type="button"
                            onClick={() => moveImageDown('existing', index)}
                            disabled={index === existingImages.length - 1}
                            className="bg-black/70 text-white px-2 py-1 rounded text-xs hover:bg-black transition disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Move down"
                          >
                            ↓
                          </button>
                          <button
                            type="button"
                            onClick={() => removeExistingImage(img.id)}
                            className="bg-red-500/70 text-white px-2 py-1 rounded text-xs hover:bg-red-500 transition"
                            title="Remove"
                          >
                            ×
                          </button>
                        </div>
                        <div className="absolute bottom-2 left-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
                          #{index + 1}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* New Images */}
              {newImages.length > 0 && (
                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-2">New Images</p>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {newImages.map((img, index) => (
                      <div
                        key={index}
                        className="relative border border-gray-200 rounded-lg overflow-hidden bg-gray-100"
                      >
                        <div className="aspect-square relative">
                          <Image
                            src={img.preview}
                            alt={`New image ${index + 1}`}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="absolute top-2 right-2 flex gap-1">
                          <button
                            type="button"
                            onClick={() => moveImageUp('new', index)}
                            disabled={index === 0}
                            className="bg-black/70 text-white px-2 py-1 rounded text-xs hover:bg-black transition disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Move up"
                          >
                            ↑
                          </button>
                          <button
                            type="button"
                            onClick={() => moveImageDown('new', index)}
                            disabled={index === newImages.length - 1}
                            className="bg-black/70 text-white px-2 py-1 rounded text-xs hover:bg-black transition disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Move down"
                          >
                            ↓
                          </button>
                          <button
                            type="button"
                            onClick={() => removeNewImage(index)}
                            className="bg-red-500/70 text-white px-2 py-1 rounded text-xs hover:bg-red-500 transition"
                            title="Remove"
                          >
                            ×
                          </button>
                        </div>
                        <div className="absolute bottom-2 left-2 bg-blue-500/70 text-white px-2 py-1 rounded text-xs">
                          New #{existingImages.length + index + 1}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Upload New Images */}
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleNewImageSelect}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition"
              />
              <p className="mt-1 text-xs text-gray-500">
                Upload new images. Use the arrows to reorder all images.
              </p>
            </div>

            {/* Submit Buttons */}
            <div className="flex gap-4 pt-4 border-t border-gray-200">
              <button
                type="submit"
                disabled={loading || deleting}
                className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
              <button
                type="button"
                onClick={() => router.back()}
                disabled={loading || deleting}
                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <div className="flex-1" />
              <button
                type="button"
                onClick={() => setShowDeleteModal(true)}
                disabled={loading || deleting}
                className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                Delete Product
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        title="Delete Product"
        message="Are you sure you want to delete this product? This action is permanent and cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        confirmButtonClass="bg-red-600 hover:bg-red-700"
      />

      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  )
}

