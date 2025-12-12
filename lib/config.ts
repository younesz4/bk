/**
 * Centralized Environment Configuration
 * 
 * This module centralizes all environment variable access with runtime validation.
 * It ensures that:
 * - Secrets are never exposed to the client
 * - Required variables throw errors if missing
 * - All access is type-safe
 * 
 * IMPORTANT: This file should ONLY be imported in:
 * - Server components
 * - API routes
 * - Server-only lib modules
 * 
 * NEVER import this in client components!
 */

/**
 * Check if code is running on the server
 */
function isServer(): boolean {
  return typeof window === 'undefined'
}

/**
 * Get environment variable with validation
 * Throws error if required variable is missing
 */
function getEnv(key: string, required: boolean = false, defaultValue?: string): string {
  if (!isServer()) {
    throw new Error(
      `Attempted to access server-only environment variable '${key}' in client component. ` +
      `This is a security risk. Only use this config in server components, API routes, or server-only lib modules.`
    )
  }

  const value = process.env[key]

  if (required && !value) {
    throw new Error(
      `Missing required environment variable: ${key}. ` +
      `Please set it in your .env file or environment configuration.`
    )
  }

  return value || defaultValue || ''
}

/**
 * Get optional environment variable
 */
function getOptionalEnv(key: string, defaultValue?: string): string | undefined {
  return getEnv(key, false, defaultValue) || undefined
}

/**
 * Get boolean environment variable
 */
function getBooleanEnv(key: string, defaultValue: boolean = false): boolean {
  const value = getEnv(key, false)
  if (!value) return defaultValue
  return value.toLowerCase() === 'true' || value === '1'
}

/**
 * Get integer environment variable
 */
function getIntEnv(key: string, defaultValue: number): number {
  const value = getEnv(key, false)
  if (!value) return defaultValue
  const parsed = parseInt(value, 10)
  if (isNaN(parsed)) return defaultValue
  return parsed
}

// ============================================================================
// PUBLIC ENVIRONMENT VARIABLES (Safe for client-side)
// ============================================================================

/**
 * Public site URL (safe to expose to client)
 */
export const PUBLIC_SITE_URL = getOptionalEnv('NEXT_PUBLIC_SITE_URL', 'https://bk-agencements.com') || 'https://bk-agencements.com'

/**
 * Public app URL (safe to expose to client)
 */
export const PUBLIC_APP_URL = getOptionalEnv('NEXT_PUBLIC_APP_URL', 'http://localhost:3000') || 'http://localhost:3000'

// ============================================================================
// SERVER-ONLY SECRETS (Never exposed to client)
// ============================================================================

/**
 * Database URL (Prisma)
 * Required in production
 */
export const DATABASE_URL = getEnv('DATABASE_URL', process.env.NODE_ENV === 'production')

/**
 * Session secret for admin authentication
 * Required in production
 */
export const SESSION_SECRET = getEnv(
  'SESSION_SECRET',
  process.env.NODE_ENV === 'production'
) || 'change-this-secret-in-production-min-32-chars'

/**
 * Admin API Key (if used)
 */
export const ADMIN_API_KEY = getOptionalEnv('ADMIN_API_KEY')

// ============================================================================
// EMAIL CONFIGURATION (SMTP)
// ============================================================================

/**
 * SMTP Host
 */
export const SMTP_HOST = getOptionalEnv('SMTP_HOST')

/**
 * SMTP Port
 */
export const SMTP_PORT = getIntEnv('SMTP_PORT', 587)

/**
 * SMTP User (email address)
 */
export const SMTP_USER = getOptionalEnv('SMTP_USER')

/**
 * SMTP Password
 */
export const SMTP_PASS = getOptionalEnv('SMTP_PASS')

/**
 * SMTP Secure (TLS)
 */
export const SMTP_SECURE = SMTP_PORT === 465

/**
 * Admin email address
 */
export const ADMIN_EMAIL = getOptionalEnv('ADMIN_EMAIL')

/**
 * Admin notification email (for order notifications)
 */
export const ADMIN_NOTIFICATION_EMAIL = getOptionalEnv('ADMIN_NOTIFICATION_EMAIL') || ADMIN_EMAIL

/**
 * From email address (sender)
 */
export const FROM_EMAIL = getOptionalEnv('FROM_EMAIL')

