# Security Audit Report - Next.js Application

**Date**: 2024  
**Auditor**: Security Analysis  
**Project**: Next.js 14 App Router + Prisma + SQLite  
**Priority Levels**: 🔴 Critical | 🟠 High | 🟡 Medium | 🟢 Low

---

## 🔴 CRITICAL ISSUES (Fix Immediately)

### 1. **Weak Session Secret with Default Value**
**File**: `lib/auth.ts:6`  
**Risk**: Session cookies can be forged, allowing unauthorized admin access.  
**Issue**: 
```typescript
const SESSION_SECRET = process.env.SESSION_SECRET || 'change-this-secret-in-production-min-32-chars'
```
**Fix**: 
- Remove default value
- Require `SESSION_SECRET` environment variable
- Ensure it's at least 32 characters
- Use cryptographically secure random string
```typescript
const SESSION_SECRET = process.env.SESSION_SECRET
if (!SESSION_SECRET || SESSION_SECRET.length < 32) {
  throw new Error('SESSION_SECRET must be at least 32 characters')
}
```

---

### 2. **Unsanitized HTML Injection via dangerouslySetInnerHTML**
**File**: `components/AboutGallery.tsx:110`  
**Risk**: XSS (Cross-Site Scripting) attack if `item.description` contains malicious HTML/JavaScript.  
**Issue**:
```typescript
dangerouslySetInnerHTML={{ __html: item.description }}
```
**Fix**: 
- Sanitize HTML using `DOMPurify` or similar
- Or use React's built-in escaping by rendering as text
```typescript
// Option 1: Sanitize
import DOMPurify from 'isomorphic-dompurify'
dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(item.description) }}

// Option 2: Render as text (safer)
<p>{item.description}</p>
```

---

### 3. **File Upload Without Authentication**
**File**: `app/api/admin/upload/route.ts:8`  
**Risk**: Anyone can upload files to your server, leading to storage exhaustion, malicious file uploads, or path traversal attacks.  
**Issue**: No authentication check before file upload.  
**Fix**: Add admin authentication:
```typescript
export async function POST(req: Request) {
  // Add authentication check
  const authHeader = req.headers.get('authorization')
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  
  const token = authHeader.substring(7)
  const adminApiKey = process.env.ADMIN_API_KEY
  if (!adminApiKey || token !== adminApiKey) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  
  // ... rest of upload logic
}
```

---

### 4. **Path Traversal in File Upload**
**File**: `lib/upload.ts:8`  
**Risk**: Malicious filenames like `../../../etc/passwd` could write files outside intended directory.  
**Issue**:
```typescript
const fileName = `${Date.now()}-${file.name}`
```
**Fix**: Sanitize filename:
```typescript
import path from 'path'

function sanitizeFileName(fileName: string): string {
  // Remove path separators and dangerous characters
  const sanitized = fileName
    .replace(/[^a-zA-Z0-9.-]/g, '_')
    .replace(/\.\./g, '')
    .substring(0, 255) // Limit length
  return sanitized
}

const fileName = `${Date.now()}-${sanitizeFileName(file.name)}`
const filePath = join(uploadDir, fileName)

// Additional check: ensure path is within uploadDir
const resolvedPath = path.resolve(filePath)
const resolvedDir = path.resolve(uploadDir)
if (!resolvedPath.startsWith(resolvedDir)) {
  throw new Error('Invalid file path')
}
```

---

