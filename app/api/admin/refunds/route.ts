/**
 * Admin Refunds API
 * Refund model doesn't exist in schema - returns 501
 */

import { NextRequest, NextResponse } from 'next/server'
import { authAdmin } from '@/lib/adminAuth'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest): Promise<NextResponse> {
  const isAdmin = await authAdmin(request)
  if (!isAdmin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  return NextResponse.json({ error: 'Refund feature not available' }, { status: 501 })
}
