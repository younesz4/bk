# Privacy-Safe Analytics Setup

## Overview

This project uses **Umami** for privacy-first, GDPR-compliant analytics that doesn't require cookies.

## Why Umami?

- ✅ **No cookies required** - GDPR compliant by default
- ✅ **Privacy-first** - No personal data collection
- ✅ **Self-hostable** - Full control over your data
- ✅ **Lightweight** - Minimal performance impact
- ✅ **Open source** - Transparent and auditable

## Alternative Options

### Plausible
- Similar to Umami
- Privacy-first, no cookies
- Paid service (or self-hosted)
- **Integration**: Similar to Umami

### Matomo (Self-hosted)
- Full-featured analytics
- Complete data ownership
- Requires server setup
- **Integration**: More complex, requires cookies for some features

## Setup Instructions

### 1. Get Umami Website ID

1. Sign up for Umami Cloud (https://umami.is) OR
2. Self-host Umami (https://github.com/umami-software/umami)

3. Create a website in your Umami dashboard
4. Copy your Website ID

### 2. Configure Environment Variables

Add to your `.env.local`:

```env
NEXT_PUBLIC_UMAMI_WEBSITE_ID=your-website-id-here
NEXT_PUBLIC_UMAMI_SCRIPT_URL=https://analytics.umami.is/script.js
```

**Note**: If self-hosting, update `NEXT_PUBLIC_UMAMI_SCRIPT_URL` to your Umami instance URL.

### 3. Verify Integration

1. Accept analytics cookies in the cookie banner
2. Visit your site
3. Check Umami dashboard for page views

## How It Works

1. **Cookie Consent**: User must accept analytics cookies
2. **Script Loading**: Umami script only loads if consent is given
3. **Tracking**: Page views and events tracked automatically
4. **Privacy**: No cookies, no personal data, GDPR compliant

## Custom Events

Track custom events (e.g., button clicks, form submissions):

```tsx
import { trackEvent } from '@/lib/analytics'

// Track a button click
trackEvent('button-click', { button: 'contact-form-submit' })

// Track a purchase
trackEvent('purchase', { value: 100, currency: 'EUR' })
```

## Testing

### Development
- Analytics only loads if consent is given
- Check browser console for Umami script loading
- Verify in Umami dashboard

### Production
- Ensure environment variables are set
- Test cookie consent flow
- Verify tracking in Umami dashboard

## Privacy Compliance

✅ **GDPR Compliant**: No cookies, no personal data  
✅ **User Consent**: Only tracks if user accepts  
✅ **Transparent**: Users can see what's tracked  
✅ **Opt-out**: Users can revoke consent anytime

## Troubleshooting

### Analytics not loading
- Check `NEXT_PUBLIC_UMAMI_WEBSITE_ID` is set
- Verify user accepted analytics cookies
- Check browser console for errors
- Verify Umami script URL is correct

### No data in dashboard
- Wait a few minutes (Umami updates periodically)
- Check if script is loading in browser DevTools
- Verify website ID is correct
- Check Umami server status

---

**Last Updated**: 2024

