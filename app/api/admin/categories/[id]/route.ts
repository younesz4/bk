import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { authAdmin } from '@/lib/auth/admin'

export const dynamic = 'force-dynamic'

interface RouteParams {
  params: Promise<{ id: string }>
}

/**
 * Slugify function to generate URL-friendly slugs
 */
function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove accents
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove invalid characters
    .replace(/[\s_-]+/g, '-') // Replace spaces/underscores with hyphens
    .replace(/^-+|-+$/g, '') // Remove leading/trailing hyphens
}

/**
 * Ensure unique slug by appending -2, -3, etc. if necessary
 */
async function ensureUniqueSlug(baseSlug: string, excludeId?: string): Promise<string> {
  let slug = baseSlug
  let counter = 2

  while (true) {
    const existing = await prisma.category.findUnique({
      where: { slug },
    })

    if (!existing || (excludeId && existing.id === excludeId)) {
      return slug
    }

    slug = `${baseSlug}-${counter}`
    counter++
  }
}

interface UpdateCategoryBody {
  name?: string
  slug?: string
  imageUrl?: string
}

/**
 * GET /api/admin/categories/[id]
 * Fetch a single category by ID
 */
export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    // Check admin authentication using cookies
    const isAdmin = await authAdmin()
    if (!isAdmin) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get category ID from params
    const { id } = await params

    // Fetch category
    const category = await prisma.category.findUnique({
      where: { id },
    })

    if (!category) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      id: category.id,
      name: category.name,
      slug: category.slug,
      imageUrl: category.imageUrl,
      createdAt: category.createdAt,
      updatedAt: category.updatedAt,
    })
  } catch (error: any) {
    console.error('❌ Error fetching category:', error)
    return NextResponse.json(
      { error: 'Server error' },
      { status: 500 }
    )
  }
}

/**
 * PUT /api/admin/categories/[id]
 * Update a category
 */
export async function PUT(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    // Check admin authentication using cookies
    const isAdmin = await authAdmin()
    if (!isAdmin) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get category ID from params
    const { id } = await params

    // Parse request body
    const body: UpdateCategoryBody = await request.json()
    const { name, slug, imageUrl } = body

    // Check if category exists
    const existingCategory = await prisma.category.findUnique({
      where: { id },
    })

    if (!existingCategory) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      )
    }

    // Prepare update data
    const updateData: any = {}

    if (name !== undefined) {
      if (typeof name !== 'string' || name.trim() === '') {
        return NextResponse.json(
          { error: 'Le nom est requis' },
          { status: 400 }
        )
      }

      if (name.trim().length <= 2) {
        return NextResponse.json(
          { error: 'Le nom doit contenir plus de 2 caractères' },
          { status: 400 }
        )
      }

      updateData.name = name.trim()
    }

    if (slug !== undefined) {
      // If slug is provided, use it; otherwise generate from name
      let finalSlug = slug.trim() || (name ? slugify(name.trim()) : existingCategory.slug)

      if (!finalSlug) {
        return NextResponse.json(
          { error: 'Impossible de générer un slug valide' },
          { status: 400 }
        )
      }

      // Ensure unique slug (excluding current category)
      finalSlug = await ensureUniqueSlug(finalSlug, id)
      updateData.slug = finalSlug
    } else if (name !== undefined && name !== existingCategory.name) {
      // If name changed but slug not provided, regenerate slug
      const newSlug = slugify(name.trim())
      if (newSlug) {
        const finalSlug = await ensureUniqueSlug(newSlug, id)
        updateData.slug = finalSlug
      }
    }

    if (imageUrl !== undefined) {
      updateData.imageUrl = imageUrl.trim() || null
    }

    // Update category
    const updatedCategory = await prisma.category.update({
      where: { id },
      data: updateData,
    })

    return NextResponse.json({
      id: updatedCategory.id,
      name: updatedCategory.name,
      slug: updatedCategory.slug,
      createdAt: updatedCategory.createdAt,
      updatedAt: updatedCategory.updatedAt,
    })
  } catch (error: any) {
    // Handle Prisma errors
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'Une catégorie avec ce slug existe déjà' },
        { status: 409 }
      )
    }

    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      )
    }

    console.error('❌ Error updating category:', error)
    return NextResponse.json(
      { error: 'Server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: RouteParams
) {
  const isAdmin = await authAdmin()
  if (!isAdmin) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }

  try {
    const { id } = await params

    if (typeof id !== 'string') {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      )
    }

    await prisma.category.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(
      { error: 'Server error' },
      { status: 500 }
    )
  }
}

