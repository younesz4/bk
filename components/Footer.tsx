'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { newsletterFormSchema, validateFormData, sanitizeFormData } from '@/lib/validation'

export default function Footer() {
  const currentYear = new Date().getFullYear()
  const [email, setEmail] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number],
      },
    },
  }

  return (
    <footer className="relative bg-[#0C0C0C] text-white overflow-hidden" suppressHydrationWarning>
      {/* Subtle top border gradient */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      {/* Main Footer Content */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-100px' }}
        variants={containerVariants}
        className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 py-16 sm:py-20 md:py-24 lg:py-32 xl:py-40"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 md:gap-12 lg:gap-16 xl:gap-20">
          {/* COLUMN 1 — BRAND */}
          <motion.div variants={itemVariants} className="lg:col-span-1">
            <div className="relative mb-4 sm:mb-6" style={{ width: 'clamp(160px, 20vw, 200px)', height: 'clamp(60px, 8vh, 80px)' }}>
              <Image
                src="/logo-1.png"
                alt="Logo BK Agencements - Retour à l'accueil"
                fill
                className="object-contain object-left"
                quality={75}
                sizes="(max-width: 640px) 160px, 200px"
                loading="lazy"
              />
            </div>
            <p className="text-small text-white/60 max-w-xs" style={{ fontSize: 'clamp(0.8rem, 1vw, 0.875rem)' }}>
              Agence d'agencement sur-mesure. Menuiserie, tapisserie, ferronnerie.
            </p>
          </motion.div>

          {/* COLUMN 2 — NAVIGATION */}
          <motion.div variants={itemVariants}>
            <h3 className="section-title mb-6 sm:mb-8 text-white/80" style={{ fontSize: 'clamp(0.8rem, 1vw, 1rem)' }}>
              Navigation
            </h3>
            <nav aria-label="Navigation principale">
              <ul className="space-y-3 sm:space-y-4">
                {[
                  { label: 'Accueil', href: '/' },
                  { label: 'À propos', href: '/about' },
                  { label: 'Services', href: '/services' },
                  { label: 'Boutique', href: '/boutique' },
                  { label: 'Projets', href: '/projets' },
                  { label: 'Contact', href: '/contact' },
                ].map((link) => (
                  <li key={link.href}>
                    <FooterLink href={link.href} label={link.label} />
                  </li>
                ))}
              </ul>
            </nav>
          </motion.div>

          {/* COLUMN 3 — MÉTIERS */}
          <motion.div variants={itemVariants}>
            <h3 className="section-title mb-6 sm:mb-8 text-white/80" style={{ fontSize: 'clamp(0.8rem, 1vw, 1rem)' }}>
              Nos Métiers
            </h3>
            <nav aria-label="Nos métiers">
              <ul className="space-y-3 sm:space-y-4">
                {[
                  { label: 'Menuiserie', href: '/services' },
                  { label: 'Tapisserie', href: '/services' },
                  { label: 'Ferronnerie', href: '/services' },
                  { label: 'Sur-mesure', href: '/services' },
                  { label: 'Installation professionnelle', href: '/services' },
                ].map((link, index) => (
                  <li key={`${link.label}-${index}`}>
                    <FooterLink href={link.href} label={link.label} />
                  </li>
                ))}
              </ul>
            </nav>
          </motion.div>

          {/* COLUMN 4 — CONTACT */}
          <motion.div variants={itemVariants}>
            <h3 className="section-title mb-6 sm:mb-8 text-white/80" style={{ fontSize: 'clamp(0.8rem, 1vw, 1rem)' }}>
              Contact
            </h3>
            
            {/* Contact Information */}
            <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6 text-small text-white/70" style={{ fontSize: 'clamp(0.8rem, 1vw, 0.875rem)' }}>
              <p>
                Casablanca, Maroc
              </p>
              <p>
                <a 
                  href="tel:+212522123456" 
                  className="luxury-interactive hover:text-white"
                >
                  +212 522 123 456
                </a>
              </p>
              <p>
                <a 
                  href="mailto:contact@bkagencements.ma" 
                  className="luxury-interactive hover:text-white"
                >
                  contact@bkagencements.ma
                </a>
              </p>
              <p className="pt-2">
                Lun - Ven: 9h - 18h<br />
                Samedi: 10h - 16h
              </p>
            </div>

            {/* Prendre rendez-vous Link */}
            <div className="mb-10">
              <FooterLink href="/rdv" label="Prendre rendez-vous" />
            </div>

            {/* Newsletter */}
            <div className="mt-8">
              <form 
                onSubmit={async (e) => {
                  e.preventDefault()
                  setIsSubmitting(true)
                  setError(null)
                  setSuccess(false)

                  // Sanitize and validate
                  const sanitized = sanitizeFormData({ email })
                  const validation = validateFormData(newsletterFormSchema, sanitized)

                  if (!validation.isValid) {
                    setError(validation.errors.email || 'Email invalide')
                    setIsSubmitting(false)
                    return
                  }

                  try {
                    // TODO: Implement newsletter API endpoint
                    // const response = await fetch('/api/newsletter', {
                    //   method: 'POST',
                    //   headers: { 'Content-Type': 'application/json' },
                    //   body: JSON.stringify({ email: sanitized.email }),
                    // })
                    // const data = await response.json()
                    
                    // For now, just show success
                    setSuccess(true)
                    setEmail('')
                    setTimeout(() => setSuccess(false), 3000)
                  } catch (err) {
                    setError('Une erreur est survenue')
                  } finally {
                    setIsSubmitting(false)
                  }
                }}
                className="relative"
              >
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    if (error) setError(null)
                  }}
                  placeholder="Newsletter"
                  disabled={isSubmitting}
                  aria-invalid={!!error}
                  aria-describedby={error ? 'newsletter-error' : undefined}
                  className={`w-full bg-transparent border-0 border-b pb-2 text-sm font-light text-white placeholder-white/40 focus:outline-none transition-colors duration-300 disabled:opacity-50 ${
                    error ? 'border-red-400 focus:border-red-400' : 'border-white/20 focus:border-white/60'
                  }`}
                  style={{ 
                    fontFamily: 'var(--font-raleway)',
                    letterSpacing: '0.05em'
                  }}
                />
                {error && (
                  <p id="newsletter-error" className="mt-1 text-xs text-red-400" role="alert">
                    {error}
                  </p>
                )}
                {success && (
                  <p className="mt-1 text-xs text-green-400">
                    ✓ Inscription réussie
                  </p>
                )}
                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  className="absolute right-0 bottom-2 text-white/60 hover:text-white transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  whileHover={{ x: isSubmitting ? 0 : 3 }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                  aria-label="Subscribe to newsletter"
                >
                  <svg 
                    width="16" 
                    height="16" 
                    viewBox="0 0 16 16" 
                    fill="none" 
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-4 h-4"
                  >
                    <path 
                      d="M6 3L11 8L6 13M11 8H3" 
                      stroke="currentColor" 
                      strokeWidth="1.2" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                    />
                  </svg>
                </motion.button>
              </form>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Bottom Bar */}
      <div className="border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 py-4 sm:py-6 md:py-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-4">
            <p 
              className="text-xs sm:text-sm uppercase tracking-[0.15em] font-light text-white/50 text-center sm:text-left"
              style={{ 
                fontFamily: 'var(--font-raleway)',
                letterSpacing: '0.15em',
                fontSize: 'clamp(0.7rem, 0.9vw, 0.875rem)'
              }}
            >
              © BK Agencements — {currentYear}
            </p>
            <p 
              className="text-xs sm:text-sm uppercase tracking-[0.15em] font-light text-white/50 text-center sm:text-right"
              style={{ 
                fontFamily: 'var(--font-raleway)',
                letterSpacing: '0.15em',
                fontSize: 'clamp(0.7rem, 0.9vw, 0.875rem)'
              }}
            >
              Conçu avec passion à Casablanca
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}

// Footer Link Component with hover animations
function FooterLink({ href, label }: { href: string; label: string }) {
  return (
    <Link href={href} className="luxury-link-ripple">
      <motion.span
        className="block nav-text text-white/70 uppercase relative"
        whileHover={{ 
          color: 'rgba(255, 255, 255, 1)',
          y: -2,
        }}
        transition={{ duration: 0.3, ease: [0.34, 1.56, 0.64, 1] }}
      >
        {label}
      </motion.span>
    </Link>
  )
}
