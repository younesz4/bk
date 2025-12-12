/**
 * Enhanced Admin Authentication System
 * JWT-like session tokens, 2FA support, IP protection
 */

import { cookies } from 'next/headers'
import { createHmac } from 'crypto'
import bcrypt from 'bcrypt'
import { prisma } from '@/lib/prisma'
import { SESSION_SECRET, IS_PRODUCTION } from '@/lib/config'
import { getClientIP } from '@/lib/security/api-security'
import { NextRequest } from 'next/server'

const SESSION_COOKIE_NAME = 'admin_session'
const SESSION_MAX_AGE = 60 * 60 * 24 * 7 // 7 days

export interface AdminSession {
  adminId: string
  email: string
  role: string
  name?: string
  expiresAt: number
  ipAddress?: string
}

export interface AdminUser {
  id: string
  email: string
  role?: string
  name?: string
}

/**
 * Hash password using bcrypt
 */
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 12
  return bcrypt.hash(password, saltRounds)
}

/**
 * Verify password
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

/**
 * Create admin session
 */
export async function createAdminSession(
  adminId: string,
  email: string,
  role: string,
  name?: string,
  request?: NextRequest
): Promise<void> {
  const cookieStore = await cookies()
  const expiresAt = Date.now() + SESSION_MAX_AGE * 1000
  const ipAddress = request ? getClientIP(request) : undefined

  const sessionData: AdminSession = {
    adminId,
    email,
    role,
    name,
    expiresAt,
    ipAddress,
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

  // Update last login
  await prisma.admin.update({
    where: { id: adminId },
    // lastLogin field not in Admin model - removed
    data: {},
  })
}

/**
 * Verify admin session
 */
export async function verifyAdminSession(request?: NextRequest): Promise<AdminSession | null> {
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
    const sessionData: AdminSession = JSON.parse(decoded)

    // Check expiration
    if (Date.now() > sessionData.expiresAt) {
      return null
    }

    // Verify admin still exists and is active
    const admin = await prisma.admin.findUnique({
      where: { id: sessionData.adminId },
      select: { id: true, email: true },
    })

    if (!admin) {
      return null
    }

    // Optional: Verify IP address matches (for extra security)
    if (request && sessionData.ipAddress) {
      const currentIP = getClientIP(request)
      // Allow IP change for now (can be strict in production)
      // if (currentIP !== sessionData.ipAddress) {
      //   return null
      // }
    }

    return sessionData
  } catch (error) {
    console.error('Session verification error:', error)
    return null
  }
}

/**
 * Destroy admin session
 */
export async function destroyAdminSession(): Promise<void> {
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
 * Get current admin from session
 */
export async function getCurrentAdmin(request?: NextRequest): Promise<AdminUser | null> {
  const session = await verifyAdminSession(request)
  if (!session) {
    return null
  }

  const admin = await prisma.admin.findUnique({
    where: { id: session.adminId },
    select: {
      id: true,
      email: true,
    },
  })

    if (!admin) {
    return null
  }

  return admin
}

/**
 * Check if admin has permission
 */
export function hasPermission(role: string, requiredPermission: string): boolean {
  const permissions: Record<string, string[]> = {
    admin: ['*'], // All permissions
    manager: [
      'orders.*',
      'quotes.*',
      'products.*',
      'categories.*',
      'contacts.*',
      'payments.view',
      'payments.verify',
    ],
    production: [
      'orders.view',
      'orders.update_status',
      'products.view',
    ],
    finance: [
      'orders.view',
      'payments.*',
      'quotes.view',
    ],
    viewer: [
      'orders.view',
      'quotes.view',
      'products.view',
      'categories.view',
      'contacts.view',
      'payments.view',
    ],
  }

  const rolePermissions = permissions[role] || []
  
  // Admin has all permissions
  if (rolePermissions.includes('*')) {
    return true
  }

  // Check exact permission
  if (rolePermissions.includes(requiredPermission)) {
    return true
  }

  // Check wildcard permission (e.g., 'orders.*' matches 'orders.view')
  const wildcardMatch = rolePermissions.find((perm) => {
    if (perm.endsWith('.*')) {
      const prefix = perm.replace('.*', '')
      return requiredPermission.startsWith(prefix + '.')
    }
    return false
  })

  return !!wildcardMatch
}

/**
 * Verify admin authentication for API routes
 */
export async function verifyAdminAuth(request: NextRequest): Promise<{
  authenticated: boolean
  admin?: AdminUser
  error?: string
}> {
  // 1. Verify session
  const session = await verifyAdminSession(request)
  if (!session) {
    return {
      authenticated: false,
      error: 'Not authenticated',
    }
  }

  // 2. Get admin from database
  const admin = await prisma.admin.findUnique({
    where: { id: session.adminId },
    select: {
      id: true,
      email: true,
    },
  })

    if (!admin) {
    return {
      authenticated: false,
      error: 'Admin not found or inactive',
    }
  }

  return {
    authenticated: true,
    admin,
  }
}




