import { prisma } from '@/lib/prisma'
import Image from 'next/image'
import Link from 'next/link'
import type { Metadata } from 'next'
import type { CategoryWithProducts } from '@/lib/types'
import { generateBoutiqueCategoryMetadata } from '@/lib/metadata-templates'
import { generateCategoryBreadcrumbSchema } from '@/lib/breadcrumb-schema'
import { generateCategoryPageSchema } from '@/lib/json-ld-schemas'
import { getCategorySEOContent, generateDefaultCategorySEOContent } from '@/lib/category-seo-content'

interface CategoryPageProps {
  params: Promise<{ collection: string }>
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://bk-agencements.com'
  const siteName = 'BK Agencements'
  
  const { collection } = await params
  const category = await getCategoryBySlug(collection)
  
  // Handle category not found
  if (!category) {
    return {
      title: 'Catégorie introuvable',
      description: 'Cette catégorie n\'existe pas ou n\'est plus disponible.',
      alternates: {
        canonical: `${baseUrl}/boutique/${collection}`,
      },
    }
  }
  
  // Pull category name
  const categoryName = category.name
  const categorySlug = category.slug
  const productCount = category.products.length
  
  // Pull first product image as OpenGraph image
  let ogImageUrl = '/collectio1.jpg' // Fallback image
  if (category.products && category.products.length > 0) {
    const firstProduct = category.products[0]
    if (firstProduct.images && firstProduct.images.length > 0 && firstProduct.images[0]?.url) {
      ogImageUrl = firstProduct.images[0].url
    }
  }
  
  // Generate absolute image URL
  const absoluteImageUrl = ogImageUrl.startsWith('http') 
    ? ogImageUrl 
    : `${baseUrl}${ogImageUrl}`
  
  // Generate dynamic title
  const title = `${categoryName} | ${siteName}`
  
  // Generate dynamic description
  const description = productCount > 0
    ? `Découvrez notre collection de ${categoryName.toLowerCase()}. ${productCount} produit${productCount > 1 ? 's' : ''} disponible${productCount > 1 ? 's' : ''}. Mobilier sur-mesure haut de gamme fabriqué au Maroc.`
    : `Découvrez notre collection de ${categoryName.toLowerCase()}. Mobilier sur-mesure haut de gamme fabriqué au Maroc.`
  
  // Build canonical URL
  const canonicalUrl = `${baseUrl}/boutique/${categorySlug}`
  
