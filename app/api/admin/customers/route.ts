/**
 * Admin Customers API
 * GET: List all customers with order statistics
 */

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { secureApiRoute, securityErrorResponse } from '@/lib/security/api-security'
import { rateLimiters } from '@/lib/security/rate-limiter'
import { verifyAdminAuth } from '@/lib/admin-auth'

export const dynamic = 'force-dynamic'

async function handleGetCustomers(request: NextRequest): Promise<NextResponse> {
  try {
    const authResult = await verifyAdminAuth(request)
    if (!authResult.authenticated) {
      return securityErrorResponse('Unauthorized', 401)
    }

    // Get all unique customers from orders
    const orders = await prisma.order.findMany({
      select: {
        customerEmail: true,
        customerName: true,
        totalAmount: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    // Group by email and calculate statistics
    const customerMap = new Map<
      string,
      {
        email: string
        customerName: string
        totalSpent: number
        orderCount: number
        lastOrderDate: Date | null
      }
    >()

    for (const order of orders) {
      const existing = customerMap.get(order.customerEmail)
      if (existing) {
        existing.totalSpent += order.totalAmount
        existing.orderCount += 1
        if (order.createdAt > (existing.lastOrderDate || new Date(0))) {
          existing.lastOrderDate = order.createdAt
        }
      } else {
        customerMap.set(order.customerEmail, {
          email: order.customerEmail,
          customerName: order.customerName,
          totalSpent: order.totalAmount,
          orderCount: 1,
          lastOrderDate: order.createdAt,
        })
      }
    }

    const customers = Array.from(customerMap.values()).map((customer) => ({
      id: customer.email, // Use email as ID for now
      email: customer.email,
      customerName: customer.customerName,
      totalSpent: customer.totalSpent,
      orderCount: customer.orderCount,
      lastOrderDate: customer.lastOrderDate?.toISOString() || null,
    }))

    return NextResponse.json({
      success: true,
      customers,
    })
  } catch (error: any) {
    console.error('Get customers error:', error)
    return securityErrorResponse('Failed to fetch customers', 500)
  }
}

export const GET = secureApiRoute(handleGetCustomers, {
  methods: ['GET'],
  rateLimiter: rateLimiters.api,
})




