/**
 * Environment variable validation
 * Fails fast during module load if required variables are missing
 */

function getEnvVar(key: string): string {
  const value = process.env[key]
  if (!value) {
    throw new Error(`Missing environment variable: ${key}`)
  }
  return value
}

export const env = {
  STRIPE_SECRET_KEY: getEnvVar('STRIPE_SECRET_KEY'),
  STRIPE_WEBHOOK_SECRET: getEnvVar('STRIPE_WEBHOOK_SECRET'),
  NEXT_PUBLIC_STRIPE_PUBLIC_KEY: getEnvVar('NEXT_PUBLIC_STRIPE_PUBLIC_KEY'),
  NEXT_PUBLIC_BASE_URL: getEnvVar('NEXT_PUBLIC_BASE_URL'),
}


