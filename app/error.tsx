'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log error to console for debugging
    console.error('Application error:', error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.25, 0.00, 0.15, 1] }}
        className="max-w-2xl mx-auto text-center"
      >
        <motion.h1
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-6xl md:text-8xl font-bodoni mb-6 text-black"
          style={{ fontFamily: 'var(--font-bodoni)' }}
        >
          500
        </motion.h1>
        
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-2xl md:text-3xl mb-4 text-neutral-900"
          style={{ fontFamily: 'var(--font-bodoni)' }}
        >
          Une erreur s'est produite
        </motion.h2>
        
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-base md:text-lg text-neutral-600 mb-8 max-w-md mx-auto leading-relaxed"
          style={{ fontFamily: 'var(--font-raleway)' }}
        >
          Nous rencontrons un problème technique. Notre équipe a été notifiée et travaille à résoudre le problème.
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <button
            onClick={reset}
            className="px-8 py-4 bg-black text-white uppercase tracking-wider text-sm font-light hover:bg-neutral-800 transition-colors focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
            style={{ fontFamily: 'var(--font-raleway)' }}
          >
            Réessayer
          </button>
          <Link
            href="/"
            className="px-8 py-4 bg-white border border-neutral-300 text-neutral-900 uppercase tracking-wider text-sm font-light hover:bg-neutral-50 transition-colors focus:outline-none focus:ring-2 focus:ring-neutral-300 focus:ring-offset-2"
            style={{ fontFamily: 'var(--font-raleway)' }}
          >
            Retour à l'accueil
          </Link>
        </motion.div>
      </motion.div>
    </div>
  )
}
