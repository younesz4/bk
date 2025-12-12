import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

/**
 * Safe API handler wrapper that:
 * - Handles errors gracefully
 * - Logs detailed errors server-side only
 * - Returns safe, generic error responses to client
 * - Validates HTTP methods
 * - Validates Content-Type for JSON requests
 */
export async function safeApiHandler<T = any>(
  request: NextRequest,
  options: {
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
    handler: (req: NextRequest) => Promise<NextResponse<T>>
    requireJson?: boolean // Default: true for POST/PUT/PATCH
  }
): Promise<NextResponse<T>> {
  try {
    // 1. Validate HTTP method
    if (request.method !== options.method) {
      return NextResponse.json(
        { error: 'Method not allowed' },
        { status: 405 }
      ) as NextResponse<T>
    }

    // 2. Validate Content-Type for JSON requests
    if (options.requireJson !== false && ['POST', 'PUT', 'PATCH'].includes(options.method)) {
      const contentType = request.headers.get('content-type')
      if (!contentType || !contentType.includes('application/json')) {
        return NextResponse.json(
          { error: 'Content-Type must be application/json' },
          { status: 400 }
        ) as NextResponse<T>
      }
    }

    // 3. Execute handler
    return await options.handler(request)
  } catch (error: any) {
    // Log detailed error server-side only
    console.error(`[API Error] ${request.method} ${request.nextUrl.pathname}:`, {
      message: error?.message,
      stack: error?.stack,
      code: error?.code,
      name: error?.name,
      timestamp: new Date().toISOString(),
    })

    // Map Prisma errors to safe messages (don't expose error codes)
    if (error?.code === 'P2002') {
      return NextResponse.json(
        { error: 'A record with this information already exists' },
        { status: 409 }
      ) as NextResponse<T>
    }

    if (error?.code === 'P2025') {
      return NextResponse.json(
        { error: 'The requested resource was not found' },
        { status: 404 }
      ) as NextResponse<T>
    }

    if (error?.code === 'P2003') {
      return NextResponse.json(
        { error: 'Invalid reference' },
        { status: 400 }
      ) as NextResponse<T>
    }

    // Generic error response (never expose internal details)
    return NextResponse.json(
      { error: 'An error occurred processing your request' },
      { status: 500 }
    ) as NextResponse<T>
  }
}

/**
 * Validate request body with Zod schema
 * Returns parsed data or throws validation error
 */
export function validateRequest<T>(
  body: unknown,
  schema: z.ZodSchema<T>
): T {
  const result = schema.safeParse(body)
  if (!result.success) {
    const error = new Error('Validation failed')
    ;(error as any).validationErrors = result.error.issues
    ;(error as any).statusCode = 400
    throw error
  }
  return result.data
}

/**
 * Parse JSON body safely
 */
export async function parseJsonBody(request: NextRequest): Promise<unknown> {
  try {
    return await request.json()
  } catch (error) {
    const parseError = new Error('Invalid JSON in request body')
    ;(parseError as any).statusCode = 400
    throw parseError
  }
}

/**
 * Get query parameter safely
 */
export function getQueryParam(
  request: NextRequest,
  key: string,
  defaultValue?: string
): string | undefined {
  return request.nextUrl.searchParams.get(key) || defaultValue
}

/**
 * Get integer query parameter safely
 */
export function getIntQueryParam(
  request: NextRequest,
  key: string,
  defaultValue?: number
): number {
  const value = request.nextUrl.searchParams.get(key)
  if (!value) return defaultValue ?? 0
  const parsed = parseInt(value, 10)
  return isNaN(parsed) ? (defaultValue ?? 0) : parsed
}

/**
 * Handle validation errors with proper response
 */
export function handleValidationError(error: any): NextResponse {
  if (error.statusCode === 400 && error.validationErrors) {
    return NextResponse.json(
      {
        error: 'Validation failed',
        details: error.validationErrors,
      },
      { status: 400 }
    )
  }
  throw error // Re-throw if not a validation error
}

