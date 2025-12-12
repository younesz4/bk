import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { authAdmin } from '@/lib/auth/admin'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  const isAdmin = await authAdmin()
  if (!isAdmin) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }

  const categories = await prisma.category.findMany({
    orderBy: { name: 'asc' },
  })

  return NextResponse.json({
    success: true,
    categories,
  })
}

export async function POST(request: NextRequest) {
  const isAdmin = await authAdmin()
  if (!isAdmin) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }

  // Handle FormData (for file uploads)
  let name: string
  let slug: string
  let imageUrl: string | null = null
  
  // Try to parse as FormData first (for file uploads)
  try {
    const formData = await request.formData()
    name = (formData.get('name') as string || '').trim()
    slug = (formData.get('slug') as string || '').trim()
    const imageFile = formData.get('image') as File | null
    
    // Handle image upload
    if (imageFile && imageFile.size > 0) {
      const fs = require('fs')
      const path = require('path')
      const { v4: uuidv4 } = require('uuid')
      
      const uploadDir = path.join(process.cwd(), 'public/uploads')
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true })
      }

      const arrayBuffer = await imageFile.arrayBuffer()
      const buffer = Buffer.from(arrayBuffer)
      const filename = `category-${uuidv4()}-${imageFile.name.replace(/\s+/g, '-')}`
      const filePath = path.join(uploadDir, filename)
      fs.writeFileSync(filePath, buffer)
      
      imageUrl = '/uploads/' + filename
    }
  } catch {
    // Not FormData, try JSON (for backward compatibility)
    let body
    try {
      body = await request.json()
    } catch {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    name = (body.name || '').trim()
    slug = (body.slug || '').trim()
    imageUrl = body.imageUrl || null
  }

  if (!name || !slug) {
    return NextResponse.json(
      { error: 'Missing required fields' },
      { status: 400 }
    )
  }

  const existingCategory = await prisma.category.findUnique({
    where: { slug },
  })

  if (existingCategory) {
    return NextResponse.json(
      { error: 'Category already exists' },
      { status: 409 }
    )
  }

  const category = await prisma.category.create({
    data: { 
      name, 
      slug,
      imageUrl: imageUrl || null,
    },
  })

  return NextResponse.json({
    success: true,
    category,
  })
}

export async function PUT() {
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

export async function DELETE() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  )
}
