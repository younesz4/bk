import { prisma } from '@/lib/prisma'
import Image from 'next/image'
import Link from 'next/link'
import type { Metadata } from 'next'
import BoutiqueHero from '@/components/BoutiqueHero'
import type { CategoryWithProducts, ProductWithCategoryAndImages } from '@/lib/types'
import { boutiqueMetadata } from '@/lib/metadata-templates'

export const metadata: Metadata = boutiqueMetadata

async function getCategories(): Promise<CategoryWithProducts[]> {
  try {
    const categories = await prisma.category.findMany({
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
          take: 4,
        },
      },
      orderBy: {
        name: 'asc',
      },
    })
    return categories
  } catch (error: any) {
    // If tables don't exist yet, return empty array
    if (error?.code === 'P2001' || error?.message?.includes('does not exist') || error?.message?.includes('no such table')) {
      console.warn('Database tables not found. Please run: npx prisma migrate dev')
      return []
    }
    console.error('Error fetching categories:', error)
    return []
  }
}

async function getAllProducts(): Promise<ProductWithCategoryAndImages[]> {
  try {
    const products = await prisma.product.findMany({
      where: {
        isPublished: true,
      },
      include: {
        category: true,
        images: {
          orderBy: { order: 'asc' },
          take: 1,
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })
    return products
  } catch (error: any) {
    // If tables don't exist yet, return empty array
    if (error?.code === 'P2001' || error?.message?.includes('does not exist') || error?.message?.includes('no such table')) {
      console.warn('Database tables not found. Please run: npx prisma migrate dev')
      return []
    }
    console.error('Error fetching products:', error)
    return []
  }
}

export default async function BoutiquePage() {
  let categories: CategoryWithProducts[] = []
  let allProducts: ProductWithCategoryAndImages[] = []
  
  try {
    const results = await Promise.all([
      getCategories(),
      getAllProducts(),
    ])
    categories = results[0] || []
    allProducts = results[1] || []
  } catch (error) {
    console.error('Error in BoutiquePage:', error)
    // Continue with empty arrays
  }

  return (
    <div className="bg-frost min-h-screen">
      {/* Hero Section */}
      <BoutiqueHero />

      {/* Categories Grid - Top Section */}
      <section className="section-md bg-frost border-b border-neutral-200">
        <div className="container-arch">
          {categories.length === 0 ? (
            <div className="text-center py-16 md:py-24">
              <p className="text-neutral-700 font-light text-lg md:text-xl mb-2" style={{ fontFamily: 'var(--font-raleway)' }}>
                Les catégories de mobilier sont en cours de préparation.
              </p>
              <p className="text-neutral-600 font-light text-sm md:text-base" style={{ fontFamily: 'var(--font-raleway)' }}>
                Revenez prochainement pour découvrir la collection.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 sm:gap-3 md:gap-4 lg:gap-5">
              {categories.map((category) => {
                // Get category image - use category.imageUrl first, then fallback to product image or placeholder
                let categoryImage: string | null = null
              
                // First priority: use category's own imageUrl
                if (category.imageUrl) {
                  categoryImage = category.imageUrl
                } else if (category.products && category.products[0]?.images?.[0]?.url) {
                  // Second priority: use first product's image as fallback
                  categoryImage = category.products[0].images[0].url
                } else {
                  // Last resort: use category-specific placeholder images
                  const categoryImages: Record<string, string> = {
                    'chaises': '/chaise.jpg',
                    'chaise': '/chaise.jpg',
                    'fauteuil': '/fauteuil.jpg',
                    'fauteuils': '/fauteuil.jpg',
                    'tables': '/table basse.jpg',
                    'table-basse': '/table basse.jpg',
                    'tables-appoint': '/Table dappoint.jpg',
                    'table-dappoint': '/Table dappoint.jpg',
                    'consoles': '/console.jpg',
                    'console': '/console.jpg',
                    'meubles-tv': '/meuble tv.jpg',
                    'meubles tv': '/meuble tv.jpg',
                    'meuble-tv': '/meuble tv.jpg',
                  }
                  categoryImage = categoryImages[category.slug.toLowerCase()] || '/placeholder.jpg'
                }
                
                return (
                  <Link
                    key={category.id}
                    href={`/boutique/${category.slug}`}
                    className="group relative aspect-square overflow-hidden bg-neutral-50 rounded-sm"
                    style={{ 
                      boxShadow: '0 2px 20px rgba(0, 0, 0, 0.06)',
                      transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
                    }}
                  >
                    {categoryImage ? (
                      <>
                        <Image
                          src={categoryImage}
                          alt={category.name}
                          fill
                          className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.08]"
                          quality={75}
                          sizes="(max-width: 640px) 33vw, (max-width: 1024px) 25vw, 16vw"
                          loading="lazy"
                        />
                        {/* Subtle overlay on hover */}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-500 pointer-events-none" />
                        {/* Subtle warm filter */}
                        <div className="absolute inset-0 bg-[rgba(255,245,230,0.03)] pointer-events-none" />
                      </>
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-neutral-100 via-neutral-50 to-neutral-200" />
                    )}
                    
                    {/* Hover border */}
                    <div className="absolute inset-0 border border-transparent group-hover:border-neutral-300 transition-all duration-500 pointer-events-none" />
                    
                    {/* Category Name */}
                    <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 bg-gradient-to-t from-black/40 via-black/20 to-transparent">
                      <h3 
                        className="text-white text-xs sm:text-sm font-light tracking-wide"
                        style={{ 
                          fontFamily: 'var(--font-raleway)',
                          letterSpacing: '0.05em',
                          textShadow: '0 1px 3px rgba(0,0,0,0.3)'
                        }}
                      >
                        {category.name}
                      </h3>
                    </div>
                  </Link>
                )
              })}
            </div>
          )}
        </div>
      </section>

      {/* Products Section */}
      <section className="section-md bg-frost">
        <div className="container-arch">
          {/* Products Header */}
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-12 md:mb-16 gap-6 pb-8 border-b border-neutral-200">
            <div>
              <h2 className="text-neutral-900 mb-3" style={{ fontFamily: 'var(--font-bodoni)' }}>
                Collection
              </h2>
              <p className="text-sm font-light text-neutral-600 tracking-wide" style={{ fontFamily: 'var(--font-raleway)' }}>
                {allProducts.length} pièce{allProducts.length > 1 ? 's' : ''} exclusive{allProducts.length > 1 ? 's' : ''}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <select 
                className="px-4 py-2.5 border border-neutral-300 hover:border-neutral-900 focus:border-neutral-900 rounded-sm text-xs font-light tracking-wide focus:outline-none transition-all duration-300 bg-frost cursor-pointer"
                style={{ fontFamily: 'var(--font-raleway)' }}
              >
                <option>Trier par défaut</option>
                <option>Prix: croissant</option>
                <option>Prix: décroissant</option>
                <option>Nom: A-Z</option>
                <option>Nom: Z-A</option>
              </select>
            </div>
          </div>

          {/* Products Grid */}
          {allProducts.length === 0 ? (
            <div className="text-center py-24 md:py-32">
              <p className="text-neutral-700 font-light text-lg md:text-xl mb-3" style={{ fontFamily: 'var(--font-raleway)' }}>
                Les pièces de la collection seront bientôt disponibles.
              </p>
              <p className="text-neutral-500 font-light text-sm md:text-base" style={{ fontFamily: 'var(--font-raleway)' }}>
                Contactez-nous pour un projet sur-mesure.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-5 lg:gap-8">
              {allProducts.map((product, index) => {
                const isOutOfStock = (product.stock || 0) <= 0
                const isNew = product.createdAt && new Date(product.createdAt).getTime() > Date.now() - 30 * 24 * 60 * 60 * 1000
                
                return (
                  <Link
                    key={product.id}
                    href={`/boutique/${product.category.slug}/${product.slug}`}
                    className="group block product-card"
                    style={{ 
                      animationDelay: `${index * 50}ms`,
                    }}
                  >
                    <div className="relative aspect-[3/4] overflow-hidden bg-neutral-50 mb-1.5 sm:mb-2 md:mb-4 rounded-sm" 
                      style={{ 
                        boxShadow: '0 2px 20px rgba(0, 0, 0, 0.06)',
                        transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
                      }}
                    >
                      {product.images && product.images.length > 0 && product.images[0] ? (
                        <>
                          <Image
                            src={product.images[0].url}
                            alt={product.images[0].alt || product.name}
                            fill
                            className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.08]"
                            quality={85}
                            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                            loading={index < 8 ? "eager" : "lazy"}
                          />
                          {/* Subtle overlay on hover */}
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-500 pointer-events-none" />
                          {/* Subtle warm filter */}
                          <div className="absolute inset-0 bg-[rgba(255,245,230,0.03)] pointer-events-none" />
                        </>
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-neutral-100 via-neutral-50 to-neutral-200" />
                      )}
                      
                      {/* Badges */}
                      <div className="absolute top-1 left-1 sm:top-1.5 sm:left-1.5 md:top-3 md:left-3 flex flex-col gap-0.5 sm:gap-1 md:gap-2">
                        {isNew && (
                          <span 
                            className="px-1 py-0.5 sm:px-1.5 sm:py-0.5 md:px-2.5 md:py-1 bg-neutral-900 text-white text-[8px] sm:text-[9px] md:text-[10px] uppercase tracking-[0.1em] font-light"
                            style={{ fontFamily: 'var(--font-raleway)' }}
                          >
                            Nouveau
                          </span>
                        )}
                        {isOutOfStock && (
                          <span 
                            className="px-1 py-0.5 sm:px-1.5 sm:py-0.5 md:px-2.5 md:py-1 bg-neutral-600 text-white text-[8px] sm:text-[9px] md:text-[10px] uppercase tracking-[0.1em] font-light"
                            style={{ fontFamily: 'var(--font-raleway)' }}
                          >
                            Épuisé
                          </span>
                        )}
                      </div>

                      {/* Hover overlay with subtle border */}
                      <div 
                        className="absolute inset-0 border border-transparent group-hover:border-neutral-300 transition-all duration-500 pointer-events-none"
                        style={{ 
                          boxShadow: 'inset 0 0 0 1px transparent',
                        }}
                      />
                    </div>
                    
                    {/* Product Info */}
                    <div className="space-y-0.5 sm:space-y-1 md:space-y-1.5">
                      <h3 
                        className="text-[10px] sm:text-xs md:text-sm font-light text-neutral-900 group-hover:text-neutral-600 transition-colors duration-300 line-clamp-2 leading-tight sm:leading-relaxed tracking-wide"
                        style={{ 
                          fontFamily: 'var(--font-raleway)',
                          letterSpacing: '0.02em'
                        }}
                      >
                        {product.name}
                      </h3>
                      <p 
                        className="text-[9px] sm:text-xs md:text-sm font-light text-neutral-500 tracking-wide hidden sm:block"
                        style={{ 
                          fontFamily: 'var(--font-raleway)',
                          letterSpacing: '0.05em'
                        }}
                      >
                        {product.category?.name || 'Non catégorisé'}
                      </p>
                      <p 
                        className="text-[10px] sm:text-xs md:text-base font-light text-neutral-900 mt-0.5 sm:mt-1 md:mt-2"
                        style={{ 
                          fontFamily: 'var(--font-raleway)',
                          letterSpacing: '0.02em'
                        }}
                      >
                        {new Intl.NumberFormat('fr-FR', {
                          style: 'currency',
                          currency: 'EUR',
                          minimumFractionDigits: 0,
                          maximumFractionDigits: 0,
                        }).format((product.price || 0) / 100)}
                      </p>
                    </div>
                  </Link>
                )
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
