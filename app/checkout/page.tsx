'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { useCart } from '@/contexts/CartContext'
import { placeOrder } from '@/lib/orders'

export default function CheckoutPage() {
  const router = useRouter()
  const { cartItems, getTotalPrice, clearCart } = useCart()

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    city: '',
    address: '',
    notes: '',
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Redirect if cart is empty
  useEffect(() => {
    if (cartItems.length === 0) {
      router.push('/boutique')
    }
  }, [cartItems.length, router])

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Le nom complet est requis'
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Le téléphone est requis'
    }

    if (!formData.city.trim()) {
      newErrors.city = 'La ville est requise'
    }

    if (!formData.address.trim()) {
      newErrors.address = 'L\'adresse est requise'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      const result = await placeOrder({
        customerName: formData.fullName.trim(),
        customerEmail: undefined,
        customerPhone: formData.phone.trim() || undefined,
        addressLine1: formData.address.trim(),
        addressLine2: undefined,
        city: formData.city.trim(),
        postalCode: undefined,
        country: 'Maroc',
        notes: formData.notes.trim() || undefined,
        paymentMethod: 'COD',
        items: cartItems.map((item) => ({
          productId: item.id,
          quantity: item.quantity,
        })),
      })

      if (result.success && result.orderId) {
        clearCart()
        router.push(`/order-success?orderId=${result.orderId}`)
      } else {
        alert(result.error || 'Erreur lors de la commande. Veuillez réessayer.')
        setIsSubmitting(false)
      }
    } catch (error) {
      console.error('Error placing order:', error)
      alert('Une erreur est survenue. Veuillez réessayer.')
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }))
    }
  }

  const subtotal = getTotalPrice()
  const delivery = 0 // Free delivery for now
  const total = subtotal + delivery

  if (cartItems.length === 0) {
    return null // Will redirect
  }

  const moroccanCities = [
    'Casablanca', 'Rabat', 'Marrakech', 'Fès', 'Tanger', 'Agadir', 'Meknès',
    'Oujda', 'Kenitra', 'Tétouan', 'Safi', 'Mohammedia', 'El Jadida', 'Nador',
    'Beni Mellal', 'Taza', 'Khémisset', 'Settat', 'Larache', 'Ksar El Kebir', 'Autre',
  ]

  return (
    <div className="min-h-screen bg-[#f7f7f5] pt-24 pb-24 px-4 sm:px-6 md:px-8">
      <div className="max-w-7xl mx-auto">
        <h1
          className="text-4xl md:text-5xl mb-12 text-center"
          style={{ fontFamily: 'var(--font-bodoni)' }}
        >
          Commande
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Customer Information Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Full Name */}
              <div>
                <label
                  htmlFor="fullName"
                  className="block text-sm mb-2 text-neutral-700 uppercase tracking-wider"
                  style={{ fontFamily: 'var(--font-raleway)' }}
                >
                  Nom complet <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 bg-frost border ${
                    errors.fullName ? 'border-red-500' : 'border-[#e5e5e5]'
                  } focus:outline-none focus:border-black transition-colors`}
                  style={{ fontFamily: 'var(--font-raleway)', fontSize: '14px' }}
                  required
                />
                {errors.fullName && (
                  <p className="mt-1 text-sm text-red-500">{errors.fullName}</p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm mb-2 text-neutral-700 uppercase tracking-wider"
                  style={{ fontFamily: 'var(--font-raleway)' }}
                >
                  Téléphone <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 bg-frost border ${
                    errors.phone ? 'border-red-500' : 'border-[#e5e5e5]'
                  } focus:outline-none focus:border-black transition-colors`}
                  style={{ fontFamily: 'var(--font-raleway)', fontSize: '14px' }}
                  required
                />
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-500">{errors.phone}</p>
                )}
              </div>

              {/* City */}
              <div>
                <label
                  htmlFor="city"
                  className="block text-sm mb-2 text-neutral-700 uppercase tracking-wider"
                  style={{ fontFamily: 'var(--font-raleway)' }}
                >
                  Ville <span className="text-red-500">*</span>
                </label>
                <select
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 bg-frost border ${
                    errors.city ? 'border-red-500' : 'border-[#e5e5e5]'
                  } focus:outline-none focus:border-black transition-colors`}
                  style={{ fontFamily: 'var(--font-raleway)', fontSize: '14px' }}
                  required
                >
                  <option value="">Sélectionner une ville</option>
                  {moroccanCities.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
                {errors.city && (
                  <p className="mt-1 text-sm text-red-500">{errors.city}</p>
                )}
              </div>

              {/* Address */}
              <div>
                <label
                  htmlFor="address"
                  className="block text-sm mb-2 text-neutral-700 uppercase tracking-wider"
                  style={{ fontFamily: 'var(--font-raleway)' }}
                >
                  Adresse <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 bg-frost border ${
                    errors.address ? 'border-red-500' : 'border-[#e5e5e5]'
                  } focus:outline-none focus:border-black transition-colors`}
                  style={{ fontFamily: 'var(--font-raleway)', fontSize: '14px' }}
                  required
                />
                {errors.address && (
                  <p className="mt-1 text-sm text-red-500">{errors.address}</p>
                )}
              </div>

              {/* Notes */}
              <div>
                <label
                  htmlFor="notes"
                  className="block text-sm mb-2 text-neutral-700 uppercase tracking-wider"
                  style={{ fontFamily: 'var(--font-raleway)' }}
                >
                  Notes (optionnel)
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-3 bg-frost border border-[#e5e5e5] focus:outline-none focus:border-black transition-colors resize-none"
                  style={{ fontFamily: 'var(--font-raleway)', fontSize: '14px' }}
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full px-8 py-4 bg-black text-white uppercase tracking-wider text-sm font-light hover:bg-neutral-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none"
                style={{ fontFamily: 'var(--font-raleway)' }}
              >
                {isSubmitting ? 'Traitement...' : 'Confirmer la commande'}
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-frost border border-[#e5e5e5] p-6 md:p-8 sticky top-24">
              <h2
                className="text-2xl md:text-3xl mb-8"
                style={{ fontFamily: 'var(--font-bodoni)' }}
              >
                Récapitulatif
              </h2>
              {/* Cart Items */}
              <div className="space-y-6 mb-8">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex gap-4 pb-6 border-b border-[#e5e5e5] last:border-0">
                    {/* Product Image */}
                    <div className="relative w-20 h-20 md:w-24 md:h-24 flex-shrink-0 bg-neutral-100 rounded-sm overflow-hidden">
                      <Image
                        src={item.images?.[0]?.url || '/placeholder.jpg'}
                        alt={item.images?.[0]?.alt || item.name}
                        fill
                        className="object-cover"
                        quality={75}
                        sizes="96px"
                      />
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <h3
                        className="text-base md:text-lg mb-1"
                        style={{ fontFamily: 'var(--font-bodoni)' }}
                      >
                        {item.name}
                      </h3>
                      <p
                        className="text-sm text-neutral-600 mb-2"
                        style={{ fontFamily: 'var(--font-raleway)' }}
                      >
                        {typeof item.category === 'object' ? item.category.name : item.category}
                      </p>
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

              {/* Order Totals */}
              <div className="space-y-4 pt-6 border-t border-[#e5e5e5]">
                <div className="flex justify-between items-center">
                  <span
                    className="text-base"
                    style={{ fontFamily: 'var(--font-raleway)' }}
                  >
                    Sous-total
                  </span>
                  <span
                    className="text-base"
                    style={{ fontFamily: 'var(--font-raleway)' }}
                  >
                    {new Intl.NumberFormat('fr-FR', {
                      style: 'currency',
                      currency: 'EUR',
                    }).format(subtotal)}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span
                    className="text-base"
                    style={{ fontFamily: 'var(--font-raleway)' }}
                  >
                    Livraison
                  </span>
                  <span
                    className="text-base"
                    style={{ fontFamily: 'var(--font-raleway)' }}
                  >
                    {new Intl.NumberFormat('fr-FR', {
                      style: 'currency',
                      currency: 'EUR',
                    }).format(delivery)}
                  </span>
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-[#e5e5e5]">
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
                    }).format(total)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
