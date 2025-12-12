'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function CancelPage() {
  const router = useRouter()

  const handleGoBack = () => {
    // Try to go back in browser history, fallback to boutique
    if (window.history.length > 1) {
      router.back()
    } else {
      router.push('/boutique')
    }
  }

  return (
    <div className="bg-white min-h-screen pt-32 pb-24 px-6 md:px-8">
      <div className="max-w-2xl mx-auto text-center">
        <div className="mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-neutral-100 rounded-full mb-6">
            <svg
              width="40"
              height="40"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-neutral-400"
            >
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="15" y1="9" x2="9" y2="15"></line>
              <line x1="9" y1="9" x2="15" y2="15"></line>
            </svg>
          </div>
          <h1
            className="text-4xl md:text-5xl text-neutral-900 mb-6 font-light"
            style={{ fontFamily: 'var(--font-bodoni)' }}
          >
            Paiement annulé
          </h1>
          <p
            className="text-lg text-neutral-600 font-light leading-relaxed"
            style={{ fontFamily: 'var(--font-raleway)' }}
          >
            La transaction a été interrompue. Vous pouvez réessayer.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={handleGoBack}
            className="inline-block px-12 py-4 bg-neutral-900 text-white font-light hover:bg-neutral-800 transition-colors"
            style={{ fontFamily: 'var(--font-raleway)' }}
          >
            Retour au produit
          </button>
          <Link
            href="/boutique"
            className="inline-block px-12 py-4 border border-neutral-900 text-neutral-900 font-light hover:bg-neutral-900 hover:text-white transition-colors"
            style={{ fontFamily: 'var(--font-raleway)' }}
          >
            Retour à la boutique
          </Link>
        </div>
      </div>
    </div>
  )
}

