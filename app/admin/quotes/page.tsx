/**
 * Quotes Management Page
 * List all quotes with filters and actions
 */

'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'

interface Quote {
  id: string
  customerName: string
  email: string
  phone: string
  projectType: string
  budget: string | null
  status: string
  quoteAmount: number | null
  createdAt: string
}

export default function AdminQuotesPage() {
  const router = useRouter()
  const [quotes, setQuotes] = useState<Quote[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  useEffect(() => {
    fetchQuotes()
  }, [])

  const fetchQuotes = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/admin/quotes/list')
      if (response.ok) {
        const data = await response.json()
        setQuotes(data.quotes || [])
      }
    } catch (error) {
      console.error('Error fetching quotes:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const filteredQuotes = quotes.filter((quote) => {
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      const matchesName = quote.customerName.toLowerCase().includes(query)
      const matchesEmail = quote.email.toLowerCase().includes(query)
      if (!matchesName && !matchesEmail) {
        return false
      }
    }

    if (statusFilter !== 'all' && quote.status !== statusFilter) {
      return false
    }

    return true
  })

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800',
      reviewed: 'bg-blue-100 text-blue-800',
      waiting_client: 'bg-purple-100 text-purple-800',
      approved: 'bg-green-100 text-green-800',
      converted: 'bg-gray-100 text-gray-800',
      completed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
    }

    const labels: Record<string, string> = {
      pending: 'En attente',
      reviewed: 'Examiné',
      waiting_client: 'En attente client',
      approved: 'Approuvé',
      converted: 'Converti',
      completed: 'Terminé',
      cancelled: 'Annulé',
    }

    return (
      <span className={`px-2 py-1 rounded text-xs ${styles[status] || 'bg-gray-100 text-gray-800'}`}>
        {labels[status] || status}
      </span>
    )
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1
          className="text-4xl md:text-5xl font-light text-neutral-900 dark:text-white"
          style={{ fontFamily: 'var(--font-bodoni)' }}
        >
          Devis
        </h1>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm border border-neutral-200 dark:border-neutral-700 p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
              Rechercher
            </label>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Nom, email..."
              className="w-full px-4 py-3 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
              Statut
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-4 py-3 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white"
            >
              <option value="all">Tous les statuts</option>
              <option value="pending">En attente</option>
              <option value="reviewed">Examiné</option>
              <option value="waiting_client">En attente client</option>
              <option value="approved">Approuvé</option>
              <option value="converted">Converti</option>
              <option value="cancelled">Annulé</option>
            </select>
          </div>
        </div>
      </div>

      {/* Quotes Table */}
      {isLoading ? (
        <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm border border-neutral-200 dark:border-neutral-700 p-8 text-center">
          <p className="text-neutral-600 dark:text-neutral-400">Chargement...</p>
        </div>
      ) : filteredQuotes.length === 0 ? (
        <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm border border-neutral-200 dark:border-neutral-700 p-8 text-center">
          <p className="text-neutral-600 dark:text-neutral-400">Aucun devis trouvé</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm border border-neutral-200 dark:border-neutral-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-neutral-50 dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-700">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-medium text-neutral-700 dark:text-neutral-300">ID</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-neutral-700 dark:text-neutral-300">Client</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-neutral-700 dark:text-neutral-300">Type</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-neutral-700 dark:text-neutral-300">Budget</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-neutral-700 dark:text-neutral-300">Montant</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-neutral-700 dark:text-neutral-300">Statut</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-neutral-700 dark:text-neutral-300">Date</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-neutral-700 dark:text-neutral-300">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200 dark:divide-neutral-700">
                {filteredQuotes.map((quote) => (
                  <tr
                    key={quote.id}
                    className="hover:bg-neutral-50 dark:hover:bg-neutral-900 cursor-pointer"
                    onClick={() => router.push(`/admin/quotes/${quote.id}`)}
                  >
                    <td className="px-6 py-4 text-sm font-mono text-neutral-600 dark:text-neutral-400">
                      {quote.id.substring(0, 8)}...
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div>
                        <p className="font-medium text-neutral-900 dark:text-white">{quote.customerName}</p>
                        <p className="text-xs text-neutral-500 dark:text-neutral-400">{quote.email}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-neutral-600 dark:text-neutral-400">
                      {quote.projectType}
                    </td>
                    <td className="px-6 py-4 text-sm text-neutral-600 dark:text-neutral-400">
                      {quote.budget || '—'}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium">
                      {quote.quoteAmount
                        ? new Intl.NumberFormat('fr-FR', {
                            style: 'currency',
                            currency: 'EUR',
                          }).format(quote.quoteAmount / 100)
                        : '—'}
                    </td>
                    <td className="px-6 py-4">{getStatusBadge(quote.status)}</td>
                    <td className="px-6 py-4 text-sm text-neutral-600 dark:text-neutral-400">
                      {new Date(quote.createdAt).toLocaleDateString('fr-FR')}
                    </td>
                    <td className="px-6 py-4">
                      <Link
                        href={`/admin/quotes/${quote.id}`}
                        className="text-black dark:text-white hover:underline text-sm"
                        onClick={(e) => e.stopPropagation()}
                      >
                        Voir
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}




