/**
 * Customers Management Page
 * Lists all customers with filters and search
 */

'use client'

import { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import Link from 'next/link'

interface Customer {
  id: string
  email: string
  customerName: string
  totalSpent: number
  orderCount: number
  lastOrderDate: string | null
}

export default function CustomersPage() {
  const router = useRouter()
  const [customers, setCustomers] = useState<Customer[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    fetchCustomers()
  }, [])

  const fetchCustomers = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/admin/customers')
      if (response.ok) {
        const data = await response.json()
        setCustomers(data.customers || [])
      }
    } catch (error) {
      console.error('Error fetching customers:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const filteredCustomers = useMemo(() => {
    if (!searchQuery) return customers

    const query = searchQuery.toLowerCase()
    return customers.filter(
      (customer) =>
        customer.customerName.toLowerCase().includes(query) ||
        customer.email.toLowerCase().includes(query)
    )
  }, [customers, searchQuery])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1
            className="text-3xl font-light text-neutral-900 dark:text-white mb-2"
            style={{ fontFamily: 'var(--font-bodoni)' }}
          >
            Clients
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400" style={{ fontFamily: 'var(--font-raleway)' }}>
            Gérez vos clients et leurs commandes
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm border border-neutral-200 dark:border-neutral-700 p-4">
        <input
          type="text"
          placeholder="Rechercher par nom ou email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white"
          style={{ fontFamily: 'var(--font-raleway)' }}
        />
      </div>

      {/* Customers Table */}
      <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm border border-neutral-200 dark:border-neutral-700 overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-neutral-600 dark:text-neutral-400">
            Chargement...
          </div>
        ) : filteredCustomers.length === 0 ? (
          <div className="p-8 text-center text-neutral-600 dark:text-neutral-400">
            Aucun client trouvé
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-neutral-50 dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-700">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider" style={{ fontFamily: 'var(--font-raleway)' }}>
                    Nom
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider" style={{ fontFamily: 'var(--font-raleway)' }}>
                    Email
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider" style={{ fontFamily: 'var(--font-raleway)' }}>
                    Commandes
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider" style={{ fontFamily: 'var(--font-raleway)' }}>
                    Total dépensé
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider" style={{ fontFamily: 'var(--font-raleway)' }}>
                    Dernière commande
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider" style={{ fontFamily: 'var(--font-raleway)' }}>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200 dark:divide-neutral-700">
                {filteredCustomers.map((customer, index) => (
                  <motion.tr
                    key={customer.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-neutral-900 dark:text-white" style={{ fontFamily: 'var(--font-raleway)' }}>
                        {customer.customerName}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-neutral-600 dark:text-neutral-400" style={{ fontFamily: 'var(--font-raleway)' }}>
                        {customer.email}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-neutral-900 dark:text-white" style={{ fontFamily: 'var(--font-raleway)' }}>
                        {customer.orderCount}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-neutral-900 dark:text-white" style={{ fontFamily: 'var(--font-raleway)' }}>
                        {new Intl.NumberFormat('fr-FR', {
                          style: 'currency',
                          currency: 'EUR',
                        }).format(customer.totalSpent / 100)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-neutral-600 dark:text-neutral-400" style={{ fontFamily: 'var(--font-raleway)' }}>
                        {customer.lastOrderDate
                          ? new Date(customer.lastOrderDate).toLocaleDateString('fr-FR')
                          : '—'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <Link
                        href={`/admin/customers/${customer.email}`}
                        className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-neutral-700 dark:text-neutral-300 bg-neutral-100 dark:bg-neutral-700 hover:bg-neutral-200 dark:hover:bg-neutral-600 rounded-lg transition-colors"
                        style={{ fontFamily: 'var(--font-raleway)' }}
                      >
                        Voir
                      </Link>
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




