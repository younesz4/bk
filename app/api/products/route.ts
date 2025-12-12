import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import {
  createProductSchema,
  productSchema,
  productWithRelationsSchema,
  productWithRelationsResponseSchema,
  type CreateProductInput,
  type ProductWithRelationsResponse,
} from '@/lib/schemas'
import { safeApiHandler, getIntQueryParam, getQueryParam, parseJsonBody, validateRequest, handleValidationError } from '@/lib/api-helpers'

/**
 * GET /api/products
 * Get all products with optional filtering
 * Query params: ?published=true&category=slug&page=1&limit=20
 */
type ProductsResponse = {
  ok: boolean
  products: ProductWithRelationsResponse[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export async function GET(request: NextRequest) {
  return safeApiHandler<ProductsResponse>(request, {
    method: 'GET',
    handler: async (req): Promise<NextResponse<ProductsResponse>> => {
      const published = getQueryParam(req, 'published')
      const categorySlug = getQueryParam(req, 'category')
      const page = getIntQueryParam(req, 'page', 1)
      const limit = getIntQueryParam(req, 'limit', 20)
      const skip = (page - 1) * limit

      // Build where clause
      const where: any = {}
      
      // Default to showing published products only if no filter specified
      if (published !== null) {
        where.isPublished = published === 'true'
      } else {
        // If no published filter, show only published products by default
        where.isPublished = true
      }

      if (categorySlug) {
        // Product has direct categoryId relation, not categories array
        const category = await prisma.category.findUnique({
          where: { slug: categorySlug },
          select: { id: true },
        })
        if (category) {
          where.categoryId = category.id
        } else {
          // If category not found, return empty results with consistent structure
          return NextResponse.json({
            ok: true,
            products: [],
            pagination: {
              page,
              limit,
              total: 0,
              totalPages: 0,
            },
          })
        }
      }

      // Fetch products with relations
      const [products, total] = await Promise.all([
        prisma.product.findMany({
          where,
          include: {
            category: {
              select: {
                id: true,
                name: true,
                slug: true,
              },
            },
            images: {
              orderBy: {
                order: 'asc',
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
          skip,
          take: limit,
        }),
        prisma.product.count({ where }),
      ])

      // Transform and validate products
      const validatedProducts: ProductWithRelationsResponse[] = products.map((product) => {
        // Transform Prisma dates to ISO strings for JSON serialization
        // Product has direct category relation, wrap it in categories array format for compatibility
        const transformed = {
          ...product,
          createdAt: product.createdAt.toISOString(),
          updatedAt: product.updatedAt.toISOString(),
          categories: product.category ? [{
            id: `${product.id}-cat`,
            productId: product.id,
            categoryId: product.category.id,
            order: 0,
            createdAt: new Date().toISOString(),
            category: {
              ...product.category,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
          }] : [],
          images: product.images.map((img) => ({
            ...img,
            createdAt: img.createdAt.toISOString(),
          })),
        }
        
        // Validate with Zod schema
        const result = productWithRelationsResponseSchema.safeParse(transformed)
        if (!result.success) {
          console.error('Product validation error:', result.error)
          throw new Error('Invalid product data')
        }
        
        return result.data
      })

      return NextResponse.json({
        ok: true,
        products: validatedProducts,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      })
    },
  })
}

/**
 * POST /api/products
 * Create a new product
 */
export async function POST(request: NextRequest) {
  return safeApiHandler(request, {
    method: 'POST',
    handler: async (req) => {
      try {
        const body = await parseJsonBody(req)
        const data = validateRequest(body as any, createProductSchema) as CreateProductInput

        // Extract relations from data
        const { images, categoryId, ...productData } = data as any

        // Create product with relations
        const product = await prisma.product.create({
          data: {
            ...productData,
            categoryId: categoryId || productData.categoryId,
            images: images
              ? {
                  create: images.map((img: any, index: number) => ({
                    url: img.url,
                    alt: img.alt ?? null,
                    order: img.order ?? index,
                  })),
                }
              : undefined,
          },
          include: {
            category: true,
            images: {
              orderBy: {
                order: 'asc',
              },
            },
          },
        })

        // Transform for response
        const transformed = {
          ...product,
          createdAt: product.createdAt.toISOString(),
          updatedAt: product.updatedAt.toISOString(),
          categories: product.category ? [{
            id: `${product.id}-cat`,
            productId: product.id,
            categoryId: product.category.id,
            order: 0,
            createdAt: new Date().toISOString(),
            category: {
              ...product.category,
              createdAt: product.category.createdAt.toISOString(),
              updatedAt: product.category.updatedAt.toISOString(),
            },
          }] : [],
          images: product.images.map((img) => ({
            ...img,
            createdAt: img.createdAt.toISOString(),
          })),
        }

        // Validate response
        const result = productWithRelationsResponseSchema.safeParse(transformed)
        if (!result.success) {
          console.error('Product validation error:', result.error)
          return NextResponse.json(
            {
              ok: false,
              message: 'Erreur de validation des données',
            },
            { status: 500 }
          )
        }

        return NextResponse.json(
          {
            ok: true,
            product: result.data,
            message: 'Produit créé avec succès',
          },
          { status: 201 }
        )
      } catch (error: any) {
        return handleValidationError(error)
      }
    },
  })
}
