import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { safeApiHandler } from '@/lib/api-helpers'

/**
 * GET /api/categories
 * Get all categories
 */
export async function GET(request: NextRequest) {
  return safeApiHandler(request, {
    method: 'GET',
    handler: async () => {
      const categories = await prisma.category.findMany({
        orderBy: {
          name: 'asc',
        },
      })

      return NextResponse.json({
        ok: true,
        categories: categories.map((cat) => ({
          id: cat.id,
          name: cat.name,
          slug: cat.slug,
        })),
      })
    },
  })
}
