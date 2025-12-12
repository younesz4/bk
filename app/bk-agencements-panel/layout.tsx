/**
 * Admin Panel Layout
 * Subtle admin layout with top bar and logout
 */

'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function AdminPanelLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout', { method: 'POST' })
      router.push('/bk-agencements-panel/login')
      router.refresh()
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900">
      {/* Top Admin Bar */}
      <header className="bg-white dark:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-700">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link
            href="/bk-agencements-panel"
            className="text-lg font-light text-neutral-900 dark:text-white tracking-wide"
            style={{ fontFamily: 'var(--font-bodoni)' }}
          >
            BK Agencements Panel
          </Link>
          <button
            onClick={handleLogout}
            className="px-4 py-2 text-sm text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white transition-colors uppercase tracking-wider"
            style={{ fontFamily: 'var(--font-raleway)' }}
          >
            Déconnexion
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {children}
      </main>
    </div>
  )
}




