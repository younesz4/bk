import { ReactNode } from 'react'
import { redirect } from 'next/navigation'
import { verifyAdminSession } from '@/lib/adminAuth'
import AdminTopBar from './components/AdminTopBar'
import AdminSidebar from './components/AdminSidebar'

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const session = await verifyAdminSession()
  
  if (!session) {
    redirect('/admin/login')
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
