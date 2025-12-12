/**
 * Admin products manager for BK Agencements
 * GET: List products
 * POST: Create product (with JSON body and Zod validation)
 */

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

export const dynamic = 'force-dynamic'

/**
 * Generate slug from product name
 * Example: "Table en marbre" → "table-en-marbre"
 */
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove accents
    .replace(/[^a-z0-9]+/g, '-') // Replace non-alphanumeric with hyphens
    .replace(/(^-|-$)+/g, '') // Remove leading/trailing hyphens
    .trim()
}

/**
 * Zod validation schema for product creation
 */
const createProductSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  price: z.number().positive('Price must be greater than 0'),
  stock: z.number().int().min(0, 'Stock must be 0 or greater'),
  categoryId: z.string().min(1, 'Category ID is required'),
  images: z
    .array(
      z.object({
        url: z.string().url('Image URL must be a valid URL'),
        alt: z.string().min(1, 'Alt text is required'),
      })
    )
    .min(1, 'At least one image is required'),
})

/**
 * GET /api/admin/products
 * List all products
 */
export async function GET(request: NextRequest) {
  try {
    const products = await prisma.product.findMany({
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        images: {
          orderBy: { order: 'asc' },
          take: 1,
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 50,
    })

    return NextResponse.json({
      success: true,
      products,
    })
  } catch (error: any) {
    console.error('Error fetching products:', error)
    return NextResponse.json(
      { success: false, error: 'Server error' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/admin/products
 * Create a new product with JSON body
 */
export async function POST(request: NextRequest) {
  try {
    // Temporary admin protection
    // Later step will add real auth
    // For now, we are not blocking requests

    // Parse JSON body
    const body = await request.json()

    // Validate using Zod
    const validationResult = createProductSchema.safeParse(body)

    if (!validationResult.success) {
      const errors = validationResult.error.issues.map((err) => ({
        field: err.path.join('.'),
        message: err.message,
      }))

      return NextResponse.json(
        {
          success: false,
          error: 'Validation failed',
          errors,
        },
        { status: 400 }
      )
    }

    const { name, description, price, stock, categoryId, images } = validationResult.data

    // Generate slug from name
    let slug = generateSlug(name)

    // Ensure slug is unique by appending a number if needed
    let uniqueSlug = slug
    let counter = 1
    while (await prisma.product.findUnique({ where: { slug: uniqueSlug } })) {
      uniqueSlug = `${slug}-${counter}`
      counter++
    }

    // Verify category exists
    const category = await prisma.category.findUnique({
      where: { id: categoryId },
    })

    if (!category) {
      return NextResponse.json(
        {
          success: false,
          error: 'Category not found',
        },
        { status: 400 }
      )
    }

    // Convert price to cents (if not already)
    // Assuming price is in EUR, convert to cents
    const priceInCents = Math.round(price * 100)

    // Create product in Prisma with nested images
    const product = await prisma.product.create({
      data: {
        name: name.trim(),
        slug: uniqueSlug,
        description: description?.trim() || null,
        price: priceInCents,
        stock: stock,
        categoryId: categoryId,
        images: {
          create: images.map((img, index) => ({
            url: img.url,
            alt: img.alt || `Image of ${name}`,
            order: index,
          })),
        },
      },
      include: {
        category: true,
        images: {
          orderBy: { order: 'asc' },
        },
      },
    })

    // Return success response
    return NextResponse.json(
      {
        success: true,
        productId: product.id,
      },
      { status: 201 }
    )
  } catch (error: any) {
    console.error('Error creating product:', error)

    // Handle Prisma unique constraint error (duplicate slug)
    if (error.code === 'P2002') {
      return NextResponse.json(
        {
          success: false,
          error: 'Product with this slug already exists',
        },
        { status: 409 }
      )
    }

    // Handle Prisma foreign key error (invalid category)
    if (error.code === 'P2003') {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid category ID',
        },
        { status: 400 }
      )
    }

    // Generic error response
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Server error',
      },
      { status: 400 }
    )
  }
}
