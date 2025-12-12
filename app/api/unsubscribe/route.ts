/**
 * Unsubscribe API Endpoint
 * GDPR-compliant unsubscribe handler
 */

import { NextRequest, NextResponse } from 'next/server'
import { secureApiRoute, securityErrorResponse } from '@/lib/security/api-security'
import { rateLimiters } from '@/lib/security/rate-limiter'
import { safeJsonParse, sanitizeEmail } from '@/lib/security/input-validation'
import { z } from 'zod'

const unsubscribeSchema = z.object({
  email: z.string().email().transform((val) => {
    try {
      return sanitizeEmail(val)
    } catch {
      throw new Error('Invalid email format')
    }
  }),
  reason: z.string().optional(),
})

async function handleUnsubscribe(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await safeJsonParse(request)
    const validationResult = unsubscribeSchema.safeParse(body)

    if (!validationResult.success) {
      return securityErrorResponse('Invalid email', 400)
    }

    const { email, reason } = validationResult.data

    // In production, update database
    // await prisma.emailConsent.update({
    //   where: { email },
    //   data: {
    //     unsubscribed: true,
    //     unsubscribedDate: new Date(),
    //     marketingConsent: false,
    //   },
    // })

    // Log unsubscribe
    console.log('Email unsubscribed:', email, reason)

    return NextResponse.json({
      success: true,
      message: 'Unsubscribed successfully',
    })
  } catch (error: any) {
    return securityErrorResponse('Unsubscribe failed', 500)
  }
}

export const POST = secureApiRoute(handleUnsubscribe, {
  methods: ['POST'],
  rateLimiter: rateLimiters.api,
})




