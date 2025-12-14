import { ReactNode } from 'react'
import { redirect } from 'next/navigation'
import { verifyAdminSession } from '@/lib/adminAuth'
import AdminTopBar from './components/AdminTopBar'
import AdminSidebar from './components/AdminSidebar'
import { headers } from 'next/headers'

export default async function AdminLayout({ children }: { children: ReactNode }) {
  // Get the current pathname from headers (set by middleware)
  const headersList = await headers()
  const pathname = headersList.get('x-pathname') || ''
  
  // Don't check auth for login page (prevents redirect loop)
  // If pathname is empty or not set, it might be login page, so skip auth check
  const isLoginPage = pathname === '/admin/login' || pathname === ''
  
  if (!isLoginPage) {
    const session = await verifyAdminSession()
    
    if (!session) {
      redirect('/admin/login')
    }
  }
  
  // For login page, just render children without layout
  if (isLoginPage) {
    return <>{children}</>
  }

  return (
    <div className="min-h-screen bg-frost dark:bg-neutral-900">
      <AdminTopBar />
      <div className="flex pt-16">
        <AdminSidebar />
        <main className="flex-1 ml-64 min-h-[calc(100vh-4rem)]">
          <div className="admin-container">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
