/**
 * Admin Login Form
 * Elicyon-style luxury design
 */

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginForm() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      if (response.ok) {
        router.push('/admin')
        router.refresh()
      } else {
        const data = await response.json()
        setError(data.error || 'Invalid credentials')
      }
    } catch (err) {
      setError('An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Title */}
        <h1
          className="text-4xl md:text-5xl font-serif text-white mb-2 text-center tracking-tight"
          style={{ fontFamily: 'var(--font-bodoni)' }}
        >
          Admin
        </h1>
        <p className="text-xs text-white/60 uppercase tracking-widest text-center mb-12" style={{ fontFamily: 'var(--font-raleway)' }}>
          Login
        </p>

        {/* Card */}
        <div className="border border-white/10 bg-black/50 backdrop-blur-sm p-8 md:p-12">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-xs text-white/60 uppercase tracking-widest mb-2"
                style={{ fontFamily: 'var(--font-raleway)' }}
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 bg-transparent border border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-white/40 transition-colors"
                style={{ fontFamily: 'var(--font-raleway)' }}
                placeholder="your@email.com"
                autoComplete="email"
              />
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-xs text-white/60 uppercase tracking-widest mb-2"
                style={{ fontFamily: 'var(--font-raleway)' }}
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 bg-transparent border border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-white/40 transition-colors"
                style={{ fontFamily: 'var(--font-raleway)' }}
                placeholder="••••••••"
                autoComplete="current-password"
              />
            </div>

            {/* Error */}
            {error && (
              <div className="text-xs text-red-400 text-center" style={{ fontFamily: 'var(--font-raleway)' }}>
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 border border-white/20 text-white uppercase tracking-widest text-xs hover:border-white/40 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ fontFamily: 'var(--font-raleway)' }}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
