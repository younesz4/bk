import { NextRequest, NextResponse } from 'next/server'
import { clearAdminSession } from '@/lib/adminAuth'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  const response = NextResponse.redirect(new URL('/admin/login', request.url))
  clearAdminSession(response)
  return response
}
