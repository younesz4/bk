import { verifyAdminSession } from '@/lib/adminAuth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import EditCategoryForm from './EditCategoryForm'
import { updateCategory } from './actions'

export const dynamic = 'force-dynamic'

interface PageProps {
  params: Promise<{ id: string }>
}

export { updateCategory }

export default async function EditCategoryPage({ params }: PageProps) {
  const session = await verifyAdminSession()
  if (!session) redirect('/admin/login')

  const { id } = await params

  const category = await prisma.category.findUnique({
    where: { id },
  })

  if (!category) redirect('/admin/categories?notfound=1')

  return (
    <div className="min-h-screen bg-[#f7f7f5] pt-24 pb-16">
      <div className="max-w-5xl mx-auto px-4 md:px-8">
        <div className="border border-neutral-200 bg-frost px-6 md:px-10 py-10 md:py-12">
          <EditCategoryForm category={category} />
        </div>
      </div>
    </div>
  )
}

