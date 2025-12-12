'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'

interface OrderItem {
  id: string
  quantity: number
  price: number
  product: {
    id: string
    name: string
    slug: string
    category: {
      name: string
    }
    images: Array<{
      url: string
    }>
  }
}

interface Order {
  id: string
  customerName: string | null
  customerEmail: string | null
  phone: string | null
  amount: number
  total: number
  status: string
  paymentMethod?: string
  stripeSessionId: string | null
  createdAt: string | Date
  orderItems?: OrderItem[]
  items?: OrderItem[]
}

interface AdminOrdersTableProps {
  orders: Order[]
}

const allowedStatuses = ['PENDING', 'PAID', 'SHIPPED', 'DELIVERED', 'CANCELLED'] as const

export default function AdminOrdersTable({ orders }: AdminOrdersTableProps) {
  const router = useRouter()
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [newStatus, setNewStatus] = useState<string>('')
  const [isUpdating, setIsUpdating] = useState(false)

  const formatOrderId = (id: string) => {
    return id.substring(0, 6) + '...'
  }

  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
    }).format(amount / 100)
  }

  const getStatusColor = (status: string) => {
    switch (status?.toUpperCase()) {
      case 'PENDING':
        return 'bg-yellow-50 text-yellow-700 border-yellow-200'
      case 'PAID':
        return 'bg-green-50 text-green-700 border-green-200'
      case 'SHIPPED':
        return 'bg-blue-50 text-blue-700 border-blue-200'
      case 'DELIVERED':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200'
      case 'CANCELLED':
        return 'bg-red-50 text-red-700 border-red-200'
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200'
    }
  }

  const handleUpdateStatus = async () => {
    if (!selectedOrder || !newStatus) return

    setIsUpdating(true)

    try {
      const adminApiKey = process.env.NEXT_PUBLIC_ADMIN_API_KEY || ''

      const res = await fetch(`/api/admin/orders/${selectedOrder.id}/status`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${adminApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      })

      if (!res.ok) {
        const error = await res.json()
        alert(error.error || 'Failed to update status')
        return
      }

      setSelectedOrder(null)
      setNewStatus('')
      router.refresh()
    } catch (error) {
      console.error('Update status error:', error)
      alert('Failed to update status')
    } finally {
      setIsUpdating(false)
    }
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        Aucune commande trouvée
      </div>
    )
  }

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead className="bg-gray-50 sticky top-0">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700 border-b border-gray-200" style={{ fontFamily: 'var(--font-raleway)' }}>
                  Order ID
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700 border-b border-gray-200" style={{ fontFamily: 'var(--font-raleway)' }}>
                  Customer
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700 border-b border-gray-200" style={{ fontFamily: 'var(--font-raleway)' }}>
                  Email
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700 border-b border-gray-200" style={{ fontFamily: 'var(--font-raleway)' }}>
                  Payment
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700 border-b border-gray-200" style={{ fontFamily: 'var(--font-raleway)' }}>
                  Total
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700 border-b border-gray-200" style={{ fontFamily: 'var(--font-raleway)' }}>
                  Status
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700 border-b border-gray-200" style={{ fontFamily: 'var(--font-raleway)' }}>
                  Date
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700 border-b border-gray-200" style={{ fontFamily: 'var(--font-raleway)' }}>
                  Manage
                </th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr
                  key={order.id}
                  className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 text-sm text-gray-900 font-mono" style={{ fontFamily: 'var(--font-raleway)' }}>
                    {formatOrderId(order.id)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900" style={{ fontFamily: 'var(--font-raleway)' }}>
                    {order.customerName || '-'}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900" style={{ fontFamily: 'var(--font-raleway)' }}>
                    {order.customerEmail || '-'}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900" style={{ fontFamily: 'var(--font-raleway)' }}>
                    {order.paymentMethod || (order.stripeSessionId ? 'Stripe' : 'COD')}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900" style={{ fontFamily: 'var(--font-raleway)' }}>
                    {formatCurrency(order.amount || order.total || 0)}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`} style={{ fontFamily: 'var(--font-raleway)' }}>
                      {order.status || 'PENDING'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500" style={{ fontFamily: 'var(--font-raleway)' }}>
                    {formatDate(order.createdAt)}
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => {
                        setSelectedOrder(order)
                        setNewStatus(order.status || 'PENDING')
                      }}
                      className="px-3 py-1 bg-gray-900 text-white text-xs rounded hover:bg-gray-800 transition-colors"
                      style={{ fontFamily: 'var(--font-raleway)' }}
                    >
                      Manage
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <AnimatePresence>
        {selectedOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/50"
              onClick={() => setSelectedOrder(null)}
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative bg-white rounded-lg shadow-xl max-w-md w-full p-6"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-4" style={{ fontFamily: 'var(--font-bodoni)' }}>
                Update Order Status
              </h2>
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: 'var(--font-raleway)' }}>
                    Status
                  </label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                    style={{ fontFamily: 'var(--font-raleway)' }}
                  >
                    {allowedStatuses.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex items-center justify-end gap-4">
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
                  style={{ fontFamily: 'var(--font-raleway)' }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateStatus}
                  disabled={isUpdating}
                  className="px-4 py-2 bg-gray-900 text-white rounded hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  style={{ fontFamily: 'var(--font-raleway)' }}
                >
                  {isUpdating ? 'Updating...' : 'Update Status'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}
