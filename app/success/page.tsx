import Link from 'next/link'

export default function SuccessPage() {
  return (
    <div className="bg-white min-h-screen pt-32 pb-24 px-6 md:px-8">
      <div className="max-w-2xl mx-auto text-center">
        <div className="mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-50 rounded-full mb-6">
            <svg
              width="40"
              height="40"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-green-600"
            >
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </div>
          <h1
            className="text-4xl md:text-5xl text-neutral-900 mb-6 font-light"
            style={{ fontFamily: 'var(--font-bodoni)' }}
          >
            Paiement confirmé
          </h1>
          <p
            className="text-lg text-neutral-600 font-light leading-relaxed"
            style={{ fontFamily: 'var(--font-raleway)' }}
          >
            Merci pour votre achat. Votre commande est en cours de traitement.
          </p>
        </div>

        <Link
          href="/boutique"
          className="inline-block px-12 py-4 bg-neutral-900 text-white font-light hover:bg-neutral-800 transition-colors"
          style={{ fontFamily: 'var(--font-raleway)' }}
        >
          Retour à la boutique
        </Link>
      </div>
    </div>
  )
}


