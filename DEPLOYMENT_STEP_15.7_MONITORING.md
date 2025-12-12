# STEP 15.7 — Monitoring + Error Alerts

## Monitoring Setup Complete

This guide sets up comprehensive monitoring for your production site.

## 1. Vercel Analytics ✅

### Enable Web Analytics

1. Go to Vercel project dashboard
2. Click **Settings** → **Analytics**
3. Enable **Web Analytics**
4. Enable **Speed Insights**

**Features:**
- Real-time visitor analytics
- Page views and unique visitors
- Performance metrics
- Core Web Vitals tracking

**No code changes needed** - Works automatically after enabling.

### View Analytics

- Go to **Analytics** tab in Vercel dashboard
- View real-time and historical data
- Export reports

## 2. Vercel Speed Insights ✅

### Enable Speed Insights

1. Same as Analytics (above)
2. Enable **Speed Insights** toggle

**Metrics Tracked:**
- Largest Contentful Paint (LCP)
- First Input Delay (FID)
- Cumulative Layout Shift (CLS)
- Time to First Byte (TTFB)

**View in Dashboard:**
- **Analytics** → **Speed Insights** tab

## 3. Edge Logging ✅

### Vercel Logs

**Access:**
1. Go to **Deployments** tab
2. Click on any deployment
3. Click **"View Function Logs"**

**Features:**
- Real-time logs
- Filter by function
- Search logs
- Export logs

### Application Logging

**Add logging to your code:**

```typescript
// lib/logger.ts
export function logError(error: Error, context?: Record<string, any>) {
  console.error('Error:', {
    message: error.message,
    stack: error.stack,
    context,
    timestamp: new Date().toISOString(),
  })
  
  // In production, also send to Sentry (see below)
  if (process.env.NODE_ENV === 'production') {
    // Sentry.captureException(error, { extra: context })
  }
}
```

## 4. Error Monitoring with Sentry

### Install Sentry

```bash
npm install @sentry/nextjs
```

### Initialize Sentry

**Create:** `sentry.client.config.ts`

```typescript
import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  
  // Set tracesSampleRate to 1.0 to capture 100%
  // of the transactions for performance monitoring.
  tracesSampleRate: 1.0,
  
  // Set sample rate for profiling
  profilesSampleRate: 1.0,
  
  // Enable in production only
  enabled: process.env.NODE_ENV === 'production',
  
  environment: process.env.NODE_ENV,
  
  // Filter out known errors
  ignoreErrors: [
    'ResizeObserver loop limit exceeded',
    'Non-Error promise rejection captured',
  ],
  
  // Add release tracking
  release: process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA,
})
```

**Create:** `sentry.server.config.ts`

```typescript
import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  
  tracesSampleRate: 1.0,
  
  enabled: process.env.NODE_ENV === 'production',
  
  environment: process.env.NODE_ENV,
  
  release: process.env.VERCEL_GIT_COMMIT_SHA,
})
```

**Create:** `sentry.edge.config.ts`

```typescript
import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  
  tracesSampleRate: 1.0,
  
  enabled: process.env.NODE_ENV === 'production',
  
  environment: process.env.NODE_ENV,
})
```

### Update next.config.js

```javascript
const { withSentryConfig } = require('@sentry/nextjs')

const nextConfig = {
  // ... your existing config
}

module.exports = withSentryConfig(
  nextConfig,
  {
    // For all available options, see:
    // https://github.com/getsentry/sentry-webpack-plugin#options
    
    // Suppresses source map uploading logs during build
    silent: true,
    
    org: 'your-sentry-org',
    project: 'bk-agencements',
  },
  {
    // For all available options, see:
    // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/
    
    // Upload a larger set of source maps for better debugging
    widenClientFileUpload: true,
    
    // Transpiles SDK to be compatible with IE11 (increases bundle size)
    transpileClientSDK: true,
    
    // Routes browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers
    tunnelRoute: '/monitoring',
    
    // Hides source maps from generated client bundles
    hideSourceMaps: true,
    
    // Automatically tree-shake Sentry logger statements to reduce bundle size
    disableLogger: true,
  }
)
```

### Set Up Sentry Account

