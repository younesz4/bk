/**
 * Input Validation and Sanitization Utilities
 * Prevents XSS, SQL injection, and other injection attacks
 */

import { z } from 'zod'

/**
 * Maximum request body size (2MB)
 */
export const MAX_REQUEST_SIZE = 2 * 1024 * 1024 // 2MB

/**
 * Sanitize string input - remove dangerous characters
 */
export function sanitizeString(input: string | null | undefined): string {
  if (!input || typeof input !== 'string') {
    return ''
  }
  
  // Remove null bytes
  let sanitized = input.replace(/\0/g, '')
  
  // Remove control characters except newlines and tabs
  sanitized = sanitized.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')
  
  // Trim whitespace
  sanitized = sanitized.trim()
  
  // Limit length (prevent DoS)
  if (sanitized.length > 10000) {
    sanitized = sanitized.substring(0, 10000)
  }
  
  return sanitized
}

/**
 * Sanitize HTML - escape dangerous characters
 */
export function escapeHTML(input: string | null | undefined): string {
  if (!input || typeof input !== 'string') {
    return ''
  }
  
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
}

/**
 * Validate and sanitize email
 */
export function sanitizeEmail(input: string | null | undefined): string {
  const sanitized = sanitizeString(input)
  const emailSchema = z.string().email()
  
  try {
    emailSchema.parse(sanitized)
    return sanitized.toLowerCase().trim()
  } catch {
    throw new Error('Invalid email format')
  }
}

/**
 * Validate and sanitize URL
 */
export function sanitizeURL(input: string | null | undefined): string {
  const sanitized = sanitizeString(input)
  
  try {
    const url = new URL(sanitized)
    // Only allow http and https
    if (!['http:', 'https:'].includes(url.protocol)) {
      throw new Error('Invalid URL protocol')
    }
    return url.toString()
  } catch {
    throw new Error('Invalid URL format')
  }
}

/**
 * Validate UUID
 */
export function validateUUID(input: string | null | undefined): string {
  if (!input || typeof input !== 'string') {
    throw new Error('Invalid UUID')
  }
  
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
  if (!uuidRegex.test(input)) {
    throw new Error('Invalid UUID format')
  }
  
  return input
}

/**
 * Validate CUID (Prisma default ID format)
 */
export function validateCUID(input: string | null | undefined): string {
  if (!input || typeof input !== 'string') {
    throw new Error('Invalid ID')
  }
  
  // CUID format: starts with 'c', followed by 25 alphanumeric characters
  const cuidRegex = /^c[a-z0-9]{25}$/i
  if (!cuidRegex.test(input)) {
    throw new Error('Invalid ID format')
  }
  
  return input
}

/**
 * Validate request body size
 */
export async function validateRequestSize(
  request: Request,
  maxSize: number = MAX_REQUEST_SIZE
): Promise<void> {
  const contentLength = request.headers.get('content-length')
  
  if (contentLength) {
    const size = parseInt(contentLength, 10)
    if (size > maxSize) {
      throw new Error(`Request body too large. Maximum size: ${maxSize / 1024 / 1024}MB`)
    }
  }
  
  // For streaming requests, we can't check size beforehand
  // But we can limit it during parsing
}

/**
 * Safe JSON parse with size limit
 */
export async function safeJsonParse<T>(
  request: Request,
  maxSize: number = MAX_REQUEST_SIZE
): Promise<T> {
  await validateRequestSize(request, maxSize)
  
  const text = await request.text()
  
  if (text.length > maxSize) {
    throw new Error(`Request body too large. Maximum size: ${maxSize / 1024 / 1024}MB`)
  }
  
  try {
    return JSON.parse(text) as T
  } catch (error) {
    throw new Error('Invalid JSON format')
  }
}

/**
 * Common validation schemas
 */
export const validationSchemas = {
  email: z.string().email('Invalid email format').transform((val) => sanitizeEmail(val)),
  url: z.string().url('Invalid URL format').transform((val) => sanitizeURL(val)),
  uuid: z.string().uuid('Invalid UUID format'),
  cuid: z.string().regex(/^c[a-z0-9]{25}$/i, 'Invalid ID format'),
  string: z.string().transform((val) => sanitizeString(val)),
  phone: z.string().regex(/^[\d\s\+\-\(\)]+$/, 'Invalid phone format').transform((val) => sanitizeString(val)),
  positiveInteger: z.number().int().positive('Must be a positive integer'),
  nonNegativeInteger: z.number().int().nonnegative('Must be a non-negative integer'),
  price: z.number().int().nonnegative('Price must be non-negative').refine(
    (val) => val <= 100000000, // Max 1 million euros (in cents)
    'Price too high'
  ),
}




