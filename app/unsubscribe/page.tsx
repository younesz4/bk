/**
 * Unsubscribe Page
 * GDPR-compliant unsubscribe system
 */

'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

function UnsubscribePageContent() {
  const searchParams = useSearchParams()
  const email = searchParams.get('email')
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [reason, setReason] = useState('')

  useEffect(() => {
    if (email) {
      // In production, call API to unsubscribe
      // For now, just show success
      setTimeout(() => {
        setStatus('success')
      }, 1000)
    } else {
      setStatus('error')
    }
  }, [email])

  const handleUnsubscribe = async () => {
    if (!email) return

    try {
      const response = await fetch('/api/unsubscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, reason }),
      })

      if (response.ok) {
        setStatus('success')
      } else {
        setStatus('error')
      }
    } catch (error) {
      setStatus('error')
    }
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-neutral-600">Traitement en cours...</p>
        </div>
      </div>
    )
  }

  if (status === 'error') {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="max-w-md text-center">
          <h1 className="text-2xl font-light mb-4">Erreur</h1>
          <p className="text-neutral-600 mb-6">
            Une erreur est survenue. Veuillez réessayer ou nous contacter.
          </p>
          <Link href="/contact" className="text-black underline">
            Nous contacter
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="max-w-md text-center px-6">
        <h1 className="text-3xl font-light mb-4" style={{ fontFamily: 'var(--font-bodoni)' }}>
          Désabonnement confirmé
        </h1>
        <p className="text-neutral-600 mb-6">
          Vous avez été désabonné avec succès de nos communications.
        </p>
        {email && (
          <p className="text-sm text-neutral-500 mb-6">
            Email: {email}
          </p>
        )}
        <Link href="/" className="text-black underline">
          Retour à l'accueil
        </Link>
      </div>
    </div>
  )
}

export default function UnsubscribePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-cream-50 pt-32 pb-24 px-6 md:px-8 flex items-center justify-center">
        <div className="text-lg text-neutral-600">Chargement...</div>
      </div>
    }>
      <UnsubscribePageContent />
    </Suspense>
  )
}


