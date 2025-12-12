import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
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

    const formData = await req.formData()
    const file = formData.get('file') as File | null
    const productId = formData.get('productId') as string | null
    const alt = formData.get('alt') as string | null
    const orderStr = formData.get('order') as string | null

    if (!file) {
      return NextResponse.json(
        { error: 'file is required' },
        { status: 400 }
      )
    }

    if (!productId || typeof productId !== 'string') {
      return NextResponse.json(
        { error: 'productId is required' },
        { status: 400 }
      )
    }

    const order = orderStr ? parseInt(orderStr, 10) : 0

    const fileExtension = file.name.split('.').pop()?.toLowerCase() || 'jpg'
    const allowedExtensions = ['jpg', 'jpeg', 'png', 'webp', 'gif']
    
    if (!allowedExtensions.includes(fileExtension)) {
      return NextResponse.json(
        { error: 'Invalid file type. Allowed: jpg, jpeg, png, webp, gif' },
        { status: 400 }
      )
    }

    const uniqueFilename = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExtension}`
    const uploadDir = join(process.cwd(), 'public', 'uploads', 'products', productId)

    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true })
    }

    const filePath = join(uploadDir, uniqueFilename)
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    await writeFile(filePath, buffer)

    const url = `/uploads/products/${productId}/${uniqueFilename}`

    const image = await prisma.productImage.create({
      data: {
        productId,
        url,
        alt: alt?.trim() || null,
        order: isNaN(order) ? 0 : order,
      },
    })

    return NextResponse.json(
      {
        success: true,
        image,
      },
      { status: 201 }
    )
  } catch (error: any) {
    if (error.code === 'P2003') {
      return NextResponse.json(
        { error: 'Invalid productId' },
        { status: 400 }
      )
    }

    if (error.code === 'P2001' || error.message?.includes('does not exist') || error.message?.includes('no such table')) {
      console.error('❌ Database error:', error.message)
      return NextResponse.json(
        { error: 'Server error' },
        { status: 500 }
      )
    }

    console.error('❌ Error uploading image:', error)
    return NextResponse.json(
      { error: 'Server error' },
      { status: 500 }
    )
  }
}


