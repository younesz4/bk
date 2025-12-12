/**
 * API Security Utilities
 * Common security functions for all API routes
 */

import { NextRequest, NextResponse } from 'next/server'
import { safeJsonParse, validateRequestSize, MAX_REQUEST_SIZE } from './input-validation'
import { rateLimiters, withRateLimit } from './rate-limiter'

/**
 * Allowed HTTP methods for write operations
 */
export const ALLOWED_WRITE_METHODS = ['POST', 'PATCH', 'PUT', 'DELETE']

/**
 * Allowed HTTP methods for read operations
 */
export const ALLOWED_READ_METHODS = ['GET', 'HEAD']

/**
 * Security error response (no stack traces)
 */
export function securityErrorResponse(
  message: string,
  status: number = 400,
  details?: Record<string, unknown>
): NextResponse {
  return NextResponse.json(
    {
      error: message,
      ...(details && { details }),
    },
    { status }
  )
}

/**
 * Validate HTTP method
 */
export function validateMethod(
  request: NextRequest,
  allowedMethods: string[]
): void {
  if (!allowedMethods.includes(request.method)) {
    throw new Error(`Method ${request.method} not allowed`)
  }
}

/**
 * Secure API route wrapper
 */
export interface SecureApiOptions {
  methods: string[]
  rateLimiter?: (req: Request) => Promise<{ allowed: boolean; remaining: number; resetTime: number }>
  requireAuth?: boolean
  maxBodySize?: number
}

export function secureApiRoute(
  handler: (request: NextRequest) => Promise<NextResponse>,
  options: SecureApiOptions
) {
  return async (request: NextRequest): Promise<NextResponse> => {
    try {
      // 1. Validate HTTP method
      validateMethod(request, options.methods)
      
      // 2. Validate request size
      if (request.method !== 'GET' && request.method !== 'HEAD') {
        await validateRequestSize(request, options.maxBodySize || MAX_REQUEST_SIZE)
      }
      
      // 3. Apply rate limiting
      if (options.rateLimiter) {
        const response = await withRateLimit(
          request,
          options.rateLimiter,
          async () => {
            // 4. Execute handler
            return await handler(request)
          }
        )
        // Convert Response to NextResponse if needed
        if (response instanceof Response && !('cookies' in response)) {
          return NextResponse.json(await response.json(), { status: response.status, headers: response.headers })
        }
        return response as NextResponse
      }
      
      // 4. Execute handler
      return await handler(request)
    } catch (error: any) {
      // Log error server-side (but don't expose to client)
      console.error('API Security Error:', {
        message: error.message,
        path: request.nextUrl.pathname,
        method: request.method,
        // Don't log full stack trace in production
        ...(process.env.NODE_ENV === 'development' && { stack: error.stack }),
      })
      
      // Return generic error (no stack traces)
      if (error.message.includes('not allowed')) {
        return securityErrorResponse('Method not allowed', 405)
      }
      
      if (error.message.includes('too large')) {
        return securityErrorResponse(
          `Request too large. Maximum size: ${(options.maxBodySize || MAX_REQUEST_SIZE) / 1024 / 1024}MB`,
          413
        )
      }
      
      if (error.message.includes('Rate limit')) {
        return securityErrorResponse('Too many requests', 429)
      }
      
      // Generic error
      return securityErrorResponse(
        'An error occurred processing your request',
        500
      )
    }
  }
}

/**
 * Get client IP from request
 */
export function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for')
  if (forwarded) {
    return forwarded.split(',')[0].trim()
  }
  
  const realIP = request.headers.get('x-real-ip')
  if (realIP) {
    return realIP
  }
  
  return 'unknown'
}

/**
 * Check if request is from allowed IP (for admin routes)
 */
export function isAllowedIP(
  request: NextRequest,
  allowedIPs: string[]
): boolean {
  const clientIP = getClientIP(request)
  
  if (allowedIPs.length === 0) {
    return true // No restrictions
  }
  
  return allowedIPs.includes(clientIP)
}

/**
 * Validate Content-Type header
 */
export function validateContentType(
  request: NextRequest,
  expectedType: string = 'application/json'
): void {
  const contentType = request.headers.get('content-type')
  
  if (!contentType || !contentType.includes(expectedType)) {
    throw new Error(`Invalid Content-Type. Expected: ${expectedType}`)
  }
}




