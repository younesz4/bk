'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

interface OrderDetailsClientProps {
  orderId: string
}

export default function OrderDetailsClient({ orderId }: OrderDetailsClientProps) {
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (!confirm('Supprimer cette commande ?')) {
      return
    }

    setIsDeleting(true)

    try {
      const adminApiKey = process.env.NEXT_PUBLIC_ADMIN_API_KEY || ''
      
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${adminApiKey}`,
        },
      })

      if (!res.ok) {
        alert('Erreur lors de la suppression')
        return
      }

      router.push('/admin/orders')
    } catch (error) {
      console.error('Delete error:', error)
      alert('Erreur lors de la suppression')
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
    >
      {isDeleting ? 'Suppression...' : 'Supprimer la commande'}
    </button>
  )
}


