/**
 * Invoice PDF Download Endpoint
 * GET: Download invoice PDF
 */

import { NextRequest, NextResponse } from 'next/server'
import { authAdmin } from '@/lib/adminAuth'

export const dynamic = 'force-dynamic'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  const isAdmin = await authAdmin(request)
  if (!isAdmin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Invoice model doesn't exist in schema - return error
  return NextResponse.json({ error: 'Invoice feature not available' }, { status: 501 })
}
