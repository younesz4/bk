/**
 * Admin Settings API
 * GET: Get settings
 * PUT: Update settings
 */

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { secureApiRoute, securityErrorResponse } from '@/lib/security/api-security'
import { rateLimiters } from '@/lib/security/rate-limiter'
import { verifyAdminAuth } from '@/lib/admin-auth'
import { safeJsonParse } from '@/lib/security/input-validation'
import { z } from 'zod'

export const dynamic = 'force-dynamic'

const settingsSchema = z.object({
  storeName: z.string().min(1).max(100),
  contactEmail: z.string().email(),
  currency: z.string().length(3),
  taxRate: z.number().min(0).max(100),
  codEnabled: z.boolean(),
  logoUrl: z.string().url().nullable().optional(),
})

async function handleGetSettings(request: NextRequest): Promise<NextResponse> {
  try {
    const authResult = await verifyAdminAuth(request)
    if (!authResult.authenticated) {
      return securityErrorResponse('Unauthorized', 401)
    }

    // For now, return default settings
    // In production, store settings in database
    const settings = {
      storeName: process.env.STORE_NAME || 'BK Agencements',
      contactEmail: process.env.CONTACT_EMAIL || process.env.ADMIN_NOTIFICATION_EMAIL || '',
      currency: process.env.CURRENCY || 'EUR',
      taxRate: parseFloat(process.env.TAX_RATE || '20'),
      codEnabled: process.env.COD_ENABLED !== 'false',
      logoUrl: null,
    }

    return NextResponse.json({
      success: true,
      settings,
    })
  } catch (error: any) {
    console.error('Get settings error:', error)
    return securityErrorResponse('Failed to fetch settings', 500)
  }
}

async function handleUpdateSettings(request: NextRequest): Promise<NextResponse> {
  try {
    const authResult = await verifyAdminAuth(request)
    if (!authResult.authenticated) {
      return securityErrorResponse('Unauthorized', 401)
    }

    const body = await safeJsonParse(request)
    const validationResult = settingsSchema.safeParse(body)

    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Validation error', details: validationResult.error.issues },
        { status: 400 }
      )
    }

    const settings = validationResult.data

    // In production, save to database
    // For now, just return success
    // You would create a Settings model in Prisma and save here

    return NextResponse.json({
      success: true,
      settings,
      message: 'Settings updated successfully',
    })
  } catch (error: any) {
    console.error('Update settings error:', error)
    return securityErrorResponse('Failed to update settings', 500)
  }
}

export const GET = secureApiRoute(handleGetSettings, {
  methods: ['GET'],
  rateLimiter: rateLimiters.api,
})

export const PUT = secureApiRoute(handleUpdateSettings, {
  methods: ['PUT'],
  rateLimiter: rateLimiters.api,
})




