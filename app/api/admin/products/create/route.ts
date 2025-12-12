import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifySession } from '@/lib/auth'
import { safeApiHandler, parseJsonBody, validateRequest, handleValidationError } from '@/lib/api-helpers'
import { createProductSchema } from '@/lib/api-validators'

export const dynamic = 'force-dynamic'

/**
 * POST /api/admin/products/create
 * Create a new product with images
 */
export async function POST(req: NextRequest) {
  return safeApiHandler(req, {
    method: 'POST',
    handler: async (request) => {
      // Validate admin authentication
      const session = await verifySession()
      if (!session) {
        return NextResponse.json(
          { error: 'Unauthorized' },
          { status: 401 }
        )
      }

      try {
        const body = await parseJsonBody(request)
        const { name, slug, description, price, stock, categoryId, images } = validateRequest(body, createProductSchema)

    // Check if slug already exists
    const existingProduct = await prisma.product.findUnique({
      where: { slug },
    })

    if (existingProduct) {
      return NextResponse.json(
        { error: 'Product with this slug already exists' },
        { status: 409 }
      )
    }

    // Verify category exists
    const category = await prisma.category.findUnique({
      where: { id: categoryId },
    })

    if (!category) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 400 }
      )
    }

    // Create product
    const product = await prisma.product.create({
      data: {
        name: name.trim(),
        slug: slug.trim(),
        description: description?.trim() || null,
        price: Math.round(price), // Ensure integer (cents)
        stock: stock ? Math.round(stock) : 0,
        categoryId,
        isPublished: false,
      },
    })

    // Create images
    if (Array.isArray(images) && images.length > 0) {
      await prisma.productImage.createMany({
        data: images.map((url: string, index: number) => ({
          productId: product.id,
          url,
          alt: name.trim(),
          order: index,
        })),
      })
    }

    // Fetch created product with relations
    const createdProduct = await prisma.product.findUnique({
      where: { id: product.id },
      include: {
        category: true,
        images: {
          orderBy: { order: 'asc' },
        },
      },
    })

        return NextResponse.json(
          {
            success: true,
            product: createdProduct,
          },
          { status: 201 }
        )
      } catch (error: any) {
        return handleValidationError(error)
      }
    },
  })
}

