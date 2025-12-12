/**
 * Sentry Client Configuration
 * Captures frontend errors and performance data
 */

import * as Sentry from '@sentry/nextjs'

const SENTRY_DSN = process.env.NEXT_PUBLIC_SENTRY_DSN
const ENVIRONMENT = process.env.NODE_ENV || 'development'

Sentry.init({
  dsn: SENTRY_DSN,
  environment: ENVIRONMENT,
  
  // Performance monitoring
  tracesSampleRate: ENVIRONMENT === 'production' ? 0.1 : 1.0, // 10% in prod, 100% in dev
  
  // Session replay (optional, can be expensive)
  replaysSessionSampleRate: ENVIRONMENT === 'production' ? 0.01 : 0.1, // 1% in prod
  replaysOnErrorSampleRate: 1.0, // Always capture replays on errors
  
  // Filter out sensitive data
  beforeSend(event, hint) {
    // Don't send events in development
    if (ENVIRONMENT === 'development') {
      return null
    }
    
    // Remove sensitive data from URLs
    const request = event.request
    if (request && request.url) {
      request.url = request.url.replace(/password=[^&]*/gi, 'password=***')
        .replace(/token=[^&]*/gi, 'token=***')
        .replace(/api_key=[^&]*/gi, 'api_key=***')
    }
    
    // Remove sensitive data from headers
    if (request?.headers) {
      const sensitiveHeaders = ['authorization', 'cookie', 'x-api-key', 'x-csrf-token']
      const headers = request.headers
      sensitiveHeaders.forEach((header) => {
        if (headers[header]) {
          headers[header] = '***'
        }
      })
    }
    
    // Remove sensitive data from user
    if (event.user) {
      delete event.user.ip_address
    }
    
    return event
  },
  
  // Ignore certain errors
  ignoreErrors: [
    // Browser extensions
    'ResizeObserver loop limit exceeded',
    'Non-Error promise rejection captured',
    // Network errors that are not actionable
    'NetworkError',
    'Failed to fetch',
    // Third-party scripts
    'Script error',
  ],
  
  // Don't capture errors from admin panel (too noisy)
  denyUrls: [
    /\/admin\//,
    /\/api\/admin\//,
  ],
  
  // Integrations (commented out - not available in this Sentry version)
  // integrations: [
  //   new Sentry.BrowserTracing({
  //     tracePropagationTargets: ['localhost', /^https:\/\/bk-agencements\.com/],
  //   }),
  //   new Sentry.Replay({
  //     maskAllText: false,
  //     blockAllMedia: false,
  //   }),
  // ],
})




