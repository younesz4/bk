# MEGA PROMPT IMPLEMENTATION GUIDE

This document contains all the code changes needed to implement the 4 improvements requested.

## 1. CHECKOUT UI (COD ONLY) - Premium Luxury Design

### File: `app/checkout/page.tsx`
Replace entire file with COD-only checkout (see code below).

### File: `app/order-success/page.tsx` (NEW)
Create new order success page that redirects from `/order-success?orderId=...`

### File: `app/api/orders/route.ts`
Already updated to accept optional email and COD payment method.

### File: `lib/orders.ts`
Already updated to support COD payment method.

---

## 2. ADMIN PANEL IMPROVEMENTS

### File: `app/admin/orders/page.tsx`
Add filters, search, pagination, and status dropdown.

### File: `app/admin/orders/[id]/page.tsx`
Already exists, but ensure it has invoice download button (already present).

---

## 3. EMAIL SYSTEM - Nodemailer + Gmail SMTP

### File: `lib/email.ts` (NEW)
Create new email system using Nodemailer instead of SendGrid.

### File: `lib/email/templates.ts` (NEW)
Create email templates for customer and admin.

### File: `app/api/orders/route.ts`
Update to use new email system.

---

## 4. PDF INVOICE - Luxury Style

### File: `lib/pdf/invoice.ts` (NEW)
Create luxury PDF invoice generator using pdfkit (already installed).

### File: `app/api/orders/[id]/invoice/route.ts`
Update to use new luxury invoice generator.

---

## ENV VARIABLES NEEDED

Add to `.env.local`:
```
# Gmail SMTP (no API key needed)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
FROM_EMAIL=your-email@gmail.com
ADMIN_EMAIL=admin@example.com
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**Note:** For Gmail, you need to:
1. Enable 2-factor authentication
2. Generate an "App Password" (not your regular password)
3. Use that app password as SMTP_PASS

---

## IMPLEMENTATION ORDER

1. Update checkout page (COD only)
2. Create order-success page
3. Update admin orders page (filters, search, pagination)
4. Create email system (Nodemailer)
5. Create PDF invoice generator
6. Update API routes to use new systems

---

See individual code blocks below for each file.

