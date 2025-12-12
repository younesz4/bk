# Booking System - Documentation

## Installation

### 1. Install Dependencies

```bash
npm install @prisma/client @sendgrid/mail prisma
```

### 2. Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# Database
DATABASE_URL="file:./prisma/dev.db"

# SendGrid Email Configuration
SENDGRID_API_KEY="your-sendgrid-api-key-here"
FROM_EMAIL="noreply@yourdomain.com"
ADMIN_EMAIL="you@yourdomain.com"

# Admin Token (for accessing bookings API)
ADMIN_TOKEN="a-strong-secret-token-change-this"

# Optional: App URL for admin email links
NEXT_PUBLIC_APP_URL="https://yourdomain.com"
```

### 3. Database Setup

```bash
# Generate Prisma Client
npx prisma generate

# Run migrations
npx prisma migrate dev --name init

# (Optional) Open Prisma Studio to view data
npx prisma studio
```

## API Endpoints

### POST /api/bookings

Create a new booking.

**Request Body:**
```json
{
  "fullName": "Jean Dupont",
  "email": "jean@example.com",
  "phone": "+33612345678",
  "projectType": "Résidentiel",
  "budget": "25 000 - 50 000 €",
  "message": "Je souhaite un rendez-vous pour discuter de mon projet.",
  "date": "2025-12-15",
  "timeSlot": "10:00",
  "honeypot": "" // Anti-bot field (should be empty)
}
```

**Response (Success - 201):**
```json
{
  "ok": true,
  "bookingId": "clx1234567890",
  "emailSent": true,
  "message": "Votre demande de rendez-vous a été enregistrée avec succès."
}
```

**Response (Validation Error - 422):**
```json
{
  "ok": false,
  "errors": {
    "email": ["Une adresse email valide est requise"],
    "date": ["La date est requise"]
  }
}
```

### GET /api/bookings

Get last 50 bookings (Admin only).

**Headers:**
```
x-admin-token: your-admin-token-here
```

**Response (200):**
```json
{
  "ok": true,
  "bookings": [
    {
      "id": "clx1234567890",
      "fullName": "Jean Dupont",
      "email": "jean@example.com",
      "phone": "+33612345678",
      "projectType": "Résidentiel",
      "budget": "25 000 - 50 000 €",
      "message": "...",
      "date": "2025-12-15T00:00:00.000Z",
      "timeSlot": "10:00",
      "createdAt": "2025-01-15T10:30:00.000Z",
      "status": "pending"
    }
  ]
}
```

## Testing

### Test Booking Creation

```bash
curl -X POST "http://localhost:3000/api/bookings" \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Test User",
    "email": "test@example.com",
    "date": "2025-12-01",
    "timeSlot": "10:00",
    "message": "Test booking"
  }'
```

### Test Admin Endpoint

```bash
curl -X GET "http://localhost:3000/api/bookings" \
  -H "x-admin-token: your-admin-token-here"
```

## Features

- ✅ **Server-side validation** - All fields validated before saving
- ✅ **Rate limiting** - 5 requests per minute per IP
- ✅ **Anti-bot protection** - Honeypot field
- ✅ **Email notifications** - Confirmation to client + notification to admin
- ✅ **Error handling** - Graceful error handling with French messages
- ✅ **SQLite database** - Simple file-based database
- ✅ **TypeScript** - Full type safety

## Email Templates

The system sends two emails:

1. **Client Confirmation** - Sent to the booking email address
2. **Admin Notification** - Sent to ADMIN_EMAIL

Both emails are in French and include:
- Booking details (date, time, project type)
- Reference number (booking ID)
- Professional formatting

## Security

- **Rate Limiting**: Prevents abuse (5 requests/minute per IP)
- **Honeypot Field**: Hidden field to catch bots
- **Admin Token**: Required for accessing bookings list
- **Input Validation**: Server-side validation of all fields
- **Email Sanitization**: Email addresses are lowercased and trimmed

## Troubleshooting

### Emails not sending

1. Check that `SENDGRID_API_KEY` is set correctly
2. Verify `FROM_EMAIL` is a verified sender in SendGrid
3. Check SendGrid dashboard for delivery status
4. Note: Bookings are saved even if email fails

### Database errors

1. Run `npx prisma generate` to regenerate client
2. Run `npx prisma migrate dev` to apply migrations
3. Check that `DATABASE_URL` is correct in `.env.local`

### Rate limit errors

- Wait 1 minute between requests
- Rate limit is per IP address
- In production, consider using Redis for distributed rate limiting

## Production Considerations

1. **Database**: Consider migrating to PostgreSQL for production
2. **Rate Limiting**: Use Redis-based rate limiting for distributed systems
3. **Email**: Monitor SendGrid delivery rates
4. **Backups**: Set up regular database backups
5. **Monitoring**: Add logging and error tracking (Sentry, etc.)

## File Structure

```
├── app/
│   ├── api/
│   │   └── bookings/
│   │       └── route.ts          # POST/GET endpoints
│   └── rdv/
│       └── page.tsx              # Booking form UI
├── lib/
│   ├── prisma.ts                 # Prisma client singleton
│   ├── mail.ts                   # SendGrid email functions
│   ├── validation.ts              # Input validation
│   └── rateLimit.ts              # Rate limiting
├── prisma/
│   └── schema.prisma             # Database schema
└── types/
    └── booking.ts                # TypeScript types
```



