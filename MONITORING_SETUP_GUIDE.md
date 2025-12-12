# Monitoring Setup Guide - BK Agencements

## Quick Start

### 1. Vercel Analytics
**Status:** ✅ Already configured
- Automatically enabled when deployed to Vercel
- No configuration needed
- View dashboard at: https://vercel.com/dashboard

### 2. Sentry Setup

1. **Create Sentry Account:**
   - Go to https://sentry.io
   - Create account and project
   - Select "Next.js" as platform

2. **Get DSN:**
   - Copy DSN from project settings
   - Add to environment variables:
     ```env
     NEXT_PUBLIC_SENTRY_DSN=your_dsn_here
     SENTRY_DSN=your_dsn_here
     ```

3. **Configure Alerts:**
   - Go to Alerts → Create Alert Rule
   - Set up alerts for:
     - Critical errors
     - Error rate spikes
     - Performance degradation

### 3. Hotjar Setup

1. **Create Hotjar Account:**
   - Go to https://www.hotjar.com
   - Sign up for free plan
   - Create site

2. **Get Site ID:**
   - Copy Site ID from Hotjar dashboard
   - Add to environment variables:
     ```env
     NEXT_PUBLIC_HOTJAR_ID=your_site_id
     ```

3. **Configure:**
   - Set up heatmaps
   - Enable session recordings
   - Configure funnels

### 4. Meta Pixel Setup

1. **Create Meta Pixel:**
   - Go to Facebook Events Manager
   - Create new pixel
   - Copy Pixel ID

2. **Add to Environment:**
   ```env
   NEXT_PUBLIC_META_PIXEL_ID=your_pixel_id
   ```

3. **Test Events:**
   - Use Facebook Pixel Helper browser extension
   - Test events on your site

### 5. Google Ads Setup

1. **Create Google Ads Account:**
   - Go to Google Ads
   - Set up conversion tracking
   - Get Measurement ID (G-XXXXXXXXXX)

2. **Add to Environment:**
   ```env
   NEXT_PUBLIC_GOOGLE_ADS_ID=G-XXXXXXXXXX
   ```

3. **Set Up Conversions:**
   - Purchase
   - Add to cart
   - Form submission

### 6. Uptime Monitoring (UptimeRobot)

1. **Sign Up:**
   - Go to https://uptimerobot.com
   - Create free account (50 monitors)

2. **Add Monitors:**
   - **Homepage:** `https://bk-agencements.com` (HTTP(S), 5 min)
   - **API Health:** `https://bk-agencements.com/api/health` (HTTP(S), 5 min)
   - **Checkout:** `https://bk-agencements.com/api/checkout/stripe` (HTTP(S), 15 min)

3. **Configure Alerts:**
   - Email alerts
   - SMS alerts (optional, paid)
   - Slack webhook (optional)

### 7. Real-Time Dashboard

**Option 1: Use Existing Dashboards**
- Vercel Analytics Dashboard
- Sentry Dashboard
- Hotjar Dashboard
- Google Analytics Dashboard

**Option 2: Custom Dashboard (Advanced)**
- Use Datadog, New Relic, or Grafana
- Connect to your metrics
- Create custom dashboards

## Event Tracking Examples

### Product View
```typescript
import { trackProductView } from '@/lib/tracking'

trackProductView(productId, productName, price, 'EUR')
```

### Add to Cart
```typescript
import { trackAddToCart } from '@/lib/tracking'

trackAddToCart(productId, productName, price, quantity, 'EUR')
```

### Checkout Start
```typescript
import { trackInitiateCheckout } from '@/lib/tracking'

trackInitiateCheckout(items, total, 'EUR')
```

### Purchase Complete
```typescript
import { trackPurchase } from '@/lib/tracking'

trackPurchase(orderId, items, total, 'EUR')
```

### Form Submission
```typescript
import { trackFormSubmission } from '@/lib/tracking'

trackFormSubmission('Contact Form', 'contact-form-1')
```

## Logging Examples

### Server-Side
```typescript
import { logger } from '@/lib/logger'

logger.info('Order created', { orderId: '123' })
logger.error('Payment failed', error, { orderId: '123' })
logger.critical('Database connection lost', error)
```

### Client-Side
```typescript
import { clientLogger } from '@/lib/logger'

clientLogger.error('Cart update failed', error, { productId: '123' })
```

## Performance Monitoring

### Track API Response
```typescript
import { trackAPIResponse } from '@/lib/performance-monitor'

const startTime = Date.now()
// ... API logic ...
const duration = Date.now() - startTime
trackAPIResponse('/api/orders', 'POST', duration, 200)
```

### Track Database Query
```typescript
import { trackDatabaseQuery } from '@/lib/performance-monitor'

const startTime = Date.now()
const orders = await prisma.order.findMany()
const duration = Date.now() - startTime
trackDatabaseQuery('findMany', 'Order', duration)
```

## Troubleshooting

### Analytics Not Loading
- Check cookie consent (must accept analytics)
- Check browser console for errors
- Verify environment variables are set

### Sentry Not Capturing Errors
- Verify DSN is set correctly
- Check Sentry dashboard for project status
- Ensure errors are not in ignore list

### Conversion Tracking Not Working
- Check marketing consent is given
- Verify pixel IDs are correct
- Use browser extensions to test:
  - Facebook Pixel Helper
  - Google Tag Assistant

## Best Practices

1. **Respect User Privacy:**
   - Always check consent before tracking
   - Don't track on admin pages
   - Anonymize sensitive data

2. **Monitor Performance:**
   - Set up alerts for slow queries
   - Monitor error rates
   - Track conversion funnels

3. **Regular Reviews:**
   - Weekly: Check error rates
   - Monthly: Review performance metrics
   - Quarterly: Audit tracking implementation

4. **Data Retention:**
   - Review data retention policies
   - Comply with GDPR
   - Clean up old logs regularly

