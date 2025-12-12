/**
 * Email Sending API Route
 * POST: Send email by event type
 */

import { NextRequest, NextResponse } from 'next/server'
import { sendEmailByEvent, sendEmailBatch, EmailEvent } from '@/lib/email-service'
import { secureApiRoute, securityErrorResponse } from '@/lib/security/api-security'
import { rateLimiters } from '@/lib/security/rate-limiter'
import { safeJsonParse } from '@/lib/security/input-validation'
import { z } from 'zod'

export const dynamic = 'force-dynamic'

const sendEmailSchema = z.object({
  type: z.enum([
    'order_confirmation',
    'quote_request',
    'quote_received_admin',
    'order_status_update',
    'payment_confirmation',
    'abandoned_cart',
    'contact_confirmation',
    'contact_admin_alert',
    'order_shipped',
  ]),
  data: z.any(),
  to: z.string().email().optional(),
  cc: z.array(z.string().email()).optional(),
  bcc: z.array(z.string().email()).optional(),
})

const sendBatchSchema = z.object({
  events: z.array(sendEmailSchema),
})

async function handleSendEmail(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await safeJsonParse(request)
    const validationResult = sendEmailSchema.safeParse(body)

    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Validation error', details: validationResult.error.issues },
        { status: 400 }
      )
    }

    const result = await sendEmailByEvent(validationResult.data as EmailEvent)

    if (result.success) {
      return NextResponse.json({
        success: true,
        messageId: result.messageId,
      })
    } else {
      return NextResponse.json(
        { error: result.error || 'Failed to send email' },
        { status: 500 }
      )
    }
  } catch (error: any) {
    console.error('Send email error:', error)
    return securityErrorResponse('Failed to send email', 500)
  }
}

async function handleSendBatch(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await safeJsonParse(request)
    const validationResult = sendBatchSchema.safeParse(body)

    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Validation error', details: validationResult.error.issues },
        { status: 400 }
      )
    }

    const results = await sendEmailBatch(validationResult.data.events as EmailEvent[])

    return NextResponse.json({
      success: true,
      results,
    })
  } catch (error: any) {
    console.error('Send batch email error:', error)
    return securityErrorResponse('Failed to send batch emails', 500)
  }
}

export const POST = secureApiRoute(handleSendEmail, {
  methods: ['POST'],
  rateLimiter: rateLimiters.api,
})

// Batch endpoint
export async function PUT(request: NextRequest): Promise<NextResponse> {
  return secureApiRoute(handleSendBatch, {
    methods: ['PUT'],
    rateLimiter: rateLimiters.api,
  })(request)
}




