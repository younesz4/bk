# CMS + Checkout + Invoices Implementation Notes

## Analysis Summary

### Current State
- **Prisma Schema**: Has Product, Category, ProductImage, Booking models. Order and OrderItem exist but need updating to match new requirements.
- **Cart System**: CartContext.tsx exists and works with products from Prisma.
- **Checkout**: Basic checkout page exists at /app/checkout/page.tsx, uses placeOrder from lib/orders.ts
- **Mail System**: SendGrid configured in lib/mail.ts with booking confirmation emails
- **Admin Structure**: Partial admin structure exists at /app/admin with some pages and API routes
- **Boutique Pages**: /app/boutique/page.tsx already filters by isPublished=true

### What Needs to be Done

1. **Prisma Schema Updates**
   - Update Order model to match requirements (addressLine1, addressLine2, postalCode, country, paymentMethod enum, OrderStatus enum)
   - Update OrderItem to include unitPrice and subtotal fields
   - Add PaymentMethod and OrderStatus enums

2. **Admin Authentication**
   - Create lib/adminAuth.ts with session management
   - Create /app/api/admin/login and /app/api/admin/logout routes
   - Add middleware to protect /admin routes

3. **Admin UI**
   - Create admin layout with navigation
   - Create login page
   - Create dashboard with stats
   - Category management (CRUD)
   - Product management (CRUD with images)
   - Order management (view and update status)

4. **Checkout Flow Updates**
   - Add payment method selection (QUOTE_ONLY, CASH_ON_DELIVERY, BANK_TRANSFER)
   - Update /api/orders to handle new order structure
   - Update checkout page UI

5. **Invoice System**
   - Create lib/invoice.ts for HTML invoice generation
   - Extend lib/mail.ts with order confirmation emails
   - Send invoices via SendGrid after order creation

6. **Public Pages**
   - Ensure boutique pages only show published products (already done)
   - No changes to homepage, projects, etc.

## Implementation Plan

1. Update Prisma schema
2. Create admin auth system
3. Build admin UI shell
4. Implement category management
5. Implement product management
6. Update checkout flow
7. Add invoice generation
8. Add order emails
9. Build admin order management
10. Final testing





