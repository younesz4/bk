/**
 * Create Refund API
 * Refund model doesn't exist in schema - returns 501
 */

import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest): Promise<NextResponse> {
  return NextResponse.json({ error: 'Refund feature not available' }, { status: 501 })
}
