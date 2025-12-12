import { verifyAdminSession } from '@/lib/adminAuth'
import { redirect } from 'next/navigation'
import AddCategoryForm from '@/components/admin/AddCategoryForm'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function AdminAddCategoryPage() {
  // Verify session using JWT (new auth system)
  const session = await verifyAdminSession()
  if (!session) {
    redirect('/admin/login')
  }
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <Link
            href="/admin/categories"
            className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4 transition-colors"
            style={{ fontFamily: 'var(--font-raleway)' }}
          >
            ← Retour aux catégories
          </Link>
          <h1
            className="text-3xl font-bold text-gray-900"
            style={{ fontFamily: 'var(--font-bodoni)' }}
          >
            Ajouter une catégorie
          </h1>
        </div>
        <AddCategoryForm />
      </div>
    </div>
  )
}

