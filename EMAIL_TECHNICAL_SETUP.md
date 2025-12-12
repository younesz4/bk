# Email Sending Setup (Technical) - BK Agencements

## Stack
- **Framework:** Next.js 14 (App Router)
- **Database:** Prisma + PostgreSQL/SQLite
- **Email Service:** Nodemailer (SMTP) or API (Resend, Brevo, Mailgun, SendGrid)

## Option 1: SMTP (Nodemailer) - Current Setup

### Configuration
Already configured in `lib/email.ts` and `lib/config.ts`

**Environment Variables:**
```env
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@example.com
SMTP_PASS=your-password
FROM_EMAIL=noreply@bk-agencements.com
ADMIN_NOTIFICATION_EMAIL=admin@bk-agencements.com
```

### SPF Record
Add to your domain's DNS:
```
TXT record: v=spf1 include:_spf.example.com ~all
```

### DKIM Record
Add to your domain's DNS:
```
TXT record: default._domainkey
Value: v=DKIM1; k=rsa; p=YOUR_PUBLIC_KEY
```

### DMARC Record
Add to your domain's DNS:
```
TXT record: _dmarc
Value: v=DMARC1; p=quarantine; rua=mailto:dmarc@bk-agencements.com
```

## Option 2: Resend (Recommended for Production)

### Installation
```bash
npm install resend
```

### Configuration
```typescript
// lib/email-resend.ts
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendEmailResend(options: {
  to: string
  subject: string
  html: string
  from?: string
}) {
  return await resend.emails.send({
    from: options.from || 'BK Agencements <noreply@bk-agencements.com>',
    to: options.to,
    subject: options.subject,
    html: options.html,
  })
}
```

**Environment Variables:**
```env
RESEND_API_KEY=re_xxxxxxxxxxxxx
```

### Domain Verification
1. Add domain in Resend dashboard
2. Add DNS records (SPF, DKIM, DMARC) provided by Resend
3. Verify domain

## Option 3: Brevo (formerly Sendinblue)

### Installation
```bash
npm install @getbrevo/brevo
```

### Configuration
```typescript
// lib/email-brevo.ts
import * as brevo from '@getbrevo/brevo'

const apiInstance = new brevo.TransactionalEmailsApi()
apiInstance.setApiKey(brevo.TransactionalEmailsApiApiKeys.apiKey, process.env.BREVO_API_KEY)

export async function sendEmailBrevo(options: {
  to: string
  subject: string
  html: string
}) {
  return await apiInstance.sendTransacEmail({
    sender: { email: 'noreply@bk-agencements.com', name: 'BK Agencements' },
    to: [{ email: options.to }],
    subject: options.subject,
    htmlContent: options.html,
  })
}
```

**Environment Variables:**
```env
BREVO_API_KEY=your-brevo-api-key
```

## Option 4: Mailgun

### Installation
```bash
npm install mailgun.js
```

### Configuration
```typescript
// lib/email-mailgun.ts
import formData from 'form-data'
import Mailgun from 'mailgun.js'

const mailgun = new Mailgun(formData)
const mg = mailgun.client({
  username: 'api',
  key: process.env.MAILGUN_API_KEY!,
})

export async function sendEmailMailgun(options: {
  to: string
  subject: string
  html: string
}) {
  return await mg.messages.create(process.env.MAILGUN_DOMAIN!, {
    from: 'BK Agencements <noreply@bk-agencements.com>',
    to: [options.to],
    subject: options.subject,
    html: options.html,
  })
}
```

**Environment Variables:**
```env
MAILGUN_API_KEY=your-mailgun-api-key
MAILGUN_DOMAIN=mg.bk-agencements.com
```

## Option 5: SendGrid

### Installation
```bash
npm install @sendgrid/mail
```

### Configuration
```typescript
// lib/email-sendgrid.ts
import sgMail from '@sendgrid/mail'

sgMail.setApiKey(process.env.SENDGRID_API_KEY!)

export async function sendEmailSendGrid(options: {
  to: string
  subject: string
  html: string
}) {
  return await sgMail.send({
    from: 'noreply@bk-agencements.com',
    to: options.to,
    subject: options.subject,
    html: options.html,
  })
}
```

