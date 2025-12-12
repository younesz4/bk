'use server'

import { prisma } from '@/lib/prisma'
import { verifyAdminSession } from '@/lib/adminAuth'
import { redirect } from 'next/navigation'

/**
 * Server action to delete a category
 * Prevents deletion if category has products
 */
export async function deleteCategory(formData: FormData) {
  const session = await verifyAdminSession()
  if (!session) redirect('/admin/login')

  const id = formData.get('id') as string
  if (!id) return { ok: false, error: 'ID manquant.' }

  // Check if category has products
  const count = await prisma.product.count({
    where: { categoryId: id },
  })

  if (count > 0) {
    return {
      ok: false,
      error: 'Impossible de supprimer : cette catégorie contient encore des produits.',
    }
  }

  try {
    await prisma.category.delete({
      where: { id },
    })
  } catch (error) {
    return {
      ok: false,
      error: 'Erreur lors de la suppression.',
    }
  }

  redirect('/admin/categories?deleted=1')
}

