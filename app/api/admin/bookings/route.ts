/**
 * Admin bookings manager for BK Agencements
 * GET: List bookings with filters
 */

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyAdminAuth } from '@/lib/admin-auth'

export const dynamic = 'force-dynamic'

/**
 * GET /api/admin/bookings
 * List bookings with optional filters
 */
export async function GET(request: NextRequest) {
  try {
    // Verify admin auth
    const auth = await verifyAdminAuth(request)
    if (!auth.authenticated) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const searchParams = request.nextUrl.searchParams
    const status = searchParams.get('status') || ''
    const range = searchParams.get('range') || ''

    const where: any = {}

    if (status && status !== 'all') {
      where.status = status
    }

    // Date range filter
    if (range === '7') {
      const sevenDaysAgo = new Date()
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
      where.createdAt = { gte: sevenDaysAgo }
    } else if (range === '30') {
      const thirtyDaysAgo = new Date()
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
      where.createdAt = { gte: thirtyDaysAgo }
    }

    const bookings = await prisma.booking.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: 50,
    })

    return NextResponse.json({
      success: true,
      data: bookings,
    })
  } catch (error: any) {
    console.error('Error fetching bookings:', error)
    return NextResponse.json(
      { success: false, error: 'Server error' },
      { status: 500 }
    )
  }
}



