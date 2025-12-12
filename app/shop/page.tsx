import { Suspense } from 'react'
import { prisma } from '@/lib/prisma'
import CategoryGrid from '@/components/CategoryGrid'
import ShopContent from '@/components/ShopContent'

export const dynamic = 'force-dynamic'

interface ShopPageProps {
  searchParams: Promise<{ category?: string; page?: string }>
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  // Fetch categories from database with imageUrl
  const categories = await prisma.category.findMany({
    select: {
      id: true,
      name: true,
      slug: true,
      imageUrl: true,
    },
    orderBy: { name: 'asc' },
  })

  return (
    <div className="bg-white">
      {/* Category Grid Section */}
      <CategoryGrid categories={categories} />

      {/* Products Section */}
      <section className="bg-white">
        <div className="max-w-7xl mx-auto px-6">
          {/* Section Title */}
          <div className="mb-8 md:mb-12">
            <h1 className="text-black mb-2">
              Produits
            </h1>
          </div>

          <Suspense fallback={<div className="h-16" />}>
            <ShopContent />
          </Suspense>
        </div>
      </section>
    </div>
  )
}
