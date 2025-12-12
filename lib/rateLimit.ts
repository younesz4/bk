// Simple in-memory rate limiter
// In production, consider using Redis or a dedicated service

interface RateLimitStore {
  [key: string]: {
    count: number
    resetTime: number
  }
}

const store: RateLimitStore = {}

interface RateLimitConfig {
  maxRequests: number
  windowMs: number
}

// Rate limit configurations per endpoint
const RATE_LIMIT_CONFIGS: Record<string, RateLimitConfig> = {
  bookings: {
    maxRequests: 5,
    windowMs: 10 * 60 * 1000, // 10 minutes
  },
  contact: {
    maxRequests: 10,
    windowMs: 10 * 60 * 1000, // 10 minutes
  },
  default: {
    maxRequests: 10,
    windowMs: 60 * 1000, // 1 minute
  },
}

/**
 * Check rate limit for an identifier (IP address)
 * @param identifier - Unique identifier (usually IP address)
 * @param endpoint - Endpoint name for specific rate limit config (e.g., 'bookings', 'contact')
 * @returns Object with allowed status and remaining requests
 */
export function checkRateLimit(
  identifier: string,
  endpoint: string = 'default'
): { allowed: boolean; remaining: number; resetTime?: number } {
  const config = RATE_LIMIT_CONFIGS[endpoint] || RATE_LIMIT_CONFIGS.default
  const key = `${endpoint}:${identifier}`
  const now = Date.now()
  const record = store[key]

  if (!record || now > record.resetTime) {
    // New window
    store[key] = {
      count: 1,
      resetTime: now + config.windowMs,
    }
    return {
      allowed: true,
      remaining: config.maxRequests - 1,
      resetTime: now + config.windowMs,
    }
  }

  if (record.count >= config.maxRequests) {
    return {
      allowed: false,
      remaining: 0,
      resetTime: record.resetTime,
    }
  }

  record.count++
  return {
    allowed: true,
    remaining: config.maxRequests - record.count,
    resetTime: record.resetTime,
  }
}

// Clean up old entries periodically
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now()
    Object.keys(store).forEach((key) => {
      if (store[key].resetTime < now) {
        delete store[key]
      }
    })
  }, 60000) // Clean up every minute
}
