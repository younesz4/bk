import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifySession } from '@/lib/auth'
import { safeApiHandler, parseJsonBody, validateRequest, handleValidationError } from '@/lib/api-helpers'
import { updateProductSchema } from '@/lib/api-validators'

export const dynamic = 'force-dynamic'

/**
 * POST /api/admin/products/update
 * Update an existing product
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
        const {
          id,
          name,
          slug,
          description,
          price,
          stock,
          categoryId,
          images = [],
        } = validateRequest(body, updateProductSchema)

        // Check if product exists
        const existingProduct = await prisma.product.findUnique({
          where: { id },
        })

        if (!existingProduct) {
          return NextResponse.json(
            { error: 'Product not found' },
            { status: 404 }
          )
        }

        // Check if slug is already taken by another product
        if (slug !== existingProduct.slug) {
          const slugExists = await prisma.product.findUnique({
            where: { slug },
          })

          if (slugExists) {
            return NextResponse.json(
              { error: 'Product with this slug already exists' },
              { status: 409 }
            )
          }
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

        // Update basic fields
        const updatedProduct = await prisma.product.update({
          where: { id },
          data: {
            name: name.trim(),
            slug: slug.trim(),
            description: description?.trim() || null,
            price: Math.round(price), // Ensure integer (cents)
            stock: stock ?? 0,
            categoryId,
          },
        })

        // Rewrite images (delete → insert)
        await prisma.productImage.deleteMany({
          where: { productId: id },
        })

        // Insert new images with proper order
        if (Array.isArray(images) && images.length > 0) {
          for (let i = 0; i < images.length; i++) {
            const url = images[i]

            if (!url || typeof url !== 'string' || url.trim() === '') {
              continue
            }

            await prisma.productImage.create({
              data: {
                productId: id,
                url: url.trim(),
                alt: name.trim(),
                order: i,
              },
            })
          }
        }

        // Fetch full product with relations
        const fullProduct = await prisma.product.findUnique({
          where: { id },
          include: {
            category: true,
            images: {
              orderBy: { order: 'asc' },
            },
          },
        })

        return NextResponse.json(fullProduct, { status: 200 })
      } catch (error: any) {
        return handleValidationError(error)
      }
    },
  })
}
