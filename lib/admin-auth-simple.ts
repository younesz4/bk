/**
 * Simple Admin Authentication Utilities
 * Token signing and verification using Node.js crypto
 */

import { cookies } from 'next/headers'
import { createHmac } from 'crypto'

const SESSION_SECRET = process.env.SESSION_SECRET || 'change-me-in-production'
const COOKIE_NAME = 'admin_session'
const MAX_AGE = 60 * 60 * 4 // 4 hours

export interface AdminSessionToken {
  userId: string
  createdAt: number
}

/**
 * Sign a token using HMAC SHA-256
 */
function signToken(data: string): string {
  const hmac = createHmac('sha256', SESSION_SECRET)
  hmac.update(data)
  return hmac.digest('base64')
}

/**
 * Verify a token signature
 */
function verifyToken(data: string, signature: string): boolean {
  const expectedSignature = signToken(data)
  return expectedSignature === signature
}

/**
 * Create a signed session token
 */
export function createSessionToken(userId: string): string {
  const tokenData: AdminSessionToken = {
    userId,
    createdAt: Date.now(),
  }

  const encoded = Buffer.from(JSON.stringify(tokenData)).toString('base64')
  const signature = signToken(encoded)
  return `${encoded}.${signature}`
}

/**
 * Verify and decode a session token
 */
export function verifySessionToken(token: string): AdminSessionToken | null {
  try {
    const [encoded, signature] = token.split('.')
    if (!encoded || !signature) {
      return null
    }

    const isValid = verifyToken(encoded, signature)
    if (!isValid) {
      return null
    }

    const decoded = Buffer.from(encoded, 'base64').toString('utf-8')
    const tokenData: AdminSessionToken = JSON.parse(decoded)

    // Check if token has expired (4 hours)
    const now = Date.now()
    const age = now - tokenData.createdAt
    if (age > MAX_AGE * 1000) {
      return null
    }

    return tokenData
  } catch (error) {
    return null
  }
}

/**
 * Get session from cookie
 */
export async function getSession(): Promise<AdminSessionToken | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get(COOKIE_NAME)?.value
  if (!token) {
    return null
  }
  return verifySessionToken(token)
}

/**
 * Set session cookie
 */
export async function setSessionCookie(token: string): Promise<void> {
  const cookieStore = await cookies()
  const isProduction = process.env.NODE_ENV === 'production'

  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: isProduction,
    sameSite: 'strict',
    path: '/',
    maxAge: MAX_AGE,
  })
}

/**
 * Clear session cookie
 */
export async function clearSessionCookie(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.set(COOKIE_NAME, '', {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    path: '/',
    maxAge: 0,
  })
}

