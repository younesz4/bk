import Stripe from 'stripe'

/**
 * Server-side Stripe instance
 * DO NOT use this client-side - it uses the secret key
 * 
 * Uses globalThis to prevent duplicate instances in dev mode (hot reload)
 */

// Type-safe global for Stripe instance
const globalForStripe = globalThis as unknown as {
  stripe: Stripe | undefined
}

// Get Stripe secret key from environment
const stripeSecretKey = process.env.STRIPE_SECRET_KEY

if (!stripeSecretKey) {
  throw new Error('STRIPE_SECRET_KEY is not set in environment variables')
}

// Create or reuse Stripe instance
export const stripe: Stripe =
  globalForStripe.stripe ??
  new Stripe(stripeSecretKey, {
    typescript: true,
  })

// Store in globalThis for dev mode (prevents duplicate instances on hot reload)
if (process.env.NODE_ENV !== 'production') {
  globalForStripe.stripe = stripe
}
