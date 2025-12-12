/**
 * Admin Panel Protection
 * IP allowlist, rate limiting, and access control
 */

import { NextRequest } from 'next/server'
import { getClientIP } from './api-security'
import { rateLimiters } from './rate-limiter'

/**
 * Get allowed IPs from environment
 */
export function getAllowedIPs(): string[] {
  const allowedIPs = process.env.ADMIN_ALLOWED_IPS || ''
  return allowedIPs.split(',').filter(Boolean).map((ip) => ip.trim())
}

/**
 * Check if IP is allowed for admin access
 */
export function isAdminIPAllowed(request: NextRequest): boolean {
  const allowedIPs = getAllowedIPs()
  const clientIP = getClientIP(request)
  
  // If no IPs configured, allow all (not recommended for production)
  if (allowedIPs.length === 0) {
    console.warn('WARNING: No admin IPs configured. Allowing all IPs.')
    return true
  }
  
  return allowedIPs.includes(clientIP)
}

/**
 * Admin route protection middleware
 */
export async function protectAdminRoute(request: NextRequest): Promise<{
  allowed: boolean
  error?: string
}> {
  // 1. Check IP allowlist
  if (!isAdminIPAllowed(request)) {
    console.warn(`Unauthorized admin access attempt from IP: ${getClientIP(request)}`)
    return {
      allowed: false,
      error: 'Unauthorized',
    }
  }
  
  // 2. Apply rate limiting
  const rateLimit = await rateLimiters.admin(request)
  if (!rateLimit.allowed) {
    return {
      allowed: false,
      error: 'Rate limit exceeded',
    }
  }
  
  return { allowed: true }
}

/**
 * Verify admin authentication (for API routes)
 */
export async function verifyAdminAuth(request: NextRequest): Promise<{
  authorized: boolean
  error?: string
}> {
  // Use protectAdminRoute which includes IP check and rate limiting
  const protection = await protectAdminRoute(request)
  
  if (!protection.allowed) {
    return {
      authorized: false,
      error: protection.error || 'Unauthorized',
    }
  }
  
  // Additional auth check can be added here if needed
  // For now, IP allowlist + rate limiting is the protection
  
  return { authorized: true }
}

/**
 * Generate robots.txt content that blocks admin pages
 */
export function generateAdminRobotsTxt(): string {
  return `User-agent: *
Disallow: /admin/
Disallow: /api/admin/
`
}




