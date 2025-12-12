'use server'

import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'

/**
 * Server action to create a new category
 */
export async function createCategory(formData: FormData) {
  const name = (formData.get('name') as string || '').trim()
  const slugInput = (formData.get('slug') as string || '').trim()

  if (!name) {
    return { ok: false, error: 'Le nom de la catégorie est obligatoire.' }
  }

  // Basic slugify from `slug` OR from `name`
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

  // Check unique slug
  const existing = await prisma.category.findUnique({
    where: { slug },
  })

  if (existing) {
    return { ok: false, error: 'Ce slug est déjà utilisé par une autre catégorie.' }
  }

  await prisma.category.create({
    data: {
      name,
      slug,
    },
  })

  // Redirect back to categories list
  redirect('/admin/categories?created=1')
}

