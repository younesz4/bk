/**
 * Admin bookings manager for BK Agencements
 * Booking detail drawer component
 */

'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'

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

interface BookingDetailDrawerProps {
  booking: Booking
  onClose: () => void
  onUpdate: (booking: Booking) => void
}

export default function BookingDetailDrawer({ booking, onClose, onUpdate }: BookingDetailDrawerProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [internalNotes, setInternalNotes] = useState(booking.internalNotes || '')

  const handleStatusUpdate = async (newStatus: string) => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/admin/bookings/${booking.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: newStatus,
          internalNotes: internalNotes || null,
        }),
      })

      const data = await response.json()

      if (data.success) {
        onUpdate(data.data)
        onClose()
        router.refresh()
      } else {
        setError(data.error || 'Erreur lors de la mise à jour')
      }
    } catch (err) {
      setError('Erreur de connexion')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-end">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/50"
      />

      {/* Drawer */}
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        className="relative w-full md:w-[500px] h-full md:h-auto md:max-h-[90vh] bg-frost dark:bg-neutral-800 shadow-xl overflow-y-auto"
      >
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-700 pb-4">
            <h2
              className="text-2xl font-light text-neutral-900 dark:text-white"
              style={{ fontFamily: 'var(--font-bodoni)' }}
            >
              Détails du rendez-vous
            </h2>
            <button
              onClick={onClose}
              className="text-neutral-500 hover:text-neutral-900 dark:hover:text-white"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-sm text-red-600 dark:text-red-400" style={{ fontFamily: 'var(--font-raleway)' }}>
                {error}
              </p>
            </div>
          )}

          {/* Booking Info */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-light text-neutral-700 dark:text-neutral-300 mb-1" style={{ fontFamily: 'var(--font-raleway)' }}>
                Nom
              </label>
              <p className="text-neutral-900 dark:text-white" style={{ fontFamily: 'var(--font-raleway)' }}>
                {booking.fullName}
              </p>
            </div>

            <div>
              <label className="block text-sm font-light text-neutral-700 dark:text-neutral-300 mb-1" style={{ fontFamily: 'var(--font-raleway)' }}>
                Email
              </label>
              <a
                href={`mailto:${booking.email}`}
                className="text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white"
                style={{ fontFamily: 'var(--font-raleway)' }}
              >
                {booking.email}
              </a>
            </div>

            {booking.phone && (
              <div>
                <label className="block text-sm font-light text-neutral-700 dark:text-neutral-300 mb-1" style={{ fontFamily: 'var(--font-raleway)' }}>
                  Téléphone
                </label>
                <a
                  href={`tel:${booking.phone}`}
                  className="text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white"
                  style={{ fontFamily: 'var(--font-raleway)' }}
                >
                  {booking.phone}
                </a>
              </div>
            )}

            {booking.projectType && (
              <div>
                <label className="block text-sm font-light text-neutral-700 dark:text-neutral-300 mb-1" style={{ fontFamily: 'var(--font-raleway)' }}>
                  Type de projet
                </label>
                <p className="text-neutral-900 dark:text-white" style={{ fontFamily: 'var(--font-raleway)' }}>
                  {booking.projectType}
                </p>
              </div>
            )}

            <div>
              <label className="block text-sm font-light text-neutral-700 dark:text-neutral-300 mb-1" style={{ fontFamily: 'var(--font-raleway)' }}>
                Date
              </label>
              <p className="text-neutral-900 dark:text-white" style={{ fontFamily: 'var(--font-raleway)' }}>
                {formatDate(booking.date)}
                {booking.timeSlot && ` - ${booking.timeSlot}`}
              </p>
            </div>

            {booking.message && (
              <div>
                <label className="block text-sm font-light text-neutral-700 dark:text-neutral-300 mb-1" style={{ fontFamily: 'var(--font-raleway)' }}>
                  Message
                </label>
                <p className="text-neutral-900 dark:text-white whitespace-pre-wrap" style={{ fontFamily: 'var(--font-raleway)' }}>
                  {booking.message}
                </p>
              </div>
            )}

            <div>
              <label className="block text-sm font-light text-neutral-700 dark:text-neutral-300 mb-1" style={{ fontFamily: 'var(--font-raleway)' }}>
                Statut actuel
              </label>
              <p className="text-neutral-900 dark:text-white capitalize" style={{ fontFamily: 'var(--font-raleway)' }}>
                {booking.status}
              </p>
            </div>

            <div>
              <label className="block text-sm font-light text-neutral-700 dark:text-neutral-300 mb-2" style={{ fontFamily: 'var(--font-raleway)' }}>
                Notes internes
              </label>
              <textarea
                value={internalNotes}
                onChange={(e) => setInternalNotes(e.target.value)}
                rows={4}
                className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-700 rounded-lg focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent"
                style={{ fontFamily: 'var(--font-raleway)' }}
                placeholder="Ajoutez des notes internes..."
              />
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-3 pt-4 border-t border-neutral-200 dark:border-neutral-700">
            <button
              onClick={() => handleStatusUpdate('confirmed')}
              disabled={loading || booking.status === 'confirmed'}
              className="w-full px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors uppercase tracking-wider text-sm font-light disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ fontFamily: 'var(--font-raleway)' }}
            >
              Marquer comme confirmée
            </button>
            <button
              onClick={() => handleStatusUpdate('completed')}
              disabled={loading || booking.status === 'completed'}
              className="w-full px-6 py-3 bg-neutral-600 text-white rounded-lg hover:bg-neutral-700 transition-colors uppercase tracking-wider text-sm font-light disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ fontFamily: 'var(--font-raleway)' }}
            >
              Marquer comme terminée
            </button>
            <button
              onClick={() => handleStatusUpdate('cancelled')}
              disabled={loading || booking.status === 'cancelled'}
              className="w-full px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors uppercase tracking-wider text-sm font-light disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ fontFamily: 'var(--font-raleway)' }}
            >
              Annuler le rendez-vous
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}



