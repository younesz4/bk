/**
 * Admin Login Page
 * Two-step login: email/password → 2FA code
 */

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'

type Step = 'credentials' | 'code'

export default function AdminLoginPage() {
  const router = useRouter()
  const [step, setStep] = useState<Step>('credentials')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [code, setCode] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Identifiants invalides.')
        setIsLoading(false)
        return
      }

      // Success - move to code step
      setStep('code')
      setIsLoading(false)
    } catch (error) {
      console.error('Login error:', error)
      setError('Une erreur est survenue. Veuillez réessayer.')
      setIsLoading(false)
    }
  }

  const handleCodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/admin/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Code invalide ou expiré.')
        setIsLoading(false)
        return
      }

      // Success - redirect to admin panel
      router.push('/bk-agencements-panel')
      router.refresh()
    } catch (error) {
      console.error('Verify error:', error)
      setError('Une erreur est survenue. Veuillez réessayer.')
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <h1
            className="text-3xl font-light text-neutral-900 mb-2 tracking-wide"
            style={{ fontFamily: 'var(--font-bodoni)' }}
          >
            BK Agencements
          </h1>
          <p className="text-neutral-600 text-sm uppercase tracking-widest" style={{ fontFamily: 'var(--font-raleway)' }}>
            Administration
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-8">
          {step === 'credentials' ? (
            <form onSubmit={handleCredentialsSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-neutral-700 mb-2"
                  style={{ fontFamily: 'var(--font-raleway)' }}
                >
                  Adresse e-mail
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                  style={{ fontFamily: 'var(--font-raleway)' }}
                  required
                  autoComplete="email"
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-neutral-700 mb-2"
                  style={{ fontFamily: 'var(--font-raleway)' }}
                >
                  Mot de passe
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                  style={{ fontFamily: 'var(--font-raleway)' }}
                  required
                  autoComplete="current-password"
                />
              </div>

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-600" style={{ fontFamily: 'var(--font-raleway)' }}>
                    {error}
                  </p>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full px-6 py-3 bg-black text-white rounded-lg hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors uppercase tracking-wider text-sm font-light"
                style={{ fontFamily: 'var(--font-raleway)' }}
              >
                {isLoading ? 'Envoi du code...' : 'Continuer'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleCodeSubmit} className="space-y-6">
              <div className="text-center mb-6">
                <p className="text-neutral-700 mb-2" style={{ fontFamily: 'var(--font-raleway)' }}>
                  Entrez le code de vérification envoyé à votre adresse e-mail.
                </p>
                <p className="text-sm text-neutral-500" style={{ fontFamily: 'var(--font-raleway)' }}>
                  {email}
                </p>
              </div>

              <div>
                <label
                  htmlFor="code"
                  className="block text-sm font-medium text-neutral-700 mb-2"
                  style={{ fontFamily: 'var(--font-raleway)' }}
                >
                  Code de vérification
                </label>
                <input
                  type="text"
                  id="code"
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent transition-all text-center text-2xl tracking-widest font-mono"
                  style={{ fontFamily: 'var(--font-raleway)' }}
                  placeholder="000000"
                  maxLength={6}
                  required
                  autoComplete="off"
                />
              </div>

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-600" style={{ fontFamily: 'var(--font-raleway)' }}>
                    {error}
                  </p>
                </div>
              )}

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setStep('credentials')
                    setCode('')
                    setError(null)
                  }}
                  className="flex-1 px-6 py-3 border border-neutral-300 text-neutral-700 rounded-lg hover:bg-neutral-50 transition-colors uppercase tracking-wider text-sm font-light"
                  style={{ fontFamily: 'var(--font-raleway)' }}
                >
                  Retour
                </button>
                <button
                  type="submit"
                  disabled={isLoading || code.length !== 6}
                  className="flex-1 px-6 py-3 bg-black text-white rounded-lg hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors uppercase tracking-wider text-sm font-light"
                  style={{ fontFamily: 'var(--font-raleway)' }}
                >
                  {isLoading ? 'Vérification...' : 'Vérifier'}
                </button>
              </div>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  )
}




