'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'

interface OrderItem {
  id: string
  quantity: number
  unitPrice: number
  subtotal: number
  product: {
    id: string
    name: string
    images: Array<{ url: string; alt: string | null }>
    category: {
      name: string
    }
  }
}

interface Order {
  id: string
  customerName: string
  customerEmail: string
  customerPhone: string | null
  addressLine1: string
  addressLine2: string | null
  city: string
  postalCode: string | null
  country: string
  notes: string | null
  totalAmount: number
  currency: string
  status: string
  paymentMethod: string
  createdAt: string
  items: OrderItem[]
}

export default function AdminOrderDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const orderId = params.id as string

  const [order, setOrder] = useState<Order | null>(null)
  const [status, setStatus] = useState<string>('PENDING')
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchOrder()
  }, [orderId])

  const fetchOrder = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/admin/orders/${orderId}`)
      if (response.ok) {
        const data = await response.json()
        setOrder(data.order)
        setStatus(data.order.status || 'New')
      } else {
        setError('Commande non trouvée')
      }
    } catch (err) {
      console.error('Error fetching order:', err)
      setError('Erreur lors du chargement')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSave = async () => {
    if (!order) return

    setIsSaving(true)
    setError(null)

    try {
      const response = await fetch(`/api/admin/orders/${order.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      })

      if (response.ok) {
        const data = await response.json()
        setOrder(data.order)
        alert('Statut mis à jour avec succès')
      } else {
        const error = await response.json()
        setError(error.error || 'Erreur lors de la mise à jour')
      }
    } catch (err: any) {
      console.error('Error updating order:', err)
      setError('Erreur lors de la mise à jour')
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async () => {
    setIsDeleting(true)
    setError(null)

    try {
      const response = await fetch('/api/admin/orders/delete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: orderId,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        router.push('/admin/orders')
      } else {
        setError(data.error || 'Erreur lors de la suppression')
        setShowDeleteConfirm(false)
      }
    } catch (err: any) {
      console.error('Error deleting order:', err)
      setError('Erreur lors de la suppression')
      setShowDeleteConfirm(false)
    } finally {
      setIsDeleting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen pt-32 pb-24 px-6 md:px-8">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-8"
          >
            {/* Header Skeleton */}
            <div className="mb-8">
              <div className="h-4 bg-neutral-200 rounded w-32 mb-4 animate-pulse" />
              <div className="h-12 bg-neutral-200 rounded w-64 mb-2 animate-pulse" />
              <div className="h-4 bg-neutral-200 rounded w-48 animate-pulse" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Content Skeleton */}
              <div className="lg:col-span-2 space-y-6">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="bg-frost rounded-xl shadow-sm border border-neutral-200 p-6 md:p-8">
                    <div className="h-6 bg-neutral-200 rounded w-48 mb-6 animate-pulse" />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {[...Array(4)].map((_, j) => (
                        <div key={j}>
                          <div className="h-3 bg-neutral-200 rounded w-24 mb-2 animate-pulse" />
                          <div className="h-5 bg-neutral-200 rounded w-full animate-pulse" />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Sidebar Skeleton */}
              <div className="lg:col-span-1">
                <div className="sticky top-32 bg-frost rounded-xl shadow-sm border border-neutral-200 p-6 md:p-8 space-y-6">
                  <div>
                    <div className="h-6 bg-neutral-200 rounded w-24 mb-4 animate-pulse" />
                    <div className="h-10 bg-neutral-200 rounded w-32 animate-pulse" />
                  </div>
                  <div>
                    <div className="h-4 bg-neutral-200 rounded w-16 mb-2 animate-pulse" />
                    <div className="h-10 bg-neutral-200 rounded w-full animate-pulse" />
                  </div>
                  <div className="h-12 bg-neutral-200 rounded w-full animate-pulse" />
                  <div className="h-12 bg-neutral-200 rounded w-full animate-pulse" />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    )
  }

  if (error && !order) {
    return (
      <div className="min-h-screen pt-32 pb-24 px-6 md:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <p
            className="text-red-600 mb-4"
            style={{ fontFamily: 'var(--font-raleway)' }}
          >
            {error}
          </p>
          <Link
            href="/admin/orders"
            className="inline-block px-6 py-3 bg-black text-white hover:bg-neutral-800 transition-colors"
            style={{ fontFamily: 'var(--font-raleway)' }}
          >
            Retour aux commandes
          </Link>
        </div>
      </div>
    )
  }

  if (!order) {
    return null
  }

  return (
    <div className="min-h-screen pt-32 pb-24 px-6 md:px-8">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-8"
        >
          <Link
            href="/admin/orders"
            className="inline-flex items-center text-sm text-neutral-600 hover:text-black mb-4 transition-colors"
            style={{ fontFamily: 'var(--font-raleway)' }}
          >
            ← Retour aux commandes
          </Link>
          <h1
            className="text-4xl md:text-5xl mb-2"
            style={{ fontFamily: 'var(--font-bodoni)' }}
          >
            Commande #{order.id.substring(0, 8)}
          </h1>
          <p
            className="text-sm text-neutral-500"
            style={{ fontFamily: 'var(--font-raleway)' }}
          >
            {new Date(order.createdAt).toLocaleDateString('fr-FR', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </p>
        </motion.div>

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg"
            >
              <p
                className="text-sm text-red-600"
                style={{ fontFamily: 'var(--font-raleway)' }}
              >
                {error}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="lg:col-span-2 space-y-6"
          >
            {/* Customer Info */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              className="bg-frost rounded-xl shadow-sm border border-neutral-200 p-6 md:p-8"
            >
              <h2
                className="text-2xl mb-6"
                style={{ fontFamily: 'var(--font-bodoni)' }}
              >
                Informations client
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p
                    className="text-sm text-neutral-500 mb-1"
                    style={{ fontFamily: 'var(--font-raleway)' }}
                  >
                    Nom
                  </p>
                  <p
                    className="text-base font-medium"
                    style={{ fontFamily: 'var(--font-raleway)' }}
                  >
                    {order.customerName}
                  </p>
                </div>
                <div>
                  <p
                    className="text-sm text-neutral-500 mb-1"
                    style={{ fontFamily: 'var(--font-raleway)' }}
                  >
                    Email
                  </p>
                  <p
                    className="text-base font-medium"
                    style={{ fontFamily: 'var(--font-raleway)' }}
                  >
                    {order.customerEmail}
                  </p>
                </div>
                <div>
                  <p
                    className="text-sm text-neutral-500 mb-1"
                    style={{ fontFamily: 'var(--font-raleway)' }}
                  >
                    Téléphone
                  </p>
                  <p
                    className="text-base font-medium"
                    style={{ fontFamily: 'var(--font-raleway)' }}
                  >
                    {order.customerPhone || '-'}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Shipping Info */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.3 }}
              className="bg-frost rounded-xl shadow-sm border border-neutral-200 p-6 md:p-8"
            >
              <h2
                className="text-2xl mb-6"
                style={{ fontFamily: 'var(--font-bodoni)' }}
              >
                Adresse de livraison
              </h2>
              <div className="space-y-2">
                <p
                  className="text-base"
                  style={{ fontFamily: 'var(--font-raleway)' }}
                >
                  {order.addressLine1}
                  {order.addressLine2 && `, ${order.addressLine2}`}
                </p>
                <p
                  className="text-base"
                  style={{ fontFamily: 'var(--font-raleway)' }}
                >
                  {order.postalCode ? `${order.postalCode} ` : ''}{order.city}, {order.country}
                </p>
              </div>
              {order.notes && (
                <div className="mt-6 pt-6 border-t border-neutral-200">
                  <p
                    className="text-sm text-neutral-500 mb-2"
                    style={{ fontFamily: 'var(--font-raleway)' }}
                  >
                    Notes
                  </p>
                  <p
                    className="text-base"
                    style={{ fontFamily: 'var(--font-raleway)' }}
                  >
                    {order.notes}
                  </p>
                </div>
              )}
            </motion.div>

            {/* Items List */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.4 }}
              className="bg-frost rounded-xl shadow-sm border border-neutral-200 p-6 md:p-8"
            >
              <h2
                className="text-2xl mb-6"
                style={{ fontFamily: 'var(--font-bodoni)' }}
              >
                Articles
              </h2>
              <div className="space-y-6">
                <AnimatePresence>
                  {order.items.map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      transition={{ duration: 0.2, delay: index * 0.05 }}
                      className="flex gap-6 pb-6 border-b border-neutral-200 last:border-0"
                    >
                    <div className="relative w-24 h-24 md:w-32 md:h-32 flex-shrink-0 bg-neutral-100 rounded-lg overflow-hidden">
                      {item.product.images[0] ? (
                        <Image
                          src={item.product.images[0].url}
                          alt={item.product.images[0].alt || item.product.name}
                          fill
                          className="object-cover"
                          quality={75}
                          sizes="128px"
                        />
                      ) : (
                        <div className="w-full h-full bg-neutral-200" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3
                        className="text-lg md:text-xl mb-2"
                        style={{ fontFamily: 'var(--font-bodoni)' }}
                      >
                        {item.product.name}
                      </h3>
                      <p
                        className="text-sm text-neutral-600 mb-2"
                        style={{ fontFamily: 'var(--font-raleway)' }}
                      >
                        {item.product.category.name}
                      </p>
                      <p
                        className="text-sm text-neutral-500 mb-2"
                        style={{ fontFamily: 'var(--font-raleway)' }}
                      >
                        Quantité: {item.quantity}
                      </p>
                      <p
                        className="text-base font-medium"
                        style={{ fontFamily: 'var(--font-raleway)' }}
                      >
                        {new Intl.NumberFormat('fr-FR', {
                          style: 'currency',
                          currency: order.currency || 'EUR',
                        }).format(item.subtotal / 100)}
                      </p>
                    </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </motion.div>
          </motion.div>

          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="lg:col-span-1"
          >
            <div className="sticky top-32 bg-frost rounded-xl shadow-sm border border-neutral-200 p-6 md:p-8 space-y-6">
              <div>
                <h2
                  className="text-2xl mb-4"
                  style={{ fontFamily: 'var(--font-bodoni)' }}
                >
                  Total
                </h2>
                <p
                  className="text-3xl font-medium"
                  style={{ fontFamily: 'var(--font-bodoni)' }}
                >
                  {new Intl.NumberFormat('fr-FR', {
                    style: 'currency',
                    currency: order.currency || 'EUR',
                  }).format(order.totalAmount / 100)}
                </p>
              </div>

              <div>
                <label
                  htmlFor="status"
                  className="block text-sm font-medium text-neutral-700 mb-2"
                  style={{ fontFamily: 'var(--font-raleway)' }}
                >
                  Statut
                </label>
                <select
                  id="status"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent bg-frost"
                  style={{ fontFamily: 'var(--font-raleway)' }}
                >
                  <option value="PENDING">En attente</option>
                  <option value="CONFIRMED">Confirmée</option>
                  <option value="PREPARING">En préparation</option>
                  <option value="SHIPPED">Expédiée</option>
                  <option value="COMPLETED">Terminée</option>
                  <option value="CANCELLED">Annulée</option>
                </select>
              </div>

              <button
                onClick={handleSave}
                disabled={isSaving}
                className="w-full px-6 py-4 bg-black text-white uppercase tracking-wider text-sm font-light hover:bg-neutral-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
                style={{ fontFamily: 'var(--font-raleway)' }}
              >
                {isSaving ? 'Enregistrement...' : 'Enregistrer'}
              </button>

              <a
                href={`/api/orders/${orderId}/invoice`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full px-6 py-4 bg-neutral-100 text-black uppercase tracking-wider text-sm font-light hover:bg-neutral-200 transition-colors focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 text-center block"
                style={{ fontFamily: 'var(--font-raleway)' }}
              >
                Télécharger la facture PDF
              </a>

              <button
                onClick={() => setShowDeleteConfirm(true)}
                disabled={isDeleting}
                className="w-full px-6 py-4 bg-red-600 text-white uppercase tracking-wider text-sm font-light hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2"
                style={{ fontFamily: 'var(--font-raleway)' }}
              >
                Supprimer
              </button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowDeleteConfirm(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-frost rounded-xl shadow-lg max-w-md w-full p-6 md:p-8"
            >
            <h2
              className="text-2xl mb-4"
              style={{ fontFamily: 'var(--font-bodoni)' }}
            >
              Confirmer la suppression
            </h2>
            <p
              className="text-base text-neutral-600 mb-6"
              style={{ fontFamily: 'var(--font-raleway)' }}
            >
              Êtes-vous sûr de vouloir supprimer cette commande ? Cette action est irréversible.
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                disabled={isDeleting}
                className="flex-1 px-6 py-3 border border-neutral-300 text-neutral-700 uppercase tracking-wider text-sm font-light hover:bg-neutral-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-neutral-300 focus:ring-offset-2"
                style={{ fontFamily: 'var(--font-raleway)' }}
              >
                Annuler
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="flex-1 px-6 py-3 bg-red-600 text-white uppercase tracking-wider text-sm font-light hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2"
                style={{ fontFamily: 'var(--font-raleway)' }}
              >
                {isDeleting ? 'Suppression...' : 'Supprimer'}
              </button>
            </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
