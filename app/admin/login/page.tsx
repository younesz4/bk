'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminLogin() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // Include cookies in request
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Erreur lors de la connexion.')
        setLoading(false)
        return
      }

      // Login successful - cookie should be set by server
      console.log('Login successful, response received')
      
      // Wait for cookie to be set, then redirect
      // Using replace instead of href to avoid adding to history
      setTimeout(() => {
        window.location.replace('/admin')
      }, 300)
    } catch (err) {
      console.error('Login error:', err)
      setError('Une erreur est survenue.')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-cream-50">
      <div className="bg-frost p-8 md:p-12 rounded-sm border border-neutral-200 shadow-sm w-full max-w-md">
        <h1
          className="text-3xl md:text-4xl mb-2 text-center"
          style={{ fontFamily: 'var(--font-bodoni)' }}
        >
          BK Agencements
        </h1>
        <p
          className="text-sm text-neutral-600 text-center mb-8"
          style={{ fontFamily: 'var(--font-raleway)' }}
        >
          Administration
        </p>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-sm mb-2 text-neutral-700"
              style={{ fontFamily: 'var(--font-raleway)' }}
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-neutral-300 bg-frost rounded-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition"
              style={{ fontFamily: 'var(--font-raleway)' }}
              required
              placeholder="admin@bk-agencements.com"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm mb-2 text-neutral-700"
              style={{ fontFamily: 'var(--font-raleway)' }}
            >
              Mot de passe
            </label>
            <input
              type="password"
              id="password"
              name="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-neutral-300 bg-frost rounded-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition"
              style={{ fontFamily: 'var(--font-raleway)' }}
              required
              placeholder="••••••••"
            />
          </div>

          {error && (
            <p
              className="text-red-500 text-sm"
              style={{ fontFamily: 'var(--font-raleway)' }}
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full px-6 py-4 bg-black text-white uppercase tracking-wider text-sm font-light hover:bg-neutral-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
            style={{ fontFamily: 'var(--font-raleway)' }}
          >
            {loading ? 'Connexion...' : 'Connexion'}
          </button>
        </form>
      </div>
    </div>
  )
}

