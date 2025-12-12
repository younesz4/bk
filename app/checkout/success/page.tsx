'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'

interface OrderItem {
  id: string
  name: string
  price: number
  quantity: number
  product: {
    images: Array<{ url: string; alt: string | null }>
  }
}

interface Order {
  id: string
  customerName: string
  email: string
  totalPrice: number
  status: string
  items: OrderItem[]
  createdAt: string
}

export default function CheckoutSuccessPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const orderId = searchParams.get('orderId')

  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!orderId) {
      router.push('/boutique')
      return
    }

    // Fetch order details
    const fetchOrder = async () => {
      try {
        const res = await fetch(`/api/orders/${orderId}`)
        if (res.ok) {
          const data = await res.json()
          if (data.success && data.data) {
            setOrder(data.data)
          }
        }
      } catch (error) {
        console.error('Error fetching order:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchOrder()
  }, [orderId, router])

  if (!orderId) {
    return null
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-cream-50 pt-32 pb-24 px-6 md:px-8 flex items-center justify-center">
        <div
          className="text-lg text-neutral-600"
          style={{ fontFamily: 'var(--font-raleway)' }}
        >
          Chargement...
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-cream-50 pt-32 pb-24 px-6 md:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Success Message */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
            <svg
              width="40"
              height="40"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-green-600"
            >
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </div>
          <h1
            className="text-4xl md:text-5xl mb-4"
            style={{ fontFamily: 'var(--font-bodoni)' }}
          >
            Merci pour votre commande !
          </h1>
          <p
            className="text-lg text-neutral-600"
            style={{ fontFamily: 'var(--font-raleway)' }}
          >
            Votre commande a été enregistrée avec succès.
          </p>
        </div>

        {/* Order Details */}
        <div className="bg-white rounded-sm border border-neutral-200 p-6 md:p-8 mb-8">
          <div className="mb-6">
            <h2
              className="text-2xl mb-4"
              style={{ fontFamily: 'var(--font-bodoni)' }}
            >
              Détails de la commande
            </h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span
                  className="text-neutral-600"
                  style={{ fontFamily: 'var(--font-raleway)' }}
                >
                  Numéro de commande:
                </span>
                <span
                  className="font-medium"
                  style={{ fontFamily: 'var(--font-raleway)' }}
                >
                  {orderId}
                </span>
              </div>
              {order && (
                <>
                  <div className="flex justify-between">
                    <span
                      className="text-neutral-600"
                      style={{ fontFamily: 'var(--font-raleway)' }}
                    >
                      Client:
                    </span>
                    <span
                      className="font-medium"
                      style={{ fontFamily: 'var(--font-raleway)' }}
                    >
                      {order.customerName}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span
                      className="text-neutral-600"
                      style={{ fontFamily: 'var(--font-raleway)' }}
                    >
                      Email:
                    </span>
                    <span
                      className="font-medium"
                      style={{ fontFamily: 'var(--font-raleway)' }}
                    >
                      {order.email}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span
                      className="text-neutral-600"
                      style={{ fontFamily: 'var(--font-raleway)' }}
                    >
                      Statut:
                    </span>
                    <span
                      className="font-medium capitalize"
                      style={{ fontFamily: 'var(--font-raleway)' }}
                    >
                      {order.status === 'pending' ? 'En attente' : order.status}
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Order Items */}
          {order && order.items && order.items.length > 0 && (
            <div className="pt-6 border-t border-neutral-200">
              <h3
                className="text-xl mb-4"
                style={{ fontFamily: 'var(--font-bodoni)' }}
              >
                Articles commandés
              </h3>
              <div className="space-y-4">
                {order.items.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="relative w-16 h-16 md:w-20 md:h-20 flex-shrink-0 bg-neutral-100 rounded-sm overflow-hidden">
                      {item.product?.images?.[0]?.url ? (
                        <Image
                          src={item.product.images[0].url}
                          alt={item.product.images[0].alt || item.name}
                          fill
                          className="object-cover"
                          quality={75}
                          sizes="80px"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-neutral-400 text-xs">
                          No Image
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4
                        className="text-base mb-1"
                        style={{ fontFamily: 'var(--font-bodoni)' }}
                      >
                        {item.name}
                      </h4>
                      <div className="flex items-center justify-between">
                        <span
                          className="text-sm text-neutral-600"
                          style={{ fontFamily: 'var(--font-raleway)' }}
                        >
                          {item.quantity} × {new Intl.NumberFormat('fr-FR', {
                            style: 'currency',
                            currency: 'EUR',
                          }).format(item.price / 100)}
                        </span>
                        <span
                          className="text-base font-medium"
                          style={{ fontFamily: 'var(--font-raleway)' }}
                        >
                          {new Intl.NumberFormat('fr-FR', {
                            style: 'currency',
                            currency: 'EUR',
                          }).format((item.price / 100) * item.quantity)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Total */}
              <div className="pt-6 mt-6 border-t border-neutral-200">
                <div className="flex justify-between items-center">
                  <span
                    className="text-lg font-medium"
                    style={{ fontFamily: 'var(--font-bodoni)' }}
                  >
                    Total
                  </span>
                  <span
                    className="text-xl font-medium"
                    style={{ fontFamily: 'var(--font-bodoni)' }}
                  >
                    {new Intl.NumberFormat('fr-FR', {
                      style: 'currency',
                      currency: 'EUR',
                    }).format(order.totalPrice / 100)}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Payment Info */}
          <div className="pt-6 mt-6 border-t border-neutral-200">
            <p
              className="text-sm text-neutral-600"
              style={{ fontFamily: 'var(--font-raleway)' }}
            >
              <strong>Mode de paiement:</strong> Paiement à la livraison (Cash on Delivery)
            </p>
            <p
              className="text-sm text-neutral-600 mt-2"
              style={{ fontFamily: 'var(--font-raleway)' }}
            >
              Vous recevrez un email de confirmation avec tous les détails de votre commande.
            </p>
          </div>
        </div>

        {/* Back to Home Button */}
        <div className="text-center">
          <Link
            href="/"
            className="inline-block px-8 py-4 bg-black text-white uppercase tracking-wider text-sm font-light hover:bg-neutral-800 transition-colors focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
            style={{ fontFamily: 'var(--font-raleway)' }}
          >
            Retour à l'accueil
          </Link>
        </div>
      </div>
    </div>
  )
}
