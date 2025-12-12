'use client'

import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { shortenOrderId, formatDate } from '@/lib/utils'

interface Order {
  id: string
  customerName: string
  customerPhone: string | null
  city: string
  totalAmount: number
  currency: string
  paymentMethod: string
  status: string
  createdAt: string
}

export default function AdminOrdersPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [totalCount, setTotalCount] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize] = useState(20)

  // Filters
  const [statusFilter, setStatusFilter] = useState(searchParams.get('status') || '')
  const [paymentFilter, setPaymentFilter] = useState(searchParams.get('payment') || '')
  const [dateFilter, setDateFilter] = useState(searchParams.get('date') || '')
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '')

  useEffect(() => {
    fetchOrders()
  }, [currentPage, statusFilter, paymentFilter, dateFilter, searchQuery])

  const fetchOrders = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      params.set('page', currentPage.toString())
      params.set('limit', pageSize.toString())
      if (statusFilter) params.set('status', statusFilter)
      if (paymentFilter) params.set('paymentMethod', paymentFilter)
      if (dateFilter) params.set('date', dateFilter)
      if (searchQuery) params.set('search', searchQuery)

      const res = await fetch(`/api/admin/orders?${params.toString()}`)
      if (res.ok) {
        const data = await res.json()
        setOrders(data.orders || [])
        setTotalCount(data.total || 0)
      }
    } catch (error) {
      console.error('Error fetching orders:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = (filterType: string, value: string) => {
    if (filterType === 'status') setStatusFilter(value)
    if (filterType === 'payment') setPaymentFilter(value)
    if (filterType === 'date') setDateFilter(value)
    setCurrentPage(1)
    
    // Update URL
    const params = new URLSearchParams()
    if (value) params.set(filterType, value)
    if (searchQuery) params.set('search', searchQuery)
    router.push(`/admin/orders?${params.toString()}`)
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setCurrentPage(1)
    
    const params = new URLSearchParams()
    if (statusFilter) params.set('status', statusFilter)
    if (paymentFilter) params.set('payment', paymentFilter)
    if (dateFilter) params.set('date', dateFilter)
    if (searchQuery) params.set('search', searchQuery)
    router.push(`/admin/orders?${params.toString()}`)
  }

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })
      if (res.ok) {
        fetchOrders()
      }
    } catch (error) {
      console.error('Error updating status:', error)
    }
  }

  const totalPages = Math.ceil(totalCount / pageSize)

  return (
    <>
      {/* Header */}
      <div className="mb-8">
        <h1
          className="text-3xl md:text-4xl mb-2"
          style={{ fontFamily: 'var(--font-bodoni)' }}
        >
          Commandes
        </h1>
        <p
          className="text-neutral-600"
          style={{ fontFamily: 'var(--font-raleway)', fontSize: '14px' }}
        >
          Gérer toutes les commandes clients
        </p>
      </div>

      {/* Filters and Search */}
      <div className="bg-frost border border-[#e5e5e5] p-6 mb-6">
        <form onSubmit={handleSearch} className="space-y-4">
          {/* Search */}
          <div>
            <label
              htmlFor="search"
              className="block text-sm mb-2 text-neutral-700 uppercase tracking-wider"
              style={{ fontFamily: 'var(--font-raleway)' }}
            >
              Rechercher
            </label>
            <input
              type="text"
              id="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Nom, téléphone, ID commande..."
              className="w-full px-4 py-2 bg-frost border border-[#e5e5e5] focus:outline-none focus:border-black transition-colors"
              style={{ fontFamily: 'var(--font-raleway)', fontSize: '14px' }}
            />
          </div>

          {/* Filters Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Status Filter */}
            <div>
              <label
                htmlFor="status"
                className="block text-sm mb-2 text-neutral-700 uppercase tracking-wider"
                style={{ fontFamily: 'var(--font-raleway)' }}
              >
                Statut
              </label>
              <select
                id="status"
                value={statusFilter}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="w-full px-4 py-2 bg-frost border border-[#e5e5e5] focus:outline-none focus:border-black transition-colors"
                style={{ fontFamily: 'var(--font-raleway)', fontSize: '14px' }}
              >
                <option value="">Tous</option>
                <option value="PENDING">En attente</option>
                <option value="CONFIRMED">Confirmée</option>
                <option value="PREPARING">En préparation</option>
                <option value="SHIPPED">Expédiée</option>
                <option value="COMPLETED">Terminée</option>
                <option value="CANCELLED">Annulée</option>
              </select>
            </div>

            {/* Payment Filter */}
            <div>
              <label
                htmlFor="payment"
                className="block text-sm mb-2 text-neutral-700 uppercase tracking-wider"
                style={{ fontFamily: 'var(--font-raleway)' }}
              >
                Paiement
              </label>
              <select
                id="payment"
                value={paymentFilter}
                onChange={(e) => handleFilterChange('payment', e.target.value)}
                className="w-full px-4 py-2 bg-frost border border-[#e5e5e5] focus:outline-none focus:border-black transition-colors"
                style={{ fontFamily: 'var(--font-raleway)', fontSize: '14px' }}
              >
                <option value="">Tous</option>
                <option value="CASH_ON_DELIVERY">À la livraison</option>
                <option value="COD">À la livraison (COD)</option>
                <option value="BANK_TRANSFER">Virement bancaire</option>
                <option value="QUOTE_ONLY">Devis uniquement</option>
              </select>
            </div>

            {/* Date Filter */}
            <div>
              <label
                htmlFor="date"
                className="block text-sm mb-2 text-neutral-700 uppercase tracking-wider"
                style={{ fontFamily: 'var(--font-raleway)' }}
              >
                Date
              </label>
              <select
                id="date"
                value={dateFilter}
                onChange={(e) => handleFilterChange('date', e.target.value)}
                className="w-full px-4 py-2 bg-frost border border-[#e5e5e5] focus:outline-none focus:border-black transition-colors"
                style={{ fontFamily: 'var(--font-raleway)', fontSize: '14px' }}
              >
                <option value="">Toutes</option>
                <option value="today">Aujourd'hui</option>
                <option value="week">Cette semaine</option>
                <option value="month">Ce mois</option>
                <option value="year">Cette année</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            className="px-6 py-2 bg-black text-white uppercase tracking-wider text-sm font-light hover:bg-neutral-800 transition-colors"
            style={{ fontFamily: 'var(--font-raleway)' }}
          >
            Rechercher
          </button>
        </form>
      </div>

      {/* Orders Table */}
      <div className="bg-frost border border-[#e5e5e5] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#e5e5e5] bg-[#f7f7f5]">
                <th className="px-6 py-4 text-left font-medium text-neutral-700" style={{ fontFamily: 'var(--font-raleway)', fontSize: '14px' }}>
                  ID Commande
                </th>
                <th className="px-6 py-4 text-left font-medium text-neutral-700" style={{ fontFamily: 'var(--font-raleway)', fontSize: '14px' }}>
                  Client
                </th>
                <th className="px-6 py-4 text-left font-medium text-neutral-700" style={{ fontFamily: 'var(--font-raleway)', fontSize: '14px' }}>
                  Téléphone
                </th>
                <th className="px-6 py-4 text-left font-medium text-neutral-700" style={{ fontFamily: 'var(--font-raleway)', fontSize: '14px' }}>
                  Ville
                </th>
                <th className="px-6 py-4 text-left font-medium text-neutral-700" style={{ fontFamily: 'var(--font-raleway)', fontSize: '14px' }}>
                  Total
                </th>
                <th className="px-6 py-4 text-left font-medium text-neutral-700" style={{ fontFamily: 'var(--font-raleway)', fontSize: '14px' }}>
                  Paiement
                </th>
                <th className="px-6 py-4 text-left font-medium text-neutral-700" style={{ fontFamily: 'var(--font-raleway)', fontSize: '14px' }}>
                  Statut
                </th>
                <th className="px-6 py-4 text-left font-medium text-neutral-700" style={{ fontFamily: 'var(--font-raleway)', fontSize: '14px' }}>
                  Date
                </th>
                <th className="px-6 py-4 text-left font-medium text-neutral-700" style={{ fontFamily: 'var(--font-raleway)', fontSize: '14px' }}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={9} className="px-6 py-12 text-center text-neutral-500" style={{ fontFamily: 'var(--font-raleway)', fontSize: '14px' }}>
                    Chargement...
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-6 py-12 text-center text-neutral-500" style={{ fontFamily: 'var(--font-raleway)', fontSize: '14px' }}>
                    Aucune commande trouvée
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order.id} className="border-b border-[#e5e5e5] hover:bg-[#f7f7f5] transition-colors">
                    <td className="px-6 py-4">
                      <span className="font-mono text-neutral-700" style={{ fontFamily: 'var(--font-raleway)', fontSize: '14px' }}>
                        {shortenOrderId(order.id)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-neutral-900" style={{ fontFamily: 'var(--font-raleway)', fontSize: '14px' }}>
                        {order.customerName}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-neutral-600" style={{ fontFamily: 'var(--font-raleway)', fontSize: '14px' }}>
                        {order.customerPhone || '-'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-neutral-600" style={{ fontFamily: 'var(--font-raleway)', fontSize: '14px' }}>
                        {order.city}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-medium text-neutral-900" style={{ fontFamily: 'var(--font-raleway)', fontSize: '14px' }}>
                        {new Intl.NumberFormat('fr-FR', {
                          style: 'currency',
                          currency: order.currency || 'EUR',
                        }).format(order.totalAmount / 100)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-neutral-600" style={{ fontFamily: 'var(--font-raleway)', fontSize: '14px' }}>
                        {order.paymentMethod === 'STRIPE' ? 'Carte bancaire' :
                         order.paymentMethod === 'BANK_TRANSFER' ? 'Virement bancaire' :
                         order.paymentMethod === 'CASH_ON_DELIVERY' || order.paymentMethod === 'COD' ? 'À la livraison' :
                         order.paymentMethod === 'CASH' ? 'Espèces' :
                         order.paymentMethod === 'QUOTE_ONLY' ? 'Devis uniquement' :
                         order.paymentMethod || '-'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                        className={`px-2 py-1 text-xs rounded-full border-0 ${
                          order.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                          order.status === 'CANCELLED' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}
                        style={{ fontFamily: 'var(--font-raleway)' }}
                      >
                        <option value="PENDING">En attente</option>
                        <option value="CONFIRMED">Confirmée</option>
                        <option value="PREPARING">En préparation</option>
                        <option value="SHIPPED">Expédiée</option>
                        <option value="COMPLETED">Terminée</option>
                        <option value="CANCELLED">Annulée</option>
                      </select>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-neutral-600" style={{ fontFamily: 'var(--font-raleway)', fontSize: '14px' }}>
                        {formatDate(new Date(order.createdAt))}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <Link
                        href={`/admin/orders/${order.id}`}
                        className="inline-flex items-center px-3 py-1.5 text-neutral-700 hover:text-black hover:bg-neutral-100 rounded-sm transition-colors"
                        style={{ fontFamily: 'var(--font-raleway)', fontSize: '14px' }}
                      >
                        Voir
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-between">
          <div className="text-sm text-neutral-600" style={{ fontFamily: 'var(--font-raleway)' }}>
            Page {currentPage} sur {totalPages} ({totalCount} commandes)
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-frost border border-[#e5e5e5] text-neutral-700 hover:bg-[#f7f7f5] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ fontFamily: 'var(--font-raleway)', fontSize: '14px' }}
            >
              Précédent
            </button>
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-frost border border-[#e5e5e5] text-neutral-700 hover:bg-[#f7f7f5] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ fontFamily: 'var(--font-raleway)', fontSize: '14px' }}
            >
              Suivant
            </button>
          </div>
        </div>
      )}
    </>
  )
}
