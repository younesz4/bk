'use client'

import { useRouter } from 'next/navigation'
import { useCart } from '@/contexts/CartContext'

interface CheckoutFormData {
  customerName: string
  email: string
  phone: string
  address: string
  city: string
  country: string
  notes?: string | null
}

export function useCheckout() {
  const { cartItems } = useCart()
  const router = useRouter()

  const handleCheckout = async (
    formData: CheckoutFormData,
    setIsLoading: (loading: boolean) => void,
    setError: (error: string | null) => void
  ): Promise<void> => {
    if (cartItems.length === 0) {
      setError('Votre panier est vide')
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const items = cartItems.map((item) => ({
        productId: item.id,
        quantity: item.quantity,
      }))

      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items,
          customerName: formData.customerName,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          country: formData.country,
          notes: formData.notes || null,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de la commande')
      }

      if (data.success && data.orderId) {
        router.push(`/confirmation/${data.orderId}`)
      } else {
        throw new Error('Réponse invalide du serveur')
      }
    } catch (err: any) {
      console.error('Checkout error:', err)
      setError(err.message || 'Une erreur est survenue lors de la commande')
      setIsLoading(false)
    }
  }

  return { handleCheckout }
}
