/**
 * Bank Transfer Checkout API
 * Creates order with bank transfer payment method
 */

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendEmail } from '@/lib/email'
import { ADMIN_NOTIFICATION_EMAIL } from '@/lib/config'
import { secureApiRoute, securityErrorResponse } from '@/lib/security/api-security'
import { rateLimiters } from '@/lib/security/rate-limiter'
import { safeJsonParse } from '@/lib/security/input-validation'
import { z } from 'zod'

export const dynamic = 'force-dynamic'

const checkoutRequestSchema = z.object({
  items: z.array(
    z.object({
      productId: z.string().min(1),
      quantity: z.number().int().positive().max(100),
    })
  ).min(1),
  customerName: z.string().min(2).max(100),
  email: z.string().email(),
  phone: z.string().min(10).max(20),
  address: z.string().min(10).max(200),
  city: z.string().min(2).max(100),
  country: z.string().min(2).max(100),
  notes: z.string().max(500).optional(),
})

async function handleBankTransferCheckout(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await safeJsonParse(request)
    const validationResult = checkoutRequestSchema.safeParse(body)

    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Validation error', details: validationResult.error.issues },
        { status: 400 }
      )
    }

    const { items, customerName, email, phone, address, city, country, notes } = validationResult.data

    // Validate products and calculate total
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

    if (products.length !== productIds.length) {
      return NextResponse.json(
        { error: 'One or more products not found' },
        { status: 404 }
      )
    }

    const productMap = new Map(products.map((p) => [p.id, p]))
    let totalAmount = 0

    for (const item of items) {
      const product = productMap.get(item.productId)
      if (!product) {
        return NextResponse.json(
          { error: `Product ${item.productId} not found` },
          { status: 404 }
        )
      }

      if (product.stock < item.quantity) {
        return NextResponse.json(
          { error: `Insufficient stock for ${product.name}` },
          { status: 400 }
        )
      }

      totalAmount += product.price * item.quantity
    }

    // Create order with bank transfer payment method
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
        paymentMethod: 'BANK_TRANSFER',
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

    // Send customer email with bank details
    try {
      const emailHtml = `
        <h2>Instructions de virement bancaire</h2>
        <p>Bonjour ${customerName},</p>
        <p>Votre commande a été créée. Veuillez effectuer le virement bancaire aux coordonnées suivantes :</p>
        <div style="background-color: #f7f5f2; padding: 20px; margin: 20px 0;">
          <p><strong>Banque:</strong> [VOTRE BANQUE]</p>
          <p><strong>RIB:</strong> [VOTRE RIB]</p>
          <p><strong>BIC:</strong> [VOTRE BIC]</p>
          <p><strong>Montant:</strong> ${new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: 'EUR',
          }).format(totalAmount / 100)}</p>
          <p><strong>Référence:</strong> COMMANDE-${order.id.substring(0, 8).toUpperCase()}</p>
        </div>
        <p>Une fois le virement effectué, votre commande sera traitée.</p>
      `
      await sendEmail(
        email,
        `Commande #${order.id.substring(0, 8)} - Instructions de virement bancaire`,
        emailHtml
      )
    } catch (emailError: any) {
      console.error('Failed to send customer email:', emailError.message)
    }

    // Send admin notification
    if (ADMIN_NOTIFICATION_EMAIL) {
      try {
        const adminEmailHtml = `
          <h2>Nouvelle commande - Virement bancaire</h2>
          <p><strong>Numéro de commande:</strong> #${order.id.substring(0, 8)}</p>
          <p><strong>Client:</strong> ${customerName}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Montant:</strong> ${new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: 'EUR',
          }).format(totalAmount / 100)}</p>
          <p><a href="${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/admin/orders/${order.id}">Voir la commande</a></p>
        `
        await sendEmail(
          ADMIN_NOTIFICATION_EMAIL,
          `Nouvelle commande virement bancaire #${order.id.substring(0, 8)}`,
          adminEmailHtml
        )
      } catch (emailError: any) {
        console.error('Failed to send admin email:', emailError.message)
      }
    }

    // Invoice generation is handled separately in admin panel
    // No need to auto-generate here

    return NextResponse.json({
      success: true,
      orderId: order.id,
      redirectUrl: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/checkout/bank-transfer?order_id=${order.id}`,
    })
  } catch (error: any) {
    console.error('Bank transfer checkout error:', error)
    return securityErrorResponse('Failed to process bank transfer order', 500)
  }
}

export const POST = secureApiRoute(handleBankTransferCheckout, {
  methods: ['POST'],
  rateLimiter: rateLimiters.api,
})

