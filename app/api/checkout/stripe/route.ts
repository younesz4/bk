import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { stripe } from '@/lib/stripe'
import { sendEmail } from '@/lib/email'
import { generatePendingPaymentAdminEmail } from '@/lib/order-email-templates'
import { ADMIN_NOTIFICATION_EMAIL } from '@/lib/config'
import { z } from 'zod'

export const dynamic = 'force-dynamic'

// Request validation schema
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
 * POST /api/checkout/stripe
 * 
 * Creates a Stripe Checkout Session for the cart items.
 * 
 * Security features:
 * - Validates all product IDs exist in database
 * - Verifies prices from database (never trusts client)
 * - Checks stock availability
 * - Anti-fraud: Limits quantity per item
 * - Validates all input with Zod
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
    // ANTI-FRAUD: Verify products exist and get prices from database
    // ============================================================================
    const productIds = items.map((item) => item.productId)
    const products = await prisma.product.findMany({
      where: {
        id: { in: productIds },
        isPublished: true, // Only allow published products
      },
      select: {
        id: true,
        name: true,
        price: true,
        stock: true,
        slug: true,
        images: {
          select: {
            url: true,
            alt: true,
          },
          orderBy: { order: 'asc' },
          take: 1,
        },
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
    // ANTI-FRAUD: Verify stock and calculate total from database prices
    // ============================================================================
    let totalAmount = 0
    const lineItems: Array<{
      price_data: {
        currency: string
        product_data: {
          name: string
          images?: string[]
          description?: string
        }
        unit_amount: number
      }
      quantity: number
    }> = []

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
      const unitPrice = product.price // Price in cents
      const itemTotal = unitPrice * item.quantity
      totalAmount += itemTotal

      // Build Stripe line item
      lineItems.push({
        price_data: {
          currency: 'mad', // Moroccan Dirham
          product_data: {
            name: product.name,
            images: product.images.length > 0 
              ? [`${baseUrl}${product.images[0].url}`]
              : undefined,
            description: `SKU: ${product.slug}`,
          },
          unit_amount: unitPrice,
        },
        quantity: item.quantity,
      })
    }

    // ============================================================================
    // Create order in database with status "pending_payment"
    // ============================================================================
    const order = await prisma.order.create({
      data: {
        customerName,
        customerEmail: email,
        customerPhone: phone,
        addressLine1: address,
        city,
        country,
        notes: notes || null,
        totalAmount: totalAmount,
        status: 'PENDING',
        paymentMethod: 'STRIPE',
        items: {
          create: items.map((item) => {
            const product = productMap.get(item.productId)!
            return {
              productId: product.id,
              quantity: item.quantity,
              unitPrice: product.price, // Price per unit in cents
              subtotal: product.price * item.quantity, // Total for this item in cents
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
              },
            },
          },
        },
      },
    })

    // ============================================================================
    // Create Stripe Checkout Session
    // ============================================================================
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${baseUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}&order_id=${order.id}`,
      cancel_url: `${baseUrl}/cart?canceled=true`,
      customer_email: email,
      metadata: {
        orderId: order.id,
        customerName,
        customerEmail: email,
        customerPhone: phone,
      },
      shipping_address_collection: {
        allowed_countries: ['MA'], // Morocco only
      },
      phone_number_collection: {
        enabled: true,
      },
      // Customize checkout
      locale: 'fr', // French for Morocco
      billing_address_collection: 'required',
    })

    // ============================================================================
    // Store Stripe session ID in order for webhook processing
    // ============================================================================
    await prisma.order.update({
      where: { id: order.id },
      data: {
        // Note: Stripe session ID could be stored in order.notes or a separate field if needed
        // For now, we'll rely on Stripe's session management
      },
    })

    // ============================================================================
    // Send admin notification (pending payment)
    // ============================================================================
    if (ADMIN_NOTIFICATION_EMAIL) {
      try {
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
          items: order.items.map(item => ({
            product: { 
              name: item.product.name, 
              price: item.unitPrice / 100 // Convert from cents
            },
            quantity: item.quantity,
            price: item.subtotal / 100, // Convert from cents
          })),
        }
        const adminEmailTemplate = generatePendingPaymentAdminEmail({ order: orderForEmail })
        await sendEmail(
          ADMIN_NOTIFICATION_EMAIL,
          adminEmailTemplate.subject,
          adminEmailTemplate.html,
          adminEmailTemplate.text
        )
        console.log(`✅ Admin notification sent for pending payment order ${order.id}`)
      } catch (emailError: any) {
        console.error(`❌ Failed to send admin email:`, emailError.message)
      }
    }

    // Return session URL to client
    return NextResponse.json({
      success: true,
      sessionId: session.id,
      url: session.url,
      orderId: order.id,
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

    // Handle Stripe errors
    if (error.type === 'StripeInvalidRequestError') {
      console.error('Stripe error:', error.message)
      return NextResponse.json(
        { error: 'Payment processing error. Please try again.' },
        { status: 400 }
      )
    }

    // Log unexpected errors
    console.error('Checkout error:', error)
    return NextResponse.json(
      { error: 'An error occurred while processing your order' },
      { status: 500 }
    )
  }
}

