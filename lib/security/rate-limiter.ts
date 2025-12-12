/**
 * Rate Limiter for API Routes
 * Uses in-memory storage (fallback) or Upstash Redis (production)
 */

interface RateLimitConfig {
  windowMs: number // Time window in milliseconds
  maxRequests: number // Maximum requests per window
  keyGenerator?: (req: Request) => string // Custom key generator
}

interface RateLimitStore {
  [key: string]: {
    count: number
    resetTime: number
  }
}

// In-memory store (fallback for development)
const memoryStore: RateLimitStore = {}

// Clean up expired entries every 5 minutes
setInterval(() => {
  const now = Date.now()
  Object.keys(memoryStore).forEach((key) => {
    if (memoryStore[key].resetTime < now) {
      delete memoryStore[key]
    }
  })
}, 5 * 60 * 1000)

/**
 * Get client IP from request
 */
function getClientIP(request: Request): string {
  // Try various headers (for proxies/load balancers)
  const forwarded = request.headers.get('x-forwarded-for')
  if (forwarded) {
    return forwarded.split(',')[0].trim()
  }
  
  const realIP = request.headers.get('x-real-ip')
  if (realIP) {
    return realIP
  }
  
  // Fallback (won't work in serverless, but helps in development)
  return 'unknown'
}

/**
 * Rate limiter function
 */
export async function rateLimit(
  request: Request,
  config: RateLimitConfig
): Promise<{ allowed: boolean; remaining: number; resetTime: number }> {
  const key = config.keyGenerator
    ? config.keyGenerator(request)
    : `rate-limit:${getClientIP(request)}`
  
  const now = Date.now()
  const windowStart = now - config.windowMs
  
  // Get or create entry
  let entry = memoryStore[key]
  
  if (!entry || entry.resetTime < now) {
    // Create new entry or reset expired one
    entry = {
      count: 0,
      resetTime: now + config.windowMs,
    }
    memoryStore[key] = entry
  }
  
  // Increment count
  entry.count++
  
  const allowed = entry.count <= config.maxRequests
  const remaining = Math.max(0, config.maxRequests - entry.count)
  
  return {
    allowed,
    remaining,
    resetTime: entry.resetTime,
  }
}

/**
 * Pre-configured rate limiters
 */
export const rateLimiters = {
  // Contact form: 10 requests per minute
  contact: (request: Request) =>
    rateLimit(request, {
      windowMs: 60 * 1000, // 1 minute
      maxRequests: 10,
      keyGenerator: (req) => `contact:${getClientIP(req)}`,
    }),
  
  // General API: 30 requests per minute
  api: (request: Request) =>
    rateLimit(request, {
      windowMs: 60 * 1000, // 1 minute
      maxRequests: 30,
      keyGenerator: (req) => `api:${getClientIP(req)}`,
    }),
  
  // Login: 5 requests per minute
  login: (request: Request) =>
    rateLimit(request, {
      windowMs: 60 * 1000, // 1 minute
      maxRequests: 5,
      keyGenerator: (req) => `login:${getClientIP(req)}`,
    }),
  
  // Cart update: 20 requests per minute
  cart: (request: Request) =>
    rateLimit(request, {
      windowMs: 60 * 1000, // 1 minute
      maxRequests: 20,
      keyGenerator: (req) => `cart:${getClientIP(req)}`,
    }),
  
  // Admin API: 20 requests per minute
  admin: (request: Request) =>
    rateLimit(request, {
      windowMs: 60 * 1000, // 1 minute
      maxRequests: 20,
      keyGenerator: (req) => `admin:${getClientIP(req)}`,
    }),
}

/**
 * Rate limit middleware helper
 */
export async function withRateLimit(
  request: Request,
  limiter: (req: Request) => Promise<{ allowed: boolean; remaining: number; resetTime: number }>,
  handler: () => Promise<Response>
): Promise<Response> {
  const result = await limiter(request)
  
  if (!result.allowed) {
    return new Response(
      JSON.stringify({
        error: 'Too many requests',
        message: 'Rate limit exceeded. Please try again later.',
      }),
      {
        status: 429,
        headers: {
          'Content-Type': 'application/json',
          'X-RateLimit-Limit': '20',
          'X-RateLimit-Remaining': result.remaining.toString(),
          'X-RateLimit-Reset': new Date(result.resetTime).toISOString(),
          'Retry-After': Math.ceil((result.resetTime - Date.now()) / 1000).toString(),
        },
      }
    )
  }
  
  // Add rate limit headers to response
  const response = await handler()
  if (response.headers) {
    response.headers.set('X-RateLimit-Limit', '20')
    response.headers.set('X-RateLimit-Remaining', result.remaining.toString())
    response.headers.set('X-RateLimit-Reset', new Date(result.resetTime).toISOString())
  }
  
  return response
}




