import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { SignJWT, jwtVerify } from 'jose'

const ADMIN_SESSION_SECRET = process.env.ADMIN_SESSION_SECRET || 'default-secret-change-in-production'

const COOKIE_NAME = 'admin_session'
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7 // 7 days

// Convert secret to Uint8Array for jose
function getSecretKey() {
  return new TextEncoder().encode(ADMIN_SESSION_SECRET)
}

export interface AdminSession {
  email: string
}

export async function createAdminSession(
  response: NextResponse,
  email: string
): Promise<void> {
  const secretKey = getSecretKey()
  const token = await new SignJWT({ email })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(secretKey)

  // Set cookie with explicit settings for localhost
  const cookieOptions: any = {
    httpOnly: true,
    secure: false, // Allow http in development (localhost)
    sameSite: 'lax' as const,
    maxAge: COOKIE_MAX_AGE,
    path: '/',
  }

  // Don't set domain in development (allows localhost to work)
  // Only set domain in production if specified
  if (process.env.NODE_ENV === 'production' && process.env.COOKIE_DOMAIN) {
    cookieOptions.domain = process.env.COOKIE_DOMAIN
    cookieOptions.secure = true
  }

  response.cookies.set(COOKIE_NAME, token, cookieOptions)
}

export async function getAdminFromRequest(
  request: NextRequest
): Promise<AdminSession | null> {
  const token = request.cookies.get(COOKIE_NAME)?.value

  if (!token) {
    return null
  }

  try {
    const secretKey = getSecretKey()
    const { payload } = await jwtVerify(token, secretKey)
    const email = payload.email as string
    
    if (!email) {
      return null
    }
    
    return { email }
  } catch (error: any) {
    // Silent fail for invalid tokens
    return null
  }
}

export function clearAdminSession(response: NextResponse): void {
  response.cookies.delete(COOKIE_NAME)
}

/**
 * Verify admin session from cookies() (for Server Components)
 * This is the same as getAdminFromRequest but works with next/headers cookies()
 */
export async function verifyAdminSession(): Promise<AdminSession | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get(COOKIE_NAME)?.value

  if (!token) {
    return null
  }

  try {
    const secretKey = getSecretKey()
    const { payload } = await jwtVerify(token, secretKey)
    const email = payload.email as string
    
    if (!email) {
      return null
    }
    
    return { email }
  } catch (error: any) {
    // Silent fail for invalid tokens
    return null
  }
}

/**
 * Verify admin session from cookie (for API routes with NextRequest)
 * Returns true if admin is authenticated, false otherwise
 * Uses the new JWT system with admin_session cookie
 */
export async function authAdmin(request?: NextRequest): Promise<boolean> {
  if (request) {
    // For API routes with NextRequest
    const session = await getAdminFromRequest(request)
    return session !== null
  } else {
    // For Server Components
    const session = await verifyAdminSession()
    return session !== null
  }
}