### 5. **Prisma Error Codes Exposed to Client**
**File**: `app/api/checkout/route.ts:259-271`  
**Risk**: Reveals database structure and internal errors to attackers.  
**Issue**:
```typescript
if (error.code === 'P2002') {
  return NextResponse.json({ error: 'Database constraint violation' }, { status: 409 })
}
if (error.code === 'P2025') {
  return NextResponse.json({ error: 'Record not found' }, { status: 404 })
}
```
**Fix**: Don't expose Prisma error codes. Use generic messages:
```typescript
catch (error: any) {
  console.error('Checkout error:', error) // Log full error server-side only
  
  // Generic error messages
  if (error.code === 'P2002') {
    return NextResponse.json({ error: 'A record with this information already exists' }, { status: 409 })
  }
  if (error.code === 'P2025') {
    return NextResponse.json({ error: 'The requested resource was not found' }, { status: 404 })
  }
  
  // Don't expose error.code or error.message to client
  return NextResponse.json({ error: 'An error occurred processing your request' }, { status: 500 })
}
```

---

## 🟠 HIGH PRIORITY ISSUES

### 6. **Missing HTTP Method Validation**
**File**: Multiple API routes  
**Risk**: Routes may accept unintended HTTP methods (e.g., GET on POST-only endpoints).  
**Affected Files**:
- `app/api/checkout/route.ts` - Only exports POST, but doesn't reject other methods
- `app/api/admin/products/create/route.ts` - Only exports POST
- `app/api/admin/products/update/route.ts` - Only exports POST
- `app/api/admin/products/delete/route.ts` - Only exports POST
- `app/api/admin/upload/route.ts` - Only exports POST
- `app/api/bookings/route.ts` - Exports GET and POST, but no method check

**Fix**: Add method validation at the start of each handler:
```typescript
export async function POST(request: NextRequest) {
  if (request.method !== 'POST') {
    return NextResponse.json({ error: 'Method not allowed' }, { status: 405 })
  }
  // ... rest of handler
}
```

**Better Fix**: Use Next.js route segment config:
```typescript
export const dynamic = 'force-dynamic'

// Explicitly define allowed methods
export async function POST(request: NextRequest) {
  // Handler code
}

// Reject other methods
export async function GET() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 })
}
```

---

### 7. **Missing Rate Limiting on Public Endpoints**
**File**: Multiple API routes  
**Risk**: Brute force attacks, DDoS, resource exhaustion.  
**Affected Files**:
- `app/api/checkout/route.ts` - No rate limiting
- `app/api/admin/login/route.ts` - No rate limiting (critical for brute force)
- `app/api/admin/upload/route.ts` - No rate limiting
- `app/api/products/route.ts` - No rate limiting
- `app/api/categories/route.ts` - No rate limiting

**Note**: `app/api/bookings/route.ts` has rate limiting (good example).

**Fix**: Implement rate limiting middleware:
```typescript
// lib/rateLimit.ts
import { LRUCache } from 'lru-cache'

const rateLimit = new LRUCache<string, number>({
  max: 500,
  ttl: 60000, // 1 minute
})

export function checkRateLimit(identifier: string, maxRequests: number = 10): boolean {
  const count = rateLimit.get(identifier) || 0
  if (count >= maxRequests) {
    return false
  }
  rateLimit.set(identifier, count + 1)
  return true
}

// Usage in API route:
export async function POST(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for') || 
             request.headers.get('x-real-ip') || 
             'unknown'
  
  if (!checkRateLimit(ip, 10)) {
    return NextResponse.json(
      { error: 'Too many requests' },
      { status: 429 }
    )
  }
  // ... rest of handler
}
```

---

### 8. **Admin API Key in Request Headers (Exposed in Network Tab)**
**File**: Multiple admin API routes  
**Risk**: API keys visible in browser DevTools Network tab if used from client-side.  
**Affected Files**:
- `app/api/admin/products/create/route.ts:23-50`
- `app/api/admin/products/update/route.ts:23-52`
- `app/api/admin/products/delete/route.ts:16-45`
- `app/api/admin/upload/route.ts` - Missing auth entirely

**Issue**: Using `Authorization: Bearer <token>` in client-side code exposes the token.

**Fix**: 
- **Option 1**: Use server-side session cookies instead (recommended)
- **Option 2**: If API key must be used, ensure it's only used in server actions, never in client components
- **Option 3**: Implement short-lived JWT tokens instead of static API keys

