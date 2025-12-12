import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifySession } from '@/lib/auth'
import { safeApiHandler, parseJsonBody, validateRequest, handleValidationError } from '@/lib/api-helpers'
import { createCategorySchema } from '@/lib/api-validators'

export const dynamic = 'force-dynamic'

/**
 * Format slug: lowercase, remove accents, replace spaces with hyphens
 */
function formatSlug(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // remove accents
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-') // replace spaces/symbols
    .replace(/^-+|-+$/g, '') // trim dashes
}

/**
 * POST /api/admin/categories/create
 * Create a new category
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
        const { name, slug: providedSlug } = validateRequest(body, createCategorySchema)

        // Format slug (use provided slug or generate from name)
        const finalSlug = providedSlug ? formatSlug(providedSlug) : formatSlug(name)

        if (!finalSlug) {
          return NextResponse.json(
            { error: 'Invalid slug generated' },
            { status: 400 }
          )
        }

        // Check duplicate slug
        const existing = await prisma.category.findUnique({
          where: { slug: finalSlug },
        })

        if (existing) {
          return NextResponse.json(
            { error: 'Category with this slug already exists' },
            { status: 409 }
          )
        }

        // Create category
        const category = await prisma.category.create({
          data: {
            name: name.trim(),
            slug: finalSlug,
          },
        })

        return NextResponse.json({
          success: true,
          message: 'Category created successfully',
          category,
        })
      } catch (error: any) {
        return handleValidationError(error)
      }
    },
  })
}
