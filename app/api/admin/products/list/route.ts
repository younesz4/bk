import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization')

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const token = authHeader.substring(7)
    const adminApiKey = process.env.ADMIN_API_KEY

    if (!adminApiKey) {
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      )
    }

    if (token !== adminApiKey) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
    const products = await prisma.product.findMany({
      include: {
        category: true,
        images: {
          orderBy: { order: 'asc' },
          take: 1,
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    const formattedProducts = products.map((product) => ({
      id: product.id,
      name: product.name,
      slug: product.slug,
      category: {
        id: product.category.id,
        name: product.category.name,
      },
      price: product.price,
      stock: product.stock || 0,
      status: product.isPublished ? 'active' : 'draft',
      imageUrl: product.images && product.images.length > 0 ? product.images[0].url : null,
    }))

    return NextResponse.json({ products: formattedProducts })
  } catch (error: any) {
    if (error.code === 'P2001' || error.message?.includes('does not exist') || error.message?.includes('no such table')) {
      console.error('❌ Database error:', error.message)
      return NextResponse.json(
        { error: 'Server error' },
        { status: 500 }
      )
    }

    console.error('❌ Error fetching products:', error)
    return NextResponse.json(
      { error: 'Server error' },
      { status: 500 }
    )
  }
}