**Recommended**: Replace API key auth with session-based auth:
```typescript
import { verifySession } from '@/lib/auth'

export async function POST(req: NextRequest) {
  const session = await verifySession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  // ... rest of handler
}
```

---

### 9. **Insufficient Input Validation on File Uploads**
**File**: `app/api/admin/upload/route.ts:17-26`  
**Risk**: Malicious files could be uploaded (executables, scripts, etc.).  
**Issue**: Only checks `file.type.startsWith('image/')` which can be spoofed.

**Fix**: Add MIME type validation and file signature checking:
```typescript
// Validate file type by content, not just extension/MIME
const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
if (!allowedMimeTypes.includes(file.type)) {
  return NextResponse.json({ error: 'Invalid file type' }, { status: 400 })
}

// Validate file signature (magic bytes)
const buffer = Buffer.from(await file.arrayBuffer())
const isValidImage = validateImageSignature(buffer)
if (!isValidImage) {
  return NextResponse.json({ error: 'Invalid image file' }, { status: 400 })
}

function validateImageSignature(buffer: Buffer): boolean {
  // JPEG: FF D8 FF
  if (buffer[0] === 0xFF && buffer[1] === 0xD8 && buffer[2] === 0xFF) return true
  // PNG: 89 50 4E 47
  if (buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4E && buffer[3] === 0x47) return true
  // WebP: Check for RIFF...WEBP
  if (buffer.toString('ascii', 0, 4) === 'RIFF' && buffer.toString('ascii', 8, 12) === 'WEBP') return true
  // GIF: 47 49 46 38
  if (buffer[0] === 0x47 && buffer[1] === 0x49 && buffer[2] === 0x46 && buffer[3] === 0x38) return true
  return false
}
```

---

### 10. **Error Messages Expose Internal Details**
**File**: `app/api/products/route.ts:136`  
**Risk**: Reveals error messages that could help attackers understand system internals.  
**Issue**:
```typescript
error: error instanceof Error ? error.message : 'Unknown error',
```
**Fix**: Don't expose error messages to client:
```typescript
catch (error) {
  console.error('Error fetching products:', error) // Log server-side
  return NextResponse.json(
    {
      ok: false,
      message: 'Une erreur est survenue lors de la récupération des produits.',
      // Remove: error: error instanceof Error ? error.message : 'Unknown error',
    },
    { status: 500 }
  )
}
```

**Affected Files**:
- `app/api/products/route.ts:136, 307`
- `app/api/categories/route.ts:30`
- `app/api/webhooks/stripe/route.ts:160` - Exposes `error.message`

---

### 11. **Missing CSRF Protection**
**File**: All POST/PUT/DELETE API routes  
**Risk**: Cross-Site Request Forgery attacks.  
**Issue**: No CSRF tokens or SameSite cookie protection on state-changing operations.

**Fix**: 
- Ensure cookies use `sameSite: 'strict'` or `sameSite: 'lax'` (already done in `lib/auth.ts:34`)
- For additional protection, implement CSRF tokens for sensitive operations
- Use Next.js built-in CSRF protection if available

**Note**: Session cookies already use `sameSite: 'lax'` which provides some protection.

---

### 12. **SQL Injection Risk (Low, but verify)**
**File**: All Prisma queries  
**Risk**: SQL injection if raw queries are used.  
**Status**: ✅ **SAFE** - Prisma uses parameterized queries by default.  
**Recommendation**: Never use `prisma.$queryRaw` with user input without proper sanitization.

---

## 🟡 MEDIUM PRIORITY ISSUES

