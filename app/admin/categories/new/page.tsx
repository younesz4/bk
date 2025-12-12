import { verifyAdminSession } from '@/lib/adminAuth'
import { redirect } from 'next/navigation'
import CreateCategoryForm from './CreateCategoryForm'
import { createCategory } from './actions'

export const dynamic = 'force-dynamic'

export { createCategory }

export default async function NewCategoryPage() {
  const session = await verifyAdminSession()
  if (!session) redirect('/admin/login')

  return (
    <div className="min-h-screen bg-[#f7f7f5] pt-24 pb-16">
      <div className="max-w-5xl mx-auto px-4 md:px-8">
        <div className="border border-neutral-200 bg-frost px-6 md:px-10 py-10 md:py-12">
          <CreateCategoryForm />
        </div>
      </div>
    </div>
  )
}

