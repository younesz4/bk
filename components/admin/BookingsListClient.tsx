/**
 * Admin bookings manager for BK Agencements
 * Client component for bookings list with filters and detail drawer
 */

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import BookingDetailDrawer from './BookingDetailDrawer'

interface Booking {
  id: string
  fullName: string
  email: string
  phone: string | null
  projectType: string | null
  budget: string | null
  message: string | null
  date: Date
  timeSlot: string | null
  status: string
  internalNotes: string | null
  createdAt: Date
  updatedAt: Date
}

interface BookingsListClientProps {
  initialBookings: Booking[]
}

export default function BookingsListClient({ initialBookings }: BookingsListClientProps) {
  const router = useRouter()
  const [bookings, setBookings] = useState<Booking[]>(initialBookings)
  const [statusFilter, setStatusFilter] = useState('all')
  const [dateFilter, setDateFilter] = useState('all')
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  // Filter bookings
  const filteredBookings = bookings.filter((booking) => {
    const matchesStatus = statusFilter === 'all' || booking.status === statusFilter
    const matchesDate = (() => {
      if (dateFilter === 'all') return true
      const now = new Date()
      const bookingDate = new Date(booking.createdAt)
      if (dateFilter === '7') {
        const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        return bookingDate >= sevenDaysAgo
      }
      if (dateFilter === '30') {
        const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
        return bookingDate >= thirtyDaysAgo
      }
      return true
    })()
    return matchesStatus && matchesDate
  })

  const handleView = (booking: Booking) => {
    setSelectedBooking(booking)
    setIsDrawerOpen(true)
  }

  const handleDrawerClose = () => {
    setIsDrawerOpen(false)
    setSelectedBooking(null)
    router.refresh()
  }

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      pending: 'bg-amber-100 dark:bg-amber-900/20 text-amber-800 dark:text-amber-200',
      confirmed: 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-200',
      completed: 'bg-neutral-100 dark:bg-neutral-700 text-neutral-800 dark:text-neutral-200',
      cancelled: 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-200',
    }
    const labels: Record<string, string> = {
      pending: 'En attente',
      confirmed: 'Confirmé',
      completed: 'Terminé',
      cancelled: 'Annulé',
    }
    return (
      <span
        className={`inline-block px-3 py-1 rounded-full text-xs font-light ${
          styles[status] || styles.pending
        }`}
        style={{ fontFamily: 'var(--font-raleway)' }}
      >
        {labels[status] || status}
      </span>
    )
  }

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1
          className="text-3xl font-light text-neutral-900 dark:text-white mb-2"
          style={{ fontFamily: 'var(--font-bodoni)' }}
        >
          Rendez-vous
        </h1>
        <p className="text-neutral-600 dark:text-neutral-400" style={{ fontFamily: 'var(--font-raleway)' }}>
          Suivez et gérez les demandes de rendez-vous
        </p>
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 border border-neutral-300 dark:border-neutral-700 rounded-lg focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent"
          style={{ fontFamily: 'var(--font-raleway)' }}
        >
          <option value="all">Tous les statuts</option>
          <option value="pending">En attente</option>
          <option value="confirmed">Confirmé</option>
          <option value="completed">Terminé</option>
          <option value="cancelled">Annulé</option>
        </select>
        <select
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          className="px-4 py-2 border border-neutral-300 dark:border-neutral-700 rounded-lg focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent"
          style={{ fontFamily: 'var(--font-raleway)' }}
        >
          <option value="all">Toutes les dates</option>
          <option value="7">7 derniers jours</option>
          <option value="30">30 derniers jours</option>
        </select>
      </div>

      {/* Bookings Table */}
      <div className="bg-frost dark:bg-neutral-800 rounded-xl shadow-sm border border-neutral-200 dark:border-neutral-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-neutral-50 dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-700">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-light text-neutral-700 dark:text-neutral-300" style={{ fontFamily: 'var(--font-raleway)' }}>
                  Date
                </th>
                <th className="px-6 py-4 text-left text-sm font-light text-neutral-700 dark:text-neutral-300" style={{ fontFamily: 'var(--font-raleway)' }}>
                  Nom
                </th>
                <th className="px-6 py-4 text-left text-sm font-light text-neutral-700 dark:text-neutral-300" style={{ fontFamily: 'var(--font-raleway)' }}>
                  Email
                </th>
                <th className="px-6 py-4 text-left text-sm font-light text-neutral-700 dark:text-neutral-300" style={{ fontFamily: 'var(--font-raleway)' }}>
                  Type de projet
                </th>
                <th className="px-6 py-4 text-left text-sm font-light text-neutral-700 dark:text-neutral-300" style={{ fontFamily: 'var(--font-raleway)' }}>
                  Statut
                </th>
                <th className="px-6 py-4 text-right text-sm font-light text-neutral-700 dark:text-neutral-300" style={{ fontFamily: 'var(--font-raleway)' }}>
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200 dark:divide-neutral-700">
              {filteredBookings.map((booking) => (
                <tr
                  key={booking.id}
                  className="hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors"
                >
                  <td className="px-6 py-4">
                    <span className="text-neutral-900 dark:text-white" style={{ fontFamily: 'var(--font-raleway)' }}>
                      {formatDate(booking.createdAt)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-neutral-900 dark:text-white" style={{ fontFamily: 'var(--font-raleway)' }}>
                      {booking.fullName}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <a
                      href={`mailto:${booking.email}`}
                      className="text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white"
                      style={{ fontFamily: 'var(--font-raleway)' }}
                    >
                      {booking.email}
                    </a>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-neutral-600 dark:text-neutral-400" style={{ fontFamily: 'var(--font-raleway)' }}>
                      {booking.projectType || '-'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {getStatusBadge(booking.status)}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => handleView(booking)}
                      className="px-4 py-2 text-sm text-neutral-700 dark:text-neutral-300 hover:text-black dark:hover:text-white transition-colors"
                      style={{ fontFamily: 'var(--font-raleway)' }}
                    >
                      Voir
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredBookings.length === 0 && (
          <div className="p-12 text-center">
            <p className="text-neutral-500 dark:text-neutral-400" style={{ fontFamily: 'var(--font-raleway)' }}>
              Aucun rendez-vous trouvé
            </p>
          </div>
        )}
      </div>

      {/* Booking Detail Drawer */}
      {isDrawerOpen && selectedBooking && (
        <BookingDetailDrawer
          booking={selectedBooking}
          onClose={handleDrawerClose}
          onUpdate={(updated) => {
            setBookings(bookings.map((b) => (b.id === updated.id ? updated : b)))
          }}
        />
      )}
    </div>
  )
}



