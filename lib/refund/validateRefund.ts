/**
 * Refund Validation Logic
 * Validates refund requests before processing
 */

interface Order {
  id: string
  totalPrice: number // In cents
  status: string
  refundStatus?: string
}

interface ValidationResult {
  valid: boolean
  errors: string[]
}

/**
 * Validate refund request
 */
export function validateRefund(order: Order, amount: number): ValidationResult {
  const errors: string[] = []

  // 1. Cannot refund if order is cancelled
  if (order.status === 'cancelled') {
    errors.push('Cannot refund a cancelled order')
  }

  // 2. Amount cannot be negative
  if (amount < 0) {
    errors.push('Refund amount cannot be negative')
  }

  // 3. Amount cannot exceed order total
  if (amount > order.totalPrice) {
    errors.push(`Refund amount (${(amount / 100).toFixed(2)}€) cannot exceed order total (${(order.totalPrice / 100).toFixed(2)}€)`)
  }

  // 4. Cannot refund zero
  if (amount === 0) {
    errors.push('Refund amount must be greater than zero')
  }

  // 5. Check if already fully refunded
  if (order.refundStatus === 'full') {
    errors.push('Order has already been fully refunded')
  }

  // 6. Check if partial refund would exceed total
  if (order.refundStatus === 'partial') {
    // We need to check existing refunds to calculate remaining refundable amount
    // This will be checked in the service layer with actual refund data
  }

  return {
    valid: errors.length === 0,
    errors,
  }
}

/**
 * Calculate refundable amount for an order
 * Takes into account existing refunds
 */
export function calculateRefundableAmount(
  orderTotal: number,
  existingRefunds: Array<{ amount: number; status: string }>
): number {
  const processedRefunds = existingRefunds
    .filter((r) => r.status === 'processed' || r.status === 'approved')
    .reduce((sum, r) => sum + r.amount, 0)

  return Math.max(0, orderTotal - processedRefunds)
}

/**
 * Check if refund would result in full refund
 */
export function wouldBeFullRefund(orderTotal: number, refundAmount: number, existingRefunds: Array<{ amount: number; status: string }>): boolean {
  const refundableAmount = calculateRefundableAmount(orderTotal, existingRefunds)
  return refundAmount >= refundableAmount
}




