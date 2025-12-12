/**
 * Refund Creation Service
 * Creates refund records in database
 */

import { prisma } from '@/lib/prisma'
import { validateRefund, calculateRefundableAmount } from './validateRefund'

interface CreateRefundParams {
  orderId: string
  amount: number // In cents
  reason: string
  method: 'original' | 'manual' | 'cash'
}

interface RefundData {
  id: string
  orderId: string
  invoiceId: string | null
  amount: number
  reason: string
  status: string
  method: string
  createdAt: Date
  updatedAt: Date
}

/**
 * Create refund
 * Note: Refund model not in schema yet
 */
export async function createRefund(params: CreateRefundParams): Promise<RefundData> {
  throw new Error('Refund model not implemented in Prisma schema yet')
  /*
  const { orderId, amount, reason, method } = params

  // 1. Validate order exists
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      refunds: {
        where: {
          status: {
            in: ['pending', 'approved', 'processed'],
          },
        },
        select: {
          amount: true,
          status: true,
        },
      },
    },
  })

  if (!order) {
    throw new Error(`Order not found: ${orderId}`)
  }

  // 2. Validate refund amount
  const validation = validateRefund(order, amount)
  if (!validation.valid) {
    throw new Error(`Refund validation failed: ${validation.errors.join(', ')}`)
  }

  // 3. Check refundable amount (considering existing refunds)
  const refundableAmount = calculateRefundableAmount(order.totalPrice, order.refunds)
  if (amount > refundableAmount) {
    throw new Error(
      `Refund amount (${(amount / 100).toFixed(2)}€) exceeds refundable amount (${(refundableAmount / 100).toFixed(2)}€)`
    )
  }

  // 4. Get invoice ID if exists
  const invoice = await prisma.invoice.findUnique({
    where: { orderId },
    select: { id: true },
  })

  // 5. Create refund in DB with status "pending"
  const refund = await prisma.refund.create({
    data: {
      orderId: order.id,
      invoiceId: invoice?.id || null,
      amount,
      reason,
      method,
      status: 'pending',
    },
  })

  // 6. Return refund object
  return {
    id: refund.id,
    orderId: refund.orderId,
    invoiceId: refund.invoiceId,
    amount: refund.amount,
    reason: refund.reason,
    status: refund.status,
    method: refund.method,
    createdAt: refund.createdAt,
    updatedAt: refund.updatedAt,
  }
  */
}




