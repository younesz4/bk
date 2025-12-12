import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { formatDate } from '@/lib/utils'

export const dynamic = 'force-dynamic'

export default async function AdminDashboard() {
  // Fetch statistics
  const [totalProducts, totalCategories, totalOrders, pendingOrders, outOfStockProducts, latestProducts] = await Promise.all([
    prisma.product.count(),
    prisma.category.count(),
    prisma.order.count().catch(() => 0), // Handle if Order table doesn't exist
    prisma.order.count({ where: { status: 'PENDING' } }).catch(() => 0),
    prisma.product.count({ where: { stock: 0 } }),
    prisma.product.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
    }),
  ])

  return (
    <>
      {/* Title */}
      <h1
        className="text-3xl md:text-4xl mb-8"
        style={{ fontFamily: 'var(--font-bodoni)' }}
      >
        Tableau de bord
      </h1>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {/* Total Products */}
        <div className="bg-frost rounded-lg shadow-sm border border-neutral-200 p-5">
          <p
            className="text-neutral-600 mb-2"
            style={{ fontFamily: 'var(--font-raleway)', fontSize: '14px' }}
          >
            Total Produits
          </p>
          <p
            className="text-2xl font-medium text-neutral-900"
            style={{ fontFamily: 'var(--font-bodoni)' }}
          >
            {totalProducts}
          </p>
        </div>

        {/* Total Categories */}
        <div className="bg-frost rounded-lg shadow-sm border border-neutral-200 p-5">
          <p
            className="text-neutral-600 mb-2"
            style={{ fontFamily: 'var(--font-raleway)', fontSize: '14px' }}
          >
            Total Catégories
          </p>
          <p
            className="text-2xl font-medium text-neutral-900"
            style={{ fontFamily: 'var(--font-bodoni)' }}
          >
            {totalCategories}
          </p>
        </div>

        {/* Total Orders */}
        <div className="bg-frost rounded-lg shadow-sm border border-neutral-200 p-5">
          <p
            className="text-neutral-600 mb-2"
            style={{ fontFamily: 'var(--font-raleway)', fontSize: '14px' }}
          >
            Total Commandes
          </p>
          <p
            className="text-2xl font-medium text-neutral-900"
            style={{ fontFamily: 'var(--font-bodoni)' }}
          >
            {totalOrders}
          </p>
        </div>

        {/* Pending Orders */}
        <div className="bg-frost rounded-lg shadow-sm border border-neutral-200 p-5">
          <p
            className="text-neutral-600 mb-2"
            style={{ fontFamily: 'var(--font-raleway)', fontSize: '14px' }}
          >
            Commandes en attente
          </p>
          <p
            className="text-2xl font-medium text-neutral-900"
            style={{ fontFamily: 'var(--font-bodoni)' }}
          >
            {pendingOrders}
          </p>
        </div>

        {/* Out of Stock Products */}
        <div className="bg-frost rounded-lg shadow-sm border border-neutral-200 p-5">
          <p
            className="text-neutral-600 mb-2"
            style={{ fontFamily: 'var(--font-raleway)', fontSize: '14px' }}
          >
            Produits en rupture
          </p>
          <p
            className="text-2xl font-medium text-neutral-900"
            style={{ fontFamily: 'var(--font-bodoni)' }}
          >
            {outOfStockProducts}
          </p>
        </div>
      </div>

      {/* Latest Products */}
      <div className="bg-frost rounded-lg shadow-sm border border-neutral-200 p-6">
        <h2
          className="text-xl md:text-2xl mb-6"
          style={{ fontFamily: 'var(--font-bodoni)' }}
        >
          Derniers produits ajoutés
        </h2>

        {latestProducts.length === 0 ? (
          <p
            className="text-neutral-500"
            style={{ fontFamily: 'var(--font-raleway)', fontSize: '14px' }}
          >
            Aucun produit pour le moment
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-neutral-200">
                  <th
                    className="px-4 py-3 text-left font-medium text-neutral-700"
                    style={{ fontFamily: 'var(--font-raleway)', fontSize: '14px' }}
                  >
                    Nom
                  </th>
                  <th
                    className="px-4 py-3 text-left font-medium text-neutral-700"
                    style={{ fontFamily: 'var(--font-raleway)', fontSize: '14px' }}
                  >
                    Catégorie
                  </th>
                  <th
                    className="px-4 py-3 text-left font-medium text-neutral-700"
                    style={{ fontFamily: 'var(--font-raleway)', fontSize: '14px' }}
                  >
                    Prix
                  </th>
                  <th
                    className="px-4 py-3 text-left font-medium text-neutral-700"
                    style={{ fontFamily: 'var(--font-raleway)', fontSize: '14px' }}
                  >
                    Date d'ajout
                  </th>
                  <th
                    className="px-4 py-3 text-left font-medium text-neutral-700"
                    style={{ fontFamily: 'var(--font-raleway)', fontSize: '14px' }}
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {latestProducts.map((product) => (
                  <tr
                    key={product.id}
                    className="border-b border-neutral-100 hover:bg-neutral-50 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <span
                        className="text-neutral-900"
                        style={{ fontFamily: 'var(--font-raleway)', fontSize: '14px' }}
                      >
                        {product.name}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className="text-neutral-600"
                        style={{ fontFamily: 'var(--font-raleway)', fontSize: '14px' }}
                      >
                        {product.category.name}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className="text-neutral-900"
                        style={{ fontFamily: 'var(--font-raleway)', fontSize: '14px' }}
                      >
                        {new Intl.NumberFormat('fr-FR', {
                          style: 'currency',
                          currency: 'EUR',
                        }).format(product.price / 100)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className="text-neutral-600"
                        style={{ fontFamily: 'var(--font-raleway)', fontSize: '14px' }}
                      >
                        {formatDate(product.createdAt)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <Link
                        href={`/admin/products/${product.id}/edit`}
                        className="inline-flex items-center px-3 py-1.5 text-neutral-700 hover:text-black hover:bg-neutral-100 rounded-sm transition-colors"
                        style={{ fontFamily: 'var(--font-raleway)', fontSize: '14px' }}
                      >
                        Voir
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  )
}
