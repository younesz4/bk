# Stripe Checkout Setup

## Environment Variables

Add these variables to your `.env.local` file:

```env
# Stripe keys
STRIPE_SECRET_KEY=sk_live_*****
STRIPE_WEBHOOK_SECRET=whsec_*****
NEXT_PUBLIC_STRIPE_PUBLIC_KEY=pk_live_*****

# App URL
NEXT_PUBLIC_BASE_URL=https://bk-agencements.com
```

**Note:** For development, use test keys:
- `sk_test_...` for STRIPE_SECRET_KEY
- `pk_test_...` for NEXT_PUBLIC_STRIPE_PUBLIC_KEY
- `whsec_...` for STRIPE_WEBHOOK_SECRET (get from Stripe Dashboard → Webhooks)

## Getting Your Stripe Keys

1. Go to [Stripe Dashboard](https://dashboard.stripe.com/)
2. Navigate to **Developers** → **API keys**
3. Copy your **Secret key** (starts with `sk_test_` for test mode)
4. Copy your **Publishable key** (starts with `pk_test_` for test mode)
5. Add them to your `.env.local` file

## Stripe Instance

The Stripe instance is initialized in `lib/stripe.ts`:

- ✅ Server-side only (uses secret key)
- ✅ API version: `2023-10-16`
- ✅ TypeScript support enabled
- ✅ Uses globalThis to prevent duplicate instances in dev mode (hot reload)
- ✅ Throws error if `STRIPE_SECRET_KEY` is not set

## Environment Validation

Environment variables are validated in `lib/env.ts`:

- ✅ Fails fast during module load if variables are missing
- ✅ Validates all required Stripe and app configuration variables
- ✅ Provides clear error messages for missing variables

## Usage

```typescript
import { stripe } from '@/lib/stripe'

// Server-side only - use in API routes
const session = await stripe.checkout.sessions.create({
  // ... session config
})
```

## Important Notes

- **Never** import `stripe` from `lib/stripe.ts` in client components
- Use API routes for all Stripe operations
- For client-side, use `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` directly with Stripe.js

