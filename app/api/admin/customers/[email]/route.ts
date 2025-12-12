/**
 * Admin Customer Details API
 * GET: Get customer details with orders and refunds
 */

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { authAdmin } from '@/lib/adminAuth'

export const dynamic = 'force-dynamic'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ email: string }> }
): Promise<NextResponse> {
  try {
    const isAdmin = await authAdmin(request)
    if (!isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { email } = await params
    const decodedEmail = decodeURIComponent(email)

    // Get all orders for this customer
    const orders = await prisma.order.findMany({
      where: { customerEmail: decodedEmail },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        totalAmount: true,
        status: true,
        paymentMethod: true,
        createdAt: true,
        customerName: true,
        customerPhone: true,
      },
    })

    if (orders.length === 0) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 })
    }

    // Refunds not available - Refund model doesn't exist in schema
    const refunds: any[] = []

    // Calculate totals
    const totalSpent = orders.reduce((sum, order) => sum + order.totalAmount, 0)

    const customer = {
      email: decodedEmail,
      customerName: orders[0].customerName,
      phone: orders[0].customerPhone,
      totalSpent,
      orderCount: orders.length,
      orders: orders.map((order) => ({
        id: order.id,
        totalAmount: order.totalAmount,
        status: order.status,
        paymentMethod: order.paymentMethod,
        createdAt: order.createdAt.toISOString(),
      })),
      refunds: refunds.map((refund) => ({
        id: refund.id,
        amount: refund.amount,
        status: refund.status,
        reason: refund.reason,
        createdAt: refund.createdAt.toISOString(),
      })),
    }

    return NextResponse.json({
      success: true,
      customer,
    })
  } catch (error: any) {
    console.error('Get customer details error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch customer details' },
      { status: 500 }
    )
  }
}