### 13. **Inconsistent Error Handling**
**File**: Multiple API routes  
**Risk**: Some routes expose more information than others, creating inconsistent security posture.  
**Fix**: Standardize error handling across all routes:
```typescript
// lib/api-error-handler.ts
export function handleApiError(error: any) {
  console.error('API Error:', error) // Log full error server-side
  
  // Map Prisma errors to generic messages
  if (error.code === 'P2002') {
    return { message: 'A record with this information already exists', status: 409 }
  }
  if (error.code === 'P2025') {
    return { message: 'The requested resource was not found', status: 404 }
  }
  if (error.code === 'P2003') {
    return { message: 'Invalid reference', status: 400 }
  }
  
  // Generic error
  return { message: 'An error occurred', status: 500 }
}
```

---

### 14. **Missing Input Sanitization on Text Fields**
**File**: Multiple API routes  
**Risk**: Stored XSS if user input is displayed without sanitization.  
**Affected Fields**:
- Product names, descriptions
- Category names
- Order customer names, addresses
- Booking messages

**Fix**: Sanitize user input before storing:
```typescript
import DOMPurify from 'isomorphic-dompurify'

function sanitizeInput(input: string): string {
  return DOMPurify.sanitize(input.trim(), { ALLOWED_TAGS: [] })
}

// Usage:
name: sanitizeInput(name),
description: description ? sanitizeInput(description) : null,
```

---

### 15. **No Request Size Limits**
**File**: All API routes accepting JSON  
**Risk**: Large request bodies could cause memory exhaustion.  
**Fix**: Add body size limits in middleware or Next.js config:
```typescript
// next.config.js
module.exports = {
  api: {
    bodyParser: {
      sizeLimit: '1mb',
    },
  },
}
```

---

### 16. **Missing Content-Type Validation**
**File**: API routes accepting JSON  
**Risk**: Content-Type confusion attacks.  
**Fix**: Validate Content-Type header:
```typescript
const contentType = request.headers.get('content-type')
if (!contentType || !contentType.includes('application/json')) {
  return NextResponse.json({ error: 'Invalid content type' }, { status: 400 })
}
```

---

### 17. **Environment Variables Potentially Exposed**
**File**: `app/api/test/email/route.ts:50-51, 65-66, 119-121, 130-132`  
**Risk**: Exposing SMTP configuration details in error responses.  
**Issue**:
```typescript
<p><strong>SMTP Host:</strong> ${process.env.SMTP_HOST || 'Not configured'}</p>
```
**Fix**: Don't expose environment variable values in responses:
```typescript
// Only show if configured, not the actual value
<p><strong>SMTP Host:</strong> ${process.env.SMTP_HOST ? 'Configured' : 'Not configured'}</p>
```

---

### 18. **Missing Authorization on Test Endpoint**
**File**: `app/api/test/email/route.ts`  
**Risk**: Anyone can send test emails, potentially spamming recipients.  
**Fix**: Add admin authentication or remove in production:
```typescript
export async function POST(request: NextRequest) {
  // Add authentication
  const session = await verifySession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  // ... rest of handler
}

// Or disable in production:
if (process.env.NODE_ENV === 'production') {
  return NextResponse.json({ error: 'Not available in production' }, { status: 404 })
}
```

---

### 19. **Insecure File Storage Location**
**File**: `lib/upload.ts:9`  
**Risk**: Files stored in `public/uploads` are publicly accessible without authentication.  
**Issue**: Anyone can access uploaded files via URL.

**Fix**: 
- Store files outside `public/` directory
- Serve files through authenticated API endpoint
- Or add authentication middleware to serve files

```typescript
// Store in private directory
const uploadDir = join(process.cwd(), 'uploads') // Not in public/

// Serve via authenticated endpoint:
// app/api/uploads/[filename]/route.ts
export async function GET(request: NextRequest, { params }: { params: { filename: string } }) {
  const session = await verifySession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  // Serve file
}
```

---

