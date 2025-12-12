import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendEmail } from '@/lib/email'
import {
  generateAdminNotificationEmail,
  generateCustomerConfirmationEmail,
} from '@/lib/email-templates'
import {
  sendWhatsAppMessage,
  formatOrderWhatsAppMessage,
} from '@/lib/whatsapp'
import { safeApiHandler, parseJsonBody, validateRequest, handleValidationError } from '@/lib/api-helpers'
import { checkoutFormSchema } from '@/lib/validation'
import { ESTIMATED_DELIVERY_DAYS, ADMIN_WHATSAPP_NUMBER, ADMIN_EMAIL, SMTP_USER, maskEmail, maskPhone } from '@/lib/config'
import { z } from 'zod'

// Checkout request schema includes items array
const checkoutRequestSchema = z.object({
  items: z.array(z.object({
    productId: z.string().min(1, 'Product ID is required'),
    quantity: z.number().int().positive('Quantity must be positive'),
  })).min(1, 'At least one item is required'),
}).merge(checkoutFormSchema)

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  return safeApiHandler(request, {
    method: 'POST',
    handler: async (req) => {
      try {
        const body = await parseJsonBody(req)
        const { items, customerName, email, phone, address, city, country, notes } = validateRequest(body, checkoutRequestSchema)

    const productIds = items.map((item) => item.productId)
    const products = await prisma.product.findMany({
      where: {
        id: { in: productIds },
      },
    })

    if (products.length !== productIds.length) {
      return NextResponse.json(
        { error: 'One or more products not found' },
        { status: 404 }
      )
    }

    const productMap = new Map(products.map((p) => [p.id, p]))

    let totalPrice = 0
    const orderItemsData = []

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
          { error: `Insufficient stock for product ${product.name}` },
          { status: 400 }
        )
      }

      const itemPrice = product.price * item.quantity
      totalPrice += itemPrice

      orderItemsData.push({
        productId: product.id,
        quantity: item.quantity,
        unitPrice: product.price,
        subtotal: product.price * item.quantity,
      })
    }

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
        totalAmount: Math.round(totalPrice * 100), // Convert to cents
        currency: 'EUR',
        status: 'PENDING',
        paymentMethod: 'CASH_ON_DELIVERY',
        items: {
          create: orderItemsData,
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

    // Decrease stock for each purchased item
    for (const item of items) {
      const product = productMap.get(item.productId)!
      await prisma.product.update({
        where: { id: product.id },
        data: { stock: { decrement: item.quantity } },
      })
    }

    // Calculate estimated delivery days

    // Helper function to log errors with context
    const logNotificationError = (
      type: string,
      error: any,
      orderId: string,
      additionalContext?: Record<string, any>
    ) => {
      const errorDetails = {
        timestamp: new Date().toISOString(),
        orderId,
        notificationType: type,
        error: error?.message || String(error),
        errorStack: error?.stack,
        ...additionalContext,
      }
      console.error(`❌ [ORDER ${orderId}] Failed to send ${type}:`, JSON.stringify(errorDetails, null, 2))
    }

    // Helper function to log success
    const logNotificationSuccess = (type: string, orderId: string) => {
      console.log(`✅ [ORDER ${orderId}] ${type} sent successfully at ${new Date().toISOString()}`)
    }

    // Send notifications independently - failures won't affect order creation
    // All notifications are wrapped in try-catch to ensure order creation always succeeds

    // 1. Send WhatsApp notification to admin
    try {
      if (ADMIN_WHATSAPP_NUMBER) {
        const whatsappMessage = formatOrderWhatsAppMessage(
          order.id,
          customerName,
          phone || '',
          order.items.map(item => ({
            product: { name: item.product.name },
            quantity: item.quantity,
            price: item.unitPrice / 100, // Convert from cents
          })),
          order.totalAmount / 100 // Convert from cents
        )

        const whatsappResult = await sendWhatsAppMessage({
          to: ADMIN_WHATSAPP_NUMBER,
          message: whatsappMessage,
        })

        if (whatsappResult.success) {
          logNotificationSuccess('WhatsApp notification', order.id)
        } else {
          logNotificationError('WhatsApp notification', whatsappResult.error, order.id, {
            whatsappError: whatsappResult.error,
            recipient: maskPhone(ADMIN_WHATSAPP_NUMBER), // Mask phone in logs
          })
        }
      } else {
        console.log(`ℹ️ [ORDER ${order.id}] WhatsApp notification skipped (ADMIN_WHATSAPP_NUMBER not configured)`)
      }
    } catch (whatsappError: any) {
      logNotificationError('WhatsApp notification', whatsappError, order.id, {
        recipient: maskPhone(ADMIN_WHATSAPP_NUMBER), // Mask phone in logs
        errorType: 'exception',
      })
    }

    // Transform order to match email template interface (used by both admin and customer emails)
    const orderForEmail = {
      id: order.id,
      customerName: order.customerName,
      email: order.customerEmail,
      phone: order.customerPhone || '',
      address: order.addressLine1,
      city: order.city,
      country: order.country,
      notes: order.notes,
      totalPrice: order.totalAmount / 100,
      paymentMethod: order.paymentMethod,
      status: order.status,
      createdAt: order.createdAt.toISOString(),
      items: order.items.map(item => ({
        product: { name: item.product.name, price: item.product.price / 100 },
        quantity: item.quantity,
        price: item.unitPrice / 100,
      })),
    }

    // 2. Send email to admin
    try {
      const adminEmailAddr = ADMIN_EMAIL || SMTP_USER
      if (adminEmailAddr) {
        const adminEmailTemplate = generateAdminNotificationEmail({ order: orderForEmail })

        const emailResult = await sendEmail(
          adminEmailAddr,
          adminEmailTemplate.subject,
          adminEmailTemplate.html,
          adminEmailTemplate.text
        )

        if (emailResult) {
          logNotificationSuccess('Admin notification email', order.id)
        } else {
          logNotificationError('Admin notification email', 'Email sending failed', order.id, {
            emailError: 'Email sending failed',
            recipient: maskEmail(adminEmailAddr), // Mask email in logs
          })
        }
      } else {
        console.log(`ℹ️ [ORDER ${order.id}] Admin email skipped (ADMIN_EMAIL not configured)`)
      }
    } catch (emailError: any) {
      logNotificationError('Admin notification email', emailError, order.id, {
        recipient: maskEmail(ADMIN_EMAIL || SMTP_USER), // Mask email in logs
        errorType: 'exception',
      })
    }

    // 3. Send confirmation email to customer
    try {
      const customerEmailTemplate = generateCustomerConfirmationEmail({
        order: orderForEmail,
        estimatedDeliveryDays: ESTIMATED_DELIVERY_DAYS,
      })

      const emailResult = await sendEmail(
        email,
        customerEmailTemplate.subject,
        customerEmailTemplate.html,
        customerEmailTemplate.text
      )

      if (emailResult) {
        logNotificationSuccess('Customer confirmation email', order.id)
      } else {
        logNotificationError('Customer confirmation email', 'Email sending failed', order.id, {
          emailError: 'Email sending failed',
          recipient: maskEmail(email), // Mask email in logs
        })
      }
    } catch (emailError: any) {
      logNotificationError('Customer confirmation email', emailError, order.id, {
        recipient: maskEmail(email), // Mask email in logs
        errorType: 'exception',
      })
    }

        return NextResponse.json({
          success: true,
          orderId: order.id,
        })
      } catch (error: any) {
        return handleValidationError(error)
      }
    },
  })
}
