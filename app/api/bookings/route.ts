import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendClientConfirmation, sendAdminNotification } from '@/lib/mail'
import { checkRateLimit } from '@/lib/rateLimit'
import { checkHoneypot, removeHoneypotFields } from '@/lib/honeypot'
import { safeApiHandler, parseJsonBody, validateRequest, handleValidationError } from '@/lib/api-helpers'
import { bookingFormSchema } from '@/lib/validation'
import { verifySession } from '@/lib/auth'

/**
 * POST /api/bookings - Create a new booking
 */
export async function POST(request: NextRequest) {
  return safeApiHandler(request, {
    method: 'POST',
    handler: async (req) => {
      // Get client IP for rate limiting
      const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 
                 req.headers.get('x-real-ip') || 
                 'unknown'
      
      // Rate limiting: 5 requests per 10 minutes
      const rateLimit = checkRateLimit(ip, 'bookings')
      
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
              'X-RateLimit-Limit': '5',
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
            { ok: true, message: 'Votre demande de rendez-vous a été enregistrée avec succès.' },
            { status: 200 }
          )
        }

        // Remove honeypot fields before validation
        const cleanedBody = removeHoneypotFields(body) as Record<string, any>
        
        // Transform API format to form schema format
        const formData = {
          ...cleanedBody,
          preferredDate: cleanedBody.date || cleanedBody.preferredDate,
          preferredTime: cleanedBody.timeSlot || cleanedBody.preferredTime,
        }
        
        const bookingData = validateRequest(formData, bookingFormSchema)

        // Create booking
        const booking = await prisma.booking.create({
          data: {
            fullName: bookingData.fullName.trim(),
            email: bookingData.email.trim().toLowerCase(),
            phone: bookingData.phone?.trim() || null,
            projectType: bookingData.projectType?.trim() || null,
            budget: bookingData.budget?.trim() || null,
            message: bookingData.message?.trim() || null,
            date: new Date(bookingData.preferredDate),
            timeSlot: bookingData.preferredTime.trim(),
            status: 'pending',
          },
        })

        // Send emails (non-blocking - booking is saved even if email fails)
        let emailSent = false
        try {
          const emailData = {
            fullName: booking.fullName,
            email: booking.email,
            phone: booking.phone || undefined,
            projectType: booking.projectType || undefined,
            budget: booking.budget || undefined,
            message: booking.message || undefined,
            date: booking.date.toISOString(),
            timeSlot: booking.timeSlot || '',
            bookingId: booking.id,
          }

          const [clientEmailSent, adminEmailSent] = await Promise.all([
            sendClientConfirmation(emailData),
            sendAdminNotification(emailData),
          ])

          emailSent = clientEmailSent && adminEmailSent
        } catch (emailError) {
          console.error('Email sending failed, but booking was saved:', emailError)
          // Continue - booking is already saved
        }

        return NextResponse.json(
          {
            ok: true,
            bookingId: booking.id,
            emailSent,
            message: emailSent 
              ? 'Votre demande de rendez-vous a été enregistrée avec succès.' 
              : 'Votre demande de rendez-vous a été enregistrée. Nous avons rencontré un problème d\'envoi d\'email, nous vous contacterons.',
          },
          { 
            status: 201,
            headers: {
              'X-RateLimit-Limit': '5',
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

/**
 * GET /api/bookings - Get bookings (admin only)
 */
export async function GET(request: NextRequest) {
  try {
    // Check admin authentication
    const { authAdmin } = await import('@/lib/adminAuth')
    const isAdmin = await authAdmin(request)
    if (!isAdmin) {
      return NextResponse.json(
        { ok: false, message: 'Non autorisé' },
        { status: 401 }
      )
    }

      // Fetch last 50 bookings
      const bookings = await prisma.booking.findMany({
        take: 50,
        orderBy: {
          createdAt: 'desc',
        },
        select: {
          id: true,
          fullName: true,
          email: true,
          phone: true,
          projectType: true,
          budget: true,
          message: true,
          date: true,
          timeSlot: true,
          createdAt: true,
          status: true,
        },
      })

    return NextResponse.json({
      ok: true,
      bookings: bookings.map((booking) => ({
        ...booking,
        date: booking.date.toISOString(),
        createdAt: booking.createdAt.toISOString(),
      })),
    })
  } catch (error: any) {
    console.error('Error fetching bookings:', error)
    return NextResponse.json(
      { ok: false, message: 'Erreur serveur' },
      { status: 500 }
    )
  }
}
