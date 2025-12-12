/**
 * Admin Panel Index Page
 * Dashboard with placeholders for future sections
 */

import { prisma } from '@/lib/prisma'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function AdminPanelPage() {
  // Get some stats for the dashboard
  const [bookingsCount, productsCount, ordersCount] = await Promise.all([
    prisma.booking.count(),
    prisma.product.count(),
    prisma.order.count(),
  ])

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1
          className="text-3xl font-light text-neutral-900 dark:text-white mb-2"
          style={{ fontFamily: 'var(--font-bodoni)' }}
        >
          BK Agencements Panel
        </h1>
        <p className="text-neutral-600 dark:text-neutral-400" style={{ fontFamily: 'var(--font-raleway)' }}>
          Tableau de bord
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm border border-neutral-200 dark:border-neutral-700 p-6">
          <h3
            className="text-lg font-light text-neutral-900 dark:text-white mb-2"
            style={{ fontFamily: 'var(--font-bodoni)' }}
          >
            Demandes de rendez-vous
          </h3>
          <p className="text-3xl font-light text-neutral-900 dark:text-white" style={{ fontFamily: 'var(--font-raleway)' }}>
            {bookingsCount}
          </p>
        </div>

        <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm border border-neutral-200 dark:border-neutral-700 p-6">
          <h3
            className="text-lg font-light text-neutral-900 dark:text-white mb-2"
            style={{ fontFamily: 'var(--font-bodoni)' }}
          >
            Produits
          </h3>
          <p className="text-3xl font-light text-neutral-900 dark:text-white" style={{ fontFamily: 'var(--font-raleway)' }}>
            {productsCount}
          </p>
        </div>

        <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm border border-neutral-200 dark:border-neutral-700 p-6">
          <h3
            className="text-lg font-light text-neutral-900 dark:text-white mb-2"
            style={{ fontFamily: 'var(--font-bodoni)' }}
          >
            Commandes
          </h3>
          <p className="text-3xl font-light text-neutral-900 dark:text-white" style={{ fontFamily: 'var(--font-raleway)' }}>
            {ordersCount}
          </p>
        </div>
      </div>

      {/* Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm border border-neutral-200 dark:border-neutral-700 p-6">
          <h2
            className="text-xl font-light text-neutral-900 dark:text-white mb-4"
            style={{ fontFamily: 'var(--font-bodoni)' }}
          >
            Projets
          </h2>
          <p className="text-neutral-600 dark:text-neutral-400" style={{ fontFamily: 'var(--font-raleway)' }}>
            Gestion des projets (à venir)
          </p>
        </div>

        <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm border border-neutral-200 dark:border-neutral-700 p-6">
          <h2
            className="text-xl font-light text-neutral-900 dark:text-white mb-4"
            style={{ fontFamily: 'var(--font-bodoni)' }}
          >
            Boutique
          </h2>
          <p className="text-neutral-600 dark:text-neutral-400 mb-4" style={{ fontFamily: 'var(--font-raleway)' }}>
            Gestion des produits (à venir)
          </p>
          <Link
            href="/admin/products"
            className="inline-block px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded-lg hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors text-sm uppercase tracking-wider"
            style={{ fontFamily: 'var(--font-raleway)' }}
          >
            Voir les produits
          </Link>
        </div>

        <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm border border-neutral-200 dark:border-neutral-700 p-6">
          <h2
            className="text-xl font-light text-neutral-900 dark:text-white mb-4"
            style={{ fontFamily: 'var(--font-bodoni)' }}
          >
            Demandes de rendez-vous
          </h2>
          <p className="text-neutral-600 dark:text-neutral-400" style={{ fontFamily: 'var(--font-raleway)' }}>
            {bookingsCount} demande{bookingsCount !== 1 ? 's' : ''} enregistrée{bookingsCount !== 1 ? 's' : ''}
          </p>
        </div>
      </div>
    </div>
  )
}




