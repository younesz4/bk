/**
 * Honeypot field names that should be hidden and empty
 * If these fields are filled, the request is likely from a bot
 */
const HONEYPOT_FIELDS = ['website', 'company2', 'url', 'homepage']

/**
 * Check if honeypot fields are filled (indicating bot activity)
 * @param body - Request body object
 * @returns true if honeypot is triggered (bot detected), false otherwise
 */
export function checkHoneypot(body: Record<string, any>): boolean {
  for (const field of HONEYPOT_FIELDS) {
    const value = body[field]
    if (value && typeof value === 'string' && value.trim().length > 0) {
      // Honeypot field is filled - likely a bot
      return true
    }
  }
  return false
}

/**
 * Remove honeypot fields from body before processing
 * @param body - Request body object
 * @returns Body without honeypot fields
 */
export function removeHoneypotFields<T extends Record<string, any>>(body: T): Omit<T, typeof HONEYPOT_FIELDS[number]> {
  const cleaned = { ...body }
  for (const field of HONEYPOT_FIELDS) {
    delete cleaned[field]
  }
  return cleaned
}

