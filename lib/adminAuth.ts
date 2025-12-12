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

  console.log('Setting admin_session cookie:', {
    hasToken: !!token,
    tokenLength: token.length,
    email,
    secretSet: !!process.env.ADMIN_SESSION_SECRET
  })

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
  
  // Also set it in headers for debugging
  response.headers.set('X-Set-Cookie', 'admin_session=' + token.substring(0, 20) + '...')

  console.log('Cookie set successfully with options:', {
    httpOnly: cookieOptions.httpOnly,
    secure: cookieOptions.secure,
    sameSite: cookieOptions.sameSite,
    path: cookieOptions.path,
    maxAge: cookieOptions.maxAge
  })
}

export async function getAdminFromRequest(
  request: NextRequest
): Promise<AdminSession | null> {
  const token = request.cookies.get(COOKIE_NAME)?.value

  if (!token) {
    console.log('No admin_session cookie found')
    return null
  }

  console.log('Attempting to verify token:', {
    tokenLength: token.length,
    tokenPreview: token.substring(0, 20) + '...',
    secretSet: !!ADMIN_SESSION_SECRET,
    secretLength: ADMIN_SESSION_SECRET.length
  })

  try {
    const secretKey = getSecretKey()
    const { payload } = await jwtVerify(token, secretKey)
    const email = payload.email as string
    
    if (!email) {
      console.log('JWT payload missing email:', payload)
      return null
    }
    
    console.log('Admin session verified successfully:', email)
    return { email }
  } catch (error: any) {
    console.log('JWT verification failed:', {
      error: error.message,
      errorName: error.name,
      errorCode: error.code,
      stack: error.stack?.substring(0, 200)
    })
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
    console.log('No admin_session cookie found (Server Component)')
    return null
  }

  console.log('Attempting to verify token (Server Component):', {
    tokenLength: token.length,
    tokenPreview: token.substring(0, 20) + '...',
    secretSet: !!ADMIN_SESSION_SECRET,
    secretLength: ADMIN_SESSION_SECRET.length
  })

  try {
    const secretKey = getSecretKey()
    const { payload } = await jwtVerify(token, secretKey)
    const email = payload.email as string
    
    if (!email) {
      console.log('JWT payload missing email:', payload)
      return null
    }
    
    console.log('Admin session verified successfully (Server Component):', email)
    return { email }
  } catch (error: any) {
    console.log('JWT verification failed (Server Component):', {
      error: error.message,
      errorName: error.name,
      errorCode: error.code,
      stack: error.stack?.substring(0, 200)
    })
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
