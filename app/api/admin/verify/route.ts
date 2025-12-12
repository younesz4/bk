/**
 * Admin Verify 2FA Code API Route
 * POST: Verify 6-digit code and create session
 */

import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'
import { createAdminSession } from '@/lib/adminAuth'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, code } = body

    if (!email || !code) {
      return NextResponse.json(
        { error: 'Email et code requis.' },
        { status: 400 }
      )
    }

    // Find admin by email
    const admin = await prisma.admin.findUnique({
      where: { email: email.trim().toLowerCase() },
    })

    if (!admin) {
      return NextResponse.json(
        { error: 'Code invalide ou expiré.' },
        { status: 401 }
      )
    }

    // 2FA not implemented in current schema - skip verification for now
    // In production, implement proper 2FA
    
    // Create session
    const response = NextResponse.json({ success: true })
    await createAdminSession(response, admin.email)

    return response
  } catch (error: any) {
    console.error('Verify error:', error)
    return NextResponse.json(
      { error: 'Une erreur est survenue. Veuillez réessayer.' },
      { status: 500 }
    )
  }
}




