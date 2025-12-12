import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendEmail } from '@/lib/email'
import {
  generateCODCustomerEmail,
  generateCODAdminEmail,
} from '@/lib/order-email-templates'
import { ADMIN_NOTIFICATION_EMAIL } from '@/lib/config'
import { z } from 'zod'

export const dynamic = 'force-dynamic'

// Request validation schema (same as Stripe checkout)
const checkoutRequestSchema = z.object({
  items: z.array(
    z.object({
      productId: z.string().min(1, 'Product ID is required'),
      quantity: z.number().int().positive('Quantity must be positive').max(100, 'Quantity too high'),
    })
  ).min(1, 'At least one item is required'),
  customerName: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number is required').max(20),
  address: z.string().min(10, 'Address is required').max(200),
  city: z.string().min(2, 'City is required').max(100),
  country: z.string().min(2, 'Country is required').max(100),
  notes: z.string().max(500).optional(),
})

/**
 * POST /api/checkout-cod
 * 
 * Creates a Cash on Delivery (COD) order.
 * 
 * Features:
 * - Validates cart items from database
 * - Creates order with status "pending_cod"
 * - Skips Stripe payment
 * - Sends admin notifications
 * - Returns success page URL
 */
export async function POST(request: NextRequest) {
  try {
    // Parse and validate request body
    const body = await request.json()
    const validatedData = checkoutRequestSchema.parse(body)
    
    const { items, customerName, email, phone, address, city, country, notes } = validatedData

    // Get base URL for redirects
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

    // ============================================================================
    // Validate products exist and get prices from database
    // ============================================================================
    const productIds = items.map((item) => item.productId)
    const products = await prisma.product.findMany({
      where: {
        id: { in: productIds },
        isPublished: true,
      },
      select: {
        id: true,
        name: true,
        price: true,
        stock: true,
      },
    })

    // Verify all products exist
    if (products.length !== productIds.length) {
      const foundIds = products.map((p) => p.id)
      const missingIds = productIds.filter((id) => !foundIds.includes(id))
      return NextResponse.json(
        { 
          error: 'One or more products not found',
          missingProducts: missingIds,
        },
        { status: 404 }
      )
    }

    // Create product map for quick lookup
    const productMap = new Map(products.map((p) => [p.id, p]))

    // ============================================================================
    // Verify stock and calculate total from database prices
    // ============================================================================
    let totalAmount = 0

    for (const item of items) {
      const product = productMap.get(item.productId)
      
      if (!product) {
        return NextResponse.json(
          { error: `Product ${item.productId} not found` },
          { status: 404 }
        )
      }

      // Check stock availability
      if (product.stock < item.quantity) {
        return NextResponse.json(
          { 
            error: `Insufficient stock for ${product.name}`,
            available: product.stock,
            requested: item.quantity,
          },
          { status: 400 }
        )
      }

      // Use database price (never trust client)
      const itemTotal = product.price * item.quantity
      totalAmount += itemTotal
    }

    // ============================================================================
    // Create order with status "pending_cod"
    // ============================================================================
    const order = await prisma.order.create({
      data: {
        customerName,
        customerEmail: email,
        customerPhone: phone || null,
        addressLine1: address,
        addressLine2: null,
        city,
        postalCode: null,
        country,
        notes: notes || null,
        totalAmount: Math.round(totalAmount * 100), // Convert to cents
        currency: 'EUR',
        status: 'PENDING',
        paymentMethod: 'CASH_ON_DELIVERY',
        items: {
          create: items.map((item) => {
            const product = productMap.get(item.productId)!
            return {
              productId: product.id,
              quantity: item.quantity,
              unitPrice: product.price,
              subtotal: product.price * item.quantity,
            }
          }),
        },
      },
      include: {
        items: {
          include: {
            product: {
              select: {
                name: true,
                price: true,
              },
            },
          },
        },
      },
    })

    // ============================================================================
    // Decrease stock for purchased items
    // ============================================================================
    for (const item of items) {
      const product = productMap.get(item.productId)!
      await prisma.product.update({
        where: { id: product.id },
        data: { stock: { decrement: item.quantity } },
      })
    }

    // ============================================================================
    // Send email notifications (non-blocking - failures won't affect order creation)
    // ============================================================================
    
    // Transform order to match email template interface
    const orderForEmail = {
      id: order.id,
      customerName: order.customerName,
      email: order.customerEmail,
      phone: order.customerPhone || '',
      address: order.addressLine1,
      city: order.city,
      country: order.country,
      notes: order.notes,
      totalPrice: order.totalAmount / 100, // Convert from cents
      paymentMethod: order.paymentMethod,
      status: order.status,
      createdAt: order.createdAt.toISOString(),
      items: order.items.map((item) => ({
        product: {
          name: item.product.name,
          price: item.product.price / 100, // Convert from cents
        },
        quantity: item.quantity,
        price: item.unitPrice / 100, // Convert from cents
      })),
    }
    
    // 1. Send admin notification email (COD)
    if (ADMIN_NOTIFICATION_EMAIL) {
      try {
        const adminEmailTemplate = generateCODAdminEmail({ order: orderForEmail })
        await sendEmail(
          ADMIN_NOTIFICATION_EMAIL,
          adminEmailTemplate.subject,
          adminEmailTemplate.html,
          adminEmailTemplate.text
        )
        console.log(`✅ Admin notification email sent for COD order ${order.id}`)
      } catch (emailError: any) {
        console.error(`❌ Failed to send admin email for order ${order.id}:`, emailError.message)
      }
    }

    // 2. Send customer confirmation email (COD)
    try {
      const customerEmailTemplate = generateCODCustomerEmail({ order: orderForEmail })
      await sendEmail(
        email,
        customerEmailTemplate.subject,
        customerEmailTemplate.html,
        customerEmailTemplate.text
      )
      console.log(`✅ Customer confirmation email sent for COD order ${order.id}`)
    } catch (emailError: any) {
      console.error(`❌ Failed to send customer email for order ${order.id}:`, emailError.message)
    }

    console.log(`✅ COD Order created: ${order.id} for ${customerName} - Total: ${(totalAmount / 100).toFixed(2)} MAD`)

    // Invoice generation is handled separately in admin panel
    // No need to auto-generate here

    // Return success with order ID
    return NextResponse.json({
      success: true,
      orderId: order.id,
      redirectUrl: `${baseUrl}/checkout/success?order_id=${order.id}&payment_method=cod`,
    })
  } catch (error: any) {
    // Handle Zod validation errors
    if (error.name === 'ZodError') {
      return NextResponse.json(
        {
          error: 'Validation error',
          details: error.issues,
        },
        { status: 400 }
      )
    }

    // Log unexpected errors
    console.error('COD Checkout error:', error)
    return NextResponse.json(
      { error: 'An error occurred while processing your order' },
      { status: 500 }
    )
  }
}

