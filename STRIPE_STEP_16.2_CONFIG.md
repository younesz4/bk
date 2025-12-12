# STEP 16.2 — Stripe + Next.js Configuration

## ✅ Configuration Complete

### 1. NPM Install Command

Stripe is already installed in your project. If you need to reinstall:

```bash
npm install stripe
```

**Current version:** `stripe@^20.0.0` ✅

### 2. Stripe Helper File

**File:** `lib/stripe.ts` ✅ (Already exists and updated)

The file includes:
- ✅ TypeScript-safe initialization
- ✅ Server-side only (uses secret key)
- ✅ Global instance (prevents duplicates in dev)
- ✅ Environment variable validation
- ✅ Latest API version

### 3. Environment Variables

**Update your `.env` file:**

```env
# Stripe Keys (Test Mode for Development)
STRIPE_SECRET_KEY=sk_test_xxxxxxxxxxxxx
NEXT_PUBLIC_STRIPE_PUBLIC_KEY=pk_test_xxxxxxxxxxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx

# Stripe Keys (Live Mode for Production)
# Uncomment and use these in production:
# STRIPE_SECRET_KEY=sk_live_xxxxxxxxxxxxx
# NEXT_PUBLIC_STRIPE_PUBLIC_KEY=pk_live_xxxxxxxxxxxxx
# STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx
```

**Also update `env.template`:**

The template already includes Stripe keys placeholders.

### 4. TypeScript Types

Stripe package includes TypeScript types automatically. No additional `@types/stripe` needed.

### 5. Client-Side Stripe (Optional)

If you need Stripe.js on the client side (for elements, payment forms):

```bash
npm install @stripe/stripe-js
```

**Usage example:**
```typescript
// lib/stripe-client.ts
import { loadStripe } from '@stripe/stripe-js'

export const getStripe = () => {
  const stripeKey = process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY
  
  if (!stripeKey) {
    throw new Error('NEXT_PUBLIC_STRIPE_PUBLIC_KEY is not set')
  }
  
  return loadStripe(stripeKey)
}
```

**Note:** For Checkout Sessions (recommended), you don't need client-side Stripe.js.

## Verification

### Test Stripe Connection

Create a test file: `scripts/test-stripe.ts`

```typescript
import { stripe } from '@/lib/stripe'

async function testStripe() {
  try {
    const account = await stripe.account.retrieve()
    console.log('✅ Stripe connected:', account.id)
    console.log('Country:', account.country)
    console.log('Mode:', account.livemode ? 'LIVE' : 'TEST')
  } catch (error) {
    console.error('❌ Stripe connection failed:', error)
  }
}

testStripe()
```

Run: `tsx scripts/test-stripe.ts`

## Next Steps

- ✅ **STEP 16.3** - Checkout API Route
- ✅ **STEP 16.4** - Cash on Delivery Option
- ✅ **STEP 16.5** - Prisma Order Model Updates

---

**Status:** Stripe configuration complete ✅




