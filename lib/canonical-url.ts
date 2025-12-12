/**
 * Universal helper to generate canonical URLs for all pages
 * Supports static pages, dynamic routes, and query parameters
 */

interface GenerateCanonicalUrlOptions {
  /**
   * Pathname or route path (e.g., '/boutique', '/boutique/[collection]', '/projets/[slug]')
   * Can include dynamic segments like [slug] or actual values
   */
  pathname: string
  /**
   * Base URL of the website (defaults to env var or https://bk-agencements.com)
   */
  baseUrl?: string
  /**
   * Parameters to replace dynamic segments in pathname
   * Example: { collection: 'chaises', handle: 'chaise-01' } for '/boutique/[collection]/[handle]'
   */
  params?: Record<string, string>
  /**
   * Query parameters to include (optional, usually excluded from canonical URLs)
   * Set to true if you want to include them
   */
  includeQuery?: boolean
  /**
   * Query string to append (if includeQuery is true)
   */
  query?: string | URLSearchParams
}

/**
 * Generates a canonical URL for any page
 * 
 * @param options - Configuration options
 * @returns Absolute canonical URL
 * 
 * @example
 * // Static page
 * generateCanonicalUrl({ pathname: '/boutique' })
 * // Returns: 'https://bk-agencements.com/boutique'
 * 
 * @example
 * // Dynamic route with params
 * generateCanonicalUrl({
 *   pathname: '/boutique/[collection]/[handle]',
 *   params: { collection: 'chaises', handle: 'chaise-01' }
 * })
 * // Returns: 'https://bk-agencements.com/boutique/chaises/chaise-01'
 * 
 * @example
 * // Direct pathname with values
 * generateCanonicalUrl({
 *   pathname: '/boutique/chaises/chaise-01'
 * })
 * // Returns: 'https://bk-agencements.com/boutique/chaises/chaise-01'
 */
export function generateCanonicalUrl({
  pathname,
  baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://bk-agencements.com',
  params,
  includeQuery = false,
  query,
}: GenerateCanonicalUrlOptions): string {
  // Remove trailing slash from baseUrl
  const cleanBaseUrl = baseUrl.replace(/\/$/, '')
  
  // Remove leading slash from pathname for consistency
  let cleanPathname = pathname.startsWith('/') ? pathname : `/${pathname}`
  
  // Replace dynamic segments with actual values if params provided
  if (params && Object.keys(params).length > 0) {
    // Check if pathname contains dynamic segments like [slug], [id], etc.
    const dynamicSegmentRegex = /\[([^\]]+)\]/g
    
    if (dynamicSegmentRegex.test(cleanPathname)) {
      // Replace dynamic segments
      cleanPathname = cleanPathname.replace(dynamicSegmentRegex, (match, key) => {
        return params[key] || match
      })
    } else {
      // If no brackets, try to replace segments manually
      // This handles cases where pathname is already a template
      Object.entries(params).forEach(([key, value]) => {
        cleanPathname = cleanPathname.replace(`[${key}]`, value)
      })
    }
  }
  
  // Remove any remaining dynamic segments (shouldn't happen, but safety check)
  cleanPathname = cleanPathname.replace(/\[[^\]]+\]/g, '')
  
  // Remove trailing slash (except for root)
  if (cleanPathname !== '/' && cleanPathname.endsWith('/')) {
    cleanPathname = cleanPathname.slice(0, -1)
  }
  
  // Build URL
  let canonicalUrl = `${cleanBaseUrl}${cleanPathname}`
  
  // Add query string if requested
  if (includeQuery && query) {
    const queryString = typeof query === 'string' 
      ? query 
      : new URLSearchParams(query).toString()
    
    if (queryString) {
      canonicalUrl = `${canonicalUrl}?${queryString}`
    }
  }
  
  return canonicalUrl
}

/**
 * Helper function specifically for Next.js dynamic routes
 * Extracts params from Next.js route params object
 * 
 * @param pathname - The route pathname (e.g., '/boutique/[collection]/[handle]')
 * @param params - Next.js params object (from route params)
 * @param baseUrl - Optional base URL
 * @returns Canonical URL
 * 
 * @example
 * // In a page component
 * export default async function ProductPage({ params }: { params: { collection: string, handle: string } }) {
 *   const canonical = generateCanonicalFromParams(
 *     '/boutique/[collection]/[handle]',
 *     params
 *   )
 * }
 */
export function generateCanonicalFromParams(
  pathname: string,
  params: Record<string, string | string[] | undefined>,
  baseUrl?: string
): string {
  // Convert Next.js params to string params
  const stringParams: Record<string, string> = {}
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined) {
      // Handle array params (take first value)
      stringParams[key] = Array.isArray(value) ? value[0] : value
    }
  })
  
  return generateCanonicalUrl({
    pathname,
    params: stringParams,
    baseUrl,
  })
}

/**
 * Helper function for static pages
 * 
 * @param pathname - Static pathname (e.g., '/boutique', '/about')
 * @param baseUrl - Optional base URL
 * @returns Canonical URL
 */
export function generateStaticCanonical(
  pathname: string,
  baseUrl?: string
): string {
  return generateCanonicalUrl({ pathname, baseUrl })
}

/**
 * Helper function for pages with query parameters that should be included
 * Use sparingly - most canonical URLs should exclude query params
 * 
 * @param pathname - Pathname
 * @param query - Query parameters
 * @param baseUrl - Optional base URL
 * @returns Canonical URL with query string
 */
export function generateCanonicalWithQuery(
  pathname: string,
  query: Record<string, string> | URLSearchParams,
  baseUrl?: string
): string {
  const queryParams = query instanceof URLSearchParams 
    ? query 
    : new URLSearchParams(query)
  return generateCanonicalUrl({
    pathname,
    baseUrl,
    includeQuery: true,
    query: queryParams,
  })
}