### 20. **Missing Input Length Validation**
**File**: Multiple API routes  
**Risk**: Extremely long input strings could cause DoS or database issues.  
**Fix**: Add length limits:
```typescript
if (name.length > 255) {
  return NextResponse.json({ error: 'Name too long' }, { status: 400 })
}
if (description && description.length > 5000) {
  return NextResponse.json({ error: 'Description too long' }, { status: 400 })
}
```

---

## 🟢 LOW PRIORITY / BEST PRACTICES

### 21. **Console.log in Production**
**File**: Multiple API routes  
**Risk**: Information leakage through logs.  
**Fix**: Use proper logging library with log levels:
```typescript
// Use winston or pino
import logger from '@/lib/logger'
logger.error('Error message', { context: error })
```

---

### 22. **Missing Security Headers**
**File**: `next.config.js` or middleware  
**Risk**: Missing security headers increase attack surface.  
**Fix**: Add security headers in `next.config.js`:
```typescript
module.exports = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
    ]
  },
}
```

---

### 23. **Missing CORS Configuration**
**File**: API routes  
**Risk**: Unrestricted CORS allows any origin to call APIs.  
**Fix**: Configure CORS properly:
```typescript
// middleware.ts or in each route
const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || ['https://bk-agencements.com']

const origin = request.headers.get('origin')
if (origin && !allowedOrigins.includes(origin)) {
  return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
}
```

---

### 24. **Session Cookie Security**
**File**: `lib/auth.ts:31-37`  
**Status**: ✅ **GOOD** - Uses `httpOnly`, `secure` in production, `sameSite: 'lax'`  
**Recommendation**: Consider `sameSite: 'strict'` for admin sessions.

---

### 25. **Password Hashing**
**File**: `app/api/admin/login/route.ts:51`  
**Status**: ✅ **GOOD** - Uses `bcrypt.compare()`  
**Recommendation**: Ensure bcrypt rounds are sufficient (default is usually 10, which is good).

---

## 📋 SUMMARY CHECKLIST

### Immediate Actions (Critical)
- [ ] Fix weak session secret (remove default, require env var)
- [ ] Sanitize HTML in `AboutGallery.tsx`
- [ ] Add authentication to file upload endpoint
- [ ] Fix path traversal in file upload
- [ ] Remove Prisma error code exposure

### High Priority (This Week)
- [ ] Add HTTP method validation to all API routes
- [ ] Implement rate limiting on all public endpoints
- [ ] Replace API key auth with session-based auth for admin routes
- [ ] Add file signature validation for uploads
- [ ] Remove error message exposure to clients
- [ ] Add CSRF protection

### Medium Priority (This Month)
- [ ] Standardize error handling across all routes
- [ ] Add input sanitization for all text fields
- [ ] Add request size limits
- [ ] Add Content-Type validation
- [ ] Remove environment variable exposure in responses
- [ ] Secure test endpoints or remove in production
- [ ] Move file storage outside public directory
- [ ] Add input length validation

### Low Priority (Best Practices)
- [ ] Replace console.log with proper logging
- [ ] Add security headers
- [ ] Configure CORS properly
- [ ] Review and update session cookie settings

---

## 🔒 SECURITY TESTING RECOMMENDATIONS

1. **Penetration Testing**: Hire a security firm or use automated tools
2. **Dependency Scanning**: Run `npm audit` and fix vulnerabilities
3. **Static Analysis**: Use tools like Snyk, SonarQube
4. **OWASP Top 10**: Review against OWASP Top 10 vulnerabilities
5. **Regular Audits**: Schedule quarterly security audits

---

## 📚 REFERENCES

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Next.js Security Best Practices](https://nextjs.org/docs/app/building-your-application/configuring/security-headers)
- [Prisma Security](https://www.prisma.io/docs/guides/performance-and-optimization/connection-management/security)
- [Node.js Security Best Practices](https://nodejs.org/en/docs/guides/security/)

---

**Report Generated**: 2024  
**Total Issues Found**: 25  
**Critical**: 5 | **High**: 7 | **Medium**: 8 | **Low**: 5

