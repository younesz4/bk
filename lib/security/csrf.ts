/**
 * CSRF Protection Utilities
 */

import { cookies } from 'next/headers'
import crypto from 'crypto'

const CSRF_TOKEN_COOKIE = 'csrf-token'
const CSRF_TOKEN_HEADER = 'x-csrf-token'

/**
 * Generate CSRF token
 */
export function generateCSRFToken(): string {
  return crypto.randomBytes(32).toString('hex')
}

/**
 * Get or create CSRF token
 * Note: This should be called from a Server Component or API route
 */
export async function getCSRFToken(): Promise<string> {
  try {
    const cookieStore = await cookies()
    let token = cookieStore.get(CSRF_TOKEN_COOKIE)?.value
    
    if (!token) {
      token = generateCSRFToken()
      cookieStore.set(CSRF_TOKEN_COOKIE, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24, // 24 hours
      })
    }
    
    return token
  } catch (error) {
    // If cookies() fails (e.g., in middleware), generate a new token
    return generateCSRFToken()
  }
}

/**
 * Validate CSRF token
 * Note: This should be called from an API route
 */
export async function validateCSRFToken(request: Request): Promise<boolean> {
  try {
    const cookieStore = await cookies()
    const cookieToken = cookieStore.get(CSRF_TOKEN_COOKIE)?.value
    const headerToken = request.headers.get(CSRF_TOKEN_HEADER)
    
    if (!cookieToken || !headerToken) {
      return false
    }
    
    // Ensure tokens are same length for timing-safe comparison
    if (cookieToken.length !== headerToken.length) {
      return false
    }
    
    // Use timing-safe comparison to prevent timing attacks
    return crypto.timingSafeEqual(
      Buffer.from(cookieToken),
      Buffer.from(headerToken)
    )
  } catch (error) {
    // If validation fails, return false
    return false
  }
}

/**
 * Require CSRF token for write operations
 */
export async function requireCSRFToken(request: Request): Promise<void> {
  const isValid = await validateCSRFToken(request)
  
  if (!isValid) {
    throw new Error('Invalid CSRF token')
  }
}

