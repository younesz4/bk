import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { checkRateLimit } from '@/lib/rateLimit'
import { checkHoneypot, removeHoneypotFields } from '@/lib/honeypot'
import { safeApiHandler, parseJsonBody, validateRequest, handleValidationError } from '@/lib/api-helpers'
import { contactFormSchema } from '@/lib/validation'

export const dynamic = 'force-dynamic'

/**
 * POST /api/contact - Submit contact form
 */
export async function POST(request: NextRequest) {
  return safeApiHandler(request, {
    method: 'POST',
    handler: async (req) => {
      // Get client IP for rate limiting
      const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 
                 req.headers.get('x-real-ip') || 
                 'unknown'
      
      // Rate limiting: 10 requests per 10 minutes
      const rateLimit = checkRateLimit(ip, 'contact')
      
      if (!rateLimit.allowed) {
        const resetTime = rateLimit.resetTime ? new Date(rateLimit.resetTime).toISOString() : undefined
        return NextResponse.json(
          { 
            ok: false, 
            message: 'Trop de requêtes. Veuillez réessayer dans quelques instants.',
            resetTime,
          },
          { 
            status: 429,
            headers: {
              'Retry-After': rateLimit.resetTime ? Math.ceil((rateLimit.resetTime - Date.now()) / 1000).toString() : '600',
              'X-RateLimit-Limit': '10',
              'X-RateLimit-Remaining': '0',
              'X-RateLimit-Reset': rateLimit.resetTime?.toString() || '',
            },
          }
        )
      }

      try {
        const body = await parseJsonBody(req) as Record<string, any>
        
        // Check honeypot fields (must be empty)
        if (checkHoneypot(body)) {
          // Silently reject - don't reveal honeypot detection
          return NextResponse.json(
            { ok: true, message: 'Votre message a été envoyé avec succès.' },
            { status: 200 }
          )
        }

        // Remove honeypot fields before validation
        const cleanedBody = removeHoneypotFields(body)
        const contactData = validateRequest(cleanedBody, contactFormSchema)

        // Store contact message in database
        const contact = await prisma.contact.create({
          data: {
            firstName: contactData.firstName.trim(),
            lastName: contactData.lastName.trim(),
            email: contactData.email.trim().toLowerCase(),
            phone: contactData.phone?.trim() || null,
            projectType: contactData.projectType?.trim() || null,
            budget: contactData.budget?.trim() || null,
            message: contactData.message.trim(),
          },
        })

        // Log for debugging
        console.log('Contact form submission saved:', {
          id: contact.id,
          email: contact.email,
          timestamp: contact.createdAt.toISOString(),
        })

        // TODO: Send email notification to admin
        // TODO: Optionally send confirmation email to user

        return NextResponse.json(
          {
            ok: true,
            message: 'Votre message a été envoyé avec succès. Nous vous répondrons dans les plus brefs délais.',
          },
          { 
            status: 200,
            headers: {
              'X-RateLimit-Limit': '10',
              'X-RateLimit-Remaining': rateLimit.remaining.toString(),
              'X-RateLimit-Reset': rateLimit.resetTime?.toString() || '',
            },
          }
        )
      } catch (error: any) {
        return handleValidationError(error)
      }
    },
  })
}

