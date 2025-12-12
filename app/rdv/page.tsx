'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { bookingFormSchema, validateFormData, sanitizeFormData, type BookingFormData } from '@/lib/validation'

export default function RendezVousPage() {
  const [formData, setFormData] = useState<BookingFormData>({
    fullName: '',
    email: '',
    phone: '',
    preferredDate: '',
    preferredTime: '',
    projectType: '',
    budget: '',
    message: '',
    website: '', // Honeypot field (hidden) - must remain empty
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<{
    success: boolean
    message: string
    bookingId?: string
  } | null>(null)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const handleBlur = (fieldName: string) => {
    setTouched((prev) => ({ ...prev, [fieldName]: true }))
    
    // Validate single field on blur
    const validation = validateFormData(bookingFormSchema, formData)
    if (!validation.isValid && validation.errors[fieldName]) {
      setErrors((prev) => ({ ...prev, [fieldName]: validation.errors[fieldName] }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setTouched({}) // Mark all fields as touched
    setIsSubmitting(true)
    setSubmitStatus(null)

    // Sanitize and validate
    const sanitized = sanitizeFormData(formData)
    const validation = validateFormData(bookingFormSchema, sanitized)

    if (!validation.isValid) {
      setErrors(validation.errors)
      setIsSubmitting(false)
      return
    }

    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullName: sanitized.fullName,
          email: sanitized.email,
          phone: sanitized.phone || undefined,
          projectType: sanitized.projectType || undefined,
          budget: sanitized.budget || undefined,
          message: sanitized.message || undefined,
          date: sanitized.preferredDate,
          timeSlot: sanitized.preferredTime,
          website: sanitized.website, // Honeypot field
        }),
      })

      const data = await response.json()

      if (data.ok) {
        setSubmitStatus({
          success: true,
          message: data.message || 'Votre demande de rendez-vous a été enregistrée avec succès.',
          bookingId: data.bookingId,
        })
        // Reset form
        setFormData({
          fullName: '',
          email: '',
          phone: '',
          preferredDate: '',
          preferredTime: '',
          projectType: '',
          budget: '',
          message: '',
          website: '',
        })
        setErrors({})
        setTouched({})
      } else {
        setSubmitStatus({
          success: false,
          message: data.message || 'Une erreur est survenue. Veuillez réessayer.',
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

  const timeSlots = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00'
  ]

  return (
    <div className="bg-white min-h-screen">
      {/* Booking Form Section */}
      <section className="bg-white pt-12 sm:pt-16 md:pt-20 pb-12 sm:pb-16 md:pb-24 lg:pb-32">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-8">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
            className="text-4xl md:text-5xl lg:text-6xl font-light text-neutral-900 mb-8 md:mb-12 text-center"
            style={{ fontFamily: 'var(--font-bodoni)' }}
          >
            Prendre rendez-vous
          </motion.h1>
          {submitStatus ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-6 rounded-lg mb-8 ${
                submitStatus.success
                  ? 'bg-green-50 border border-green-200 text-green-800'
                  : 'bg-red-50 border border-red-200 text-red-800'
              }`}
            >
              <p className="mb-2 font-medium">
                {submitStatus.success ? '✓ Succès' : '✗ Erreur'}
              </p>
              <p>{submitStatus.message}</p>
              {submitStatus.bookingId && (
                <p className="mt-2 text-sm">
                  Référence : <strong>{submitStatus.bookingId}</strong>
                </p>
              )}
            </motion.div>
          ) : null}

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8 md:space-y-12">
              {/* Honeypot field (hidden) - must remain empty */}
              <input
                type="text"
                name="website"
                value={formData.website}
                onChange={handleInputChange}
                style={{ display: 'none' }}
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
              />

              {/* Full Name */}
              <div className="relative">
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  onBlur={() => handleBlur('fullName')}
                  required
                  aria-required="true"
                  className={`peer w-full bg-transparent border-0 border-b pb-3 pt-8 text-base focus:outline-none transition-colors duration-300 ${
                    errors.fullName ? 'border-red-500 focus:border-red-500' : 'border-neutral-300 focus:border-black'
                  }`}
                  placeholder=" "
                />
                <label
                  htmlFor="fullName"
                  className={`absolute left-0 text-sm uppercase tracking-[0.1em] pointer-events-none transition-all duration-300 ${
                    formData.fullName
                      ? 'top-0 text-xs'
                      : 'top-6 peer-focus:top-0 peer-focus:text-xs'
                  } ${errors.fullName ? 'text-red-500' : 'text-neutral-500'}`}
                >
                  Nom complet <span className="text-red-500" aria-label="requis">*</span>
                </label>
                {errors.fullName && touched.fullName && (
                  <p className="mt-1 text-sm text-red-600">{errors.fullName}</p>
                )}
              </div>

              {/* Contact Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 md:gap-12">
                <div className="relative">
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    onBlur={() => handleBlur('email')}
                    required
                    aria-required="true"
                    aria-describedby="email-description"
                    className={`peer w-full bg-transparent border-0 border-b pb-3 pt-8 text-base focus:outline-none transition-colors duration-300 ${
                      errors.email ? 'border-red-500 focus:border-red-500' : 'border-neutral-300 focus:border-black'
                    }`}
                    placeholder=" "
                  />
                  <label
                    htmlFor="email"
                    className={`absolute left-0 text-sm uppercase tracking-[0.1em] pointer-events-none transition-all duration-300 ${
                      formData.email
                        ? 'top-0 text-xs'
                        : 'top-6 peer-focus:top-0 peer-focus:text-xs'
                    } ${errors.email ? 'text-red-500' : 'text-neutral-500'}`}
                  >
                    Email <span className="text-red-500" aria-label="requis">*</span>
                  </label>
                  <span id="email-description" className="sr-only">Format: exemple@domaine.com</span>
                  {errors.email && touched.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                  )}
                </div>

                <div className="relative">
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone || ''}
                    onChange={handleInputChange}
                    onBlur={() => handleBlur('phone')}
                    className={`peer w-full bg-transparent border-0 border-b pb-3 pt-8 text-base focus:outline-none transition-colors duration-300 ${
                      errors.phone ? 'border-red-500 focus:border-red-500' : 'border-neutral-300 focus:border-black'
                    }`}
                    placeholder=" "
                  />
                  <label
                    htmlFor="phone"
                    className={`absolute left-0 text-sm uppercase tracking-[0.1em] pointer-events-none transition-all duration-300 ${
                      formData.phone
                        ? 'top-0 text-xs'
                        : 'top-6 peer-focus:top-0 peer-focus:text-xs'
                    } ${errors.phone ? 'text-red-500' : 'text-neutral-500'}`}
                  >
                    Téléphone
                  </label>
                  {errors.phone && touched.phone && (
                    <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                  )}
                </div>
              </div>

              {/* Date & Time Selection */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 md:gap-12">
                <div className="relative">
                  <input
                    type="date"
                    id="preferredDate"
                    name="preferredDate"
                    value={formData.preferredDate}
                    onChange={handleInputChange}
                    onBlur={() => handleBlur('preferredDate')}
                    required
                    aria-required="true"
                    min={new Date().toISOString().split('T')[0]}
                    className={`peer w-full bg-transparent border-0 border-b pb-3 pt-8 text-base focus:outline-none transition-colors duration-300 ${
                      errors.preferredDate ? 'border-red-500 focus:border-red-500' : 'border-neutral-300 focus:border-black'
                    }`}
                  />
                  <label
                    htmlFor="preferredDate"
                    className={`absolute left-0 text-sm uppercase tracking-[0.1em] pointer-events-none transition-all duration-300 ${
                      formData.preferredDate
                        ? 'top-0 text-xs'
                        : 'top-6 peer-focus:top-0 peer-focus:text-xs'
                    } ${errors.preferredDate ? 'text-red-500' : 'text-neutral-500'}`}
                  >
                    Date préférée <span className="text-red-500" aria-label="requis">*</span>
                  </label>
                  {errors.preferredDate && touched.preferredDate && (
                    <p className="mt-1 text-sm text-red-600">{errors.preferredDate}</p>
                  )}
                </div>

                <div className="relative">
                  <select
                    id="preferredTime"
                    name="preferredTime"
                    value={formData.preferredTime}
                    onChange={handleInputChange}
                    onBlur={() => handleBlur('preferredTime')}
                    required
                    aria-required="true"
                    className={`peer w-full bg-transparent border-0 border-b pb-3 pt-8 text-base focus:outline-none transition-colors duration-300 appearance-none cursor-pointer ${
                      errors.preferredTime ? 'border-red-500 focus:border-red-500' : 'border-neutral-300 focus:border-black'
                    }`}
                  >
                    <option value="" disabled>Sélectionner un horaire</option>
                    {timeSlots.map((time) => (
                      <option key={time} value={time}>
                        {time}
                      </option>
                    ))}
                  </select>
                  <label
                    htmlFor="preferredTime"
                    className={`absolute left-0 text-sm uppercase tracking-[0.1em] pointer-events-none transition-all duration-300 ${
                      formData.preferredTime
                        ? 'top-0 text-xs'
                        : 'top-6 peer-focus:top-0 peer-focus:text-xs'
                    } ${errors.preferredTime ? 'text-red-500' : 'text-neutral-500'}`}
                  >
                    Horaire préféré <span className="text-red-500" aria-label="requis">*</span>
                  </label>
                  <div className="absolute right-0 bottom-3 pointer-events-none" aria-hidden="true">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-neutral-400"
                    >
                      <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                  </div>
                  {errors.preferredTime && touched.preferredTime && (
                    <p className="mt-1 text-sm text-red-600">{errors.preferredTime}</p>
                  )}
                </div>
              </div>

              {/* Project Type */}
              <div className="relative">
                <select
                  id="projectType"
                  name="projectType"
                  value={formData.projectType || ''}
                  onChange={handleInputChange}
                  onBlur={() => handleBlur('projectType')}
                  className={`peer w-full bg-transparent border-0 border-b pb-3 pt-8 text-base focus:outline-none transition-colors duration-300 appearance-none cursor-pointer ${
                    errors.projectType ? 'border-red-500 focus:border-red-500' : 'border-neutral-300 focus:border-black'
                  }`}
                >
                  <option value="">Sélectionner un type de projet (optionnel)</option>
                  <option value="Résidentiel">Résidentiel</option>
                  <option value="Commercial">Commercial</option>
                  <option value="Hôtellerie">Hôtellerie</option>
                  <option value="Mobilier uniquement">Mobilier uniquement</option>
                  <option value="Consultation">Consultation</option>
                  <option value="Autre">Autre</option>
                </select>
                <label
                  htmlFor="projectType"
                  className={`absolute left-0 text-sm uppercase tracking-[0.1em] pointer-events-none transition-all duration-300 ${
                    formData.projectType
                      ? 'top-0 text-xs'
                      : 'top-6 peer-focus:top-0 peer-focus:text-xs'
                  } ${errors.projectType ? 'text-red-500' : 'text-neutral-500'}`}
                >
                  Type de projet
                </label>
                <div className="absolute right-0 bottom-3 pointer-events-none" aria-hidden="true">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-neutral-400"
                  >
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </div>
                {errors.projectType && touched.projectType && (
                  <p className="mt-1 text-sm text-red-600">{errors.projectType}</p>
                )}
              </div>

              {/* Budget */}
              <div className="relative">
                <select
                  id="budget"
                  name="budget"
                  value={formData.budget || ''}
                  onChange={handleInputChange}
                  onBlur={() => handleBlur('budget')}
                  className={`peer w-full bg-transparent border-0 border-b pb-3 pt-8 text-base focus:outline-none transition-colors duration-300 appearance-none cursor-pointer ${
                    errors.budget ? 'border-red-500 focus:border-red-500' : 'border-neutral-300 focus:border-black'
                  }`}
                >
                  <option value="">Budget estimé (optionnel)</option>
                  <option value="Moins de 10 000 €">Moins de 10 000 €</option>
                  <option value="10 000 - 25 000 €">10 000 - 25 000 €</option>
                  <option value="25 000 - 50 000 €">25 000 - 50 000 €</option>
                  <option value="50 000 - 100 000 €">50 000 - 100 000 €</option>
                  <option value="Plus de 100 000 €">Plus de 100 000 €</option>
                </select>
                <label
                  htmlFor="budget"
                  className={`absolute left-0 text-sm uppercase tracking-[0.1em] pointer-events-none transition-all duration-300 ${
                    formData.budget
                      ? 'top-0 text-xs'
                      : 'top-6 peer-focus:top-0 peer-focus:text-xs'
                  } ${errors.budget ? 'text-red-500' : 'text-neutral-500'}`}
                >
                  Budget estimé
                </label>
                <div className="absolute right-0 bottom-3 pointer-events-none" aria-hidden="true">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-neutral-400"
                  >
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </div>
                {errors.budget && touched.budget && (
                  <p className="mt-1 text-sm text-red-600">{errors.budget}</p>
                )}
              </div>

              {/* Message */}
              <div className="relative">
                <textarea
                  id="message"
                  name="message"
                  value={formData.message || ''}
                  onChange={handleInputChange}
                  onBlur={() => handleBlur('message')}
                  rows={6}
                  className={`peer w-full bg-transparent border-0 border-b pb-3 pt-8 text-base focus:outline-none transition-colors duration-300 resize-none ${
                    errors.message ? 'border-red-500 focus:border-red-500' : 'border-neutral-300 focus:border-black'
                  }`}
                  placeholder=" "
                />
                <label
                  htmlFor="message"
                  className={`absolute left-0 text-sm uppercase tracking-[0.1em] pointer-events-none transition-all duration-300 ${
                    formData.message
                      ? 'top-0 text-xs'
                      : 'top-6 peer-focus:top-0 peer-focus:text-xs'
                  } ${errors.message ? 'text-red-500' : 'text-neutral-500'}`}
                >
                  Message (optionnel)
                </label>
                {errors.message && touched.message && (
                  <p className="mt-1 text-sm text-red-600">{errors.message}</p>
                )}
              </div>

              {/* Submit Button */}
              <div className="flex justify-center pt-6 sm:pt-8">
                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  className="lux-btn lux-btn-primary w-full sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    {isSubmitting && (
                      <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    )}
                    {isSubmitting ? 'Envoi en cours...' : 'Confirmer le rendez-vous'}
                  </span>
                  <span className="absolute inset-0 bg-white transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></span>
                </motion.button>
              </div>
            </form>
          </motion.div>
        </div>
      </section>

      {/* Contact Info Section */}
      <section className="bg-neutral-50 py-12 sm:py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-10 md:gap-12 text-center">
            <div>
              <h2 className="text-lg sm:text-xl mb-3 sm:mb-4" style={{ fontFamily: 'var(--font-bodoni)' }}>
                Téléphone
              </h2>
              <p className="text-sm sm:text-base text-neutral-600">
                +212 XXX XXX XXX
              </p>
            </div>
            <div>
              <h2 className="text-lg sm:text-xl mb-3 sm:mb-4" style={{ fontFamily: 'var(--font-bodoni)' }}>
                Email
              </h2>
              <p className="text-sm sm:text-base text-neutral-600">
                contact@bk-agencements.com
              </p>
            </div>
            <div>
              <h2 className="text-lg sm:text-xl mb-3 sm:mb-4" style={{ fontFamily: 'var(--font-bodoni)' }}>
                Horaires
              </h2>
              <p className="text-sm sm:text-base text-neutral-600">
                Lun - Ven: 9h - 18h
                <br />
                Sam: 10h - 16h
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
