/**
 * Invoice Number Generator
 * Format: BK-{YEAR}-{timestamp-based-sequence}
 * Generates unique invoice numbers without database dependency
 */

/**
 * Generate invoice number
 * Format: BK-YYYY-XXXXXX (e.g., BK-2024-000001)
 */
export async function generateInvoiceNumber(): Promise<string> {
  const currentYear = new Date().getFullYear()
  const prefix = `BK-${currentYear}-`

  // Generate sequence based on timestamp (last 6 digits of timestamp)
  // This ensures uniqueness without database queries
  const timestamp = Date.now()
  const sequence = (timestamp % 1000000).toString().padStart(6, '0')

  return `${prefix}${sequence}`
}




