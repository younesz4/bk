import { NextRequest, NextResponse } from 'next/server'
import { clearAdminSession } from '@/lib/adminAuth'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  const response = NextResponse.json({ success: true })
  clearAdminSession(response)
  return response
}
