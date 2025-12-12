'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { useCart } from '@/contexts/CartContext'

export default function CartPage() {
  const {
    cartItems,
    removeFromCart,
    updateQuantity,
    getTotalPrice,
    clearCart,
  } = useCart()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleCheckout = async () => {
    if (cartItems.length === 0) return

    setIsLoading(true)
    setError(null)

    try {
      // Format cart items for Stripe
      const items = cartItems.map((item) => ({
        id: item.id,
        name: item.name,
        price: item.price, // Already in cents
        quantity: item.quantity,
        description: typeof item.category === 'object' ? item.category.name : item.category,
        images: item.images?.map((img) => img.url).filter(Boolean) || [],
      }))

      // Call checkout API
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ items }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create checkout session')
      }

      // Redirect to Stripe Checkout
      if (data.url) {
        window.location.href = data.url
      } else {
        throw new Error('No checkout URL received')
      }
    } catch (err: any) {
      console.error('Checkout error:', err)
      setError(err.message || 'Une erreur est survenue lors de la création de la session de paiement.')
      setIsLoading(false)
    }
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen pt-32 pb-24 px-6 md:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1
            className="text-4xl md:text-5xl mb-6"
            style={{ fontFamily: 'var(--font-bodoni)' }}
          >
            Votre panier est vide
          </h1>
          <p
            className="text-lg text-neutral-600 mb-8"
            style={{ fontFamily: 'var(--font-raleway)' }}
          >
            Découvrez notre collection de mobilier d'exception
          </p>
          <Link
            href="/boutique"
            className="inline-block px-8 py-4 bg-black text-white hover:bg-neutral-800 transition-colors"
            style={{ fontFamily: 'var(--font-raleway)' }}
          >
            Continuer les achats
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-32 pb-24 px-6 md:px-8">
      <div className="max-w-7xl mx-auto">
        <h1
          className="text-4xl md:text-5xl mb-12"
          style={{ fontFamily: 'var(--font-bodoni)' }}
        >
          Panier
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            {cartItems.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex gap-6 pb-6 border-b border-neutral-200"
              >
                {/* Product Image */}
                <div className="relative w-32 h-32 md:w-40 md:h-40 flex-shrink-0 bg-neutral-100 rounded-lg overflow-hidden">
                  <Image
                    src={typeof item.images?.[0] === 'string' 
                      ? item.images[0] 
                      : (item.images?.[0] as any)?.url || '/placeholder.jpg'}
                    alt={item.images?.[0]?.alt || item.name}
                    fill
                    className="object-cover"
                    quality={75}
                    sizes="160px"
                    loading="lazy"
                  />
                </div>

                {/* Product Info */}
                <div className="flex-1 min-w-0">
                  <Link href={`/boutique/${item.slug}`}>
                    <h3
                      className="text-xl md:text-2xl mb-2 hover:opacity-70 transition-opacity"
                      style={{ fontFamily: 'var(--font-bodoni)' }}
                    >
                      {item.name}
                    </h3>
                  </Link>
                  <p
                    className="text-sm text-neutral-600 mb-2"
                    style={{ fontFamily: 'var(--font-raleway)' }}
                  >
                    {typeof item.category === 'object' ? item.category.name : item.category}
                  </p>
                  <p
                    className="text-lg font-medium mb-4"
                    style={{ fontFamily: 'var(--font-raleway)' }}
                  >
                    {new Intl.NumberFormat('fr-FR', {
                      style: 'currency',
                      currency: 'EUR',
                    }).format(item.price / 100)}
                  </p>

                  {/* Quantity Controls */}
                  <div className="flex items-center gap-4 mb-4">
                    <span
                      className="text-sm"
                      style={{ fontFamily: 'var(--font-raleway)' }}
                    >
                      Quantité:
                    </span>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-10 h-10 flex items-center justify-center border border-neutral-300 hover:border-black transition-colors"
                        aria-label="Diminuer la quantité"
                      >
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <line x1="5" y1="12" x2="19" y2="12"></line>
                        </svg>
                      </button>
                      <span
                        className="w-12 text-center text-lg"
                        style={{ fontFamily: 'var(--font-raleway)' }}
                      >
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-10 h-10 flex items-center justify-center border border-neutral-300 hover:border-black transition-colors"
                        aria-label="Augmenter la quantité"
                      >
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <line x1="12" y1="5" x2="12" y2="19"></line>
                          <line x1="5" y1="12" x2="19" y2="12"></line>
                        </svg>
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-neutral-600 hover:text-black transition-colors text-sm"
                    style={{ fontFamily: 'var(--font-raleway)' }}
                  >
                    Retirer
                  </button>
                </div>

                {/* Subtotal */}
                <div className="text-right">
                  <p
                    className="text-lg font-medium"
                    style={{ fontFamily: 'var(--font-raleway)' }}
                  >
                    {new Intl.NumberFormat('fr-FR', {
                      style: 'currency',
                      currency: 'EUR',
                    }).format((item.price / 100) * item.quantity)}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-32 bg-neutral-50 p-6 md:p-8">
              <h2
                className="text-2xl mb-6"
                style={{ fontFamily: 'var(--font-bodoni)' }}
              >
                Résumé de la commande
              </h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span style={{ fontFamily: 'var(--font-raleway)' }}>
                    Sous-total
                  </span>
                  <span style={{ fontFamily: 'var(--font-raleway)' }}>
                    {new Intl.NumberFormat('fr-FR', {
                      style: 'currency',
                      currency: 'EUR',
                    }).format(getTotalPrice())}
                  </span>
                </div>
                <div className="flex justify-between text-sm text-neutral-600">
                  <span style={{ fontFamily: 'var(--font-raleway)' }}>
                    Livraison
                  </span>
                  <span style={{ fontFamily: 'var(--font-raleway)' }}>
                    Calculée à l'étape suivante
                  </span>
                </div>
                <div className="border-t border-neutral-300 pt-4 flex justify-between">
                  <span
                    className="text-lg font-medium"
                    style={{ fontFamily: 'var(--font-raleway)' }}
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
                    }).format(getTotalPrice())}
                  </span>
                </div>
              </div>

              {error && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded">
                  {error}
                </div>
              )}
              <button
                onClick={handleCheckout}
                disabled={isLoading || cartItems.length === 0}
                className="block w-full bg-black text-white text-center py-4 hover:bg-neutral-800 transition-colors mb-4 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ fontFamily: 'var(--font-raleway)' }}
              >
                {isLoading ? 'Traitement...' : 'Passer la commande'}
              </button>

              <button
                onClick={clearCart}
                className="w-full text-neutral-600 hover:text-black py-2 transition-colors text-sm"
                style={{ fontFamily: 'var(--font-raleway)' }}
              >
                Vider le panier
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

