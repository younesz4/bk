/**
 * SECURE STRIPE CHECKOUT ROUTE
 * Demonstrates payment security best practices
 */

import { NextRequest, NextResponse } from 'next/server'
import { secureApiRoute, securityErrorResponse } from '@/lib/security/api-security'
import { rateLimiters } from '@/lib/security/rate-limiter'
import { safeJsonParse, sanitizeString } from '@/lib/security/input-validation'
import {
  validateProductAvailability,
  verifyOrderTotal,
  checkDuplicateOrder,
} from '@/lib/security/database-security'
import { prisma } from '@/lib/prisma'
import { stripe } from '@/lib/stripe'
import { z } from 'zod'

const checkoutSchema = z.object({
  items: z
    .array(
      z.object({
        productId: z.string(),
        quantity: z.number().int().positive('Quantity must be positive'),
      })
    )
    .min(1, 'At least one item required')
    .max(50, 'Too many items'), // Prevent DoS
  customerName: z.string().min(1).max(200).transform(sanitizeString),
  email: z.string().email(),
  phone: z.string().min(1).max(50).transform(sanitizeString),
  address: z.string().min(1).max(500).transform(sanitizeString),
  city: z.string().min(1).max(100).transform(sanitizeString),
  country: z.string().min(1).max(100).transform(sanitizeString),
})

async function handleStripeCheckout(request: NextRequest): Promise<NextResponse> {
  try {
    // 1. Parse and validate request
    const body = await safeJsonParse<z.infer<typeof checkoutSchema>>(request)
    const validationResult = checkoutSchema.safeParse(body)
    
    if (!validationResult.success) {
      return securityErrorResponse('Validation failed', 400, {
        errors: validationResult.error.issues,
      })
    }
    
    const data = validationResult.data
    
    // 2. Validate all products exist and are available
    const productValidations = await Promise.all(
      data.items.map((item) => validateProductAvailability(item.productId, item.quantity))
    )
    
    const invalidProduct = productValidations.find((v) => !v.valid)
    if (invalidProduct) {
      return securityErrorResponse('Invalid product or insufficient stock', 400)
    }
    
    // 3. Fetch products and calculate prices SERVER-SIDE (never trust client)
    const products = await Promise.all(
      productValidations.map((v) => v.product!)
    )
    
    const itemsWithPrices = data.items.map((item, index) => {
      const product = products[index]
      return {
        productId: product.id,
        quantity: item.quantity,
        price: product.price, // Use server-side price
      }
    })
    
    // 4. Calculate total SERVER-SIDE
    const calculatedTotal = itemsWithPrices.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    )
    
    // 5. Check for duplicate order (prevent double submission)
    const isDuplicate = await checkDuplicateOrder(data.email, data.items)
    if (isDuplicate) {
      return securityErrorResponse('Duplicate order detected', 409)
    }
    
    // 6. Create order in database (pending payment)
    const order = await prisma.order.create({
      data: {
        customerName: data.customerName,
        customerEmail: data.email,
        customerPhone: data.phone,
        addressLine1: data.address,
        city: data.city,
        country: data.country,
        totalAmount: calculatedTotal,
        status: 'PENDING',
        paymentMethod: 'STRIPE',
        items: {
          create: itemsWithPrices.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            unitPrice: item.price, // Price per unit in cents
            subtotal: item.price * item.quantity, // Total for this item in cents
          })),
        },
      },
    })
    
    // 7. Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: itemsWithPrices.map((item) => ({
        price_data: {
          currency: 'mad',
          product_data: {
            name: products.find((p) => p.id === item.productId)?.name || 'Product',
          },
          unit_amount: item.price,
        },
        quantity: item.quantity,
      })),
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/checkout/cancel`,
      metadata: {
        orderId: order.id,
      },
    })
    
    // 8. Update order with Stripe session ID
    // Note: Stripe session ID could be stored in order.notes or a separate field if needed
    // For now, we'll rely on Stripe's session management
    
    return NextResponse.json({
      success: true,
      sessionId: session.id,
      url: session.url,
      orderId: order.id,
    })
  } catch (error: any) {
    // Log error but don't expose details
    console.error('Checkout error:', error.message)
    return securityErrorResponse('Checkout failed', 500)
  }
}

export const POST = secureApiRoute(handleStripeCheckout, {
  methods: ['POST'],
  rateLimiter: rateLimiters.api,
  maxBodySize: 2 * 1024 * 1024,
})

// Reject all other methods
export async function GET() {
  return securityErrorResponse('Method not allowed', 405)
}




