import { prisma } from '@/lib/prisma'
import { verifyAdminSession } from '@/lib/adminAuth'
import { redirect, notFound } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import EditProductForm from '@/components/admin/EditProductForm'

export const dynamic = 'force-dynamic'

interface PageProps {
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
 * Server action to update a product
 */
async function updateProduct(formData: {
  id: string
  name: string
  description: string
  price: string
  stock: number
  category: string
  newImages: string[]
  removedImages: string[]
  existingImagesCount: number
}) {
  'use server'

  try {
    const {
      id,
      name,
      price,
      stock,
      category,
      description,
      newImages,
      removedImages,
      existingImagesCount,
    } = formData

    // Delete removed images
    if (removedImages.length > 0) {
      await prisma.productImage.deleteMany({
        where: { id: { in: removedImages } },
      })
    }

    // Ensure unique slug (if name changed)
    const existingProduct = await prisma.product.findUnique({
      where: { id },
    })

    let finalSlug = existingProduct?.slug || slugify(name)

    // Only regenerate slug if name changed
    if (existingProduct && name !== existingProduct.name) {
      let slug = slugify(name)
      let counter = 2
      finalSlug = slug

      while (true) {
        const slugExists = await prisma.product.findUnique({
          where: { slug: finalSlug },
        })

        if (!slugExists || slugExists.id === id) {
          break
        }

        finalSlug = `${slug}-${counter}`
        counter++
      }
    }

    // Prepare update data
    const updateData: any = {
      name: name.trim(),
      slug: finalSlug,
      description: description.trim() || null,
      price: Math.round(parseFloat(price) * 100), // Convert to cents
      stock: stock || 0,
      categoryId: category,
    }

    // Only add images.create if there are new images
    if (newImages.length > 0) {
      updateData.images = {
        create: newImages.map((url: string, index: number) => ({
          url,
          alt: name.trim(),
          order: existingImagesCount + index,
        })),
      }
    }

    // Update product fields and add new images
    await prisma.product.update({
      where: { id },
      data: updateData,
    })

    revalidatePath('/admin/products')
    redirect('/admin/products')
  } catch (error: any) {
    // NEXT_REDIRECT is a special error thrown by redirect() - don't catch it
    if (error && typeof error === 'object' && 'digest' in error && error.digest?.startsWith('NEXT_REDIRECT')) {
      throw error // Re-throw redirect errors
    }
    
    console.error('Error updating product:', error)
    // Provide more detailed error message
    const errorMessage = error.message || 'Erreur lors de la mise à jour du produit'
    if (error.code === 'P2002') {
      throw new Error('Un produit avec ce slug existe déjà')
    } else if (error.code === 'P2025') {
      throw new Error('Produit non trouvé')
    }
    throw new Error(errorMessage)
  }
}

export default async function AdminEditProductPage({ params }: PageProps) {
  // Verify session using JWT (new auth system)
  const session = await verifyAdminSession()
  if (!session) {
    redirect('/admin/login')
  }

  const { id } = await params

  // Fetch product with category and images
  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      category: true,
      images: {
        orderBy: { order: 'asc' },
      },
    },
  })

  if (!product) {
    notFound()
  }

  // Fetch categories
  const categories = await prisma.category.findMany({
    orderBy: { name: 'asc' },
  })

  // Format product for client component
  const formattedProduct = {
    id: product.id,
    name: product.name,
    slug: product.slug,
    description: product.description || '',
    price: (product.price / 100).toFixed(2), // Convert cents to EUR
    stock: product.stock || 0,
    categoryId: product.categoryId,
    category: product.category,
    images: product.images.map((img) => ({
      id: img.id,
      url: img.url,
      alt: img.alt || product.name,
      order: img.order,
    })),
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f7f7f5' }}>
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="text-sm text-gray-500 mb-2" style={{ fontFamily: 'var(--font-raleway)' }}>
            [ 04 ]
          </div>
          <h1
            className="text-4xl font-bold text-gray-900 mb-3"
            style={{ fontFamily: 'var(--font-bodoni)' }}
          >
            MODIFIER LE PRODUIT
          </h1>
          <p
            className="text-gray-600 text-sm"
            style={{ fontFamily: 'var(--font-raleway)' }}
          >
            Modifiez les informations du produit.
          </p>
        </div>

        {/* Form Card */}
        <EditProductForm
          product={formattedProduct}
          categories={categories}
          updateProduct={updateProduct}
        />
      </div>
    </div>
  )
}
