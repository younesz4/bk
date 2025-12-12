/**
 * Sentry Server Configuration
 * Captures backend errors and API route exceptions
 */

import * as Sentry from '@sentry/nextjs'

const SENTRY_DSN = process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN
const ENVIRONMENT = process.env.NODE_ENV || 'development'

Sentry.init({
  dsn: SENTRY_DSN,
  environment: ENVIRONMENT,
  
  // Performance monitoring
  tracesSampleRate: ENVIRONMENT === 'production' ? 0.1 : 1.0,
  
  // Filter out sensitive data
  beforeSend(event, hint) {
    // Don't send events in development
    if (ENVIRONMENT === 'development') {
      return null
    }
    
    // Remove sensitive data from request
    if (event.request) {
      // Remove sensitive query params
      if (event.request.query_string) {
        event.request.query_string = event.request.query_string.replace(
          /(password|token|api_key|secret)=[^&]*/gi,
          '$1=***'
        )
      }
      
      // Remove sensitive headers
      if (event.request.headers) {
        const sensitiveHeaders = [
          'authorization',
          'cookie',
          'x-api-key',
          'x-csrf-token',
          'x-forwarded-for',
        ]
        sensitiveHeaders.forEach((header) => {
          if (event.request.headers[header]) {
            event.request.headers[header] = '***'
          }
        })
      }
      
      // Remove sensitive data from body
      if (event.request.data) {
        const sensitiveFields = ['password', 'token', 'apiKey', 'secret', 'creditCard']
        sensitiveFields.forEach((field) => {
          if (event.request.data[field]) {
            event.request.data[field] = '***'
          }
        })
      }
    }
    
    // Remove IP address
    if (event.user) {
      delete event.user.ip_address
    }
    
    return event
  },
  
  // Ignore certain errors
  ignoreErrors: [
    // Database connection errors (handled separately)
    'PrismaClientKnownRequestError',
    // Validation errors (not actionable)
    'ZodError',
  ],
  
  // Don't capture errors from admin routes (too noisy)
  denyUrls: [
    /\/api\/admin\//,
  ],
})




