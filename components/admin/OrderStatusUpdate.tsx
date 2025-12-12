'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface OrderStatusUpdateProps {
  orderId: string
  currentStatus: string
}

const allowedStatuses = ['PENDING', 'PAID', 'SHIPPED', 'DELIVERED', 'CANCELLED'] as const

export default function OrderStatusUpdate({ orderId, currentStatus }: OrderStatusUpdateProps) {
  const router = useRouter()
  const [selectedStatus, setSelectedStatus] = useState<string>(currentStatus || 'PENDING')
  const [isUpdating, setIsUpdating] = useState(false)
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  const handleUpdate = async () => {
    setIsUpdating(true)
    setToastMessage(null)

    try {
      const adminApiKey = process.env.NEXT_PUBLIC_ADMIN_API_KEY || ''

      const res = await fetch(`/api/admin/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${adminApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: selectedStatus }),
      })

      if (!res.ok) {
        const error = await res.json()
        setToastMessage(error.error || 'Failed to update status')
        return
      }

      setToastMessage('Status updated successfully!')
      router.refresh()

      // Clear toast after 3 seconds
      setTimeout(() => {
        setToastMessage(null)
      }, 3000)
    } catch (error) {
      console.error('Update status error:', error)
      setToastMessage('Failed to update status')
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <label
          htmlFor="status-select"
          className="block text-sm font-medium text-gray-700 mb-2"
          style={{ fontFamily: 'var(--font-raleway)' }}
        >
          Status
        </label>
        <select
          id="status-select"
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
          style={{ fontFamily: 'var(--font-raleway)' }}
        >
          {allowedStatuses.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      </div>

      <button
        onClick={handleUpdate}
        disabled={isUpdating || selectedStatus === currentStatus}
        className="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        style={{ fontFamily: 'var(--font-raleway)' }}
      >
        {isUpdating ? 'Saving...' : 'Save Status'}
      </button>

      {toastMessage && (
        <div
          className={`p-4 rounded-lg ${
            toastMessage.includes('success')
              ? 'bg-green-50 text-green-800 border border-green-200'
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}
          style={{ fontFamily: 'var(--font-raleway)' }}
        >
          {toastMessage}
        </div>
      )}
    </div>
  )
}


