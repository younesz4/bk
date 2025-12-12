/**
 * Refund Panel Component
 * Displays refund history and allows creating new refunds
 * Clean, luxury, minimal design
 */

'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

interface RefundHistoryItem {
  refundId: string
  orderId: string
  amount: number
  reason: string
  status: string
  method: string
  createdAt: string
}

interface RefundPanelProps {
  orderId: string
  orderTotal: number // In cents
  currency?: string
}

export default function RefundPanel({ orderId, orderTotal, currency = 'EUR' }: RefundPanelProps) {
  const [refundHistory, setRefundHistory] = useState<RefundHistoryItem[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<{
    success: boolean
    message: string
  } | null>(null)

  const [formData, setFormData] = useState({
    amount: '',
    reason: '',
    method: 'original' as 'original' | 'manual' | 'cash',
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    fetchRefundHistory()
  }, [orderId])

  const fetchRefundHistory = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/admin/refunds?orderId=${orderId}`)
      if (response.ok) {
        const data = await response.json()
        setRefundHistory(data.refunds || [])
      }
    } catch (error) {
      console.error('Error fetching refund history:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus(null)
    setErrors({})

    // Validate
    const amount = parseFloat(formData.amount)
    if (isNaN(amount) || amount <= 0) {
      setErrors({ amount: 'Montant invalide' })
      setIsSubmitting(false)
      return
    }

    if (amount > orderTotal / 100) {
      setErrors({ amount: 'Le montant ne peut pas dépasser le total de la commande' })
      setIsSubmitting(false)
      return
    }

    if (!formData.reason.trim()) {
      setErrors({ reason: 'La raison est requise' })
      setIsSubmitting(false)
      return
    }

    try {
      const response = await fetch('/api/refunds/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId,
          amount: Math.round(amount * 100), // Convert to cents
          reason: formData.reason,
          method: formData.method,
        }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        setSubmitStatus({
          success: true,
          message: 'Demande de remboursement créée avec succès',
        })
        // Reset form
        setFormData({
          amount: '',
          reason: '',
          method: 'original',
        })
        // Refresh history
        fetchRefundHistory()
      } else {
        setSubmitStatus({
          success: false,
          message: data.error || 'Une erreur est survenue',
        })
      }
    } catch (error) {
      setSubmitStatus({
        success: false,
        message: 'Une erreur est survenue',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-blue-100 text-blue-800',
      declined: 'bg-red-100 text-red-800',
      processed: 'bg-green-100 text-green-800',
    }

    const labels: Record<string, string> = {
      pending: 'En attente',
      approved: 'Approuvé',
      declined: 'Refusé',
      processed: 'Traité',
    }

    return (
      <span className={`px-2 py-1 rounded text-xs ${styles[status] || 'bg-gray-100 text-gray-800'}`}>
        {labels[status] || status}
      </span>
    )
  }

  const getMethodLabel = (method: string) => {
    const labels: Record<string, string> = {
      original: 'Méthode originale',
      manual: 'Manuel',
      cash: 'Espèces',
    }
    return labels[method] || method
  }

  const totalRefunded = refundHistory
    .filter((r) => r.status === 'processed' || r.status === 'approved')
    .reduce((sum, r) => sum + r.amount, 0)

  const refundableAmount = orderTotal - totalRefunded

  return (
    <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm border border-neutral-200 dark:border-neutral-700 p-6 md:p-8">
      {/* Header */}
      <div className="mb-8">
        <h2
          className="text-2xl md:text-3xl font-light text-neutral-900 dark:text-white mb-2"
          style={{ fontFamily: 'var(--font-bodoni)' }}
        >
          Gestion des remboursements
        </h2>
        <div className="flex items-center gap-4 text-sm text-neutral-600 dark:text-neutral-400">
          <span>
            Total commande: <strong>{new Intl.NumberFormat('fr-FR', { style: 'currency', currency }).format(orderTotal / 100)}</strong>
          </span>
          <span>•</span>
          <span>
            Remboursable: <strong>{new Intl.NumberFormat('fr-FR', { style: 'currency', currency }).format(refundableAmount / 100)}</strong>
          </span>
        </div>
      </div>

      {/* Refund Form */}
      <form onSubmit={handleSubmit} className="mb-8 pb-8 border-b border-neutral-200 dark:border-neutral-700">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
              Montant du remboursement (€)
            </label>
            <input
              type="number"
              id="amount"
              name="amount"
              value={formData.amount}
              onChange={handleInputChange}
              step="0.01"
              min="0"
              max={refundableAmount / 100}
              required
              className="w-full px-4 py-3 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white"
              placeholder="0.00"
            />
            {errors.amount && (
              <p className="text-red-600 dark:text-red-400 text-sm mt-1">{errors.amount}</p>
            )}
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
              Maximum: {new Intl.NumberFormat('fr-FR', { style: 'currency', currency }).format(refundableAmount / 100)}
            </p>
          </div>

          <div>
            <label htmlFor="method" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
              Méthode de remboursement
            </label>
            <select
              id="method"
              name="method"
              value={formData.method}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white"
            >
              <option value="original">Méthode originale</option>
              <option value="manual">Manuel</option>
              <option value="cash">Espèces</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label htmlFor="reason" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
              Raison du remboursement
            </label>
            <textarea
              id="reason"
              name="reason"
              value={formData.reason}
              onChange={handleInputChange}
              required
              rows={4}
              className="w-full px-4 py-3 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white resize-none"
              placeholder="Décrivez la raison du remboursement..."
            />
            {errors.reason && (
              <p className="text-red-600 dark:text-red-400 text-sm mt-1">{errors.reason}</p>
            )}
          </div>
        </div>

        <div className="mt-6">
          <button
            type="submit"
            disabled={isSubmitting || refundableAmount <= 0}
            className="px-8 py-3 bg-black dark:bg-white text-white dark:text-black hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wider text-sm font-light"
          >
            {isSubmitting ? 'Création...' : 'Créer le remboursement'}
          </button>
        </div>

        {submitStatus && (
          <div
            className={`mt-4 p-4 rounded-lg ${
              submitStatus.success
                ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-800 dark:text-green-200'
                : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-200'
            }`}
          >
            <p>{submitStatus.message}</p>
          </div>
        )}
      </form>

      {/* Refund History */}
      <div>
        <h3
          className="text-xl font-light text-neutral-900 dark:text-white mb-4"
          style={{ fontFamily: 'var(--font-bodoni)' }}
        >
          Historique des remboursements
        </h3>

        {isLoading ? (
          <p className="text-neutral-600 dark:text-neutral-400">Chargement...</p>
        ) : refundHistory.length === 0 ? (
          <p className="text-neutral-600 dark:text-neutral-400">Aucun remboursement pour cette commande</p>
        ) : (
          <div className="space-y-4">
            {refundHistory.map((refund) => (
              <motion.div
                key={refund.refundId}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="border border-neutral-200 dark:border-neutral-700 rounded-lg p-4"
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="font-medium text-neutral-900 dark:text-white">
                      {new Intl.NumberFormat('fr-FR', {
                        style: 'currency',
                        currency,
                      }).format(refund.amount / 100)}
                    </p>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                      {new Date(refund.createdAt).toLocaleDateString('fr-FR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                  <div className="text-right">
                    {getStatusBadge(refund.status)}
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                      {getMethodLabel(refund.method)}
                    </p>
                  </div>
                </div>
                <p className="text-sm text-neutral-700 dark:text-neutral-300 mt-2">{refund.reason}</p>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}