/**
 * SendGrid API Key (if using SendGrid instead of SMTP)
 */
export const SENDGRID_API_KEY = getOptionalEnv('SENDGRID_API_KEY')

// ============================================================================
// WHATSAPP CONFIGURATION
// ============================================================================

/**
 * WhatsApp Phone Number ID
 */
export const WHATSAPP_PHONE_NUMBER_ID = getOptionalEnv('WHATSAPP_PHONE_NUMBER_ID')

/**
 * WhatsApp Access Token
 */
export const WHATSAPP_ACCESS_TOKEN = getOptionalEnv('WHATSAPP_ACCESS_TOKEN')

/**
 * Admin WhatsApp Number (for notifications)
 */
export const ADMIN_WHATSAPP_NUMBER = getOptionalEnv('ADMIN_WHATSAPP_NUMBER')

// ============================================================================
// STRIPE CONFIGURATION
// ============================================================================

/**
 * Stripe Secret Key
 */
export const STRIPE_SECRET_KEY = getOptionalEnv('STRIPE_SECRET_KEY')

/**
 * Stripe Publishable Key (safe for client, but not used here)
 */
export const STRIPE_PUBLISHABLE_KEY = getOptionalEnv('STRIPE_PUBLISHABLE_KEY')

// ============================================================================
// APPLICATION CONFIGURATION
// ============================================================================

/**
 * Node environment
 */
export const NODE_ENV = getEnv('NODE_ENV', false) || 'development'

/**
 * Is production environment
 */
export const IS_PRODUCTION = NODE_ENV === 'production'

/**
 * Is development environment
 */
export const IS_DEVELOPMENT = NODE_ENV === 'development'

/**
 * Estimated delivery days for orders
 */
export const ESTIMATED_DELIVERY_DAYS = getIntEnv('ESTIMATED_DELIVERY_DAYS', 21)

// ============================================================================
// VALIDATION HELPERS
// ============================================================================

/**
 * Validate that required email configuration is present
 */
export function validateEmailConfig(): { valid: boolean; missing: string[] } {
  const missing: string[] = []

  // Check for either SMTP or SendGrid
  const hasSMTP = SMTP_HOST && SMTP_USER && SMTP_PASS
  const hasSendGrid = !!SENDGRID_API_KEY

  if (!hasSMTP && !hasSendGrid) {
    missing.push('SMTP configuration (SMTP_HOST, SMTP_USER, SMTP_PASS) or SENDGRID_API_KEY')
  }

  if (!ADMIN_EMAIL && !SMTP_USER) {
    missing.push('ADMIN_EMAIL or SMTP_USER (for admin notifications)')
  }

  if (!FROM_EMAIL && !SMTP_USER) {
    missing.push('FROM_EMAIL or SMTP_USER (for sender address)')
  }

  return {
    valid: missing.length === 0,
    missing,
  }
}

/**
 * Validate that required WhatsApp configuration is present
 */
export function validateWhatsAppConfig(): { valid: boolean; missing: string[] } {
  const missing: string[] = []

  if (!WHATSAPP_PHONE_NUMBER_ID) {
    missing.push('WHATSAPP_PHONE_NUMBER_ID')
  }

  if (!WHATSAPP_ACCESS_TOKEN) {
    missing.push('WHATSAPP_ACCESS_TOKEN')
  }

  if (!ADMIN_WHATSAPP_NUMBER) {
    missing.push('ADMIN_WHATSAPP_NUMBER')
  }

  return {
    valid: missing.length === 0,
    missing,
  }
}

/**
 * Mask sensitive data for logging
 */
export function maskSensitiveData(data: string | undefined | null): string {
  if (!data) return '[not set]'
  if (data.length <= 4) return '****'
  return data.substring(0, 2) + '****' + data.substring(data.length - 2)
}

/**
 * Mask email for logging (show only domain)
 */
export function maskEmail(email: string | undefined | null): string {
  if (!email) return '[not set]'
  const [local, domain] = email.split('@')
  if (!domain) return '****@****'
  return `${local.substring(0, 2)}****@${domain}`
}

/**
 * Mask phone for logging
 */
export function maskPhone(phone: string | undefined | null): string {
  if (!phone) return '[not set]'
  if (phone.length <= 4) return '****'
  return phone.substring(0, 2) + '****' + phone.substring(phone.length - 2)
}

