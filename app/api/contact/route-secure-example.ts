/**
 * SECURE API ROUTE EXAMPLE
 * This demonstrates all security best practices for API routes
 */

import { NextRequest, NextResponse } from 'next/server'
import { secureApiRoute, securityErrorResponse, validateContentType } from '@/lib/security/api-security'
import { rateLimiters } from '@/lib/security/rate-limiter'
import { safeJsonParse, sanitizeString, sanitizeEmail } from '@/lib/security/input-validation'
import { requireCSRFToken } from '@/lib/security/csrf'
import { z } from 'zod'

// Validation schema
const contactFormSchema = z.object({
  firstName: z.string().min(1, 'First name required').max(100).transform(sanitizeString),
  lastName: z.string().min(1, 'Last name required').max(100).transform(sanitizeString),
  email: z.string().email('Invalid email').transform((val) => {
    try {
      return sanitizeEmail(val)
    } catch {
      throw new Error('Invalid email format')
    }
  }),
  phone: z.string().optional().transform((val) => val ? sanitizeString(val) : undefined),
  message: z.string().min(10, 'Message too short').max(5000).transform(sanitizeString),
  budget: z.string().optional(),
  projectType: z.string().optional(),
  // Honeypot field (must be empty)
  company2: z.string().optional().refine((val) => !val || val === '', {
    message: 'Honeypot field must be empty',
  }),
})

/**
 * POST /api/contact - Secure contact form handler
 */
async function handleContact(request: NextRequest): Promise<NextResponse> {
  try {
    // 1. Validate Content-Type
    validateContentType(request, 'application/json')
    
    // 2. Parse and validate JSON body
    const body = await safeJsonParse<z.infer<typeof contactFormSchema>>(request)
    
    // 3. Validate with Zod schema
    const validationResult = contactFormSchema.safeParse(body)
    
    if (!validationResult.success) {
      return securityErrorResponse('Validation failed', 400, {
        errors: validationResult.error.issues,
      })
    }
    
    const data = validationResult.data
    
    // 4. Check honeypot (silently reject if filled)
    if (data.company2 && data.company2.trim() !== '') {
      // Silently accept (don't reveal honeypot detection)
      return NextResponse.json({ ok: true, message: 'Message sent successfully' })
    }
    
    // 5. Process contact form (send email, save to DB, etc.)
    // ... your business logic here ...
    
    return NextResponse.json({
      ok: true,
      message: 'Message sent successfully',
    })
  } catch (error: any) {
    // Error already handled by secureApiRoute wrapper
    throw error
  }
}

// Export with security wrapper
export const POST = secureApiRoute(handleContact, {
  methods: ['POST'],
  rateLimiter: rateLimiters.contact,
  maxBodySize: 2 * 1024 * 1024, // 2MB
})

// Reject all other methods
export async function GET() {
  return securityErrorResponse('Method not allowed', 405)
}

export async function PUT() {
  return securityErrorResponse('Method not allowed', 405)
}

export async function PATCH() {
  return securityErrorResponse('Method not allowed', 405)
}

export async function DELETE() {
  return securityErrorResponse('Method not allowed', 405)
}




