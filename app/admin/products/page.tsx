import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import ProductsTable from './ProductsTable'

export const dynamic = 'force-dynamic'

export default async function AdminProductsPage() {
  // Fetch all products with Prisma
  const products = await prisma.product.findMany({
    include: {
      category: true,
      images: {
        take: 1,
        orderBy: { order: 'asc' },
      },
    },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <>
      {/* Header */}
      <div className="mb-8 flex justify-between items-start">
        <div>
          <h1
            className="text-3xl md:text-4xl mb-2"
            style={{ fontFamily: 'var(--font-bodoni)' }}
          >
            Produits
          </h1>
        </div>
        <Link
          href="/admin/products/new"
          className="px-4 py-2 bg-black text-white rounded-sm hover:opacity-80 transition-opacity"
          style={{ fontFamily: 'var(--font-raleway)', fontSize: '14px' }}
        >
          Ajouter un produit
        </Link>
      </div>

      {/* Products Table */}
      <ProductsTable products={products} />
    </>
  )
}
