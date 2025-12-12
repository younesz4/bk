/**
 * Admin Dashboard Layout
 * Luxury layout with sidebar and topbar
 */

'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import AdminSidebar from './AdminSidebar'
import AdminTopbar from './AdminTopbar'

interface AdminLayoutProps {
  children: React.ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [theme, setTheme] = useState<'light' | 'dark'>('light')

  // Hide sidebar on login page
  const isLoginPage = pathname === '/admin/login'

  useEffect(() => {
    // Load theme from localStorage
    const savedTheme = localStorage.getItem('admin-theme') as 'light' | 'dark' | null
    if (savedTheme) {
      setTheme(savedTheme)
    }
  }, [])

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
    localStorage.setItem('admin-theme', newTheme)
    document.documentElement.classList.toggle('dark', newTheme === 'dark')
  }

  if (isLoginPage) {
    return <>{children}</>
  }

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'dark bg-neutral-900' : 'bg-neutral-50'}`}>
      <div className="flex">
        {/* Sidebar */}
        <AdminSidebar
          isOpen={sidebarOpen}
          onToggle={() => setSidebarOpen(!sidebarOpen)}
          theme={theme}
        />

        {/* Main Content */}
        <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-0'}`}>
          {/* Topbar */}
          <AdminTopbar
            onMenuClick={() => setSidebarOpen(!sidebarOpen)}
            onThemeToggle={toggleTheme}
            theme={theme}
          />

          {/* Page Content */}
          <main className="p-6 md:p-8">
            {children}
          </main>
        </div>
      </div>
    </div>
  )
}




