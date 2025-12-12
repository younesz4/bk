'use client'

import { useRouter } from 'next/navigation'
import { useCart } from '@/contexts/CartContext'

interface CheckoutButtonProps {
  productId: string
  disabled?: boolean
}

export default function CheckoutButton({ productId, disabled }: CheckoutButtonProps) {
  const router = useRouter()
  const { cartItems } = useCart()

  const handleCheckout = () => {
    if (disabled) return
    
    // If cart is empty, show message, otherwise redirect to cart/checkout
    if (cartItems.length === 0) {
      alert('Veuillez d\'abord ajouter des produits au panier')
      return
    }
    
    // Redirect to cart page where user can proceed to checkout
    router.push('/cart')
  }

  return (
    <button
      onClick={handleCheckout}
      disabled={disabled || cartItems.length === 0}
      className="w-full md:w-auto px-12 py-4 bg-neutral-900 text-white font-light hover:bg-neutral-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      style={{ fontFamily: 'var(--font-raleway)' }}
    >
      {cartItems.length === 0 ? 'Panier vide' : 'Passer la commande'}
    </button>
  )
}


