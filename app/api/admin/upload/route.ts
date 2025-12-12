import { NextRequest, NextResponse } from 'next/server'
import { authAdmin } from '@/lib/adminAuth'

export const dynamic = 'force-dynamic'

/**
 * POST /api/admin/upload
 * Upload a file (admin only)
 */
export async function POST(req: NextRequest) {
  const isAdmin = await authAdmin(req)
  if (!isAdmin) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }

  // File upload functionality disabled - returns 501
  return NextResponse.json(
    { error: 'File upload feature not available' },
    { status: 501 }
  )
}