**Environment Variables:**
```env
SENDGRID_API_KEY=SG.xxxxxxxxxxxxx
```

## DNS Records Setup

### SPF Record
```
Type: TXT
Name: @ (or domain name)
Value: v=spf1 include:_spf.resend.com ~all
      (or include:_spf.sendgrid.net ~all for SendGrid)
```

### DKIM Record
```
Type: TXT
Name: default._domainkey (or selector._domainkey)
Value: (Provided by your email service)
```

### DMARC Record
```
Type: TXT
Name: _dmarc
Value: v=DMARC1; p=quarantine; rua=mailto:dmarc@bk-agencements.com; ruf=mailto:dmarc@bk-agencements.com
```

## Webhooks for Delivery & Bounce Tracking

### Resend Webhooks
```typescript
// app/api/webhooks/resend/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

export async function POST(request: NextRequest) {
  const body = await request.json()
  
  // Handle webhook events
  if (body.type === 'email.delivered') {
    // Email delivered
    console.log('Email delivered:', body.data.email_id)
  } else if (body.type === 'email.bounced') {
    // Email bounced
    console.log('Email bounced:', body.data.email_id)
  } else if (body.type === 'email.complained') {
    // Email marked as spam
    console.log('Email complained:', body.data.email_id)
  }
  
  return NextResponse.json({ received: true })
}
```

### SendGrid Webhooks
```typescript
// app/api/webhooks/sendgrid/route.ts
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const events = await request.json()
  
  for (const event of events) {
    if (event.event === 'delivered') {
      // Email delivered
    } else if (event.event === 'bounce') {
      // Email bounced
    } else if (event.event === 'spamreport') {
      // Email marked as spam
    }
  }
  
  return NextResponse.json({ received: true })
}
```

## Domain Verification

### Steps:
1. **Add Domain:**
   - Log into your email service dashboard
   - Add your domain (bk-agencements.com)

2. **Add DNS Records:**
   - Copy the DNS records provided
   - Add them to your domain's DNS settings
   - Wait for verification (usually 24-48 hours)

3. **Verify Domain:**
   - Click "Verify" in the dashboard
   - Wait for confirmation

4. **Set as Default:**
   - Set verified domain as default sending domain

## Best Practices

1. **Use Dedicated IP (Optional):**
   - For high volume, consider dedicated IP
   - Improves deliverability

2. **Monitor Reputation:**
   - Check sender reputation regularly
   - Monitor bounce rates
   - Monitor spam complaints

3. **Warm-up IP:**
   - Gradually increase sending volume
   - Start with 50 emails/day, increase by 20% daily

4. **List Hygiene:**
   - Remove bounced emails
   - Honor unsubscribe requests immediately
   - Clean list regularly

5. **Authentication:**
   - Always use SPF, DKIM, DMARC
   - Verify domain before sending

## Testing

### Test Email Sending
```typescript
// app/api/test/email/route.ts
import { sendEmail } from '@/lib/email'

export async function POST(request: NextRequest) {
  const result = await sendEmail({
    to: 'test@example.com',
    subject: 'Test Email',
    html: '<h1>Test</h1>',
  })
  
  return NextResponse.json(result)
}
```

### Verify SMTP Connection
```typescript
import { verifyEmailConnection } from '@/lib/email'

// In your API route or script
const isConnected = await verifyEmailConnection()
console.log('SMTP connected:', isConnected)
```

## Recommended Setup for Production

**For BK Agencements:**
1. **Use Resend** (best for Next.js, easy setup, good deliverability)
2. **Or Brevo** (free tier: 300 emails/day, good for starting)
3. **Or SendGrid** (reliable, good for high volume)

**Steps:**
1. Sign up for chosen service
2. Add domain and verify DNS records
3. Get API key
4. Update `lib/email.ts` to use chosen service
5. Test sending
6. Set up webhooks for tracking




