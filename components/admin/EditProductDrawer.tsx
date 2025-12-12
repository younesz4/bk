'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'

interface Category {
  id: string
  name: string
}

interface ProductImage {
  id: string
  url: string
}

interface Product {
  id: string
  name: string
  slug: string
  category: Category
  price: number
  stock: number
  description: string
  images: ProductImage[]
  createdAt: string
}

interface EditProductDrawerProps {
  product: Product
  categories: Category[]
  onClose: () => void
}

export default function EditProductDrawer({ product, categories, onClose }: EditProductDrawerProps) {
  const router = useRouter()
  const [isSaving, setIsSaving] = useState(false)
  const [formData, setFormData] = useState({
    name: product.name || '',
    categoryId: product.category?.id || '',
    price: product.price ? (product.price / 100).toString() : '',
    stock: product.stock?.toString() || '0',
    description: product.description || '',
  })
  const [images, setImages] = useState<ProductImage[]>(product.images || [])
  const [uploadingImage, setUploadingImage] = useState(false)

  const handleSave = async () => {
    setIsSaving(true)

    try {
      const adminApiKey = process.env.NEXT_PUBLIC_ADMIN_API_KEY || ''

      const res = await fetch(`/api/admin/products/${product.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${adminApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          categoryId: formData.categoryId,
          price: Math.round(parseFloat(formData.price) * 100),
          stock: parseInt(formData.stock, 10),
          description: formData.description,
        }),
      })

      if (!res.ok) {
        const error = await res.json()
        alert(error.error || 'Erreur lors de la sauvegarde')
        return
      }

      router.refresh()
      onClose()
    } catch (error) {
      console.error('Save error:', error)
      alert('Erreur lors de la sauvegarde')
    } finally {
      setIsSaving(false)
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadingImage(true)

    try {
      const formData = new FormData()
      formData.append('image', file)

      const adminApiKey = process.env.NEXT_PUBLIC_ADMIN_API_KEY || ''

      const res = await fetch(`/api/admin/products/${product.id}/images`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${adminApiKey}`,
        },
        body: formData,
      })

      if (!res.ok) {
        alert('Erreur lors de l\'upload')
        return
      }

      const newImage = await res.json()
      setImages([...images, newImage])
      router.refresh()
    } catch (error) {
      console.error('Upload error:', error)
      alert('Erreur lors de l\'upload')
    } finally {
      setUploadingImage(false)
      e.target.value = ''
    }
  }

  const handleImageDelete = async (imageId: string) => {
    if (!confirm('Supprimer cette image ?')) return

    try {
      const adminApiKey = process.env.NEXT_PUBLIC_ADMIN_API_KEY || ''

      const res = await fetch(`/api/admin/products/${product.id}/images/${imageId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${adminApiKey}`,
        },
      })

      if (!res.ok) {
        alert('Erreur lors de la suppression')
        return
      }

      setImages(images.filter(img => img.id !== imageId))
      router.refresh()
    } catch (error) {
      console.error('Delete image error:', error)
      alert('Erreur lors de la suppression')
    }
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-hidden">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/50"
          onClick={onClose}
        />
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 30, stiffness: 300 }}
          className="absolute right-0 top-0 h-full w-full max-w-2xl bg-white shadow-xl"
        >
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'var(--font-bodoni)' }}>
                Modifier le produit
              </h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: 'var(--font-raleway)' }}>
                  Nom du produit
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                  style={{ fontFamily: 'var(--font-raleway)' }}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: 'var(--font-raleway)' }}>
                  Catégorie
                </label>
                <select
                  value={formData.categoryId}
                  onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-gray-900 focus:border-transparent"
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

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: 'var(--font-raleway)' }}>
                    Prix (€)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                    style={{ fontFamily: 'var(--font-raleway)' }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: 'var(--font-raleway)' }}>
                    Stock
                  </label>
                  <input
                    type="number"
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
                <label className="block text-sm font-medium text-gray-700 mb-4" style={{ fontFamily: 'var(--font-raleway)' }}>
                  Images
                </label>
                <div className="grid grid-cols-4 gap-4 mb-4">
                  {images.map((image) => (
                    <div key={image.id} className="relative group">
                      <img
                        src={image.url}
                        alt="Product"
                        className="w-full aspect-square object-cover rounded border border-gray-200"
                      />
                      <button
                        onClick={() => handleImageDelete(image.id)}
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
                <label className="block">
                  <span className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors cursor-pointer inline-block text-sm" style={{ fontFamily: 'var(--font-raleway)' }}>
                    {uploadingImage ? 'Upload...' : 'Ajouter une image'}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={uploadingImage}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            <div className="flex items-center justify-end gap-4 p-6 border-t border-gray-200">
              <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
                style={{ fontFamily: 'var(--font-raleway)' }}
              >
                Annuler
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="px-4 py-2 bg-gray-900 text-white rounded hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                style={{ fontFamily: 'var(--font-raleway)' }}
              >
                {isSaving ? 'Enregistrement...' : 'Enregistrer'}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}


