/**
 * Utility functions
 */

/**
 * Shorten an order ID to a readable format
 * Example: "clx1234567890abcdef" -> "#ABF28D"
 */
export function shortenOrderId(orderId: string): string {
  // Take first 6 characters and convert to uppercase
  const short = orderId.substring(0, 6).toUpperCase()
  return `#${short}`
}

/**
 * Format date to readable string
 */
export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(d)
}

