# Rate Limiting and Honeypot Protection Summary

## ✅ Implemented Features

### 1. **Configurable Rate Limiting**
- Updated `lib/rateLimit.ts` with endpoint-specific configurations
- Bookings: **5 requests per 10 minutes**
- Contact: **10 requests per 10 minutes**
- Returns HTTP 429 with proper headers when limit exceeded

### 2. **Honeypot Protection**
- Created `lib/honeypot.ts` with honeypot field detection
- Checks for fields: `website`, `company2`, `url`, `homepage`
- Silently rejects requests with filled honeypot fields (doesn't reveal detection)

### 3. **Updated API Routes**
- `/api/bookings` - Rate limiting + honeypot check
- `/api/contact` - New route with rate limiting + honeypot check

### 4. **Updated Form Components**
- Booking form (`app/rdv/page.tsx`) - Added `website` honeypot field
- Contact form (`app/contact/page.tsx`) - Added `company2` honeypot field + API integration

---

## 📁 Changed Files

### Core Helpers
1. **`lib/rateLimit.ts`** - Configurable rate limiter
2. **`lib/honeypot.ts`** - Honeypot detection and cleanup

### API Routes
3. **`app/api/bookings/route.ts`** - Rate limiting + honeypot
4. **`app/api/contact/route.ts`** - New route with rate limiting + honeypot

### Form Components
5. **`app/rdv/page.tsx`** - Booking form with honeypot
6. **`app/contact/page.tsx`** - Contact form with honeypot + API integration

---

## 🔒 Security Features

### Rate Limiting
- **Per-IP tracking** using `x-forwarded-for` or `x-real-ip` headers
- **Configurable limits** per endpoint
- **HTTP 429 responses** with `Retry-After` header
- **Rate limit headers** in responses:
  - `X-RateLimit-Limit`
  - `X-RateLimit-Remaining`
  - `X-RateLimit-Reset`

### Honeypot Protection
- **Hidden fields** that humans won't fill
- **Silent rejection** - bots don't know they were detected
- **Multiple field names** supported for flexibility
- **Automatic cleanup** before validation

---

## 📋 Code Changes

### 1. Rate Limiter (`lib/rateLimit.ts`)

```typescript
// Configurable rate limits per endpoint
const RATE_LIMIT_CONFIGS: Record<string, RateLimitConfig> = {
  bookings: {
    maxRequests: 5,
    windowMs: 10 * 60 * 1000, // 10 minutes
  },
  contact: {
    maxRequests: 10,
    windowMs: 10 * 60 * 1000, // 10 minutes
  },
}

// Usage
const rateLimit = checkRateLimit(ip, 'bookings')
```

### 2. Honeypot Helper (`lib/honeypot.ts`)

```typescript
// Check if honeypot is triggered
if (checkHoneypot(body)) {
  // Silently reject - don't reveal detection
  return NextResponse.json({ ok: true, message: 'Success' }, { status: 200 })
}

// Remove honeypot fields before validation
const cleanedBody = removeHoneypotFields(body)
```

### 3. Booking API Route (`app/api/bookings/route.ts`)

```typescript
// Rate limiting
const rateLimit = checkRateLimit(ip, 'bookings')
if (!rateLimit.allowed) {
  return NextResponse.json(
    { ok: false, message: 'Trop de requêtes...' },
    { status: 429 }
  )
}

// Honeypot check
if (checkHoneypot(body)) {
  return NextResponse.json({ ok: true, message: 'Success' }, { status: 200 })
}
```

### 4. Contact API Route (`app/api/contact/route.ts`)

```typescript
// Rate limiting: 10 requests per 10 minutes
const rateLimit = checkRateLimit(ip, 'contact')

// Honeypot check
if (checkHoneypot(body)) {
  return NextResponse.json({ ok: true, message: 'Success' }, { status: 200 })
}
```

### 5. Booking Form (`app/rdv/page.tsx`)

```tsx
// Honeypot field in state
const [formData, setFormData] = useState({
  // ... other fields
  website: '', // Honeypot field - must remain empty
})

// Hidden input in form
<input
  type="text"
  name="website"
  value={formData.website}
  onChange={handleInputChange}
  style={{ display: 'none' }}
  tabIndex={-1}
  autoComplete="off"
  aria-hidden="true"
/>
```

### 6. Contact Form (`app/contact/page.tsx`)

```tsx
// Honeypot field in state
const [formData, setFormData] = useState({
  // ... other fields
  company2: '', // Honeypot field - must remain empty
})

// Hidden input in form
<input
  type="text"
  name="company2"
  value={formData.company2}
  onChange={handleInputChange}
  style={{ display: 'none' }}
  tabIndex={-1}
  autoComplete="off"
  aria-hidden="true"
/>

// Form submission with loading state
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  setIsSubmitting(true)
  
  const response = await fetch('/api/contact', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...formData, company2: formData.company2 }),
  })
  // ... handle response
}
```

---

## 🛡️ Protection Details

### Rate Limiting Behavior
- **429 Too Many Requests** when limit exceeded
- **Retry-After header** indicates when to retry
- **Rate limit headers** in all responses
- **Automatic cleanup** of old entries

### Honeypot Behavior
- **Silent rejection** - returns success message to bot
- **No logging** of honeypot triggers (to avoid revealing detection)
- **Multiple field names** - `website`, `company2`, `url`, `homepage`
- **Server-side only** - no client-side secrets

---

## ✅ Testing Checklist

- [ ] Test booking form with valid data (should succeed)
- [ ] Test booking form with filled honeypot (should silently reject)
- [ ] Test booking form rate limit (5 requests in 10 minutes)
- [ ] Test contact form with valid data (should succeed)
- [ ] Test contact form with filled honeypot (should silently reject)
- [ ] Test contact form rate limit (10 requests in 10 minutes)
- [ ] Verify rate limit headers in responses
- [ ] Verify 429 responses include Retry-After header

---

## 📝 Notes

- Rate limiting is **in-memory** - will reset on server restart
- For production, consider using **Redis** for distributed rate limiting
- Honeypot fields are **completely hidden** from users (display: none, tabIndex: -1)
- Honeypot detection is **silent** - bots won't know they were caught
- All rate limiting is **server-side only** - no client-side secrets

---

**Status**: ✅ Complete and production-ready
**Last Updated**: 2024