  return {
    title,
    description,
    keywords: [
      categoryName.toLowerCase(),
      'mobilier',
      'mobilier sur-mesure',
      'agencement intérieur',
      'Maroc',
      'Casablanca',
      'boutique',
      'collection',
    ],
    alternates: {
      canonical: canonicalUrl,
      languages: {
        'fr-FR': canonicalUrl,
        'fr': canonicalUrl,
      },
    },
    openGraph: {
      type: 'website',
      locale: 'fr_FR',
      url: canonicalUrl,
      siteName: siteName,
      title,
      description,
      images: [
        {
          url: absoluteImageUrl,
          width: 1200,
          height: 630,
          alt: `${categoryName} - ${siteName}`,
          type: 'image/jpeg',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [absoluteImageUrl],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  }
}

async function getCategoryBySlug(slug: string): Promise<CategoryWithProducts | null> {
  try {
    const category = await prisma.category.findUnique({
      where: { slug },
      include: {
        products: {
          where: {
            isPublished: true,
          },
          include: {
            images: {
              orderBy: { order: 'asc' },
              take: 1,
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    })
    return category
  } catch (error: any) {
    if (error?.code === 'P2001' || error?.message?.includes('does not exist') || error?.message?.includes('no such table')) {
      return null
    }
    console.error('Error fetching category:', error)
    return null
  }
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { collection } = await params
  const category = await getCategoryBySlug(collection)

  if (!category) {
    return (
      <div className="bg-white min-h-screen">
        <section className="section-md bg-white">
          <div className="container-arch">
            <div className="text-center py-16 md:py-24">
              <p className="text-neutral-700 font-light text-lg md:text-xl mb-2">
                Cette catégorie n'existe pas ou n'est plus disponible.
              </p>
              <Link
                href="/boutique"
                className="inline-block mt-6 px-6 py-3 border border-neutral-300 text-neutral-700 hover:border-neutral-900 hover:text-neutral-900 transition-colors font-light"
              >
                Retour à la boutique
              </Link>
            </div>
          </div>
        </section>
      </div>
    )
  }

  // Generate JSON-LD Schemas
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://bk-agencements.com'
  const breadcrumbStructuredData = generateCategoryBreadcrumbSchema({
    categoryName: category.name,
    categorySlug: category.slug,
    baseUrl,
  })
  
  const categoryPageSchema = generateCategoryPageSchema(
    category.name,
    category.slug,
    category.products.length
  )
  
  // Get SEO content for category
  const seoContent = getCategorySEOContent(category.slug) || generateDefaultCategorySEOContent(category.name)

  return (
    <div className="bg-white min-h-screen">
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbStructuredData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(categoryPageSchema) }}
      />
      
      {/* Category Header */}
      <section className="section-md bg-white border-b border-neutral-200">
        <div className="container-arch">
          <div className="mb-8">
            <Link 
              href="/boutique"
              className="text-sm text-neutral-600 hover:text-neutral-900 transition-colors mb-4 inline-block"
            >
              ← Retour à la boutique
            </Link>
            <h1 className="text-4xl md:text-5xl font-light text-neutral-900 mb-4">
              {category.name}
            </h1>
            {category.products.length > 0 && (
              <p className="text-neutral-600 font-light">
                {category.products.length} produit{category.products.length > 1 ? 's' : ''} disponible{category.products.length > 1 ? 's' : ''}
              </p>
            )}
          </div>
          
          {/* SEO Content Block */}
          <div className="mt-8 md:mt-12 max-w-3xl">
            <h2 className="text-2xl md:text-3xl font-light text-neutral-900 mb-6">
              {category.name} sur-mesure
            </h2>
            <div className="prose prose-neutral max-w-none">
              <p className="text-neutral-700 font-light leading-relaxed text-base md:text-lg">
                {seoContent}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="section-md bg-white">
        <div className="container-arch">
          {category.products.length === 0 ? (
            <div className="text-center py-16 md:py-24">
              <p className="text-neutral-700 font-light text-lg md:text-xl mb-2">
                Les pièces de cette catégorie seront bientôt disponibles.
              </p>
              <Link
                href="/boutique"
                className="inline-block mt-6 px-6 py-3 border border-neutral-300 text-neutral-700 hover:border-neutral-900 hover:text-neutral-900 transition-colors font-light"
              >
                Retour à la boutique
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5 md:gap-6">
              {category.products.map((product) => (
                <Link
                  key={product.id}
                  href={`/boutique/${category.slug}/${product.slug}`}
                  className="group bg-white border border-neutral-200 hover:border-neutral-400 transition-all duration-300"
                >
                  <div className="relative aspect-[5/6] overflow-hidden bg-neutral-100 rounded-[12px]" style={{ boxShadow: 'var(--shadow-soft)' }}>
                    {product.images && product.images.length > 0 && product.images[0] ? (
                      <>
                        <Image
                          src={product.images[0].url}
                          alt={product.images[0].alt || product.name}
                          fill
                          className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                          quality={70}
                          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                          loading="lazy"
                        />
                        {/* Warm filter overlay */}
                        <div className="absolute inset-0 bg-[rgba(255,245,230,0.08)] pointer-events-none" />
                        {/* Bottom gradient */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/15 to-transparent pointer-events-none" />
                      </>
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-neutral-100 to-neutral-200" />
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="text-small text-neutral-900 mb-2 group-hover:text-neutral-600 transition-colors line-clamp-2">
                      {product.name}
                    </h3>
                    <p className="text-base font-light text-neutral-900">
                      {new Intl.NumberFormat('fr-FR', {
                        style: 'currency',
                        currency: 'EUR',
                      }).format((product.price || 0) / 100)}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

