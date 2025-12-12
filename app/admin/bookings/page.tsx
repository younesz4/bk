/**
 * Admin bookings manager for BK Agencements
 * Bookings list page with filters and detail view
 */

import { prisma } from '@/lib/prisma'
import { verifyAdminSession } from '@/lib/adminAuth'
import { redirect } from 'next/navigation'
import BookingsListClient from '@/components/admin/BookingsListClient'

export const dynamic = 'force-dynamic'

export default async function BookingsPage() {
  // Verify admin session
  const session = await verifyAdminSession()
  if (!session) {
    redirect('/admin/login')
  }

  // Fetch latest 50 bookings
  const bookings = await prisma.booking.findMany({
    orderBy: { createdAt: 'desc' },
    take: 50,
  })

  return <BookingsListClient initialBookings={bookings} />
}



