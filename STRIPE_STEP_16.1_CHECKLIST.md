# STEP 16.1 — Stripe Account Setup Checklist

## ✅ Stripe Account Setup for Morocco

### 1. Create Stripe Account
- [ ] Go to [stripe.com](https://stripe.com)
- [ ] Click "Sign up" or "Start now"
- [ ] Enter business email
- [ ] Create password
- [ ] Verify email address

### 2. Complete Business Information
- [ ] Business name: **BK Agencements**
- [ ] Business type: **Company** (or appropriate type)
- [ ] Country: **Morocco**
- [ ] Business address in Morocco
- [ ] Tax ID (if applicable)
- [ ] Phone number
- [ ] Website: `https://bk-agencements.com`

### 3. Enable Test Mode
- [ ] Toggle **Test mode** ON (for development)
- [ ] Note: Test mode uses test API keys (starts with `sk_test_` and `pk_test_`)
- [ ] Test mode allows testing without real charges

### 4. Collect API Keys
- [ ] Go to **Developers** → **API keys**
- [ ] Copy **Publishable key** (starts with `pk_test_` for test mode)
- [ ] Copy **Secret key** (starts with `sk_test_` for test mode)
- [ ] **Important:** Never commit secret keys to Git
- [ ] Store keys securely (use environment variables)

### 5. Activate Payment Methods for Morocco

#### Credit/Debit Cards ✅
- [ ] Cards are automatically enabled for Morocco
- [ ] Supports: Visa, Mastercard, American Express
- [ ] No additional setup needed

#### Apple Pay
- [ ] Check availability: [Stripe Payment Methods by Country](https://stripe.com/docs/payments/payment-methods)
- [ ] **Note:** Apple Pay availability in Morocco may be limited
- [ ] If available, enable in Stripe dashboard:
  - [ ] Go to **Settings** → **Payment methods**
  - [ ] Enable **Apple Pay**
  - [ ] Complete domain verification if required

#### Google Pay
- [ ] Check availability for Morocco
- [ ] If available, enable in Stripe dashboard
- [ ] Complete setup if required

#### Alternative Payment Methods (Optional)
- [ ] **Cash on Delivery (COD)** - Will be handled separately (not via Stripe)
- [ ] **Bank Transfer** - Can be added as manual payment method

### 6. Configure Webhooks (For Later - STEP 16.8)
- [ ] Go to **Developers** → **Webhooks**
- [ ] Click **Add endpoint**
- [ ] Endpoint URL: `https://bk-agencements.com/api/webhooks/stripe`
- [ ] Select events to listen for:
  - [ ] `payment_intent.succeeded`
  - [ ] `payment_intent.payment_failed`
  - [ ] `checkout.session.completed`
- [ ] Copy **Webhook signing secret** (starts with `whsec_`)
- [ ] Store webhook secret in environment variables

### 7. Activate Live Mode (After Testing)
- [ ] Complete business verification
- [ ] Submit required documents (if needed)
- [ ] Wait for account activation
- [ ] Switch to **Live mode**
- [ ] Get **Live API keys** (starts with `sk_live_` and `pk_live_`)
- [ ] Update environment variables with live keys

### 8. Set Up Business Profile
- [ ] Upload business logo
- [ ] Set business description
- [ ] Configure customer support email
- [ ] Set up business hours (if applicable)

### 9. Configure Tax Settings (Morocco)
- [ ] Go to **Settings** → **Tax**
- [ ] Enable tax calculation if needed
- [ ] Configure Morocco tax rates (VAT/TVA if applicable)
- [ ] Set up tax registration number if required

### 10. Test Payment Flow
- [ ] Use Stripe test cards:
  - **Success:** `4242 4242 4242 4242`
  - **Decline:** `4000 0000 0000 0002`
  - **3D Secure:** `4000 0025 0000 3155`
- [ ] Test expiration: Any future date (e.g., `12/34`)
- [ ] Test CVC: Any 3 digits (e.g., `123`)
- [ ] Test ZIP: Any 5 digits (e.g., `12345`)

## Environment Variables to Add

After completing setup, add these to your `.env` file:

```env
# Stripe Test Keys (Development)
STRIPE_SECRET_KEY=sk_test_xxxxxxxxxxxxx
NEXT_PUBLIC_STRIPE_PUBLIC_KEY=pk_test_xxxxxxxxxxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx

# Stripe Live Keys (Production - add later)
# STRIPE_SECRET_KEY=sk_live_xxxxxxxxxxxxx
# NEXT_PUBLIC_STRIPE_PUBLIC_KEY=pk_live_xxxxxxxxxxxxx
# STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx
```

## Important Notes

1. **Test Mode vs Live Mode:**
   - Use **Test mode** during development
   - Switch to **Live mode** only after thorough testing
   - Never use live keys in development

2. **Security:**
   - Never commit API keys to Git
   - Use environment variables
   - Rotate keys if compromised
   - Use webhook signature verification

3. **Morocco-Specific:**
   - Cards work automatically
   - Apple Pay/Google Pay may have limited availability
   - Consider Cash on Delivery as alternative (STEP 16.4)

4. **Compliance:**
   - Ensure compliance with Morocco payment regulations
   - Display terms and conditions
   - Handle refunds according to local laws

## Next Steps

After completing this checklist:
- ✅ **STEP 16.2** - Stripe + Next.js Configuration
- ✅ **STEP 16.3** - Checkout API Route
- ✅ **STEP 16.4** - Cash on Delivery Option
- ✅ **STEP 16.5** - Prisma Order Model Updates
- ✅ **STEP 16.6** - Admin Order Dashboard
- ✅ **STEP 16.7** - Email Notifications
- ✅ **STEP 16.8** - Stripe Webhooks

---

**Status:** Checklist ready - Complete account setup before proceeding




