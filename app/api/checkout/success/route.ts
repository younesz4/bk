import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'

/**
 * GET /api/checkout/success
 * Retrieves checkout session details after successful payment
 * 
 * Query params:
 * - session_id: Stripe Checkout Session ID
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const sessionId = searchParams.get('session_id')

    if (!sessionId) {
      return NextResponse.json(
        { error: 'session_id is required' },
        { status: 400 }
      )
    }

    // Retrieve the checkout session from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['line_items', 'customer'],
    })

    // Verify payment was successful
    if (session.payment_status !== 'paid') {
      return NextResponse.json(
        { error: 'Payment not completed' },
        { status: 400 }
      )
    }

    // Return session details
    return NextResponse.json({
      session: {
        id: session.id,
        payment_status: session.payment_status,
        amount_total: session.amount_total,
        currency: session.currency,
        customer_email: session.customer_details?.email,
        customer_name: session.customer_details?.name,
        shipping_address: (session as any).shipping_details?.address || (session as any).shipping?.address,
        line_items: session.line_items?.data.map((item) => ({
          id: item.id,
          description: item.description,
          quantity: item.quantity,
          amount_total: item.amount_total,
          price: item.price,
        })),
        metadata: session.metadata,
      },
    })
  } catch (error: any) {
    console.error('❌ Error retrieving checkout session:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to retrieve checkout session' },
      { status: 500 }
    )
  }
}


