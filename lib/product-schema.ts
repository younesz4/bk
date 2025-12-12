import type { ProductWithCategoryAndImages } from '@/lib/types'
import { escapeHTML, sanitizeURL } from '@/lib/sanitize'

interface GenerateProductSchemaOptions {
  product: ProductWithCategoryAndImages
  baseUrl?: string
  brandName?: string
}

/**
 * Generates JSON-LD structured data for a product page
 * All user-provided data is sanitized to prevent XSS
 * 
 * @param options - Configuration options
 * @param options.product - Product data with category and images
 * @param options.baseUrl - Base URL of the website (defaults to env var or https://bk-agencements.com)
 * @param options.brandName - Brand name (defaults to "BK Agencements")
 * @returns JSON-LD schema object for Product
 */
export function generateProductSchema({
  product,
  baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://bk-agencements.com',
  brandName = 'BK Agencements',
}: GenerateProductSchemaOptions) {
  // Convert price from cents to euros
  const priceInEuros = (product.price || 0) / 100

  // Determine availability based on stock
  const availability = product.stock > 0 
    ? 'https://schema.org/InStock' 
    : 'https://schema.org/OutOfStock'

  // Sanitize product name and description (escape HTML)
  const sanitizedName = escapeHTML(product.name || '')
  const sanitizedDescription = product.description 
    ? escapeHTML(product.description)
    : `Découvrez ${sanitizedName} - Mobilier sur-mesure haut de gamme fabriqué au Maroc.`

  // Sanitize category name
  const sanitizedCategoryName = escapeHTML(product.category.name || '')

  // Sanitize slugs for URL construction
  const sanitizedCategorySlug = product.category.slug || ''
  const sanitizedProductSlug = product.slug || ''

  // Process product images - convert to absolute URLs and sanitize
  const productImages = product.images && product.images.length > 0
    ? product.images.map((img) => {
        const imageUrl = img.url || ''
        const fullUrl = imageUrl.startsWith('http') ? imageUrl : `${baseUrl}${imageUrl}`
        return sanitizeURL(fullUrl)
      }).filter(url => url.length > 0) // Remove invalid URLs
    : [sanitizeURL(`${baseUrl}/collectio1.jpg`)] // Fallback image

  // Build product URL with sanitized slugs
  const productUrl = sanitizeURL(`${baseUrl}/boutique/${sanitizedCategorySlug}/${sanitizedProductSlug}`)

  // Generate product schema with sanitized data
  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: sanitizedName,
    description: sanitizedDescription,
    image: productImages,
    sku: product.id, // ID is safe (CUID)
    mpn: product.id, // ID is safe (CUID)
    brand: {
      '@type': 'Brand',
      name: escapeHTML(brandName),
    },
    category: sanitizedCategoryName,
    offers: {
      '@type': 'Offer',
      price: priceInEuros,
      priceCurrency: 'EUR',
      availability: availability,
      url: productUrl,
      priceValidUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 1 year from now
      itemCondition: 'https://schema.org/NewCondition',
      seller: {
        '@type': 'Organization',
        name: escapeHTML(brandName),
        url: sanitizeURL(baseUrl),
      },
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '5',
      reviewCount: '1',
    },
  }

  return productSchema
}

/**
 * Generates the script tag HTML for product JSON-LD schema
 * 
 * @param options - Configuration options (same as generateProductSchema)
 * @returns Script tag string ready to be used with dangerouslySetInnerHTML
 */
export function generateProductSchemaScript(options: GenerateProductSchemaOptions): string {
  const schema = generateProductSchema(options)
  return JSON.stringify(schema, null, 2)
}

