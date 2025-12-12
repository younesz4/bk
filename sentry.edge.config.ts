/**
 * Sentry Edge Configuration
 * For Edge runtime (middleware, edge API routes)
 */

import * as Sentry from '@sentry/nextjs'

const SENTRY_DSN = process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN
const ENVIRONMENT = process.env.NODE_ENV || 'development'

Sentry.init({
  dsn: SENTRY_DSN,
  environment: ENVIRONMENT,
  tracesSampleRate: ENVIRONMENT === 'production' ? 0.1 : 1.0,
  
  beforeSend(event) {
    if (ENVIRONMENT === 'development') {
      return null
    }
    
    // Remove sensitive data
    const request = event.request
    if (request?.headers) {
      const sensitiveHeaders = ['authorization', 'cookie', 'x-api-key']
      const headers = request.headers
      sensitiveHeaders.forEach((header) => {
        if (headers[header]) {
          headers[header] = '***'
        }
      })
    }
    
    return event
  },
})




