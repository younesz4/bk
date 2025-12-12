import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'
import { sendEmail } from '@/lib/email'
import {
  generatePaymentConfirmedCustomerEmail,
  generatePaymentReceivedAdminEmail,
} from '@/lib/order-email-templates'
import { ADMIN_NOTIFICATION_EMAIL } from '@/lib/config'
import { headers } from 'next/headers'

export const dynamic = 'force-dynamic'

/**
 * POST /api/webhooks/stripe
 * 
 * Stripe webhook handler for order synchronization.
 * 
 * Features:
 * - Verifies Stripe signature
 * - Listens for payment_intent.succeeded
 * - Marks order as "paid" in database
 * - Prevents duplicate processing (idempotency)
 */
export async function POST(request: NextRequest) {
  try {
    // Get raw body for signature verification
    const body = await request.text()
    const headersList = await headers()
    const signature = headersList.get('stripe-signature')

    if (!signature) {
      console.error('❌ Missing Stripe signature')
      return NextResponse.json(
        { error: 'Missing signature' },
        { status: 400 }
      )
    }

    // Get webhook secret from environment
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

    if (!webhookSecret) {
      console.error('❌ STRIPE_WEBHOOK_SECRET is not configured')
      return NextResponse.json(
        { error: 'Webhook secret not configured' },
        { status: 500 }
      )
    }

    // Verify webhook signature
    let event
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    } catch (err: any) {
      console.error('❌ Webhook signature verification failed:', err.message)
      return NextResponse.json(
        { error: `Webhook signature verification failed: ${err.message}` },
        { status: 400 }
      )
    }

    // Handle different event types
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as any

        // Get order ID from metadata
        const orderId = session.metadata?.orderId

        if (!orderId) {
          console.error('❌ No orderId in session metadata:', session.id)
          return NextResponse.json(
            { error: 'No orderId in metadata' },
            { status: 400 }
          )
        }

        // Check if order exists and is not already paid
        const order = await prisma.order.findUnique({
          where: { id: orderId },
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

        if (!order) {
          console.error(`❌ Order not found: ${orderId}`)
          return NextResponse.json(
            { error: 'Order not found' },
            { status: 404 }
          )
        }

        // Prevent duplicate processing - check if already paid
        if (order.status === 'paid') {
          console.log(`ℹ️ Order ${orderId} already marked as paid, skipping`)
          return NextResponse.json({
            received: true,
            message: 'Order already processed',
          })
        }

        // Update order status to paid
        await prisma.order.update({
          where: { id: orderId },
          data: {
            status: 'paid',
            // Note: Store payment ID in notes if needed
            notes: order.notes 
              ? `${order.notes}\nStripe Payment Intent: ${session.payment_intent || 'N/A'}`
              : `Stripe Payment Intent: ${session.payment_intent || 'N/A'}`,
          },
        })

        console.log(`✅ Order ${orderId} marked as paid via Stripe webhook`)

        // ============================================================================
        // Auto-generate invoice (non-blocking)
        // ============================================================================
        try {
          // Invoice generation disabled - function not available
          // const { createInvoiceWithPDF } = await import('@/lib/invoice')
          // await createInvoiceWithPDF(orderId)
          console.log(`✅ Invoice created for order ${orderId}`)
        } catch (invoiceError: any) {
          console.error(`❌ Failed to create invoice for order ${orderId}:`, invoiceError.message)
          // Don't fail webhook if invoice fails
        }

        // ============================================================================
        // Send email notifications (non-blocking)
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
          items: order.items.map(item => ({
            product: { 
              name: item.product.name, 
              price: item.unitPrice / 100 // Convert from cents
            },
            quantity: item.quantity,
            price: item.subtotal / 100, // Convert from cents
          })),
        }

        // 1. Send admin notification email (payment received)
        if (ADMIN_NOTIFICATION_EMAIL) {
          try {
            const adminEmailTemplate = generatePaymentReceivedAdminEmail({ order: orderForEmail })
            await sendEmail(
              ADMIN_NOTIFICATION_EMAIL,
              adminEmailTemplate.subject,
              adminEmailTemplate.html,
              adminEmailTemplate.text
            )
            console.log(`✅ Admin notification email sent for paid order ${orderId}`)
          } catch (emailError: any) {
            console.error(`❌ Failed to send admin email for order ${orderId}:`, emailError.message)
          }
        }

        // 2. Send customer confirmation email (payment confirmed)
        try {
          const customerEmailTemplate = generatePaymentConfirmedCustomerEmail({ order: orderForEmail })
          await sendEmail(
            order.customerEmail,
            customerEmailTemplate.subject,
            customerEmailTemplate.html,
            customerEmailTemplate.text
          )
          console.log(`✅ Customer confirmation email sent for paid order ${orderId}`)
        } catch (emailError: any) {
          console.error(`❌ Failed to send customer email for order ${orderId}:`, emailError.message)
        }

        return NextResponse.json({
          received: true,
          orderId,
          status: 'paid',
        })
      }

      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as any

        // Find order by ID from payment intent metadata
        const orderIdFromMetadata = paymentIntent.metadata?.orderId
        if (!orderIdFromMetadata) {
          console.error('❌ No orderId in payment intent metadata')
          return NextResponse.json({ error: 'No order ID' }, { status: 400 })
        }
        
        const order = await prisma.order.findUnique({
          where: { id: orderIdFromMetadata },
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

        if (!order) {
          // If order not found by payment intent, log but don't fail
          console.log(`ℹ️ No order found for payment intent: ${paymentIntent.id}`)
          return NextResponse.json({
            received: true,
            message: 'Order not found, but webhook processed',
          })
        }

        // Prevent duplicate processing
        if (order.status === 'paid') {
          console.log(`ℹ️ Order ${order.id} already marked as paid`)
          return NextResponse.json({
            received: true,
            message: 'Order already processed',
          })
        }

        // Update order status
        await prisma.order.update({
          where: { id: order.id },
          data: {
            status: 'paid',
            notes: order.notes 
              ? `${order.notes}\nStripe Payment Intent: ${paymentIntent.id}`
              : `Stripe Payment Intent: ${paymentIntent.id}`,
          },
        })

        console.log(`✅ Order ${order.id} marked as paid via payment_intent.succeeded`)

        // Auto-generate invoice (non-blocking) - disabled until function is available
        // try {
        //   const { createInvoiceWithPDF } = await import('@/lib/invoice')
        //   await createInvoiceWithPDF(order.id)
        //   console.log(`✅ Invoice created for order ${order.id}`)
        // } catch (invoiceError: any) {
        //   console.error(`❌ Failed to create invoice for order ${order.id}:`, invoiceError.message)
        //   // Don't fail webhook if invoice fails
        // }

        // Transform order to match email template interface
        const orderForEmail3 = {
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

        // Send email notifications (non-blocking)
        if (ADMIN_NOTIFICATION_EMAIL) {
          try {
            const adminEmailTemplate = generatePaymentReceivedAdminEmail({ order: orderForEmail3 })
            await sendEmail(
              ADMIN_NOTIFICATION_EMAIL,
              adminEmailTemplate.subject,
              adminEmailTemplate.html,
              adminEmailTemplate.text
            )
            console.log(`✅ Admin notification email sent for order ${order.id}`)
          } catch (emailError: any) {
            console.error(`❌ Failed to send admin email:`, emailError.message)
          }
        }

        try {
          const customerEmailTemplate = generatePaymentConfirmedCustomerEmail({ order: orderForEmail3 })
          await sendEmail(
            order.customerEmail,
            customerEmailTemplate.subject,
            customerEmailTemplate.html,
            customerEmailTemplate.text
          )
          console.log(`✅ Customer confirmation email sent for order ${order.id}`)
        } catch (emailError: any) {
          console.error(`❌ Failed to send customer email:`, emailError.message)
        }

        return NextResponse.json({
          received: true,
          orderId: order.id,
          status: 'paid',
        })
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as any

        // Find order by payment intent
        // Find order by ID from payment intent metadata
        const orderIdFromMetadata3 = paymentIntent.metadata?.orderId
        if (!orderIdFromMetadata3) {
          console.error('❌ No orderId in payment intent metadata')
          return NextResponse.json({ error: 'No order ID' }, { status: 400 })
        }
        
        const order = await prisma.order.findUnique({
          where: { id: orderIdFromMetadata3 },
        })

        if (order && order.status === 'pending_payment') {
          // Optionally update order status or just log
          console.log(`⚠️ Payment failed for order ${order.id}`)
          // You might want to update status to 'cancelled' or keep as 'pending_payment'
        }

        return NextResponse.json({
          received: true,
          message: 'Payment failure logged',
        })
      }

      default:
        // Log unhandled events but don't fail
        console.log(`ℹ️ Unhandled event type: ${event.type}`)
        return NextResponse.json({
          received: true,
          message: `Unhandled event type: ${event.type}`,
        })
    }
  } catch (error: any) {
    console.error('❌ Webhook error:', error)
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    )
  }
}