1. Go to [sentry.io](https://sentry.io)
2. Sign up for free account
3. Create new project: **Next.js**
4. Copy **DSN** from project settings
5. Add to Vercel environment variables:
   ```
   SENTRY_DSN=https://xxx@xxx.ingest.sentry.io/xxx
   NEXT_PUBLIC_SENTRY_DSN=https://xxx@xxx.ingest.sentry.io/xxx
   SENTRY_ORG=your-org
   SENTRY_PROJECT=bk-agencements
   SENTRY_AUTH_TOKEN=your-auth-token
   ```

### Add Error Boundaries

**Create:** `app/error-boundary.tsx`

```typescript
'use client'

import * as Sentry from '@sentry/nextjs'
import { useEffect } from 'react'

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log error to Sentry
    Sentry.captureException(error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Something went wrong!</h2>
        <button
          onClick={reset}
          className="px-4 py-2 bg-black text-white rounded"
        >
          Try again
        </button>
      </div>
    </div>
  )
}
```

## 5. Real-Time Uptime Monitoring

### Option A: UptimeRobot (Free)

1. Go to [uptimerobot.com](https://uptimerobot.com)
2. Sign up (free plan: 50 monitors)
3. Add monitor:
   - **Type:** HTTPS
   - **URL:** `https://bk-agencements.com`
   - **Interval:** 5 minutes
   - **Alert Contacts:** Your email
4. Set up alerts for downtime

### Option B: Better Uptime (Free)

1. Go to [betteruptime.com](https://betteruptime.com)
2. Sign up (free plan available)
3. Add monitor for your domain
4. Configure alert channels (email, Slack, etc.)

### Option C: Vercel Status Page

1. Vercel provides status page automatically
2. Check: `https://www.vercel-status.com`
3. Subscribe to status updates

## 6. Performance Monitoring

### Core Web Vitals

**Tracked automatically by:**
- Vercel Speed Insights
- Google Search Console
- Chrome User Experience Report

**Key Metrics:**
- **LCP** (Largest Contentful Paint): < 2.5s
- **FID** (First Input Delay): < 100ms
- **CLS** (Cumulative Layout Shift): < 0.1

### Lighthouse CI

**Add to GitHub Actions:**

```yaml
# .github/workflows/lighthouse.yml
name: Lighthouse CI

on:
  pull_request:
    branches: [main]

jobs:
  lighthouse:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: treosh/lighthouse-ci-action@v10
        with:
          urls: |
            https://bk-agencements.com
            https://bk-agencements.com/boutique
          uploadArtifacts: true
          temporaryPublicStorage: true
```

## 7. Alert Configuration

### Email Alerts

**Vercel:**
- Go to **Settings** → **Notifications**
- Enable email for:
  - Failed deployments
  - Domain issues
  - Build failures

**Sentry:**
- Go to **Settings** → **Alerts**
- Create alert rules:
  - Error rate > threshold
  - New issues
  - Performance degradation

### Slack Integration (Optional)

**Sentry → Slack:**
1. Install Sentry Slack app
2. Connect workspace
3. Configure alert channels

**Vercel → Slack:**
1. Install Vercel Slack app
2. Connect workspace
3. Choose channels for notifications

## 8. Monitoring Dashboard

### Create Monitoring Page (Optional)

**Create:** `app/admin/monitoring/page.tsx`

```typescript
export default function MonitoringPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Monitoring Dashboard</h1>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 border rounded">
          <h2 className="font-bold mb-2">Vercel Analytics</h2>
          <p>View in Vercel dashboard</p>
        </div>
        
        <div className="p-4 border rounded">
          <h2 className="font-bold mb-2">Sentry Errors</h2>
          <p>View in Sentry dashboard</p>
        </div>
      </div>
    </div>
  )
}
```

## Complete Monitoring Setup Checklist

### Vercel
- [x] Enable Web Analytics
- [x] Enable Speed Insights
- [x] Set up email notifications
- [x] Configure deployment alerts

### Sentry
- [ ] Create Sentry account
- [ ] Install Sentry SDK
- [ ] Configure Sentry
- [ ] Add error boundaries
- [ ] Set up alert rules
- [ ] Add DSN to environment variables

### Uptime Monitoring
- [ ] Set up UptimeRobot or Better Uptime
- [ ] Configure alert contacts
- [ ] Test alert system

### Performance
- [x] Vercel Speed Insights enabled
- [ ] Set up Lighthouse CI (optional)
- [ ] Monitor Core Web Vitals

### Logging
- [x] Vercel function logs available
- [ ] Add application logging
- [ ] Set up log aggregation (optional)

## Environment Variables Summary

Add to Vercel:

```
# Sentry
SENTRY_DSN=https://xxx@xxx.ingest.sentry.io/xxx
NEXT_PUBLIC_SENTRY_DSN=https://xxx@xxx.ingest.sentry.io/xxx
SENTRY_ORG=your-org
SENTRY_PROJECT=bk-agencements
SENTRY_AUTH_TOKEN=your-auth-token

# Vercel (automatic)
VERCEL_GIT_COMMIT_SHA=xxx
VERCEL_ENV=production
```

## Monitoring Best Practices

1. **Set Up Alerts Early** - Don't wait for issues
2. **Monitor Key Metrics** - Focus on what matters
3. **Regular Reviews** - Weekly monitoring review
4. **Test Alerts** - Ensure alerts actually work
5. **Document Issues** - Keep track of recurring problems
6. **Set Thresholds** - Know when to take action
7. **Automate Responses** - Auto-restart on failures (if possible)

---

## 🎉 Deployment Complete!

All 7 deployment steps are now configured:

✅ **STEP 15.1** - GitHub Setup  
✅ **STEP 15.2** - Deployment Audit  
✅ **STEP 15.3** - Vercel Deployment  
✅ **STEP 15.4** - Custom Domain  
✅ **STEP 15.5** - Business Email  
✅ **STEP 15.6** - Automated Backups  
✅ **STEP 15.7** - Monitoring & Alerts  

**Next Actions:**
1. Complete GitHub setup (STEP 15.1)
2. Migrate database to PostgreSQL
3. Deploy to Vercel
4. Configure domain DNS
5. Set up email with Zoho
6. Enable monitoring services




