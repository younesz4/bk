/**
 * Quote Request API Endpoint
 * Creates a new quote request
 */

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendEmail } from '@/lib/email'
import { generateQuoteRequestReceivedEmail } from '@/lib/transactional-email-templates'
import { ADMIN_NOTIFICATION_EMAIL } from '@/lib/config'
import { secureApiRoute, securityErrorResponse } from '@/lib/security/api-security'
import { rateLimiters } from '@/lib/security/rate-limiter'
import { safeJsonParse, sanitizeEmail, sanitizeString } from '@/lib/security/input-validation'
import { z } from 'zod'

export const dynamic = 'force-dynamic'

const quoteRequestSchema = z.object({
  customerName: z.string().min(2).max(100),
  email: z.string().email().transform((val) => {
    try {
      return sanitizeEmail(val)
    } catch {
      throw new Error('Invalid email format')
    }
  }),
  phone: z.string().min(10).max(20),
  address: z.string().max(200).optional(),
  city: z.string().max(100).optional(),
  projectType: z.string().min(1),
  budget: z.string().optional(),
  message: z.string().max(2000).optional(),
  dimensions: z.string().max(200).optional(),
  materials: z.string().max(200).optional(),
  finishes: z.string().max(200).optional(),
  customDetails: z.string().max(2000).optional(),
  honeypot: z.string().max(0).optional(), // Must be empty
})

async function handleQuoteRequest(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await safeJsonParse(request) as any
    
    // Check honeypot
    if (body.honeypot && body.honeypot.length > 0) {
      return securityErrorResponse('Spam detected', 400)
    }

    const validationResult = quoteRequestSchema.safeParse(body)

    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: 'Validation error',
          details: validationResult.error.issues,
        },
        { status: 400 }
      )
    }

    const data = validationResult.data

    // Create quote request in Contact table (Quote model doesn't exist)
    const contact = await prisma.contact.create({
      data: {
        firstName: sanitizeString(data.customerName.split(' ')[0] || data.customerName),
        lastName: sanitizeString(data.customerName.split(' ').slice(1).join(' ') || ''),
        email: data.email,
        phone: sanitizeString(data.phone),
        projectType: sanitizeString(data.projectType),
        budget: data.budget ? sanitizeString(data.budget) : null,
        message: data.message 
          ? sanitizeString(`${data.message}${data.dimensions ? `\nDimensions: ${data.dimensions}` : ''}${data.materials ? `\nMaterials: ${data.materials}` : ''}${data.finishes ? `\nFinishes: ${data.finishes}` : ''}${data.customDetails ? `\nCustom Details: ${data.customDetails}` : ''}`)
          : sanitizeString(`Quote request for ${data.projectType}`),
      },
    })

    // Send confirmation email to customer
    try {
      // Create quote-like object for email template (matching Quote interface)
      const quoteForEmail = {
        id: contact.id,
        customerName: data.customerName,
        email: data.email,
        phone: data.phone,
        projectType: data.projectType,
        budget: data.budget || null,
        message: data.message || null,
        dimensions: data.dimensions || null,
        materials: data.materials || null,
        finishes: data.finishes || null,
        customDetails: data.customDetails || null,
        createdAt: contact.createdAt.toISOString(),
        status: 'pending',
      } as any
      const customerEmail = generateQuoteRequestReceivedEmail({ quote: quoteForEmail })
      await sendEmail(
        data.email,
        customerEmail.subject,
        customerEmail.html,
        customerEmail.text
      )
    } catch (emailError: any) {
      console.error('Failed to send customer email:', emailError.message)
      // Don't fail the request if email fails
    }

    // Send admin notification
    if (ADMIN_NOTIFICATION_EMAIL) {
      try {
        await sendEmail(
          ADMIN_NOTIFICATION_EMAIL,
          `Nouvelle demande de devis #${contact.id.substring(0, 8)} - ${data.customerName}`,
          `
            <h2>Nouvelle demande de devis</h2>
            <p><strong>Référence:</strong> #${contact.id.substring(0, 8)}</p>
            <p><strong>Client:</strong> ${data.customerName}</p>
            <p><strong>Email:</strong> ${data.email}</p>
            <p><strong>Téléphone:</strong> ${data.phone}</p>
            <p><strong>Type de projet:</strong> ${data.projectType}</p>
            ${data.budget ? `<p><strong>Budget:</strong> ${data.budget}</p>` : ''}
            ${data.message ? `<p><strong>Message:</strong> ${data.message}</p>` : ''}
            <p><a href="${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/admin/contacts/${contact.id}">Voir la demande</a></p>
          `
        )
      } catch (emailError: any) {
        console.error('Failed to send admin email:', emailError.message)
      }
    }

    return NextResponse.json({
      success: true,
      quoteId: contact.id,
      message: 'Votre demande de devis a été envoyée avec succès.',
    })
  } catch (error: any) {
    console.error('Quote request error:', error)
    return securityErrorResponse('Failed to create quote request', 500)
  }
}

export const POST = secureApiRoute(handleQuoteRequest, {
  methods: ['POST'],
  rateLimiter: rateLimiters.contact, // Use contact rate limiter (10 req/min)
})




