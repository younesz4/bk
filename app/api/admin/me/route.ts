/**
 * Get Current Admin Info API
 * GET: Returns current admin information
 */

import { NextRequest, NextResponse } from 'next/server'
import { secureApiRoute, securityErrorResponse } from '@/lib/security/api-security'
import { rateLimiters } from '@/lib/security/rate-limiter'
import { verifyAdminAuth } from '@/lib/admin-auth'

export const dynamic = 'force-dynamic'

async function handleGetMe(request: NextRequest): Promise<NextResponse> {
  try {
    const authResult = await verifyAdminAuth(request)
    if (!authResult.authenticated || !authResult.admin) {
      return securityErrorResponse('Unauthorized', 401)
    }

    return NextResponse.json({
      success: true,
      admin: authResult.admin,
    })
  } catch (error: any) {
    return securityErrorResponse('Failed to fetch admin info', 500)
  }
}

export const GET = secureApiRoute(handleGetMe, {
  methods: ['GET'],
  rateLimiter: rateLimiters.api,
})




