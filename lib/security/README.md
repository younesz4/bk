# Security Module Documentation

This directory contains all security utilities for the BK Agencements application.

## Files

### `api-security.ts`
Secure API route wrapper that provides:
- Input validation
- Request size limits
- Rate limiting
- Error handling (no stack traces)
- Method validation

**Usage:**
```typescript
import { secureApiRoute } from '@/lib/security/api-security'
import { rateLimiters } from '@/lib/security/rate-limiter'

export const POST = secureApiRoute(handler, {
  methods: ['POST'],
  rateLimiter: rateLimiters.contact,
  maxBodySize: 2 * 1024 * 1024, // 2MB
})
```

### `input-validation.ts`
Input validation and sanitization utilities:
- `sanitizeString()` - Remove dangerous characters
- `escapeHTML()` - Escape HTML entities
- `sanitizeEmail()` - Validate and sanitize emails
- `sanitizeURL()` - Validate and sanitize URLs
- `validateUUID()` - Validate UUID format
- `validateCUID()` - Validate CUID format (Prisma default)
- `safeJsonParse()` - Safe JSON parsing with size limits

### `rate-limiter.ts`
Rate limiting system with pre-configured limiters:
- `rateLimiters.contact` - 10 req/min
- `rateLimiters.api` - 30 req/min
- `rateLimiters.login` - 5 req/min
- `rateLimiters.cart` - 20 req/min
- `rateLimiters.admin` - 20 req/min

### `csrf.ts`
CSRF protection:
- `generateCSRFToken()` - Generate token
- `getCSRFToken()` - Get or create token
- `validateCSRFToken()` - Validate token
- `requireCSRFToken()` - Require valid token

### `database-security.ts`
Database security utilities:
- `safeFindUnique()` - Safe Prisma queries
- `validateProductAvailability()` - Verify product exists and is available
- `verifyOrderTotal()` - Verify order total matches calculated total
- `checkDuplicateOrder()` - Prevent duplicate submissions
- Validation schemas for products, categories, orders

### `bot-protection.ts`
Bot and DDoS protection:
- `isBlockedUserAgent()` - Check if user agent is blocked
- `isHoneypotEndpoint()` - Detect honeypot access
- `trackIP()` - Track and block repeated offenders

### `file-upload.ts`
Secure file upload handler:
- MIME type validation (jpeg, png, webp only)
- File size limit (5MB)
- Secure filename generation
- EXIF removal placeholder
- Virus scan placeholder

### `admin-protection.ts`
Admin panel protection:
- IP allowlist checking
- Rate limiting
- Robots.txt generation

## Best Practices

1. **Always validate input** - Use Zod schemas
2. **Sanitize all strings** - Use sanitizeString() or escapeHTML()
3. **Validate IDs** - Use validateCUID() or validateUUID()
4. **Rate limit all endpoints** - Use rateLimiters
5. **Never trust client data** - Always verify server-side
6. **Use secureApiRoute wrapper** - For all API routes
7. **Generic error messages** - Never expose stack traces
8. **CSRF tokens** - For all write operations

## Example: Secure API Route

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { secureApiRoute, securityErrorResponse } from '@/lib/security/api-security'
import { rateLimiters } from '@/lib/security/rate-limiter'
import { safeJsonParse, sanitizeString } from '@/lib/security/input-validation'
import { z } from 'zod'

const schema = z.object({
  name: z.string().min(1).max(100).transform(sanitizeString),
  email: z.string().email(),
})

async function handler(request: NextRequest): Promise<NextResponse> {
  const body = await safeJsonParse(request)
  const result = schema.safeParse(body)
  
  if (!result.success) {
    return securityErrorResponse('Validation failed', 400)
  }
  
  // Process request...
  return NextResponse.json({ ok: true })
}

export const POST = secureApiRoute(handler, {
  methods: ['POST'],
  rateLimiter: rateLimiters.api,
})
```




