/**
 * JSON-LD Schema Markup for All Pages
 * Complete structured data for SEO
 */

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://bk-agencements.com'
const siteName = 'BK Agencements'

/**
 * Homepage Schema - WebSite with SearchAction
 */
export function generateHomepageSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteName,
    url: baseUrl,
    description: 'Mobilier sur-mesure haut de gamme, artisanat marocain. Menuiserie, tapisserie et ferronnerie. Agencement intérieur d\'exception au Maroc.',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${baseUrl}/boutique?search={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
    publisher: {
      '@type': 'Organization',
      name: siteName,
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}/logo.png`,
      },
    },
  }
}

/**
 * About Page Schema - AboutPage
 */
export function generateAboutPageSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    name: 'À Propos | BK Agencements',
    description: 'Découvrez l\'histoire et la philosophie de BK Agencements. Expert en mobilier sur-mesure et agencement intérieur au Maroc.',
    url: `${baseUrl}/about`,
    mainEntity: {
      '@type': 'Organization',
      name: siteName,
      description: 'Expert en mobilier sur-mesure et agencement intérieur au Maroc. Menuiserie, tapisserie et ferronnerie d\'exception.',
      address: {
        '@type': 'PostalAddress',
        addressCountry: 'MA',
        addressLocality: 'Casablanca',
      },
      sameAs: [
        // Add social media links if available
      ],
    },
  }
}

/**
 * Boutique (Collection) Page Schema - CollectionPage
 */
export function generateBoutiquePageSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Boutique | Mobilier Sur-Mesure',
    description: 'Collection de mobilier sur-mesure haut de gamme. Chaises, fauteuils, tables, consoles. Artisanat marocain d\'exception.',
    url: `${baseUrl}/boutique`,
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: [], // Will be populated with products
    },
  }
}

/**
 * Category Page Schema - CollectionPage
 */
export function generateCategoryPageSchema(
  categoryName: string,
  categorySlug: string,
  productCount: number
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `${categoryName} | ${siteName}`,
    description: `Découvrez notre collection de ${categoryName.toLowerCase()}. ${productCount} produit${productCount > 1 ? 's' : ''} disponible${productCount > 1 ? 's' : ''}. Mobilier sur-mesure haut de gamme fabriqué au Maroc.`,
    url: `${baseUrl}/boutique/${categorySlug}`,
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: productCount,
      itemListElement: [], // Will be populated with products
    },
  }
}

/**
 * Product Page Schema - Already exists in lib/product-schema.ts
 * This is a reference - use generateProductSchema from that file
 */

/**
 * Projects Page Schema - CollectionPage
 */
export function generateProjectsPageSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Projets | Réalisations Agencement',
    description: 'Portfolio de nos projets d\'agencement intérieur et mobilier sur-mesure. Réalisations résidentielles et commerciales au Maroc.',
    url: `${baseUrl}/projets`,
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: [], // Will be populated with projects
    },
  }
}

/**
 * Single Project Page Schema - CreativeWork
 */
export function generateProjectPageSchema(
  projectName: string,
  projectSlug: string,
  projectDescription: string,
  projectImage?: string,
  projectType?: string
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    '@id': `${baseUrl}/projets/${projectSlug}`,
    name: projectName,
    description: projectDescription,
    image: projectImage ? (projectImage.startsWith('http') ? projectImage : `${baseUrl}${projectImage}`) : undefined,
    url: `${baseUrl}/projets/${projectSlug}`,
    creator: {
      '@type': 'Organization',
      name: siteName,
      url: baseUrl,
    },
    about: {
      '@type': 'Thing',
      name: projectType || 'Agencement intérieur',
    },
    inLanguage: 'fr-FR',
    datePublished: new Date().toISOString(),
  }
}

/**
 * Réalisations Page Schema - CollectionPage
 */
export function generateRealisationsPageSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Réalisations | Portfolio Agencement',
    description: 'Galerie de nos réalisations d\'agencement intérieur et mobilier sur-mesure. Projets résidentiels et commerciaux au Maroc.',
    url: `${baseUrl}/realisations`,
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: [], // Will be populated with projects
    },
  }
}

/**
 * Contact Page Schema - ContactPage
 */
export function generateContactPageSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    name: 'Contact | Devis Gratuit',
    description: 'Contactez BK Agencements pour votre projet de mobilier sur-mesure ou d\'agencement intérieur. Devis gratuit, consultation personnalisée.',
    url: `${baseUrl}/contact`,
    mainEntity: {
      '@type': 'Organization',
      name: siteName,
      url: baseUrl,
      contactPoint: {
        '@type': 'ContactPoint',
        contactType: 'Customer Service',
        availableLanguage: ['French'],
        areaServed: 'MA', // Morocco
      },
    },
  }
}

/**
 * Services Page Schema - Service
 */
export function generateServicesPageSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: 'Services | BK Agencements',
    description: 'Services d\'agencement intérieur et mobilier sur-mesure. Menuiserie, tapisserie, ferronnerie. Consultation et réalisation au Maroc.',
    url: `${baseUrl}/services`,
    provider: {
      '@type': 'Organization',
      name: siteName,
      url: baseUrl,
    },
    areaServed: {
      '@type': 'Country',
      name: 'Morocco',
    },
    serviceType: [
      'Agencement intérieur',
      'Mobilier sur-mesure',
      'Menuiserie',
      'Tapisserie',
      'Ferronnerie',
    ],
  }
}




