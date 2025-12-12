import { prisma } from '@/lib/prisma'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import type { ProductWithCategoryAndImages } from '@/lib/types'
import CheckoutButton from '@/components/CheckoutButton'
import AddToCartButton from '@/components/AddToCartButton'
import { generateBoutiqueProductMetadata } from '@/lib/metadata-templates'
import { generateProductSchema } from '@/lib/product-schema'
import { generateProductBreadcrumbSchema } from '@/lib/breadcrumb-schema'

interface ProductPageProps {
  params: Promise<{ collection: string; handle: string }>
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://bk-agencements.com'
  const siteName = 'BK Agencements'
  
  const { collection, handle } = await params
  const product = await getProductBySlug(collection, handle)
  
  // Handle product not found
  if (!product) {
    return {
      title: 'Produit introuvable',
      description: 'Ce produit n\'existe pas ou n\'est plus disponible.',
      alternates: {
        canonical: `${baseUrl}/boutique/${collection}/${handle}`,
      },
    }
  }
  
  // Use product name
  const productName = product.name
  
  // Use product description (truncate if too long)
  const productDescription = product.description 
    ? product.description.length > 155
      ? `${product.description.substring(0, 152)}...`
      : product.description
    : `Découvrez ${productName} - Mobilier sur-mesure haut de gamme fabriqué au Maroc.`
  
  // Use first image as OpenGraph image
  const firstImage = product.images && product.images.length > 0 
    ? product.images[0].url 
    : '/collectio1.jpg'
  
  // Generate absolute image URL
  const absoluteImageUrl = firstImage.startsWith('http') 
    ? firstImage 
    : `${baseUrl}${firstImage}`
  
  // Format price
  const priceInEuros = (product.price || 0) / 100
  const priceFormatted = new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
  }).format(priceInEuros)
  
  // Generate dynamic title
  const title = `${productName} | ${siteName}`
  
  // Generate description with price
  const metaDescription = `${productDescription} Prix: ${priceFormatted}. Disponible dans la catégorie ${product.category.name}.`
  
  // Build canonical URL
  const canonicalUrl = `${baseUrl}/boutique/${product.category.slug}/${product.slug}`
  
  // Availability status
  const availability = product.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock'
  
  return {
    title,
    description: metaDescription,
    keywords: [
      productName.toLowerCase(),
      product.category.name.toLowerCase(),
      'mobilier sur-mesure',
      'mobilier haut de gamme',
      'agencement intérieur',
      'Maroc',
      'Casablanca',
      priceFormatted,
      'achat mobilier',
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
      description: metaDescription,
      images: [
        {
          url: absoluteImageUrl,
          width: 1200,
          height: 630,
          alt: `${productName} - ${siteName}`,
          type: 'image/jpeg',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: metaDescription,
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
    other: {
      'product:price:amount': priceInEuros.toString(),
      'product:price:currency': 'EUR',
      'product:availability': availability,
      'product:condition': 'https://schema.org/NewCondition',
      'product:brand': siteName,
      'product:category': product.category.name,
    },
  }
}

async function getProductBySlug(
  categorySlug: string,
  productSlug: string
): Promise<ProductWithCategoryAndImages | null> {
  try {
    const product = await prisma.product.findFirst({
      where: {
        slug: productSlug,
        category: {
          slug: categorySlug,
        },
        isPublished: true,
      },
      include: {
        category: true,
        images: {
          orderBy: { order: 'asc' },
        },
      },
    })
    return product
  } catch (error: any) {
    if (error?.code === 'P2001' || error?.message?.includes('does not exist') || error?.message?.includes('no such table')) {
      return null
    }
    console.error('Error fetching product:', error)
    return null
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { collection, handle } = await params
  const product = await getProductBySlug(collection, handle)

  if (!product) {
    notFound()
  }

  const mainImage = product.images && product.images.length > 0 ? product.images[0] : null
  const otherImages = product.images && product.images.length > 1 ? product.images.slice(1) : []

  // Generate Product JSON-LD Schema using reusable function
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://bk-agencements.com'
  const productStructuredData = generateProductSchema({
    product,
    baseUrl,
    brandName: 'BK Agencements',
  })

  // Generate Breadcrumb JSON-LD Schema
  const breadcrumbStructuredData = generateProductBreadcrumbSchema({
    categoryName: product.category.name,
    categorySlug: product.category.slug,
    productName: product.name,
    productSlug: product.slug,
    baseUrl,
  })

  return (
    <div className="bg-frost min-h-screen pt-32 pb-24">
      {/* Product Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productStructuredData) }}
      />
      {/* Breadcrumb Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbStructuredData) }}
      />
      
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        {/* Breadcrumb */}
        <nav className="mb-8 text-sm text-neutral-600 font-light">
          <Link href="/boutique" className="hover:text-neutral-900 transition-colors">
            Boutique
          </Link>
          <span className="mx-2">/</span>
          <Link
            href={`/boutique/${product.category.slug}`}
            className="hover:text-neutral-900 transition-colors"
          >
            {product.category.name}
          </Link>
          <span className="mx-2">/</span>
          <span className="text-neutral-900">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Image Gallery */}
          <div className="space-y-4">
            {mainImage ? (
              <div className="relative aspect-square bg-neutral-100">
                <Image
                  src={mainImage.url}
                  alt={mainImage.alt || product.name}
                  fill
                  className="object-cover"
                  quality={85}
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
                />
              </div>
            ) : (
              <div className="relative aspect-square bg-gradient-to-br from-neutral-100 to-neutral-200" />
            )}

            {otherImages.length > 0 && (
              <div className="grid grid-cols-4 gap-4">
                {otherImages.map((image, index) => (
                  <div key={image.id} className="relative aspect-square bg-neutral-100">
                    <Image
                      src={image.url}
                      alt={image.alt || `${product.name} ${index + 2}`}
                      fill
                      className="object-cover"
                      quality={70}
                      sizes="(max-width: 640px) 25vw, (max-width: 1024px) 12.5vw, 12.5vw"
                      loading="lazy"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div>
            <p className="text-sm text-neutral-500 font-light mb-4">
              {product.category.name}
            </p>
            <h1 className="text-4xl md:text-5xl text-neutral-900 mb-6 font-light">
              {product.name}
            </h1>
            <p className="text-3xl text-neutral-700 font-light mb-4">
              {new Intl.NumberFormat('fr-FR', {
                style: 'currency',
                currency: 'EUR',
              }).format((product.price || 0) / 100)}
            </p>

            {/* Stock Display */}
            {product.stock > 0 ? (
              <p className="text-green-600 mb-8">En stock ({product.stock})</p>
            ) : (
              <p className="text-red-600 mb-8">Rupture de stock</p>
            )}

            <div className="mb-8 space-y-4">
              <AddToCartButton 
                product={{
                  id: product.id,
                  name: product.name,
                  slug: product.slug,
                  price: product.price,
                  images: product.images,
                  category: product.category,
                  stock: product.stock || 0,
                }}
                className="w-full md:w-auto"
              />
              <div className="text-sm text-neutral-500">
                <p>Ou</p>
              </div>
              <CheckoutButton productId={product.id} />
            </div>

            {product.description && (
              <div className="border-t border-neutral-200 pt-8">
                <p className="text-neutral-700 font-light leading-relaxed">
                  {product.description}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

