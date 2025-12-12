import { escapeHTML, sanitizeURL } from '@/lib/sanitize'

interface BreadcrumbItem {
  name: string
  url: string
}

interface GenerateBreadcrumbSchemaOptions {
  items: BreadcrumbItem[]
  baseUrl?: string
}

/**
 * Generates JSON-LD structured data for breadcrumb navigation
 * All user-provided data is sanitized to prevent XSS
 * 
 * @param options - Configuration options
 * @param options.items - Array of breadcrumb items in order (e.g., [{name: 'Boutique', url: '/boutique'}, {name: 'Category', url: '/boutique/category'}, {name: 'Product', url: '/boutique/category/product'}])
 * @param options.baseUrl - Base URL of the website (defaults to env var or https://bk-agencements.com)
 * @returns JSON-LD schema object for BreadcrumbList
 */
export function generateBreadcrumbSchema({
  items,
  baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://bk-agencements.com',
}: GenerateBreadcrumbSchemaOptions) {
  // Ensure items array is not empty
  if (!items || items.length === 0) {
    throw new Error('Breadcrumb items array cannot be empty')
  }

  // Convert relative URLs to absolute URLs and sanitize
  const breadcrumbItems = items.map((item, index) => {
    // Sanitize name (escape HTML)
    const sanitizedName = escapeHTML(item.name || '')
    
    // Sanitize URL
    const absoluteUrl = item.url.startsWith('http') 
      ? item.url 
      : `${baseUrl}${item.url.startsWith('/') ? item.url : `/${item.url}`}`
    
    const sanitizedUrl = sanitizeURL(absoluteUrl)

    return {
      '@type': 'ListItem',
      position: index + 1,
      name: sanitizedName,
      item: sanitizedUrl,
    }
  })

  // Generate breadcrumb schema
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbItems,
  }

  return breadcrumbSchema
}

/**
 * Helper function to generate breadcrumb schema for Boutique → Category → Product path
 * 
 * @param options - Configuration options
 * @param options.categoryName - Category name
 * @param options.categorySlug - Category slug
 * @param options.productName - Product name
 * @param options.productSlug - Product slug
 * @param options.baseUrl - Base URL (optional)
 * @returns JSON-LD schema object for BreadcrumbList
 */
export function generateProductBreadcrumbSchema({
  categoryName,
  categorySlug,
  productName,
  productSlug,
  baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://bk-agencements.com',
}: {
  categoryName: string
  categorySlug: string
  productName: string
  productSlug: string
  baseUrl?: string
}) {
  // Sanitize slugs for URL construction (slugs should already be safe, but validate)
  const sanitizedCategorySlug = categorySlug || ''
  const sanitizedProductSlug = productSlug || ''
  
  const items: BreadcrumbItem[] = [
    {
      name: 'Boutique',
      url: '/boutique',
    },
    {
      name: categoryName, // Will be sanitized in generateBreadcrumbSchema
      url: `/boutique/${sanitizedCategorySlug}`,
    },
    {
      name: productName, // Will be sanitized in generateBreadcrumbSchema
      url: `/boutique/${sanitizedCategorySlug}/${sanitizedProductSlug}`,
    },
  ]

  return generateBreadcrumbSchema({ items, baseUrl })
}

/**
 * Helper function to generate breadcrumb schema for Boutique → Category path
 * 
 * @param options - Configuration options
 * @param options.categoryName - Category name
 * @param options.categorySlug - Category slug
 * @param options.baseUrl - Base URL (optional)
 * @returns JSON-LD schema object for BreadcrumbList
 */
export function generateCategoryBreadcrumbSchema({
  categoryName,
  categorySlug,
  baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://bk-agencements.com',
}: {
  categoryName: string
  categorySlug: string
  baseUrl?: string
}) {
  // Sanitize slug for URL construction (slug should already be safe, but validate)
  const sanitizedCategorySlug = categorySlug || ''
  
  const items: BreadcrumbItem[] = [
    {
      name: 'Boutique',
      url: '/boutique',
    },
    {
      name: categoryName, // Will be sanitized in generateBreadcrumbSchema
      url: `/boutique/${sanitizedCategorySlug}`,
    },
  ]

  return generateBreadcrumbSchema({ items, baseUrl })
}

/**
 * Generates the script tag HTML for breadcrumb JSON-LD schema
 * 
 * @param options - Configuration options (same as generateBreadcrumbSchema)
 * @returns Script tag string ready to be used with dangerouslySetInnerHTML
 */
export function generateBreadcrumbSchemaScript(
  options: GenerateBreadcrumbSchemaOptions
): string {
  const schema = generateBreadcrumbSchema(options)
  return JSON.stringify(schema, null, 2)
}

