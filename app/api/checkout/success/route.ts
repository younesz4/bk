import { NextRequest, NextResponse } from 'next/server'

/**
 * GET /api/checkout/success
 * Stripe checkout removed - this route is no longer used
 * Use /api/orders/[id] instead for order confirmation
 */
export async function GET(request: NextRequest) {
  return NextResponse.json(
    { error: 'Stripe checkout has been removed. Use order confirmation endpoint instead.' },
    { status: 410 } // 410 Gone
  )
}


