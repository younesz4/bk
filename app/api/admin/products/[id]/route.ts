import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { authAdmin } from '@/lib/auth/admin'

export const dynamic = 'force-dynamic'

interface ProductRouteParams {
  params: Promise<{ id: string }>
}

export async function GET(
  request: NextRequest,
  { params }: ProductRouteParams
) {
  const isAdmin = await authAdmin()
  if (!isAdmin) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }

  const { id } = await params

  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      images: {
        orderBy: { order: 'asc' },
      },
      category: true,
    },
  })

  if (!product) {
    return NextResponse.json(
      { error: 'Product not found' },
      { status: 404 }
    )
  }

  return NextResponse.json({ 
    success: true,
    data: product,
    product, // Also include for backward compatibility
  })
}

export async function PUT(
  request: NextRequest,
  { params }: ProductRouteParams
) {
  const isAdmin = await authAdmin()
  if (!isAdmin) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }

  const { id } = await params

  // Handle FormData (for file uploads) or JSON
  // Note: FormData doesn't set content-type header, so we check if it's FormData by trying to parse it
  let body: any = {}
  
  try {
    // Try to get formData - if it fails, it's JSON
    const formData = await request.formData()
    body = {
      name: formData.get('name'),
      slug: formData.get('slug'),
      description: formData.get('description'),
      price: formData.get('price'),
      stock: formData.get('stock'),
      categoryId: formData.get('categoryId'),
      deletedImageIds: formData.get('deletedImageIds') ? JSON.parse(formData.get('deletedImageIds') as string) : [],
      imageOrders: formData.get('imageOrders') ? JSON.parse(formData.get('imageOrders') as string) : {},
      newImages: formData.getAll('newImages') as File[],
    }
  } catch {
    // Not FormData, try JSON
    try {
      body = await request.json()
    } catch {
      return NextResponse.json(
        { error: 'Invalid body' },
        { status: 400 }
      )
    }
  }

  const { name, slug, description, price, categoryId, stock, deletedImageIds, imageOrders, newImages } = body

  const updateData: any = {}

  if (name !== undefined) {
    updateData.name = name
  }

  if (slug !== undefined) {
    updateData.slug = slug
  }

  if (description !== undefined) {
    updateData.description = description
  }

  if (price !== undefined) {
    // Convert price to cents if it's a string or float
    const priceNum = typeof price === 'string' ? parseFloat(price) : price
    updateData.price = Math.round(priceNum * 100)
  }

  if (categoryId !== undefined) {
    updateData.categoryId = categoryId
  }

  if (stock !== undefined) {
    // Parse stock as integer
    const stockNum = typeof stock === 'string' ? parseInt(stock, 10) : stock
    updateData.stock = isNaN(stockNum) ? 0 : stockNum
  }

  try {
    // Handle image deletions
    if (deletedImageIds && Array.isArray(deletedImageIds) && deletedImageIds.length > 0) {
      await prisma.productImage.deleteMany({
        where: {
          id: { in: deletedImageIds },
          productId: id,
        },
      })
    }

    // Handle image order updates
    if (imageOrders && typeof imageOrders === 'object') {
      for (const [imageId, order] of Object.entries(imageOrders)) {
        await prisma.productImage.updateMany({
          where: {
            id: imageId,
            productId: id,
          },
          data: { order: Number(order) },
        })
      }
    }

    // Handle new image uploads
    if (newImages && Array.isArray(newImages) && newImages.length > 0) {
      const fs = require('fs')
      const path = require('path')
      const { v4: uuidv4 } = require('uuid')
      
      const uploadDir = path.join(process.cwd(), 'public/uploads')
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true })
      }

      const existingImagesCount = await prisma.productImage.count({
        where: { productId: id },
      })

      for (let i = 0; i < newImages.length; i++) {
        const img = newImages[i]
        if (img && img.size > 0) {
          const arrayBuffer = await img.arrayBuffer()
          const buffer = Buffer.from(arrayBuffer)
          const filename = uuidv4() + '-' + img.name.replace(/\s+/g, '-')
          const filePath = path.join(uploadDir, filename)
          fs.writeFileSync(filePath, buffer)

          await prisma.productImage.create({
            data: {
              productId: id,
              url: '/uploads/' + filename,
              alt: name || 'Product image',
              order: existingImagesCount + i,
            },
          })
        }
      }
    }

    // Update product
    await prisma.product.update({
      where: { id },
      data: updateData,
    })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(
      { error: 'Server error' },
      { status: 500 }
    )
  }
}

export async function POST() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  )
}

export async function PATCH() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  )
}

export async function DELETE(
  request: NextRequest,
  { params }: ProductRouteParams
) {
  const isAdmin = await authAdmin()
  if (!isAdmin) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }

  const { id } = await params

  if (typeof id !== 'string') {
    return NextResponse.json(
      { error: 'Product not found' },
      { status: 404 }
    )
  }

  try {
    await prisma.productImage.deleteMany({
      where: { productId: id },
    })

    await prisma.product.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(
      { error: 'Server error' },
      { status: 500 }
    )
  }
}
