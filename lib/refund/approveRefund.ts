/**
 * Approve Refund Admin Action
 * Approves a pending refund
 */

import { prisma } from '@/lib/prisma'

interface RefundData {
  id: string
  orderId: string
  amount: number
  status: string
  order: {
    totalPrice: number
    refundStatus: string | null
  }
}

/**
 * Approve refund
 * Note: Refund model not in schema yet
 */
export async function approveRefund(refundId: string): Promise<RefundData> {
  throw new Error('Refund model not implemented in Prisma schema yet')
  // TODO: Uncomment when Refund model is added to schema
  /*
  // 1. Get refund with order
  const refund = await prisma.refund.findUnique({
    where: { id: refundId },
    include: {
      order: {
        select: {
          id: true,
          totalPrice: true,
          refundStatus: true,
        },
      },
    },
  })

  if (!refund) {
    throw new Error(`Refund not found: ${refundId}`)
  }

  if (refund.status !== 'pending') {
    throw new Error(`Refund is not pending (current status: ${refund.status})`)
  }

  // 2. Change refund.status to "approved"
  const updatedRefund = await prisma.refund.update({
    where: { id: refundId },
    data: {
      status: 'approved',
    },
    include: {
      order: {
        select: {
          id: true,
          totalPrice: true,
          refundStatus: true,
        },
      },
    },
  })

  // 3. Update related order.refundStatus
  // Calculate if this is full or partial refund
  const existingRefunds = await prisma.refund.findMany({
    where: {
      orderId: refund.orderId,
      status: {
        in: ['approved', 'processed'],
      },
    },
    select: {
      amount: true,
    },
  })

  const totalRefunded = existingRefunds.reduce((sum, r) => sum + r.amount, 0) + refund.amount
  const newRefundStatus = totalRefunded >= refund.order.totalPrice ? 'full' : 'partial'

  await prisma.order.update({
    where: { id: refund.orderId },
    data: {
      refundStatus: newRefundStatus,
    },
  })

  // 4. Return updated refund
  return {
    id: updatedRefund.id,
    orderId: updatedRefund.orderId,
    amount: updatedRefund.amount,
    status: updatedRefund.status,
    order: {
      totalPrice: updatedRefund.order.totalPrice,
      refundStatus: newRefundStatus,
    },
  }
  */
}




