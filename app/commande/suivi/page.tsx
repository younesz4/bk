'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'

interface Order {
  id: string
  customerName: string
  email: string
  phone: string
  address: string
  city: string
  country: string
  totalPrice: number
  status: string
  paymentMethod: string | null
  createdAt: string
  items: Array<{
    product: {
      name: string
      price: number
    }
    quantity: number
    price: number
  }>
}

const statusSteps = [
  { key: 'pending_payment', label: 'Reçue', description: 'Votre commande a été reçue' },
  { key: 'paid', label: 'Paiement validé', description: 'Votre paiement a été confirmé' },
  { key: 'preparing', label: 'Préparation', description: 'Votre commande est en cours de préparation' },
  { key: 'shipped', label: 'Expédiée', description: 'Votre commande a été expédiée' },
  { key: 'delivered', label: 'Livrée', description: 'Votre commande a été livrée' },
]

export default function TrackOrderPage() {
  const [email, setEmail] = useState('')
  const [orderId, setOrderId] = useState('')
  const [order, setOrder] = useState<Order | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      const response = await fetch('/api/orders/track', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, orderId }),
      })

      if (response.ok) {
        const data = await response.json()
        setOrder(data.order)
      } else {
        const errorData = await response.json()
        setError(errorData.error || 'Commande introuvable ou email incorrect')
        setOrder(null)
      }
    } catch (err) {
      console.error('Error tracking order:', err)
      setError('Erreur lors de la recherche de la commande')
      setOrder(null)
    } finally {
      setIsLoading(false)
    }
  }

  const getCurrentStepIndex = () => {
    if (!order) return -1

    const statusMap: Record<string, number> = {
      pending_payment: 0,
      pending_cod: 0,
      paid: 1,
      preparing: 2,
      shipped: 3,
      delivered: 4,
    }

    return statusMap[order.status] ?? 0
  }

  return (
    <div className="min-h-screen bg-[#f7f5f2] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1
            className="text-4xl md:text-5xl font-light mb-4 tracking-wider"
            style={{ fontFamily: 'var(--font-bodoni)' }}
          >
            Suivi de commande
          </h1>
          <p
            className="text-neutral-600 text-lg"
            style={{ fontFamily: 'var(--font-raleway)' }}
          >
            Entrez votre email et le numéro de commande pour suivre votre commande
          </p>
        </motion.div>

        {/* Search Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-sm border border-neutral-200 p-8 mb-8"
        >
          <form onSubmit={handleTrack} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-neutral-700 mb-2"
                style={{ fontFamily: 'var(--font-raleway)' }}
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                style={{ fontFamily: 'var(--font-raleway)' }}
                placeholder="votre@email.com"
              />
            </div>

            <div>
              <label
                htmlFor="orderId"
                className="block text-sm font-medium text-neutral-700 mb-2"
                style={{ fontFamily: 'var(--font-raleway)' }}
              >
                Numéro de commande
              </label>
              <input
                type="text"
                id="orderId"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                required
                className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent font-mono"
                style={{ fontFamily: 'var(--font-raleway)' }}
                placeholder="12345678"
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-700 text-sm" style={{ fontFamily: 'var(--font-raleway)' }}>
                  {error}
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full px-6 py-4 bg-black text-white uppercase tracking-wider text-sm font-light hover:bg-neutral-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
              style={{ fontFamily: 'var(--font-raleway)' }}
            >
              {isLoading ? 'Recherche...' : 'Rechercher'}
            </button>
          </form>
        </motion.div>

        {/* Order Details */}
        {order && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl shadow-sm border border-neutral-200 p-8"
          >
            {/* Order Info */}
            <div className="mb-8 pb-8 border-b border-neutral-200">
              <h2
                className="text-2xl font-light mb-4 tracking-wider"
                style={{ fontFamily: 'var(--font-bodoni)' }}
              >
                Commande #{order.id.substring(0, 8)}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm" style={{ fontFamily: 'var(--font-raleway)' }}>
                <div>
                  <p className="text-neutral-600">Date</p>
                  <p className="text-neutral-900 font-medium">
                    {new Date(order.createdAt).toLocaleDateString('fr-FR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-neutral-600">Total</p>
                  <p className="text-neutral-900 font-medium">
                    {new Intl.NumberFormat('fr-FR', {
                      style: 'currency',
                      currency: 'MAD',
                    }).format(order.totalPrice / 100)}
                  </p>
                </div>
              </div>
            </div>

            {/* Status Timeline */}
            <div className="mb-8">
              <h3
                className="text-xl font-light mb-6 tracking-wider"
                style={{ fontFamily: 'var(--font-bodoni)' }}
              >
                Statut de la commande
              </h3>
              <div className="space-y-6">
                {statusSteps.map((step, index) => {
                  const currentStepIndex = getCurrentStepIndex()
                  const isCompleted = index <= currentStepIndex
                  const isCurrent = index === currentStepIndex

                  return (
                    <div key={step.key} className="flex items-start gap-4">
                      {/* Timeline dot */}
                      <div className="flex-shrink-0">
                        <div
                          className={`w-12 h-12 rounded-full flex items-center justify-center border-2 ${
                            isCompleted
                              ? 'bg-black border-black text-white'
                              : 'bg-white border-neutral-300 text-neutral-400'
                          }`}
                        >
                          {isCompleted ? (
                            <svg
                              className="w-6 h-6"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          ) : (
                            <span className="text-sm font-medium">{index + 1}</span>
                          )}
                        </div>
                      </div>

                      {/* Content */}
                      <div className="flex-1 pt-2">
                        <h4
                          className={`text-base font-medium mb-1 ${
                            isCompleted ? 'text-black' : 'text-neutral-400'
                          }`}
                          style={{ fontFamily: 'var(--font-raleway)' }}
                        >
                          {step.label}
                        </h4>
                        <p
                          className={`text-sm ${
                            isCompleted ? 'text-neutral-600' : 'text-neutral-400'
                          }`}
                          style={{ fontFamily: 'var(--font-raleway)' }}
                        >
                          {step.description}
                        </p>
                        {isCurrent && (
                          <p
                            className="text-xs text-neutral-500 mt-2"
                            style={{ fontFamily: 'var(--font-raleway)' }}
                          >
                            En cours
                          </p>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Items */}
            <div className="border-t border-neutral-200 pt-8">
              <h3
                className="text-xl font-light mb-6 tracking-wider"
                style={{ fontFamily: 'var(--font-bodoni)' }}
              >
                Articles commandés
              </h3>
              <div className="space-y-4">
                {order.items.map((item, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center py-4 border-b border-neutral-100 last:border-0"
                  >
                    <div style={{ fontFamily: 'var(--font-raleway)' }}>
                      <p className="text-neutral-900 font-medium">{item.product.name}</p>
                      <p className="text-sm text-neutral-600">Quantité: {item.quantity}</p>
                    </div>
                    <p
                      className="text-neutral-900 font-medium"
                      style={{ fontFamily: 'var(--font-raleway)' }}
                    >
                      {new Intl.NumberFormat('fr-FR', {
                        style: 'currency',
                        currency: 'MAD',
                      }).format((item.price / 100) * item.quantity)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}




