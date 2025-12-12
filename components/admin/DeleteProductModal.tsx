'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'

interface Product {
  id: string
  name: string
}

interface DeleteProductModalProps {
  product: Product
  onClose: () => void
}

export default function DeleteProductModal({ product, onClose }: DeleteProductModalProps) {
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    setIsDeleting(true)

    try {
      const adminApiKey = process.env.NEXT_PUBLIC_ADMIN_API_KEY || ''

      const res = await fetch(`/api/admin/products/${product.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${adminApiKey}`,
        },
      })

      if (!res.ok) {
        const error = await res.json()
        alert(error.error || 'Erreur lors de la suppression')
        return
      }

      router.refresh()
      onClose()
    } catch (error) {
      console.error('Delete error:', error)
      alert('Erreur lors de la suppression')
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/50"
          onClick={onClose}
        />
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="relative bg-white rounded-lg shadow-xl max-w-md w-full p-6"
        >
          <h2 className="text-xl font-bold text-gray-900 mb-4" style={{ fontFamily: 'var(--font-bodoni)' }}>
            Supprimer ce produit ?
          </h2>
          <p className="text-sm text-gray-600 mb-6" style={{ fontFamily: 'var(--font-raleway)' }}>
            Cette action est irréversible. Le produit "{product.name}" sera définitivement supprimé.
          </p>
          <div className="flex items-center justify-end gap-4">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
              style={{ fontFamily: 'var(--font-raleway)' }}
            >
              Annuler
            </button>
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              style={{ fontFamily: 'var(--font-raleway)' }}
            >
              {isDeleting ? 'Suppression...' : 'Supprimer'}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}


