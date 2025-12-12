/**
 * Quote Request Form Page
 * Luxury quote request form for high-ticket furniture
 */

'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { z } from 'zod'

const quoteFormSchema = z.object({
  customerName: z.string().min(2, 'Le nom doit contenir au moins 2 caractères').max(100),
  email: z.string().email('Email invalide'),
  phone: z.string().min(10, 'Numéro de téléphone requis').max(20),
  address: z.string().optional(),
  city: z.string().optional(),
  projectType: z.string().min(1, 'Type de projet requis'),
  budget: z.string().optional(),
  message: z.string().optional(),
  dimensions: z.string().optional(),
  materials: z.string().optional(),
  finishes: z.string().optional(),
  customDetails: z.string().optional(),
  honeypot: z.string().max(0, 'Spam detected'), // Honeypot field
})

type QuoteFormData = z.infer<typeof quoteFormSchema>

export default function QuoteRequestPage() {
  const [formData, setFormData] = useState<QuoteFormData>({
    customerName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    projectType: '',
    budget: '',
    message: '',
    dimensions: '',
    materials: '',
    finishes: '',
    customDetails: '',
    honeypot: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<{
    success: boolean
    message: string
  } | null>(null)

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus(null)
    setErrors({})

    try {
      const validation = quoteFormSchema.safeParse(formData)
      if (!validation.success) {
        const fieldErrors: Record<string, string> = {}
        validation.error.issues.forEach((err) => {
          if (err.path[0]) {
            fieldErrors[err.path[0] as string] = err.message
          }
        })
        setErrors(fieldErrors)
        setIsSubmitting(false)
        return
      }

      const response = await fetch('/api/quotes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(validation.data),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        setSubmitStatus({
          success: true,
          message: 'Votre demande de devis a été envoyée avec succès. Nous vous répondrons dans les plus brefs délais.',
        })
        // Reset form
        setFormData({
          customerName: '',
          email: '',
          phone: '',
          address: '',
          city: '',
          projectType: '',
          budget: '',
          message: '',
          dimensions: '',
          materials: '',
          finishes: '',
          customDetails: '',
          honeypot: '',
        })
      } else {
        setSubmitStatus({
          success: false,
          message: data.error || 'Une erreur est survenue. Veuillez réessayer.',
        })
      }
    } catch (error) {
      setSubmitStatus({
        success: false,
        message: 'Une erreur est survenue. Veuillez réessayer plus tard.',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="bg-white min-h-screen pt-32 pb-24">
      <div className="max-w-4xl mx-auto px-6 md:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1
            className="text-4xl md:text-5xl font-light text-neutral-900 mb-4"
            style={{ fontFamily: 'var(--font-bodoni)' }}
          >
            Demande de devis
          </h1>
          <p className="text-neutral-600 font-light text-lg">
            Partagez votre projet et recevez un devis personnalisé
          </p>
        </motion.div>

        {/* Form */}
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          onSubmit={handleSubmit}
          className="bg-white border border-neutral-200 p-8 md:p-12"
        >
          {/* Honeypot */}
          <input
            type="text"
            name="honeypot"
            value={formData.honeypot}
            onChange={handleInputChange}
            className="hidden"
            tabIndex={-1}
            autoComplete="off"
          />

          {/* Customer Information */}
          <div className="mb-10">
            <h2
              className="text-2xl font-light text-neutral-900 mb-6"
              style={{ fontFamily: 'var(--font-bodoni)' }}
            >
              Vos informations
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="customerName" className="block text-sm text-neutral-700 mb-2">
                  Nom complet *
                </label>
                <input
                  type="text"
                  id="customerName"
                  name="customerName"
                  value={formData.customerName}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-neutral-300 focus:border-black focus:outline-none transition-colors"
                />
                {errors.customerName && (
                  <p className="text-red-600 text-sm mt-1">{errors.customerName}</p>
                )}
              </div>

              <div>
                <label htmlFor="email" className="block text-sm text-neutral-700 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-neutral-300 focus:border-black focus:outline-none transition-colors"
                />
                {errors.email && (
                  <p className="text-red-600 text-sm mt-1">{errors.email}</p>
                )}
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm text-neutral-700 mb-2">
                  Téléphone *
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-neutral-300 focus:border-black focus:outline-none transition-colors"
                />
                {errors.phone && (
                  <p className="text-red-600 text-sm mt-1">{errors.phone}</p>
                )}
              </div>

              <div>
                <label htmlFor="city" className="block text-sm text-neutral-700 mb-2">
                  Ville
                </label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-neutral-300 focus:border-black focus:outline-none transition-colors"
                />
              </div>

              <div className="md:col-span-2">
                <label htmlFor="address" className="block text-sm text-neutral-700 mb-2">
                  Adresse
                </label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-neutral-300 focus:border-black focus:outline-none transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Project Details */}
          <div className="mb-10">
            <h2
              className="text-2xl font-light text-neutral-900 mb-6"
              style={{ fontFamily: 'var(--font-bodoni)' }}
            >
              Détails du projet
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="projectType" className="block text-sm text-neutral-700 mb-2">
                  Type de projet *
                </label>
                <select
                  id="projectType"
                  name="projectType"
                  value={formData.projectType}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-neutral-300 focus:border-black focus:outline-none transition-colors bg-white"
                >
                  <option value="">Sélectionnez...</option>
                  <option value="residential">Résidentiel</option>
                  <option value="commercial">Commercial</option>
                  <option value="hotel">Hôtel</option>
                  <option value="restaurant">Restaurant</option>
                  <option value="office">Bureau</option>
                  <option value="other">Autre</option>
                </select>
                {errors.projectType && (
                  <p className="text-red-600 text-sm mt-1">{errors.projectType}</p>
                )}
              </div>

              <div>
                <label htmlFor="budget" className="block text-sm text-neutral-700 mb-2">
                  Budget estimé
                </label>
                <select
                  id="budget"
                  name="budget"
                  value={formData.budget}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-neutral-300 focus:border-black focus:outline-none transition-colors bg-white"
                >
                  <option value="">Sélectionnez...</option>
                  <option value="500-1000">500€ - 1 000€</option>
                  <option value="1000-3000">1 000€ - 3 000€</option>
                  <option value="3000-6000">3 000€ - 6 000€</option>
                  <option value="6000-10000">6 000€ - 10 000€</option>
                  <option value="10000+">Plus de 10 000€</option>
                </select>
              </div>
            </div>
          </div>

          {/* Custom Requirements */}
          <div className="mb-10">
            <h2
              className="text-2xl font-light text-neutral-900 mb-6"
              style={{ fontFamily: 'var(--font-bodoni)' }}
            >
              Spécifications sur-mesure
            </h2>
            <div className="space-y-6">
              <div>
                <label htmlFor="dimensions" className="block text-sm text-neutral-700 mb-2">
                  Dimensions (L x l x H en cm)
                </label>
                <input
                  type="text"
                  id="dimensions"
                  name="dimensions"
                  value={formData.dimensions}
                  onChange={handleInputChange}
                  placeholder="Ex: 200 x 80 x 75"
                  className="w-full px-4 py-3 border border-neutral-300 focus:border-black focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label htmlFor="materials" className="block text-sm text-neutral-700 mb-2">
                  Matériaux souhaités
                </label>
                <input
                  type="text"
                  id="materials"
                  name="materials"
                  value={formData.materials}
                  onChange={handleInputChange}
                  placeholder="Ex: Chêne massif, cuir italien"
                  className="w-full px-4 py-3 border border-neutral-300 focus:border-black focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label htmlFor="finishes" className="block text-sm text-neutral-700 mb-2">
                  Finitions souhaitées
                </label>
                <input
                  type="text"
                  id="finishes"
                  name="finishes"
                  value={formData.finishes}
                  onChange={handleInputChange}
                  placeholder="Ex: Vernis mat, patine vieillie"
                  className="w-full px-4 py-3 border border-neutral-300 focus:border-black focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label htmlFor="customDetails" className="block text-sm text-neutral-700 mb-2">
                  Détails personnalisés supplémentaires
                </label>
                <textarea
                  id="customDetails"
                  name="customDetails"
                  value={formData.customDetails}
                  onChange={handleInputChange}
                  rows={4}
                  placeholder="Décrivez vos besoins spécifiques, vos préférences de style, etc."
                  className="w-full px-4 py-3 border border-neutral-300 focus:border-black focus:outline-none transition-colors resize-none"
                />
              </div>
            </div>
          </div>

          {/* Message */}
          <div className="mb-10">
            <label htmlFor="message" className="block text-sm text-neutral-700 mb-2">
              Message
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              rows={6}
              placeholder="Décrivez votre projet en détail..."
              className="w-full px-4 py-3 border border-neutral-300 focus:border-black focus:outline-none transition-colors resize-none"
            />
          </div>

          {/* Submit Button */}
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
            <p className="text-sm text-neutral-500">
              * Champs obligatoires
            </p>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-8 py-3 bg-black text-white hover:bg-neutral-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wider text-sm font-light"
            >
              {isSubmitting ? 'Envoi en cours...' : 'Envoyer la demande'}
            </button>
          </div>

          {/* Status Message */}
          {submitStatus && (
            <div
              className={`mt-6 p-4 ${
                submitStatus.success
                  ? 'bg-green-50 border border-green-200 text-green-800'
                  : 'bg-red-50 border border-red-200 text-red-800'
              }`}
            >
              <p>{submitStatus.message}</p>
            </div>
          )}
        </motion.form>

        {/* Back Link */}
        <div className="mt-8 text-center">
          <Link
            href="/"
            className="text-neutral-600 hover:text-neutral-900 transition-colors text-sm"
          >
            ← Retour à l'accueil
          </Link>
        </div>
      </div>
    </div>
  )
}
