import type { Metadata } from 'next'

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://bk-agencements.com'
const siteName = 'BK Agencements'

/**
 * Helper function to generate absolute URLs
 */
function url(path: string): string {
  return `${baseUrl}${path}`
}

/**
 * Helper function to generate image URLs
 */
function imageUrl(path: string): string {
  return path.startsWith('http') ? path : url(path)
}

// ============================================
// HOME PAGE METADATA
// ============================================
export const homeMetadata: Metadata = {
  title: 'Mobilier Sur-Mesure & Agencement Intérieur',
  description: 'Mobilier sur-mesure haut de gamme, artisanat marocain. Menuiserie, tapisserie et ferronnerie. Agencement intérieur d\'exception au Maroc.',
  keywords: [
    'mobilier sur-mesure',
    'agencement intérieur',
    'artisanat marocain',
    'mobilier haut de gamme',
    'luxe maroc',
    'fabrication artisanale',
    'menuiserie',
    'tapisserie',
    'ferronnerie',
    'Casablanca',
    'Maroc',
  ],
  authors: [{ name: siteName }],
  category: 'Furniture & Interior Design',
  alternates: {
    canonical: url('/'),
  },
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: url('/'),
    siteName: siteName,
    title: 'BK Agencements | Mobilier sur-mesure & Agencement intérieur',
    description: 'Mobilier sur-mesure haut de gamme, menuiserie, tapisserie et ferronnerie. Agencement intérieur d\'exception au Maroc.',
    images: [
      {
        url: imageUrl('/vila1.jpg'),
        width: 1200,
        height: 630,
        alt: 'BK Agencements - Mobilier sur-mesure',
        type: 'image/jpeg',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BK Agencements | Mobilier sur-mesure & Agencement intérieur',
    description: 'Mobilier sur-mesure haut de gamme, menuiserie, tapisserie et ferronnerie. Agencement intérieur d\'exception au Maroc.',
    images: [imageUrl('/vila1.jpg')],
  },
}

// ============================================
// ABOUT PAGE METADATA
// ============================================
export const aboutMetadata: Metadata = {
  title: 'À Propos | BK Agencements',
  description: 'Découvrez l\'histoire et la philosophie de BK Agencements. Expert en mobilier sur-mesure et agencement intérieur au Maroc.',
  keywords: [
    'à propos',
    'histoire',
    'philosophie',
    'savoir-faire',
    'artisanat marocain',
    'expertise',
    'mobilier sur-mesure',
    'agencement intérieur',
    'luxe maroc',
    'Maroc',
  ],
  authors: [{ name: siteName }],
  category: 'About',
  alternates: {
    canonical: url('/about'),
  },
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: url('/about'),
    siteName: siteName,
    title: 'À propos | BK Agencements',
    description: 'Découvrez l\'histoire et la philosophie de BK Agencements. Expert en mobilier sur-mesure et agencement intérieur au Maroc.',
    images: [
      {
        url: imageUrl('/vila1.jpg'),
        width: 1200,
        height: 630,
        alt: 'BK Agencements - À propos',
        type: 'image/jpeg',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'À propos | BK Agencements',
    description: 'Découvrez l\'histoire et la philosophie de BK Agencements. Expert en mobilier sur-mesure et agencement intérieur au Maroc.',
    images: [imageUrl('/vila1.jpg')],
  },
}

// ============================================
// BOUTIQUE PAGE METADATA (Main Shop)
// ============================================
export const boutiqueMetadata: Metadata = {
  title: 'Boutique | Mobilier Sur-Mesure',
  description: 'Collection de mobilier sur-mesure haut de gamme. Chaises, fauteuils, tables, consoles. Artisanat marocain d\'exception.',
  keywords: [
    'boutique',
    'mobilier sur-mesure',
    'mobilier haut de gamme',
    'artisanat marocain',
    'collection mobilier',
    'chaises',
    'fauteuils',
    'tables',
    'consoles',
    'meubles TV',
    'luxe maroc',
    'Maroc',
  ],
  authors: [{ name: siteName }],
  category: 'E-commerce',
  alternates: {
    canonical: url('/boutique'),
  },
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: url('/boutique'),
    siteName: siteName,
    title: 'Boutique | BK Agencements',
    description: 'Découvrez notre collection complète de mobilier sur-mesure. Chaises, fauteuils, tables, consoles, meubles TV et bien plus.',
    images: [
      {
        url: imageUrl('/collectio1.jpg'),
        width: 1200,
        height: 630,
        alt: 'BK Agencements - Boutique',
        type: 'image/jpeg',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Boutique | BK Agencements',
    description: 'Découvrez notre collection complète de mobilier sur-mesure. Chaises, fauteuils, tables, consoles, meubles TV et bien plus.',
    images: [imageUrl('/collectio1.jpg')],
  },
}

// ============================================
// BOUTIQUE CATEGORY PAGE METADATA (Dynamic)
// ============================================
export function generateBoutiqueCategoryMetadata(
  categoryName: string,
  categorySlug: string,
  productCount: number,
  categoryImage?: string
): Metadata {
  const description = `Découvrez notre collection de ${categoryName.toLowerCase()}. ${productCount} produit${productCount > 1 ? 's' : ''} disponible${productCount > 1 ? 's' : ''}. Mobilier sur-mesure haut de gamme fabriqué au Maroc.`
  
  return {
    title: categoryName,
    description,
    keywords: [
      categoryName.toLowerCase(),
      'mobilier',
      'mobilier sur-mesure',
      'agencement intérieur',
      'Maroc',
      'Casablanca',
    ],
    alternates: {
      canonical: url(`/boutique/${categorySlug}`),
    },
    openGraph: {
      type: 'website',
      locale: 'fr_FR',
      url: url(`/boutique/${categorySlug}`),
      siteName: siteName,
      title: `${categoryName} | BK Agencements`,
      description,
      images: [
        {
          url: imageUrl(categoryImage || '/collectio1.jpg'),
          width: 1200,
          height: 630,
          alt: `BK Agencements - ${categoryName}`,
          type: 'image/jpeg',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${categoryName} | BK Agencements`,
      description,
      images: [imageUrl(categoryImage || '/collectio1.jpg')],
    },
  }
}

// ============================================
// BOUTIQUE PRODUCT PAGE METADATA (Dynamic)
// ============================================
export function generateBoutiqueProductMetadata(
  productName: string,
  productSlug: string,
  categoryName: string,
  categorySlug: string,
  description: string | null,
  price: number,
  productImage?: string
): Metadata {
  const priceFormatted = new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
  }).format(price / 100)
  
  const metaDescription = description 
    ? `${description.substring(0, 150)}... Prix: ${priceFormatted}. Disponible dans la catégorie ${categoryName}.`
    : `Découvrez ${productName} - ${categoryName}. Mobilier sur-mesure haut de gamme. Prix: ${priceFormatted}.`
  
  return {
    title: productName,
    description: metaDescription,
    keywords: [
      productName.toLowerCase(),
      categoryName.toLowerCase(),
      'mobilier sur-mesure',
      'mobilier haut de gamme',
      'agencement intérieur',
      'Maroc',
      'Casablanca',
      priceFormatted,
    ],
    alternates: {
      canonical: url(`/boutique/${categorySlug}/${productSlug}`),
    },
    openGraph: {
      type: 'website',
      locale: 'fr_FR',
      url: url(`/boutique/${categorySlug}/${productSlug}`),
      siteName: siteName,
      title: `${productName} | BK Agencements`,
      description: metaDescription,
      images: [
        {
          url: imageUrl(productImage || '/collectio1.jpg'),
          width: 1200,
          height: 630,
          alt: `${productName} - BK Agencements`,
          type: 'image/jpeg',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${productName} | BK Agencements`,
      description: metaDescription,
      images: [imageUrl(productImage || '/collectio1.jpg')],
    },
    other: {
      'product:price:amount': (price / 100).toString(),
      'product:price:currency': 'EUR',
    },
  }
}

// ============================================
// PROJECTS PAGE METADATA
// ============================================
export const projectsMetadata: Metadata = {
  title: 'Projets | Réalisations Agencement',
  description: 'Portfolio de nos projets d\'agencement intérieur et mobilier sur-mesure. Réalisations résidentielles et commerciales au Maroc.',
  keywords: [
    'projets',
    'réalisations',
    'portfolio',
    'agencement intérieur',
    'mobilier sur-mesure',
    'artisanat marocain',
    'projets résidentiels',
    'projets commerciaux',
    'luxe maroc',
    'Maroc',
  ],
  authors: [{ name: siteName }],
  category: 'Portfolio',
  alternates: {
    canonical: url('/projects'),
  },
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: url('/projects'),
    siteName: siteName,
    title: 'Projets | BK Agencements',
    description: 'Découvrez nos réalisations d\'agencement intérieur et de mobilier sur-mesure. Projets résidentiels et commerciaux au Maroc.',
    images: [
      {
        url: imageUrl('/vila1.jpg'),
        width: 1200,
        height: 630,
        alt: 'BK Agencements - Projets',
        type: 'image/jpeg',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Projets | BK Agencements',
    description: 'Découvrez nos réalisations d\'agencement intérieur et de mobilier sur-mesure. Projets résidentiels et commerciaux au Maroc.',
    images: [imageUrl('/vila1.jpg')],
  },
}

// ============================================
// SINGLE PROJECT PAGE METADATA (Dynamic)
// ============================================
export function generateProjectMetadata(
  projectName: string,
  projectSlug: string,
  projectDescription: string,
  projectImage?: string,
  projectType?: string
): Metadata {
  const metaDescription = projectDescription 
    ? `${projectDescription.substring(0, 150)}... Découvrez ce projet d'agencement intérieur réalisé par BK Agencements.`
    : `Découvrez ${projectName} - Projet d'agencement intérieur réalisé par BK Agencements au Maroc.`
  
  return {
    title: projectName,
    description: metaDescription,
    keywords: [
      projectName.toLowerCase(),
      'projet',
      'agencement intérieur',
      'décoration intérieure',
      projectType?.toLowerCase() || 'résidentiel',
      'mobilier sur-mesure',
      'Maroc',
      'Casablanca',
    ],
    alternates: {
      canonical: url(`/projects/${projectSlug}`),
    },
    openGraph: {
      type: 'article',
      locale: 'fr_FR',
      url: url(`/projects/${projectSlug}`),
      siteName: siteName,
      title: `${projectName} | BK Agencements`,
      description: metaDescription,
      images: [
        {
          url: imageUrl(projectImage || '/vila1.jpg'),
          width: 1200,
          height: 630,
          alt: `${projectName} - BK Agencements`,
          type: 'image/jpeg',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${projectName} | BK Agencements`,
      description: metaDescription,
      images: [imageUrl(projectImage || '/vila1.jpg')],
    },
  }
}

// ============================================
// RÉALISATIONS PAGE METADATA
// ============================================
export const realisationsMetadata: Metadata = {
  title: 'Réalisations | Portfolio Agencement',
  description: 'Galerie de nos réalisations d\'agencement intérieur et mobilier sur-mesure. Projets résidentiels et commerciaux au Maroc.',
  keywords: [
    'réalisations',
    'galerie',
    'portfolio',
    'agencement intérieur',
    'mobilier sur-mesure',
    'artisanat marocain',
    'projets résidentiels',
    'luxe maroc',
    'Maroc',
  ],
  authors: [{ name: siteName }],
  category: 'Portfolio',
  alternates: {
    canonical: url('/realisations'),
  },
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: url('/realisations'),
    siteName: siteName,
    title: 'Réalisations | BK Agencements',
    description: 'Galerie de nos réalisations d\'agencement intérieur et de mobilier sur-mesure. Découvrez nos projets résidentiels et commerciaux réalisés au Maroc.',
    images: [
      {
        url: imageUrl('/real1.jpg'),
        width: 1200,
        height: 630,
        alt: 'BK Agencements - Réalisations',
        type: 'image/jpeg',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Réalisations | BK Agencements',
    description: 'Galerie de nos réalisations d\'agencement intérieur et de mobilier sur-mesure. Découvrez nos projets résidentiels et commerciaux réalisés au Maroc.',
    images: [imageUrl('/real1.jpg')],
  },
}

// ============================================
// CONTACT PAGE METADATA
// ============================================
export const contactMetadata: Metadata = {
  title: 'Contact | Devis Gratuit',
  description: 'Contactez BK Agencements pour votre projet de mobilier sur-mesure ou d\'agencement intérieur. Devis gratuit, consultation personnalisée.',
  keywords: [
    'contact',
    'devis',
    'consultation',
    'rendez-vous',
    'mobilier sur-mesure',
    'agencement intérieur',
    'artisanat marocain',
    'Casablanca',
    'Maroc',
  ],
  authors: [{ name: siteName }],
  category: 'Contact',
  alternates: {
    canonical: url('/contact'),
  },
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: url('/contact'),
    siteName: siteName,
    title: 'Contact | BK Agencements',
    description: 'Contactez BK Agencements pour votre projet de mobilier sur-mesure ou d\'agencement intérieur. Devis gratuit, consultation personnalisée.',
    images: [
      {
        url: imageUrl('/vila1.jpg'),
        width: 1200,
        height: 630,
        alt: 'BK Agencements - Contact',
        type: 'image/jpeg',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contact | BK Agencements',
    description: 'Contactez BK Agencements pour votre projet de mobilier sur-mesure ou d\'agencement intérieur. Devis gratuit, consultation personnalisée.',
    images: [imageUrl('/vila1.jpg')],
  },
}

