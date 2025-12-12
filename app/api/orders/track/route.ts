import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const trackOrderSchema = z.object({
  email: z.string().email('Email invalide'),
  orderId: z.string().min(1, 'Numéro de commande requis'),
})

/**
 * POST /api/orders/track
 * Track order by email and order ID
 * 
 * Public endpoint - no authentication required
 */
export async function POST(request: NextRequest) {
  try {
    // ============================================================================
    // Validate request body
    // ============================================================================
    const body = await request.json()
    const validationResult = trackOrderSchema.safeParse(body)

    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: 'Validation error',
          details: validationResult.error.issues,
        },
        { status: 400 }
      )
    }

    const { email, orderId } = validationResult.data

    // ============================================================================
    // Find order
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

    // ============================================================================
    // Verify email matches order email
    // ============================================================================
    if (!order) {
      return NextResponse.json(
        { error: 'Commande introuvable' },
        { status: 404 }
      )
    }

    if (order.customerEmail.toLowerCase() !== email.toLowerCase()) {
      return NextResponse.json(
        { error: 'Email incorrect' },
        { status: 403 }
      )
    }

    // ============================================================================
    // Return order details
    // ============================================================================
    return NextResponse.json({
      order: {
        id: order.id,
        customerName: order.customerName,
        email: order.customerEmail,
        phone: order.customerPhone,
        address: order.addressLine1,
        city: order.city,
        country: order.country,
        totalPrice: order.totalAmount / 100, // Convert from cents
        status: order.status,
        paymentMethod: order.paymentMethod,
        createdAt: order.createdAt,
        items: order.items.map((item) => ({
          product: {
            name: item.product.name,
            price: item.product.price,
          },
          quantity: item.quantity,
          price: item.unitPrice / 100, // Convert from cents
          subtotal: item.subtotal / 100, // Convert from cents
        })),
      },
    })
  } catch (error: any) {
    console.error('Error tracking order:', error)
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: error.message,
      },
      { status: 500 }
    )
  }
}




