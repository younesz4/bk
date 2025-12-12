'use client'

import React from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useCart } from '@/contexts/CartContext'
import { useSafeQuantityUpdate } from '@/hooks/useSafeQuantityUpdate'

export default function Cart() {
  const { cartItems, isOpen, setIsOpen, removeFromCart, getTotalPrice, clearCart } = useCart()
  const { safeUpdateQuantity, warning } = useSafeQuantityUpdate()
  const router = useRouter()
  const cartRef = useRef<HTMLDivElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)

  // Focus trap and keyboard navigation
  useEffect(() => {
    if (isOpen && cartRef.current) {
      // Focus the close button when cart opens
      closeButtonRef.current?.focus()
      
      // Handle Escape key
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          setIsOpen(false)
        }
      }
      
      // Trap focus within cart
      const handleTab = (e: KeyboardEvent) => {
        if (!cartRef.current) return
        
        const focusableElements = cartRef.current.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        )
        const firstElement = focusableElements[0] as HTMLElement
        const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement
        
        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault()
          lastElement?.focus()
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault()
          firstElement?.focus()
        }
      }
      
      document.addEventListener('keydown', handleEscape)
      document.addEventListener('keydown', handleTab)
      
      return () => {
        document.removeEventListener('keydown', handleEscape)
        document.removeEventListener('keydown', handleTab)
      }
    }
  }, [isOpen, setIsOpen])

  const handleCheckout = () => {
    if (cartItems.length === 0) return
    setIsOpen(false)
    router.push('/checkout')
  }

  if (!isOpen) {
    return null
  }

  const cartContent = (
    <div className="fixed inset-0 z-40">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="fixed inset-0 bg-black/50"
        onClick={() => setIsOpen(false)}
        aria-hidden="true"
      />
      <motion.div
        ref={cartRef}
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        className="fixed right-0 top-0 h-full w-full sm:w-[420px] md:w-[480px] bg-frost z-50 shadow-2xl flex flex-col"
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-title"
      >
            {/* Header */}
            <div className="flex items-center justify-between p-6 md:p-8 border-b border-neutral-200">
              <h2
                id="cart-title"
                className="text-2xl md:text-3xl"
                style={{ fontFamily: 'var(--font-bodoni)' }}
              >
                Panier
              </h2>
              <button
                ref={closeButtonRef}
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-neutral-100 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
                aria-label="Fermer le panier"
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-6 md:p-8">
              {cartItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <svg
                    width="64"
                    height="64"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1"
                    className="text-neutral-300 mb-4"
                    aria-hidden="true"
                  >
                    <circle cx="9" cy="21" r="1"></circle>
                    <circle cx="20" cy="21" r="1"></circle>
                    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                  </svg>
                  <p
                    className="text-neutral-500 mb-6"
                    style={{ fontFamily: 'var(--font-raleway)' }}
                  >
                    Votre panier est vide
                  </p>
                  <Link
                    href="/boutique"
                    onClick={() => setIsOpen(false)}
                    className="lux-btn lux-btn-secondary"
                  >
                    Continuer les achats
                  </Link>
                </div>
              ) : (
                <div className="space-y-6">
                  {cartItems.map((item) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex gap-4 pb-6 border-b border-neutral-100 last:border-0"
                    >
                      {/* Product Image */}
                      <Link
                        href={`/boutique/${typeof item.category === 'object' ? item.category.slug : 'boutique'}/${item.slug}`}
                        onClick={() => setIsOpen(false)}
                        className="relative w-24 h-24 md:w-28 md:h-28 flex-shrink-0 bg-neutral-100 rounded-lg overflow-hidden"
                      >
                        <Image
                          src={item.images?.[0]?.url || '/placeholder.jpg'}
                          alt={item.images?.[0]?.alt || item.name}
                          fill
                          className="object-cover"
                          quality={75}
                          sizes="112px"
                          loading="lazy"
                        />
                      </Link>

                      {/* Product Info */}
                      <div className="flex-1 min-w-0">
                        <Link
                          href={`/boutique/${typeof item.category === 'object' ? item.category.slug : 'boutique'}/${item.slug}`}
                          onClick={() => setIsOpen(false)}
                        >
                          <h3
                            className="text-base md:text-lg mb-1 truncate hover:text-neutral-600 transition-colors"
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
                        {item.selectedMaterial && (
                          <p className="text-xs text-neutral-500 mb-1">
                            Matériau: {item.selectedMaterial}
                          </p>
                        )}
                        {item.selectedColor && (
                          <p className="text-xs text-neutral-500 mb-1">
                            Couleur: {item.selectedColor}
                          </p>
                        )}
                        <p
                          className="text-base font-medium mb-3"
                          style={{ fontFamily: 'var(--font-raleway)' }}
                        >
                          {new Intl.NumberFormat('fr-FR', {
                            style: 'currency',
                            currency: 'EUR',
                          }).format(item.price / 100)}
                        </p>

                        {/* Quantity Controls */}
                        <div className="flex items-center justify-between gap-4">
                          <div className="flex flex-col gap-2">
                            <div className="flex items-center gap-3">
                              <button
                                onClick={() => safeUpdateQuantity(item.id, item.quantity - 1, item.selectedMaterial, item.selectedColor)}
                                className="w-9 h-9 flex items-center justify-center border-2 border-neutral-300 hover:border-black hover:bg-black hover:text-white transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-black/50 focus:ring-offset-1 rounded-sm"
                                aria-label={`Diminuer la quantité de ${item.name}`}
                              >
                                <svg
                                  width="16"
                                  height="16"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2.5"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  aria-hidden="true"
                                >
                                  <line x1="5" y1="12" x2="19" y2="12"></line>
                                </svg>
                              </button>
                              <span
                                className="w-10 text-center font-medium"
                                style={{ fontFamily: 'var(--font-raleway)' }}
                                aria-label={`Quantité: ${item.quantity}`}
                              >
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => safeUpdateQuantity(item.id, item.quantity + 1, item.selectedMaterial, item.selectedColor)}
                                className="w-9 h-9 flex items-center justify-center border-2 border-neutral-300 hover:border-black hover:bg-black hover:text-white transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-black/50 focus:ring-offset-1 rounded-sm"
                                aria-label={`Augmenter la quantité de ${item.name}`}
                              >
                                <svg
                                  width="16"
                                  height="16"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2.5"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  aria-hidden="true"
                                >
                                  <line x1="12" y1="5" x2="12" y2="19"></line>
                                  <line x1="5" y1="12" x2="19" y2="12"></line>
                                </svg>
                              </button>
                            </div>
                            {warning && (
                              <motion.p
                                initial={{ opacity: 0, y: -5 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -5 }}
                                className="text-xs text-orange-600"
                                style={{ fontFamily: 'var(--font-raleway)' }}
                              >
                                {warning}
                              </motion.p>
                            )}
                          </div>
                          <button
                            onClick={() => {
                              // Remove by matching all criteria for unique items
                              removeFromCart(item.id, item.selectedMaterial, item.selectedColor)
                            }}
                            className="text-neutral-400 hover:text-black transition-colors focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-1 rounded"
                            aria-label={`Retirer ${item.name} du panier`}
                          >
                            <svg
                              width="18"
                              height="18"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              aria-hidden="true"
                            >
                              <polyline points="3 6 5 6 21 6"></polyline>
                              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                            </svg>
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {cartItems.length > 0 && (
              <div className="border-t border-neutral-200 p-6 md:p-8 space-y-4">
                <div className="flex justify-between items-center">
                  <span
                    className="text-lg"
                    style={{ fontFamily: 'var(--font-raleway)' }}
                  >
                    Total
                  </span>
                  <span
                    className="text-2xl font-medium"
                    style={{ fontFamily: 'var(--font-bodoni)' }}
                  >
                    {new Intl.NumberFormat('fr-FR', {
                      style: 'currency',
                      currency: 'EUR',
                    }).format(getTotalPrice())}
                  </span>
                </div>
                <button
                  onClick={handleCheckout}
                  disabled={cartItems.length === 0}
                  className="w-full px-6 py-4 bg-black text-white uppercase tracking-wider text-sm font-light hover:bg-neutral-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
                  style={{ fontFamily: 'var(--font-raleway)' }}
                >
                  Commander
                </button>
                <button
                  onClick={clearCart}
                  className="lux-btn lux-btn-text w-full"
                  aria-label="Vider tout le panier"
                >
                  Vider le panier
                </button>
              </div>
            )}
          </motion.div>
    </div>
  )

  return cartContent
}

