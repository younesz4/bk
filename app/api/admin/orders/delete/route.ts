import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifySession } from '@/lib/auth'
import { safeApiHandler, parseJsonBody, validateRequest, handleValidationError } from '@/lib/api-helpers'
import { deleteOrderSchema } from '@/lib/api-validators'

export const dynamic = 'force-dynamic'

/**
 * POST /api/admin/orders/delete
 * Delete an order (admin only)
 */
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
        const { id } = validateRequest(body, deleteOrderSchema)

        // Check if order exists
        const order = await prisma.order.findUnique({
          where: { id },
        })

        if (!order) {
          return NextResponse.json(
            { error: 'Commande non trouvée' },
            { status: 404 }
          )
        }

        // Delete order (OrderItems will be deleted automatically due to onDelete: Cascade)
        await prisma.order.delete({
          where: { id },
        })

        return NextResponse.json({
          success: true,
          message: 'Commande supprimée avec succès',
        })
      } catch (error: any) {
        return handleValidationError(error)
      }
    },
  })
}

