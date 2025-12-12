import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifySession } from '@/lib/auth'
import { sendEmail } from '@/lib/email'
import { generateStatusChangeEmail } from '@/lib/email-templates'
import { safeApiHandler, parseJsonBody, validateRequest, handleValidationError } from '@/lib/api-helpers'
import { updateOrderSchema } from '@/lib/api-validators'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  return safeApiHandler(request, {
    method: 'POST',
    handler: async (req) => {
      // Validate admin authentication
      const session = await verifySession()
      if (!session) {
        return NextResponse.json(
          { error: 'Non autorisé' },
          { status: 401 }
        )
      }

      try {
        const body = await parseJsonBody(req)
        const { id, status } = validateRequest(body, updateOrderSchema)

    const order = await prisma.order.findUnique({
      where: { id },
    })

    if (!order) {
      return NextResponse.json(
        { error: 'Commande non trouvée' },
        { status: 404 }
      )
    }

    // Store old status for comparison
    const oldStatus = order.status || 'New'
    const statusChanged = oldStatus !== status

    const updatedOrder = await prisma.order.update({
      where: { id },
      data: { status },
      include: {
        items: {
          include: {
            product: {
              include: {
                images: {
                  orderBy: { order: 'asc' },
                  take: 1,
                },
                category: true,
              },
            },
          },
        },
      },
    })

    // Send status change email to admin if status changed (don't fail update if email fails)
    if (statusChanged) {
      try {
        const adminEmail = process.env.ADMIN_EMAIL || process.env.SMTP_USER
        if (adminEmail) {
          const statusChangeEmail = generateStatusChangeEmail({
            orderId: order.id,
            oldStatus,
            newStatus: status,
            changedAt: new Date().toISOString(),
          })

          const emailResult = await sendEmail(
            adminEmail,
            statusChangeEmail.subject,
            statusChangeEmail.html,
            statusChangeEmail.text
          )

          if (emailResult) {
            console.log(`✅ [ORDER ${order.id}] Status change email sent (${oldStatus} → ${status})`)
          } else {
            console.error(`❌ [ORDER ${order.id}] Failed to send status change email:`, {
              oldStatus,
              newStatus: status,
              timestamp: new Date().toISOString(),
            })
          }
        } else {
          console.log(`ℹ️ [ORDER ${order.id}] Status change email skipped (ADMIN_EMAIL not configured)`)
        }
      } catch (emailError: any) {
        // Log error but don't fail the order update
        console.error(`❌ [ORDER ${order.id}] Failed to send status change email:`, {
          error: emailError?.message || String(emailError),
          stack: emailError?.stack,
          oldStatus,
          newStatus: status,
          timestamp: new Date().toISOString(),
        })
      }
    }

        return NextResponse.json({
          success: true,
          order: updatedOrder,
        })
      } catch (error: any) {
        return handleValidationError(error)
      }
    },
  })
}

