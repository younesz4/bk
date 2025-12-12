/**
 * Refunds Management Page
 * Lists all refund requests with statuses and action buttons
 */

'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'

interface Refund {
  id: string
  orderId: string
  amount: number
  reason: string
  status: string
  method: string
  customerName: string
  customerEmail: string
  createdAt: string
}

export default function RefundsPage() {
  const [refunds, setRefunds] = useState<Refund[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [statusFilter, setStatusFilter] = useState<string>('all')

  useEffect(() => {
    fetchRefunds()
  }, [])

  const fetchRefunds = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/admin/refunds')
      if (response.ok) {
        const data = await response.json()
        setRefunds(data.refunds || [])
      }
    } catch (error) {
      console.error('Error fetching refunds:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleApprove = async (refundId: string) => {
    try {
      const response = await fetch('/api/admin/refunds/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refundId }),
      })

      if (response.ok) {
        fetchRefunds() // Refresh list
      }
    } catch (error) {
      console.error('Error approving refund:', error)
    }
  }

  const filteredRefunds = statusFilter === 'all' 
    ? refunds 
    : refunds.filter((r) => r.status === statusFilter)

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300',
      approved: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300',
      declined: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300',
      processed: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300',
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1
            className="text-3xl font-light text-neutral-900 dark:text-white mb-2"
            style={{ fontFamily: 'var(--font-bodoni)' }}
          >
            Remboursements
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400" style={{ fontFamily: 'var(--font-raleway)' }}>
            Gérez les demandes de remboursement
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm border border-neutral-200 dark:border-neutral-700 p-4">
        <div className="flex items-center gap-4">
          <label className="text-sm text-neutral-600 dark:text-neutral-400" style={{ fontFamily: 'var(--font-raleway)' }}>
            Statut:
          </label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white"
            style={{ fontFamily: 'var(--font-raleway)' }}
          >
            <option value="all">Tous</option>
            <option value="pending">En attente</option>
            <option value="approved">Approuvé</option>
            <option value="declined">Refusé</option>
            <option value="processed">Traité</option>
          </select>
        </div>
      </div>

      {/* Refunds Table */}
      <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm border border-neutral-200 dark:border-neutral-700 overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-neutral-600 dark:text-neutral-400">
            Chargement...
          </div>
        ) : filteredRefunds.length === 0 ? (
          <div className="p-8 text-center text-neutral-600 dark:text-neutral-400">
            Aucun remboursement trouvé
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-neutral-50 dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-700">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider" style={{ fontFamily: 'var(--font-raleway)' }}>
                    Client
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider" style={{ fontFamily: 'var(--font-raleway)' }}>
                    Montant
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider" style={{ fontFamily: 'var(--font-raleway)' }}>
                    Raison
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider" style={{ fontFamily: 'var(--font-raleway)' }}>
                    Statut
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider" style={{ fontFamily: 'var(--font-raleway)' }}>
                    Date
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider" style={{ fontFamily: 'var(--font-raleway)' }}>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200 dark:divide-neutral-700">
                {filteredRefunds.map((refund, index) => (
                  <motion.tr
                    key={refund.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-neutral-900 dark:text-white" style={{ fontFamily: 'var(--font-raleway)' }}>
                          {refund.customerName}
                        </div>
                        <div className="text-xs text-neutral-600 dark:text-neutral-400" style={{ fontFamily: 'var(--font-raleway)' }}>
                          {refund.customerEmail}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-neutral-900 dark:text-white" style={{ fontFamily: 'var(--font-raleway)' }}>
                        {new Intl.NumberFormat('fr-FR', {
                          style: 'currency',
                          currency: 'EUR',
                        }).format(refund.amount / 100)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-neutral-600 dark:text-neutral-400 max-w-xs truncate" style={{ fontFamily: 'var(--font-raleway)' }}>
                        {refund.reason}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(refund.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-neutral-600 dark:text-neutral-400" style={{ fontFamily: 'var(--font-raleway)' }}>
                        {new Date(refund.createdAt).toLocaleDateString('fr-FR')}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/orders/${refund.orderId}`}
                          className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-neutral-700 dark:text-neutral-300 bg-neutral-100 dark:bg-neutral-700 hover:bg-neutral-200 dark:hover:bg-neutral-600 rounded-lg transition-colors"
                          style={{ fontFamily: 'var(--font-raleway)' }}
                        >
                          Voir commande
                        </Link>
                        {refund.status === 'pending' && (
                          <button
                            onClick={() => handleApprove(refund.id)}
                            className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-white bg-black dark:bg-white dark:text-black hover:bg-neutral-800 dark:hover:bg-neutral-200 rounded-lg transition-colors"
                            style={{ fontFamily: 'var(--font-raleway)' }}
                          >
                            Approuver
                          </button>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}




