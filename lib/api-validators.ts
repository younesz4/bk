import { z } from 'zod'

/**
 * Common validation schemas for API routes
 */

// Admin Login
export const adminLoginSchema = z.object({
  email: z.string().email('Email invalide').min(1, 'Email requis'),
  password: z.string().min(1, 'Mot de passe requis'),
})

// Product schemas
export const createProductSchema = z.object({
  name: z.string().min(1, 'Name is required').max(255, 'Name too long'),
  slug: z.string().min(1, 'Slug is required').max(255, 'Slug too long'),
  description: z.string().max(5000, 'Description too long').optional().nullable(),
  price: z.number().int().positive('Price must be positive'),
  stock: z.number().int().min(0, 'Stock cannot be negative').optional(),
  categoryId: z.string().min(1, 'Category ID is required'),
  images: z.array(z.string().url('Invalid image URL')).max(6, 'Maximum 6 images').optional(),
})

export const updateProductSchema = z.object({
  id: z.string().min(1, 'Product ID is required'),
  name: z.string().min(1, 'Name is required').max(255, 'Name too long'),
  slug: z.string().min(1, 'Slug is required').max(255, 'Slug too long'),
  description: z.string().max(5000, 'Description too long').optional().nullable(),
  price: z.number().int().positive('Price must be positive'),
  stock: z.number().int().min(0, 'Stock cannot be negative').optional(),
  categoryId: z.string().min(1, 'Category ID is required'),
  images: z.array(z.string().url('Invalid image URL')).max(6, 'Maximum 6 images').optional(),
})

export const deleteProductSchema = z.object({
  id: z.string().min(1, 'Product ID is required'),
})

// Category schemas
export const createCategorySchema = z.object({
  name: z.string().min(1, 'Name is required').max(255, 'Name too long'),
  slug: z.string().min(1, 'Slug is required').max(255, 'Slug too long'),
})

export const updateCategorySchema = z.object({
  id: z.string().min(1, 'Category ID is required'),
  name: z.string().min(1, 'Name is required').max(255, 'Name too long'),
  slug: z.string().min(1, 'Slug is required').max(255, 'Slug too long'),
})

export const deleteCategorySchema = z.object({
  id: z.string().min(1, 'Category ID is required'),
})

// Order schemas
export const updateOrderSchema = z.object({
  id: z.string().min(1, 'Order ID is required'),
  status: z.enum(['New', 'In progress', 'Completed']),
})

export const deleteOrderSchema = z.object({
  id: z.string().min(1, 'Order ID is required'),
})

// Checkout schema
export const checkoutItemSchema = z.object({
  productId: z.string().min(1, 'Product ID is required'),
  quantity: z.number().int().positive('Quantity must be positive'),
})

export const checkoutRequestSchema = z.object({
  items: z.array(checkoutItemSchema).min(1, 'At least one item is required'),
  customerName: z.string().min(1, 'Customer name is required').max(255, 'Name too long'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(1, 'Phone is required').max(50, 'Phone too long'),
  address: z.string().min(1, 'Address is required').max(500, 'Address too long'),
  city: z.string().min(1, 'City is required').max(100, 'City too long'),
  country: z.string().min(1, 'Country is required').max(100, 'Country too long'),
  notes: z.string().max(1000, 'Notes too long').optional().nullable(),
})

// Booking schema
export const bookingRequestSchema = z.object({
  fullName: z.string().min(1, 'Full name is required').max(255, 'Name too long'),
  email: z.string().email('Invalid email address'),
  phone: z.string().max(50, 'Phone too long').optional().nullable(),
  projectType: z.string().max(100, 'Project type too long').optional().nullable(),
  budget: z.string().max(100, 'Budget too long').optional().nullable(),
  message: z.string().max(2000, 'Message too long').optional().nullable(),
  date: z.string().min(1, 'Date is required'),
  timeSlot: z.string().min(1, 'Time slot is required'),
})

// Query parameter schemas
export const paginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
})

export const productQuerySchema = paginationSchema.extend({
  published: z.coerce.boolean().optional(),
  category: z.string().optional(),
})

