import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { authAdmin } from '@/lib/auth/admin'
import * as fs from 'fs'
import * as path from 'path'
import { v4 as uuidv4 } from 'uuid'

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
  // Declare variables at function scope for error handling
  let uploadedFilePath: string | null = null
  let name: string = ''
  let slug: string = ''
  let imageUrl: string | null = null
  
  try {
    const isAdmin = await authAdmin()
    if (!isAdmin) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Handle FormData (for file uploads)
    
    // Try to parse as FormData first (for file uploads)
    try {
      const formData = await request.formData()
      name = (formData.get('name') as string || '').trim()
      slug = (formData.get('slug') as string || '').trim()
      const imageFile = formData.get('image') as File | null
      
      // Handle image upload
      if (imageFile && imageFile.size > 0) {
        const uploadDir = path.join(process.cwd(), 'public/uploads')
        if (!fs.existsSync(uploadDir)) {
          fs.mkdirSync(uploadDir, { recursive: true })
        }

        const arrayBuffer = await imageFile.arrayBuffer()
        const buffer = Buffer.from(arrayBuffer)
        const filename = `category-${uuidv4()}-${imageFile.name.replace(/\s+/g, '-')}`
        const filePath = path.join(uploadDir, filename)
        fs.writeFileSync(filePath, buffer)
        uploadedFilePath = filePath
        imageUrl = '/uploads/' + filename
      }
    } catch (parseError) {
      // Not FormData, try JSON (for backward compatibility)
      try {
        const body = await request.json()
        name = (body.name || '').trim()
        slug = (body.slug || '').trim()
        imageUrl = body.imageUrl || null
      } catch {
        return NextResponse.json(
          { error: 'Missing required fields' },
          { status: 400 }
        )
      }
    }

    if (!name || !slug) {
      // Clean up uploaded file if validation fails
      if (uploadedFilePath && fs.existsSync(uploadedFilePath)) {
        try {
          fs.unlinkSync(uploadedFilePath)
        } catch (cleanupError) {
          // Ignore cleanup errors
        }
      }
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const existingCategory = await prisma.category.findUnique({
      where: { slug },
    })

    if (existingCategory) {
      // Clean up uploaded file if category already exists
      if (uploadedFilePath && fs.existsSync(uploadedFilePath)) {
        try {
          fs.unlinkSync(uploadedFilePath)
        } catch (cleanupError) {
          // Ignore cleanup errors
        }
      }
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
  } catch (error) {
    // Clean up uploaded file on any error
    if (uploadedFilePath && fs.existsSync(uploadedFilePath)) {
      try {
        fs.unlinkSync(uploadedFilePath)
      } catch (cleanupError) {
        // Ignore cleanup errors
      }
    }
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
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
