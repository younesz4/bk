'use server'

import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import fs from 'fs'
import path from 'path'
import { v4 as uuidv4 } from 'uuid'

/**
 * Server action to update a category
 * Includes error handling and transaction safety for file uploads
 */
export async function updateCategory(id: string, formData: FormData) {
  try {
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

    if (!slug) {
      return { ok: false, error: 'Le slug généré est invalide.' }
    }

    // Check slug unique EXCEPT current category
    const existing = await prisma.category.findUnique({
      where: { slug },
    })

    if (existing && existing.id !== id) {
      return { ok: false, error: 'Ce slug est déjà utilisé par une autre catégorie.' }
    }

    // Get existing category first
    const existingCategory = await prisma.category.findUnique({
      where: { id },
    })

    if (!existingCategory) {
      return { ok: false, error: 'Catégorie introuvable.' }
    }

    // Handle image upload - only if a new file is provided
    let imageUrl: string | null = existingCategory.imageUrl || null
    let uploadedFilePath: string | null = null

    if (imageFile && imageFile.size > 0) {
      try {
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
      } catch (uploadError) {
        console.error('Error uploading image:', uploadError)
        return { ok: false, error: 'Erreur lors du téléchargement de l\'image.' }
      }
    }

    // Update category in database
    try {
      await prisma.category.update({
        where: { id },
        data: { 
          name, 
          slug,
          imageUrl: imageUrl || null,
        },
      })

      redirect('/admin/categories?updated=1')
    } catch (dbError) {
      // If DB update fails, clean up uploaded file
      if (uploadedFilePath && fs.existsSync(uploadedFilePath)) {
        try {
          fs.unlinkSync(uploadedFilePath)
        } catch (cleanupError) {
          console.error('Error cleaning up uploaded file:', cleanupError)
        }
      }
      console.error('Database error updating category:', dbError)
      return { ok: false, error: 'Erreur lors de la mise à jour de la catégorie.' }
    }
  } catch (error) {
    console.error('Unexpected error in updateCategory:', error)
    return { ok: false, error: 'Une erreur inattendue s\'est produite.' }
  }
}
