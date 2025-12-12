/**
 * Type definitions for Prisma models
 * These types match the Prisma schema exactly
 */

import type { Prisma } from '@prisma/client'

// Base Prisma types
export type Category = Prisma.CategoryGetPayload<{}>
export type Product = Prisma.ProductGetPayload<{}>
export type ProductImage = Prisma.ProductImageGetPayload<{}>

// Types with relations
export type CategoryWithProducts = Prisma.CategoryGetPayload<{
  include: {
    products: {
      include: {
        images: true
      }
    }
  }
}>

export type ProductWithCategoryAndImages = Prisma.ProductGetPayload<{
  include: {
    category: true
    images: true
  }
}>

export type ProductWithImages = Prisma.ProductGetPayload<{
  include: {
    images: true
  }
}>


