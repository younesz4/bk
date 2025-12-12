'use client'

import { useEffect } from 'react'
import Link from 'next/link'

export default function ContactError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="pt-32 pb-24 px-6 md:px-8 text-center">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-6xl md:text-8xl text-walnut-800 mb-6">Erreur</h1>
        <h2 className="text-3xl md:text-4xl text-walnut-700 mb-6">
          Erreur lors du chargement de la page de contact
        </h2>
        <p className="text-walnut-600 font-light text-lg mb-8">
          Une erreur s&apos;est produite. Veuillez réessayer.
        </p>
        <div className="flex gap-4 justify-center">
          <button
            onClick={reset}
            className="inline-block px-8 py-3 border border-walnut-800 text-walnut-800 font-light hover:bg-walnut-800 hover:text-cream-50 transition-colors"
          >
            Réessayer
          </button>
          <Link
            href="/"
            className="inline-block px-8 py-3 border border-walnut-800 text-walnut-800 font-light hover:bg-walnut-800 hover:text-cream-50 transition-colors"
          >
            Retour à l&apos;accueil
          </Link>
        </div>
      </div>
    </div>
  )
}

