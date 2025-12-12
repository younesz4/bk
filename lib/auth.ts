import { cookies } from 'next/headers'
import { createHmac } from 'crypto'
import { SESSION_SECRET, IS_PRODUCTION } from '@/lib/config'

const SESSION_COOKIE_NAME = 'admin_session'
const SESSION_MAX_AGE = 60 * 60 * 24 * 7 // 7 days in seconds

interface SessionData {
  adminId: string
  email: string
  expiresAt: number
}

/**
 * Create a secure session cookie
 */
export async function createSession(adminId: string, email: string) {
  const cookieStore = await cookies()
  const expiresAt = Date.now() + SESSION_MAX_AGE * 1000

  const sessionData: SessionData = {
    adminId,
    email,
    expiresAt,
  }

  // Encode session data
  const encoded = Buffer.from(JSON.stringify(sessionData)).toString('base64')
  const signature = signSession(encoded)

  cookieStore.set(SESSION_COOKIE_NAME, `${encoded}.${signature}`, {
    httpOnly: true,
    secure: IS_PRODUCTION,
    sameSite: 'lax',
    maxAge: SESSION_MAX_AGE,
    path: '/',
  })
}

/**
 * Verify and decode session cookie
 */
export async function verifySession(): Promise<SessionData | null> {
  try {
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME)

    if (!sessionCookie?.value) {
      return null
    }

    const [encoded, signature] = sessionCookie.value.split('.')

    if (!encoded || !signature) {
      return null
    }

    // Verify signature
    const expectedSignature = signSession(encoded)
    if (signature !== expectedSignature) {
      return null
    }

    // Decode session data
    const decoded = Buffer.from(encoded, 'base64').toString('utf-8')
    const sessionData: SessionData = JSON.parse(decoded)

    // Check expiration
    if (Date.now() > sessionData.expiresAt) {
      return null
    }

    return sessionData
  } catch (error) {
    console.error('Session verification error:', error)
    return null
  }
}

/**
 * Destroy session cookie
 */
export async function destroySession() {
  const cookieStore = await cookies()
  cookieStore.delete(SESSION_COOKIE_NAME)
}

/**
 * Sign session data using HMAC-SHA256
 */
function signSession(data: string): string {
  const hmac = createHmac('sha256', SESSION_SECRET)
  hmac.update(data)
  return hmac.digest('hex').substring(0, 32)
}

/**
 * Get current admin ID from session (helper function)
 */
export async function getAdminId(): Promise<string | null> {
  const session = await verifySession()
  return session?.adminId || null
}

