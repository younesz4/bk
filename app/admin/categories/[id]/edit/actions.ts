'use server'

import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import fs from 'fs'
import path from 'path'
import { v4 as uuidv4 } from 'uuid'

/**
 * Server action to update a category
 */
export async function updateCategory(id: string, formData: FormData) {
  const name = (formData.get('name') as string || '').trim()
  const slugInput = (formData.get('slug') as string || '').trim()
  const imageFile = formData.get('image') as File | null

  if (!name) {
    return { ok: false, error: 'Le nom est obligatoire.' }
  }

  const base = slugInput || name
  const slug = base
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

  // Check slug unique EXCEPT current category
  const existing = await prisma.category.findUnique({
    where: { slug },
  })

  if (existing && existing.id !== id) {
    return { ok: false, error: 'Ce slug est déjà utilisé par une autre catégorie.' }
  }

  // Handle image upload - only if a new file is provided
  let imageUrl: string | null = null
  const existingCategory = await prisma.category.findUnique({
    where: { id },
  })
  
  // Keep existing imageUrl if no new file is uploaded
  if (!imageFile || imageFile.size === 0) {
    imageUrl = existingCategory?.imageUrl || null
  } else if (imageFile && imageFile.size > 0) {
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

  await prisma.category.update({
    where: { id },
    data: { 
      name, 
      slug,
      imageUrl: imageUrl || null,
    },
  })

  redirect('/admin/categories?updated=1')
}
