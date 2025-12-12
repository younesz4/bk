import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { authAdmin } from '@/lib/adminAuth'
import { generateLuxuryInvoicePDF } from '@/lib/pdf/invoice'

/**
 * GET /api/orders/[id]/invoice
 * Generate and download invoice PDF
 * 
 * Authentication:
 * - Session-based (admin UI)
 * - Bearer token (external API)
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: orderId } = await params

    // Authentication
    const isAdmin = await authAdmin(request)
    if (!isAdmin) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // ============================================================================
    // Fetch order with all details
    // ============================================================================
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    })

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      )
    }

    // Generate luxury PDF invoice
    const pdfBuffer = await generateLuxuryInvoicePDF(order as any)

    // Return PDF as response
    return new NextResponse(pdfBuffer as any, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="facture-${order.id.substring(0, 8)}.pdf"`,
      },
    })
  } catch (error: any) {
    console.error('Error generating invoice PDF:', error)
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: error.message,
      },
      { status: 500 }
    )
  }
}

