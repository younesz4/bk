# Invoice System Setup Guide

## Quick Start

### 1. Database Migration

Add the Invoice model to your Prisma schema:

```bash
# Copy the Invoice model from prisma/schema-invoice-additions.prisma
# Add it to your prisma/schema.prisma file
# Also add the relation to Order model: invoice Invoice?
```

Then run migration:

```bash
npx prisma migrate dev --name add_invoice_model
npx prisma generate
```

### 2. Create Invoices Directory

```bash
mkdir -p public/invoices
```

### 3. Environment Variables

Ensure these are set in `.env`:

```env
ADMIN_NOTIFICATION_EMAIL=admin@bk-agencements.com
FROM_EMAIL=noreply@bk-agencements.com
SMTP_HOST=your-smtp-host
SMTP_PORT=587
SMTP_USER=your-smtp-user
SMTP_PASS=your-smtp-password
```

### 4. Test Invoice Generation

Create a test order and verify:
- Invoice is created in database
- PDF is generated in `public/invoices/`
- Emails are sent to customer and admin

## Invoice Number Format

Format: `BK-YYYY-XXXXXX`

Examples:
- First invoice of 2024: `BK-2024-000001`
- Second invoice: `BK-2024-000002`
- First invoice of 2025: `BK-2025-000001` (sequence resets)

## API Usage

### Get Invoice Details
```bash
GET /api/admin/invoices/{invoiceId}
Authorization: Bearer {admin_token}
```

### Regenerate PDF
```bash
POST /api/admin/invoices/{invoiceId}
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "action": "regenerate_pdf"
}
```

### Resend Email
```bash
POST /api/admin/invoices/{invoiceId}
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "action": "resend_email"
}
```

### Download PDF
```bash
GET /api/admin/invoices/{invoiceId}/download
Authorization: Bearer {admin_token}
```

## Automatic Invoice Generation

Invoices are automatically generated when:
1. COD order is created (`/api/checkout-cod`)
2. Stripe payment is confirmed (webhook)

## Manual Invoice Creation

```typescript
import { createInvoiceWithPDF } from '@/lib/invoice'

const invoice = await createInvoiceWithPDF(orderId)
```

## PDF Features

- A4 format
- Logo at top (from `public/logo-1.png`)
- Company details
- Customer information
- Items table with alternate row colors
- Totals: Subtotal, Tax (20%), Shipping, Grand Total
- Payment method
- Professional footer

## Email Features

- Customer receives invoice PDF via email
- Admin receives notification with PDF
- Elegant HTML templates
- Automatic sending on invoice creation

## Troubleshooting

### PDF not generating
- Check `public/invoices/` directory exists
- Verify logo file exists at `public/logo-1.png`
- Check file permissions

### Emails not sending
- Verify SMTP configuration
- Check `ADMIN_NOTIFICATION_EMAIL` is set
- Check email service logs

### Invoice number not incrementing
- Check database for existing invoices
- Verify invoice number format in database
- Check year matches current year




