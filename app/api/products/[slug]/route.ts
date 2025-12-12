import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import {
  productWithRelationsResponseSchema,
  type ProductWithRelationsResponse,
} from '@/lib/schemas'

/**
 * GET /api/products/:slug
 * Get a single product by slug
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params

    const product = await prisma.product.findUnique({
      where: { slug },
      include: {
        category: true,
        images: {
          orderBy: {
            order: 'asc',
          },
        },
      },
    })

    if (!product) {
      return NextResponse.json(
        {
          ok: false,
          message: 'Produit non trouvé',
        },
        { status: 404 }
      )
    }

    // Transform Prisma dates to ISO strings for JSON serialization
    const transformed = {
      ...product,
      createdAt: product.createdAt.toISOString(),
      updatedAt: product.updatedAt.toISOString(),
      category: product.category ? {
        ...product.category,
        createdAt: product.category.createdAt.toISOString(),
        updatedAt: product.category.updatedAt.toISOString(),
      } : null,
      images: product.images.map((img) => ({
        ...img,
        createdAt: img.createdAt.toISOString(),
      })),
    }

    // Validate with Zod schema
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

    return NextResponse.json({
      ok: true,
      product: result.data as ProductWithRelationsResponse,
    })
  } catch (error) {
    console.error('Error fetching product:', error)
    return NextResponse.json(
      {
        ok: false,
        message: 'Une erreur est survenue lors de la récupération du produit.',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

