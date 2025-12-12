import { prisma } from '@/lib/prisma'
import { verifyAdminSession } from '@/lib/adminAuth'
import { redirect } from 'next/navigation'
import CategoriesTable from '@/components/admin/CategoriesTable'
import { deleteCategory } from './actions'

export const dynamic = 'force-dynamic'

// Re-export the server action for use in client components
export { deleteCategory }

export default async function AdminCategoriesPage() {
  // Verify session using JWT (new auth system)
  const session = await verifyAdminSession()
  if (!session) {
    redirect('/admin/login')
  }

  // Fetch categories with products and their first image
  const categories = await prisma.category.findMany({
    include: {
      products: {
        include: {
          images: {
            take: 1,
            orderBy: { order: 'asc' },
          },
        },
      },
      _count: {
        select: {
          products: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  })

  // Format categories for client component
  const formattedCategories = categories.map((category) => {
    // Get first product image as category thumbnail
    const firstProduct = category.products.find((p) => p.images.length > 0)
    const thumbnail = firstProduct?.images[0]?.url || null

    return {
      id: category.id,
      name: category.name,
      slug: category.slug,
      thumbnail,
      productCount: category._count.products,
      createdAt: category.createdAt.toISOString(),
    }
  })

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f7f7f5' }}>
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <div>
            <div className="text-sm text-gray-500 mb-2" style={{ fontFamily: 'var(--font-raleway)' }}>
              [ 04 ]
            </div>
            <h1
              className="text-4xl font-bold text-gray-900"
              style={{ fontFamily: 'var(--font-bodoni)' }}
            >
              GESTION DES CATÉGORIES
            </h1>
          </div>
          <a
            href="/admin/categories/add"
            className="px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-medium"
            style={{ fontFamily: 'var(--font-raleway)' }}
          >
            Ajouter une catégorie
          </a>
        </div>

        {/* Categories Table */}
        <CategoriesTable categories={formattedCategories} />
      </div>
    </div>
  )
}
