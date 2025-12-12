/**
 * Database Security Utilities
 * Prevents SQL injection and enforces safe Prisma queries
 */

import { prisma } from '@/lib/prisma'
import { validateCUID, validateUUID } from './input-validation'
import { z } from 'zod'

/**
 * Safe Prisma query wrapper
 * Validates IDs before querying
 */
export async function safeFindUnique<T>(
  model: any,
  where: { id: string },
  idValidator: (id: string) => string = validateCUID
): Promise<T | null> {
  try {
    // Validate ID format
    const validId = idValidator(where.id)
    
    // Execute query
    return await model.findUnique({
      where: { id: validId },
    }) as T | null
  } catch (error: any) {
    if (error.message.includes('Invalid')) {
      throw new Error('Invalid ID format')
    }
    throw error
  }
}

/**
 * Product creation schema validation
 */
export const productCreateSchema = z.object({
  name: z.string().min(1, 'Name required').max(200),
  description: z.string().max(5000).nullable().optional(),
  price: z.number().int().nonnegative('Price must be non-negative'),
  stock: z.number().int().nonnegative('Stock must be non-negative'),
  categoryId: z.string().refine((val) => {
    try {
      validateCUID(val)
      return true
    } catch {
      return false
    }
  }, 'Invalid category ID'),
  slug: z.string().min(1).max(200).regex(/^[a-z0-9-]+$/, 'Invalid slug format'),
  isPublished: z.boolean().optional().default(false),
})

/**
 * Category creation schema validation
 */
export const categoryCreateSchema = z.object({
  name: z.string().min(1, 'Name required').max(200),
  description: z.string().max(2000).nullable().optional(),
  slug: z.string().min(1).max(200).regex(/^[a-z0-9-]+$/, 'Invalid slug format'),
})

/**
 * Order creation schema validation
 */
export const orderCreateSchema = z.object({
  customerName: z.string().min(1, 'Customer name required').max(200),
  email: z.string().email('Invalid email'),
  phone: z.string().min(1, 'Phone required').max(50),
  address: z.string().min(1, 'Address required').max(500),
  city: z.string().min(1, 'City required').max(100),
  country: z.string().min(1, 'Country required').max(100),
  items: z.array(z.object({
    productId: z.string(),
    quantity: z.number().int().positive('Quantity must be positive'),
    price: z.number().int().nonnegative('Price must be non-negative'),
  })).min(1, 'At least one item required'),
  totalPrice: z.number().int().nonnegative('Total price must be non-negative'),
  paymentMethod: z.enum(['stripe', 'cod', 'bank_transfer']).nullable().optional(),
})

/**
 * Validate product exists and is available
 */
export async function validateProductAvailability(
  productId: string,
  quantity: number
): Promise<{ valid: boolean; product?: any; error?: string }> {
  try {
    const validId = validateCUID(productId)
    
    const product = await prisma.product.findUnique({
      where: { id: validId },
    })
    
    if (!product) {
      return { valid: false, error: 'Product not found' }
    }
    
    if (!product.isPublished) {
      return { valid: false, error: 'Product not available' }
    }
    
    if (product.stock < quantity) {
      return { valid: false, error: 'Insufficient stock' }
    }
    
    return { valid: true, product }
  } catch (error: any) {
    return { valid: false, error: 'Invalid product ID' }
  }
}

/**
 * Verify order total matches calculated total
 */
export function verifyOrderTotal(
  items: Array<{ price: number; quantity: number }>,
  claimedTotal: number
): boolean {
  const calculatedTotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  )
  
  // Allow small rounding differences (1 cent)
  return Math.abs(calculatedTotal - claimedTotal) <= 1
}

/**
 * Prevent duplicate order submission
 * Check if order with same items and customer exists within last 5 minutes
 */
export async function checkDuplicateOrder(
  email: string,
  items: Array<{ productId: string; quantity: number }>,
  timeWindowMs: number = 5 * 60 * 1000 // 5 minutes
): Promise<boolean> {
  const recentOrders = await prisma.order.findMany({
    where: {
      customerEmail: email,
      createdAt: {
        gte: new Date(Date.now() - timeWindowMs),
      },
    },
    include: {
      items: true,
    },
    take: 5,
  })
  
  // Check if any recent order has the same items
  for (const order of recentOrders) {
    if (order.items.length === items.length) {
      const orderItems = order.items.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
      }))
      
      const isDuplicate = items.every((item) =>
        orderItems.some(
          (oi) => oi.productId === item.productId && oi.quantity === item.quantity
        )
      )
      
      if (isDuplicate) {
        return true
      }
    }
  }
  
  return false
}

/**
 * NEVER use Prisma.$queryRaw with user input directly
 * Use parameterized queries if you must use raw SQL
 */
export function safeRawQuery(query: string, params: any[]): never {
  throw new Error(
    'Raw SQL queries are disabled for security. Use Prisma query builder instead.'
  )
}




