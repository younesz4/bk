# Booking System - Quick Setup Guide

## Files Created

### 1. Database & Schema
- `prisma/schema.prisma` - Prisma schema with Booking model
- `lib/prisma.ts` - Prisma client singleton

### 2. API Routes
- `app/api/bookings/route.ts` - POST (create booking) and GET (admin list) endpoints

### 3. Utilities
- `lib/mail.ts` - SendGrid email functions (client confirmation + admin notification)
- `lib/validation.ts` - Server-side validation
- `lib/rateLimit.ts` - Simple rate limiting (5 req/min per IP)

### 4. Types
- `types/booking.ts` - TypeScript interfaces

### 5. Frontend
- `app/rdv/page.tsx` - Updated booking form with API integration

### 6. Documentation
- `README_BOOKING.md` - Complete documentation
- `.gitignore` - Updated to exclude database files

## Installation Steps

1. **Install packages:**
   ```bash
   npm install @prisma/client @sendgrid/mail prisma
   ```

2. **Create `.env.local`:**
   ```env
   DATABASE_URL="file:./prisma/dev.db"
   SENDGRID_API_KEY="your-key-here"
   FROM_EMAIL="noreply@yourdomain.com"
   ADMIN_EMAIL="you@yourdomain.com"
   ADMIN_TOKEN="change-this-to-strong-secret"
   ```

3. **Setup database:**
   ```bash
   npx prisma generate
   npx prisma migrate dev --name init
   ```

4. **Run dev server:**
   ```bash
   npm run dev
   ```

## Test the API

```bash
# Create a booking
curl -X POST "http://localhost:3000/api/bookings" \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Test User",
    "email": "test@example.com",
    "date": "2025-12-01",
    "timeSlot": "10:00"
  }'

# Get bookings (admin)
curl -X GET "http://localhost:3000/api/bookings" \
  -H "x-admin-token: your-admin-token"
```

## Key Features

✅ Server-side validation
✅ Rate limiting (5 req/min)
✅ Anti-bot honeypot
✅ Email notifications (SendGrid)
✅ SQLite database
✅ TypeScript types
✅ Error handling
✅ French language support

## Email Templates

Both emails are in French:
- **Client**: Confirmation with booking details
- **Admin**: Notification with link to view bookings

## Security

- Rate limiting per IP
- Honeypot anti-bot field
- Admin token for GET endpoint
- Input validation and sanitization



