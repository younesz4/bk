/**
 * Customer Details Page
 * Shows full customer profile: contact info, orders, refunds, notes
 */

'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import Link from 'next/link'

interface Order {
  id: string
  totalPrice: number
  status: string
  paymentMethod: string | null
  createdAt: string
}

interface Refund {
  id: string
  amount: number
  status: string
  reason: string
  createdAt: string
}

interface CustomerData {
  email: string
  customerName: string
  phone: string
  totalSpent: number
  orderCount: number
  orders: Order[]
  refunds: Refund[]
}

export default function CustomerDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const email = params.email as string
  const [customer, setCustomer] = useState<CustomerData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (email) {
      fetchCustomerDetails()
    }
  }, [email])

  const fetchCustomerDetails = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/admin/customers/${encodeURIComponent(email)}`)
      if (response.ok) {
        const data = await response.json()
        setCustomer(data.customer)
      }
    } catch (error) {
      console.error('Error fetching customer details:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-neutral-600 dark:text-neutral-400">Chargement...</p>
      </div>
    )
  }

  if (!customer) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-neutral-600 dark:text-neutral-400">Client non trouvé</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <button
            onClick={() => router.back()}
            className="mb-4 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors"
          >
            ← Retour
          </button>
          <h1
            className="text-3xl font-light text-neutral-900 dark:text-white mb-2"
            style={{ fontFamily: 'var(--font-bodoni)' }}
          >
            {customer.customerName}
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400" style={{ fontFamily: 'var(--font-raleway)' }}>
            {customer.email}
          </p>
        </div>
      </div>

      {/* Customer Info Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm border border-neutral-200 dark:border-neutral-700 p-6"
      >
        <h2
          className="text-xl font-light text-neutral-900 dark:text-white mb-4"
          style={{ fontFamily: 'var(--font-bodoni)' }}
        >
          Informations de contact
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-1" style={{ fontFamily: 'var(--font-raleway)' }}>
              Email
            </p>
            <p className="text-neutral-900 dark:text-white" style={{ fontFamily: 'var(--font-raleway)' }}>
              {customer.email}
            </p>
          </div>
          <div>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-1" style={{ fontFamily: 'var(--font-raleway)' }}>
              Téléphone
            </p>
            <p className="text-neutral-900 dark:text-white" style={{ fontFamily: 'var(--font-raleway)' }}>
              {customer.phone || '—'}
            </p>
          </div>
          <div>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-1" style={{ fontFamily: 'var(--font-raleway)' }}>
              Total dépensé
            </p>
            <p className="text-lg font-medium text-neutral-900 dark:text-white" style={{ fontFamily: 'var(--font-raleway)' }}>
              {new Intl.NumberFormat('fr-FR', {
                style: 'currency',
                currency: 'EUR',
              }).format(customer.totalSpent / 100)}
            </p>
          </div>
          <div>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-1" style={{ fontFamily: 'var(--font-raleway)' }}>
              Nombre de commandes
            </p>
            <p className="text-lg font-medium text-neutral-900 dark:text-white" style={{ fontFamily: 'var(--font-raleway)' }}>
              {customer.orderCount}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Orders */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm border border-neutral-200 dark:border-neutral-700 p-6"
      >
        <h2
          className="text-xl font-light text-neutral-900 dark:text-white mb-4"
          style={{ fontFamily: 'var(--font-bodoni)' }}
        >
          Commandes ({customer.orders.length})
        </h2>
        {customer.orders.length === 0 ? (
          <p className="text-neutral-600 dark:text-neutral-400">Aucune commande</p>
        ) : (
          <div className="space-y-3">
            {customer.orders.map((order) => (
              <Link
                key={order.id}
                href={`/admin/orders/${order.id}`}
                className="block p-4 border border-neutral-200 dark:border-neutral-700 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-neutral-900 dark:text-white" style={{ fontFamily: 'var(--font-raleway)' }}>
                      Commande #{order.id.substring(0, 8)}
                    </p>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400" style={{ fontFamily: 'var(--font-raleway)' }}>
                      {new Date(order.createdAt).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-neutral-900 dark:text-white" style={{ fontFamily: 'var(--font-raleway)' }}>
                      {new Intl.NumberFormat('fr-FR', {
                        style: 'currency',
                        currency: 'EUR',
                      }).format(order.totalPrice / 100)}
                    </p>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400" style={{ fontFamily: 'var(--font-raleway)' }}>
                      {order.status}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </motion.div>

      {/* Refunds */}
      {customer.refunds.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm border border-neutral-200 dark:border-neutral-700 p-6"
        >
          <h2
            className="text-xl font-light text-neutral-900 dark:text-white mb-4"
            style={{ fontFamily: 'var(--font-bodoni)' }}
          >
            Remboursements ({customer.refunds.length})
          </h2>
          <div className="space-y-3">
            {customer.refunds.map((refund) => (
              <div
                key={refund.id}
                className="p-4 border border-neutral-200 dark:border-neutral-700 rounded-lg"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-neutral-900 dark:text-white" style={{ fontFamily: 'var(--font-raleway)' }}>
                      {new Intl.NumberFormat('fr-FR', {
                        style: 'currency',
                        currency: 'EUR',
                      }).format(refund.amount / 100)}
                    </p>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400" style={{ fontFamily: 'var(--font-raleway)' }}>
                      {refund.reason}
                    </p>
                  </div>
                  <div className="text-right">
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        refund.status === 'processed'
                          ? 'bg-green-100 text-green-800'
                          : refund.status === 'approved'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {refund.status}
                    </span>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1" style={{ fontFamily: 'var(--font-raleway)' }}>
                      {new Date(refund.createdAt).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  )
}




