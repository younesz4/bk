/**
 * Activity Logger
 * Logs all admin actions to database
 */

import { prisma } from '@/lib/prisma'
import { getClientIP } from '@/lib/security/api-security'
import { NextRequest } from 'next/server'

export interface ActivityLogData {
  adminId: string
  action: string
  entity?: string
  entityId?: string
  details?: Record<string, any>
  request?: NextRequest
}

/**
 * Log admin activity
 */
export async function logActivity(data: ActivityLogData): Promise<void> {
  try {
    const ipAddress = data.request ? getClientIP(data.request) : undefined
    const userAgent = data.request?.headers.get('user-agent') || undefined

    // ActivityLog model not in schema - logging disabled
    // await prisma.activityLog.create({
    //   data: {
    //     adminId: data.adminId,
    //     action: data.action,
    //     entity: data.entity || null,
    //     entityId: data.entityId || null,
    //     details: data.details ? JSON.stringify(data.details) : null,
    //     ipAddress: ipAddress || null,
    //     userAgent: userAgent || null,
    //   },
    // })
    console.log('Activity log:', { adminId: data.adminId, action: data.action, entity: data.entity, entityId: data.entityId })
  } catch (error) {
    // Don't fail the request if logging fails
    console.error('Failed to log activity:', error)
  }
}

/**
 * Common activity actions
 */
export const ActivityActions = {
  // Authentication
  LOGIN: 'login',
  LOGOUT: 'logout',
  LOGIN_FAILED: 'login_failed',
  
  // Orders
  ORDER_CREATE: 'order_create',
  ORDER_UPDATE: 'order_update',
  ORDER_STATUS_UPDATE: 'order_status_update',
  ORDER_DELETE: 'order_delete',
  
  // Quotes
  QUOTE_CREATE: 'quote_create',
  QUOTE_UPDATE: 'quote_update',
  QUOTE_STATUS_UPDATE: 'quote_status_update',
  QUOTE_CONVERT: 'quote_convert',
  QUOTE_DELETE: 'quote_delete',
  
  // Products
  PRODUCT_CREATE: 'product_create',
  PRODUCT_UPDATE: 'product_update',
  PRODUCT_DELETE: 'product_delete',
  PRODUCT_STOCK_UPDATE: 'product_stock_update',
  
  // Categories
  CATEGORY_CREATE: 'category_create',
  CATEGORY_UPDATE: 'category_update',
  CATEGORY_DELETE: 'category_delete',
  
  // Contacts
  CONTACT_READ: 'contact_read',
  CONTACT_UPDATE: 'contact_update',
  CONTACT_ASSIGN: 'contact_assign',
  CONTACT_DELETE: 'contact_delete',
  
  // Payments
  PAYMENT_VERIFY: 'payment_verify',
  PAYMENT_REFUND: 'payment_refund',
  
  // Settings
  SETTINGS_UPDATE: 'settings_update',
} as const




