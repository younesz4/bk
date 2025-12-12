import { verifyAdminSession } from '@/lib/adminAuth'

/**
 * Verify admin session from cookie
 * Returns true if admin is authenticated, false otherwise
 * Uses the new JWT system with admin_session cookie
 */
export async function authAdmin(): Promise<boolean> {
  const session = await verifyAdminSession()
  return session !== null
}

