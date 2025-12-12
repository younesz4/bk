import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Image from 'next/image'

interface ConfirmationPageProps {
  params: Promise<{ orderId: string }>
}

export default async function ConfirmationPage({ params }: ConfirmationPageProps) {
  const { orderId } = await params

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      items: {
        include: {
          product: {
            include: {
              images: {
                orderBy: { order: 'asc' },
                take: 1,
              },
              category: true,
            },
          },
        },
      },
    },
  })

  if (!order) {
    notFound()
  }

  return (
    <div className="min-h-screen pt-32 pb-24 px-6 md:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-12 text-center">
          <h1
            className="text-4xl md:text-5xl mb-4"
            style={{ fontFamily: 'var(--font-bodoni)' }}
          >
            Commande confirmée
          </h1>
          <p
            className="text-lg text-neutral-600"
            style={{ fontFamily: 'var(--font-raleway)' }}
          >
            Merci pour votre commande
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-8 md:p-10 mb-8">
          <h2
            className="text-2xl mb-6"
            style={{ fontFamily: 'var(--font-bodoni)' }}
          >
            Informations de commande
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p
                className="text-sm text-neutral-500 mb-1"
                style={{ fontFamily: 'var(--font-raleway)' }}
              >
                Numéro de commande
              </p>
              <p
                className="text-base font-medium"
                style={{ fontFamily: 'var(--font-raleway)' }}
              >
                {order.id}
              </p>
            </div>
            <div>
              <p
                className="text-sm text-neutral-500 mb-1"
                style={{ fontFamily: 'var(--font-raleway)' }}
              >
                Date
              </p>
              <p
                className="text-base font-medium"
                style={{ fontFamily: 'var(--font-raleway)' }}
              >
                {new Date(order.createdAt).toLocaleDateString('fr-FR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-8 md:p-10 mb-8">
          <h2
            className="text-2xl mb-6"
            style={{ fontFamily: 'var(--font-bodoni)' }}
          >
            Informations client
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p
                className="text-sm text-neutral-500 mb-1"
                style={{ fontFamily: 'var(--font-raleway)' }}
              >
                Nom
              </p>
              <p
                className="text-base font-medium"
                style={{ fontFamily: 'var(--font-raleway)' }}
              >
                {order.customerName}
              </p>
            </div>
            <div>
              <p
                className="text-sm text-neutral-500 mb-1"
                style={{ fontFamily: 'var(--font-raleway)' }}
              >
                Email
              </p>
              <p
                className="text-base font-medium"
                style={{ fontFamily: 'var(--font-raleway)' }}
              >
                {order.customerEmail}
              </p>
            </div>
            <div>
              <p
                className="text-sm text-neutral-500 mb-1"
                style={{ fontFamily: 'var(--font-raleway)' }}
              >
                Téléphone
              </p>
              <p
                className="text-base font-medium"
                style={{ fontFamily: 'var(--font-raleway)' }}
              >
                {order.customerPhone}
              </p>
            </div>
            <div>
              <p
                className="text-sm text-neutral-500 mb-1"
                style={{ fontFamily: 'var(--font-raleway)' }}
              >
                Adresse
              </p>
              <p
                className="text-base font-medium"
                style={{ fontFamily: 'var(--font-raleway)' }}
              >
                {order.addressLine1}
              </p>
            </div>
            <div>
              <p
                className="text-sm text-neutral-500 mb-1"
                style={{ fontFamily: 'var(--font-raleway)' }}
              >
                Ville
              </p>
              <p
                className="text-base font-medium"
                style={{ fontFamily: 'var(--font-raleway)' }}
              >
                {order.city}
              </p>
            </div>
            <div>
              <p
                className="text-sm text-neutral-500 mb-1"
                style={{ fontFamily: 'var(--font-raleway)' }}
              >
                Pays
              </p>
              <p
                className="text-base font-medium"
                style={{ fontFamily: 'var(--font-raleway)' }}
              >
                {order.country}
              </p>
            </div>
            {order.notes && (
              <div className="md:col-span-2">
                <p
                  className="text-sm text-neutral-500 mb-1"
                  style={{ fontFamily: 'var(--font-raleway)' }}
                >
                  Notes
                </p>
                <p
                  className="text-base font-medium"
                  style={{ fontFamily: 'var(--font-raleway)' }}
                >
                  {order.notes}
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-8 md:p-10 mb-8">
          <h2
            className="text-2xl mb-6"
            style={{ fontFamily: 'var(--font-bodoni)' }}
          >
            Articles commandés
          </h2>
          <div className="space-y-6">
            {order.items.map((item) => (
              <div key={item.id} className="flex gap-6 pb-6 border-b border-neutral-200 last:border-0">
                <div className="relative w-24 h-24 md:w-32 md:h-32 flex-shrink-0 bg-neutral-100 rounded-lg overflow-hidden">
                  {item.product.images[0] ? (
                    <Image
                      src={item.product.images[0].url}
                      alt={item.product.images[0].alt || item.product.name}
                      fill
                      className="object-cover"
                      quality={75}
                      sizes="128px"
                    />
                  ) : (
                    <div className="w-full h-full bg-neutral-200" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3
                    className="text-lg md:text-xl mb-2"
                    style={{ fontFamily: 'var(--font-bodoni)' }}
                  >
                    {item.product.name}
                  </h3>
                  {item.product.category && (
                    <p
                      className="text-sm text-neutral-600 mb-2"
                      style={{ fontFamily: 'var(--font-raleway)' }}
                    >
                      {item.product.category.name}
                    </p>
                  )}
                  <p
                    className="text-sm text-neutral-500 mb-2"
                    style={{ fontFamily: 'var(--font-raleway)' }}
                  >
                    Quantité: {item.quantity}
                  </p>
                  <p
                    className="text-base font-medium"
                    style={{ fontFamily: 'var(--font-raleway)' }}
                  >
                    {new Intl.NumberFormat('fr-FR', {
                      style: 'currency',
                      currency: 'EUR',
                    }).format((item.unitPrice / 100) * item.quantity)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-8 md:p-10">
          <div className="flex justify-between items-center">
            <span
              className="text-2xl"
              style={{ fontFamily: 'var(--font-bodoni)' }}
            >
              Total
            </span>
            <span
              className="text-3xl font-medium"
              style={{ fontFamily: 'var(--font-bodoni)' }}
            >
              {new Intl.NumberFormat('fr-FR', {
                style: 'currency',
                currency: 'EUR',
              }).format(order.totalAmount / 100 / 100)}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

