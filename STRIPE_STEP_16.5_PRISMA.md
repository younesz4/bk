# STEP 16.5 — Prisma Order Model Updates

## ✅ Order Model Enhanced

The Order model has been updated to support:
- ✅ Stripe paid orders
- ✅ Cash on Delivery (COD) orders
- ✅ Bank transfer (optional)
- ✅ Complete order tracking

## Updated Schema

```prisma
model Order {
  id              String      @id @default(cuid())
  createdAt       DateTime    @default(now())
  updatedAt       DateTime    @updatedAt
  customerName    String
  email           String
  phone           String
  address         String
  city            String
  country         String
  notes           String?
  totalPrice      Int         // Price in cents
  status          String      @default("pending_payment")
  paymentMethod   String?     // stripe, cod, bank_transfer
  stripeSessionId String?     @unique
  stripePaymentId String?     // Payment Intent ID
  items           OrderItem[]

  @@index([email])
  @@index([createdAt])
  @@index([status])
  @@index([paymentMethod])
  @@index([stripeSessionId])
}
```

## Order Status Values

- `pending_payment` - Order created, awaiting Stripe payment
- `pending_cod` - Cash on Delivery order, awaiting payment on delivery
- `paid` - Payment completed (Stripe or COD confirmed)
- `cancelled` - Order cancelled
- `refunded` - Order refunded

## Payment Method Values

- `stripe` - Paid via Stripe
- `cod` - Cash on Delivery
- `bank_transfer` - Bank transfer (manual)

## Migration Steps

### 1. Create Migration

```bash
npx prisma migrate dev --name add_payment_fields
```

This will:
- Add `paymentMethod` field
- Add `stripeSessionId` field
- Add `stripePaymentId` field
- Update `status` default value
- Add indexes for performance

### 2. For Existing Orders

If you have existing orders, you may want to update them:

```typescript
// scripts/migrate-existing-orders.ts
import { prisma } from '@/lib/prisma'

async function migrateOrders() {
  // Update existing orders without paymentMethod
  await prisma.order.updateMany({
    where: {
      paymentMethod: null,
    },
    data: {
      paymentMethod: 'cod', // or 'stripe' if they were paid
      status: 'paid', // or appropriate status
    },
  })
  
  console.log('Orders migrated successfully')
}

migrateOrders()
```

### 3. Generate Prisma Client

```bash
npx prisma generate
```

## Seed Example

```typescript
// prisma/seed.ts (add to existing seed)
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function seedOrders() {
  // Example Stripe order
  const stripeOrder = await prisma.order.create({
    data: {
      customerName: 'Ahmed Benali',
      email: 'ahmed@example.com',
      phone: '+212612345678',
      address: '123 Rue Mohammed V',
      city: 'Casablanca',
      country: 'Morocco',
      totalPrice: 50000, // 500.00 MAD
      status: 'paid',
      paymentMethod: 'stripe',
      stripeSessionId: 'cs_test_xxxxx',
      items: {
        create: [
          {
            productId: 'product-id-1',
            quantity: 1,
            price: 50000,
          },
        ],
      },
    },
  })

  // Example COD order
  const codOrder = await prisma.order.create({
    data: {
      customerName: 'Fatima Alami',
      email: 'fatima@example.com',
      phone: '+212612345679',
      address: '456 Avenue Hassan II',
      city: 'Rabat',
      country: 'Morocco',
      totalPrice: 75000, // 750.00 MAD
      status: 'pending_cod',
      paymentMethod: 'cod',
      items: {
        create: [
          {
            productId: 'product-id-2',
            quantity: 2,
            price: 37500,
          },
        ],
      },
    },
  })

  console.log('Orders seeded:', { stripeOrder: stripeOrder.id, codOrder: codOrder.id })
}
```

## Safe Database Updates

### Adding Fields (Non-Breaking)

The migration adds optional fields (`paymentMethod`, `stripeSessionId`, `stripePaymentId`), so:
- ✅ Existing code continues to work
- ✅ No data loss
- ✅ Backward compatible

### Status Field Update

The default status changed from `"New"` to `"pending_payment"`. Existing orders keep their current status.

### Indexes Added

New indexes improve query performance:
- `status` - Fast filtering by order status
- `paymentMethod` - Fast filtering by payment method
- `stripeSessionId` - Fast lookup for webhook processing

## TypeScript Types

After migration, Prisma will generate updated types:

```typescript
type Order = {
  id: string
  createdAt: Date
  updatedAt: Date
  customerName: string
  email: string
  phone: string
  address: string
  city: string
  country: string
  notes: string | null
  totalPrice: number
  status: string
  paymentMethod: string | null
  stripeSessionId: string | null
  stripePaymentId: string | null
  items: OrderItem[]
}
```

## Next Steps

After migration:
- ✅ **STEP 16.6** - Admin Order Dashboard
- ✅ **STEP 16.7** - Email Notifications
- ✅ **STEP 16.8** - Stripe Webhooks

---

**Status:** Prisma schema updated - Run migration to apply changes




