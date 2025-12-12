/**
 * Admin Topbar
 * Top navigation bar with user info and notifications
 */

'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface AdminTopbarProps {
  onMenuClick: () => void
  onThemeToggle: () => void
  theme: 'light' | 'dark'
}

export default function AdminTopbar({ onMenuClick, onThemeToggle, theme }: AdminTopbarProps) {
  const [admin, setAdmin] = useState<{ name?: string; email: string } | null>(null)
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    // Fetch admin info
    fetch('/api/admin/me')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setAdmin(data.admin)
        }
      })
      .catch(console.error)

    // Fetch unread notifications count
    fetch('/api/admin/notifications?unread=true')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setUnreadCount(data.count || 0)
        }
      })
      .catch(console.error)
  }, [])

  return (
    <header className="sticky top-0 z-20 bg-white border-b border-neutral-200 dark:bg-neutral-900 dark:border-neutral-800">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Left: Menu Button */}
        <button
          onClick={onMenuClick}
          className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        {/* Right: Actions */}
        <div className="flex items-center gap-4">
          {/* Notifications */}
          <Link
            href="/admin/notifications"
            className="relative p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </Link>

          {/* Theme Toggle */}
          <button
            onClick={onThemeToggle}
            className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
            title={theme === 'light' ? 'Mode sombre' : 'Mode clair'}
          >
            {theme === 'light' ? (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            )}
          </button>

          {/* User Info */}
          <div className="flex items-center gap-3 pl-4 border-l border-neutral-200 dark:border-neutral-800">
            <div className="text-right">
              <p className="text-sm font-medium text-neutral-900 dark:text-white" style={{ fontFamily: 'var(--font-raleway)' }}>
                {admin?.name || admin?.email || 'Admin'}
              </p>
              <p className="text-xs text-neutral-500 dark:text-neutral-400" style={{ fontFamily: 'var(--font-raleway)' }}>
                {admin?.email}
              </p>
            </div>
            <div className="w-10 h-10 rounded-full bg-neutral-200 dark:bg-neutral-700 flex items-center justify-center">
              <span className="text-sm font-medium text-neutral-600 dark:text-neutral-300">
                {(admin?.name || admin?.email || 'A')[0].toUpperCase()}
              </span>
            </div>
          </div>

          {/* Logout Button */}
          <form action="/api/admin/logout" method="POST" className="ml-4">
            <button
              type="submit"
              className="px-4 py-2 text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors uppercase tracking-wider"
              style={{ fontFamily: 'var(--font-raleway)' }}
            >
              Logout
            </button>
          </form>
        </div>
      </div>
    </header>
  )
}


