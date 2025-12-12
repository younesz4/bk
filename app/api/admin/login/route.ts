import { NextRequest, NextResponse } from 'next/server'
import { createAdminSession } from '@/lib/adminAuth'

export const dynamic = 'force-dynamic'

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@bk-agencements.com'
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'change-this-password'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    // Debug logging (remove in production)
    console.log('Login attempt:', { 
      providedEmail: email, 
      expectedEmail: ADMIN_EMAIL,
      emailMatch: email === ADMIN_EMAIL,
      passwordMatch: password === ADMIN_PASSWORD 
    })

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email et mot de passe requis' },
        { status: 400 }
      )
    }

    if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
      console.log('Login failed: credentials mismatch')
      return NextResponse.json(
        { error: 'Identifiants incorrects' },
        { status: 401 }
      )
    }

    const response = NextResponse.json({ success: true })
    await createAdminSession(response, email)

    console.log('Login successful, session created')
    return response
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Erreur interne' },
      { status: 500 }
    )
  }
}
