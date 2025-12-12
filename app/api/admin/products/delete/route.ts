import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifySession } from '@/lib/auth'
import { safeApiHandler, parseJsonBody, validateRequest, handleValidationError } from '@/lib/api-helpers'
import { deleteProductSchema } from '@/lib/api-validators'

export const dynamic = 'force-dynamic'

/**
 * POST /api/admin/products/delete
 * Delete a product and all its images
 */
export async function POST(req: NextRequest) {
  return safeApiHandler(req, {
    method: 'POST',
    handler: async (request) => {
      // Validate admin authentication
      const session = await verifySession()
      if (!session) {
        return NextResponse.json(
          { error: 'Unauthorized' },
          { status: 401 }
        )
      }

      try {
        const body = await parseJsonBody(request)
        const { id } = validateRequest(body, deleteProductSchema)

        // Confirm product exists
        const existing = await prisma.product.findUnique({
          where: { id },
        })

        if (!existing) {
          return NextResponse.json(
            { error: 'Product not found' },
            { status: 404 }
          )
        }

        // Delete all images associated with product
        await prisma.productImage.deleteMany({
          where: { productId: id },
        })

        // Delete the product
        await prisma.product.delete({
          where: { id },
        })

        return NextResponse.json({
          success: true,
          message: 'Product deleted successfully',
          id,
        })
      } catch (error: any) {
        return handleValidationError(error)
      }
    },
  })
}
