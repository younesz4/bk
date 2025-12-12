/**
 * Get Refunds History
 * Returns refund history for admin dashboard
 */

import { prisma } from '@/lib/prisma'

interface RefundHistoryItem {
  refundId: string
  orderId: string
  amount: number
  reason: string
  status: string
  method: string
  createdAt: Date
  customer: {
    name: string
    email: string
  }
}

/**
 * Get all refunds sorted newest first
 * Note: Refund model not in schema yet
 */
export async function getRefunds(): Promise<RefundHistoryItem[]> {
  throw new Error('Refund model not implemented in Prisma schema yet')
  /*
  const refunds = await prisma.refund.findMany({
    orderBy: {
      createdAt: 'desc',
    },
    include: {
      order: {
        select: {
          customerName: true,
          email: true,
        },
      },
    },
  })

  return refunds.map((refund) => ({
    refundId: refund.id,
    orderId: refund.orderId,
    amount: refund.amount,
    reason: refund.reason,
    status: refund.status,
    method: refund.method,
    createdAt: refund.createdAt,
    customer: {
      name: refund.order.customerName,
      email: refund.order.email,
    },
  }))
  */
}

/**
 * Get refunds for a specific order
 * Note: Refund model not in schema yet
 */
export async function getRefundsByOrder(orderId: string): Promise<RefundHistoryItem[]> {
  throw new Error('Refund model not implemented in Prisma schema yet')
  /*
  const refunds = await prisma.refund.findMany({
    where: { orderId },
    orderBy: {
      createdAt: 'desc',
    },
    include: {
      order: {
        select: {
          customerName: true,
          email: true,
        },
      },
    },
  })

  return refunds.map((refund) => ({
    refundId: refund.id,
    orderId: refund.orderId,
    amount: refund.amount,
    reason: refund.reason,
    status: refund.status,
    method: refund.method,
    createdAt: refund.createdAt,
    customer: {
      name: refund.order.customerName,
      email: refund.order.email,
    },
  }))
  */
}




