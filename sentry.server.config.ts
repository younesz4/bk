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
    const request = event.request
    if (request) {
      // Remove sensitive query params
      if (request.query_string) {
        const queryStr = typeof request.query_string === 'string'
          ? request.query_string
          : new URLSearchParams(request.query_string as any).toString()
        request.query_string = queryStr.replace(
          /(password|token|api_key|secret)=[^&]*/gi,
          '$1=***'
        ) as any
      }
      
      // Remove sensitive headers
      if (request.headers) {
        const sensitiveHeaders = [
          'authorization',
          'cookie',
          'x-api-key',
          'x-csrf-token',
          'x-forwarded-for',
        ]
        const headers = request.headers
        sensitiveHeaders.forEach((header) => {
          if (headers[header]) {
            headers[header] = '***'
          }
        })
      }
      
      // Remove sensitive data from body
      if (request.data) {
        const sensitiveFields = ['password', 'token', 'apiKey', 'secret', 'creditCard']
        const data = request.data
        sensitiveFields.forEach((field) => {
          if (data && typeof data === 'object' && field in data) {
            (data as any)[field] = '***'
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




