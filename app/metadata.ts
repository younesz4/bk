/**
 * Centralized metadata configuration for BK Agencements
 * Optimized for SEO with luxury interior design keywords
 */

import type { Metadata } from 'next'

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://bk-agencements.com'
const siteName = 'BK Agencements'

function url(path: string): string {
  return `${baseUrl}${path}`
}

function imageUrl(path: string): string {
  return path.startsWith('http') ? path : url(path)
}

// ============================================
// SERVICES PAGE METADATA
// ============================================
export const servicesMetadata: Metadata = {
  title: 'Services | Menuiserie Tapisserie Ferronnerie',
  description: 'Menuiserie, tapisserie et ferronnerie sur-mesure au Maroc. Fabrication artisanale de mobilier haut de gamme et agencement intérieur d\'exception.',
  keywords: [
    'menuiserie',
    'tapisserie',
    'ferronnerie',
    'mobilier sur-mesure',
    'fabrication artisanale',
    'agencement intérieur',
    'artisanat marocain',
    'mobilier haut de gamme',
    'Casablanca',
    'Maroc',
  ],
  authors: [{ name: siteName }],
  category: 'Interior Design & Furniture',
  alternates: {
    canonical: url('/services'),
  },
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: url('/services'),
    siteName: siteName,
    title: 'Services | Menuiserie Tapisserie Ferronnerie | BK Agencements',
    description: 'Menuiserie, tapisserie et ferronnerie sur-mesure au Maroc. Fabrication artisanale de mobilier haut de gamme.',
    images: [
      {
        url: imageUrl('/vila1.jpg'),
        width: 1200,
        height: 630,
        alt: 'BK Agencements - Services',
        type: 'image/jpeg',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Services | Menuiserie Tapisserie Ferronnerie',
    description: 'Menuiserie, tapisserie et ferronnerie sur-mesure au Maroc. Fabrication artisanale de mobilier haut de gamme.',
    images: [imageUrl('/vila1.jpg')],
  },
}

// ============================================
// PROJETS PAGE METADATA
// ============================================
export const projetsMetadata: Metadata = {
  title: 'Projets | Réalisations Agencement',
  description: 'Portfolio de nos projets d\'agencement intérieur et mobilier sur-mesure. Réalisations résidentielles et commerciales au Maroc.',
  keywords: [
    'projets',
    'réalisations',
    'portfolio',
    'agencement intérieur',
    'mobilier sur-mesure',
    'projets résidentiels',
    'projets commerciaux',
    'artisanat marocain',
    'luxe maroc',
    'Maroc',
  ],
  authors: [{ name: siteName }],
  category: 'Portfolio',
  alternates: {
    canonical: url('/projets'),
  },
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: url('/projets'),
    siteName: siteName,
    title: 'Projets | Réalisations Agencement | BK Agencements',
    description: 'Portfolio de nos projets d\'agencement intérieur et mobilier sur-mesure. Réalisations résidentielles et commerciales au Maroc.',
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
    title: 'Projets | Réalisations Agencement',
    description: 'Portfolio de nos projets d\'agencement intérieur et mobilier sur-mesure. Réalisations résidentielles et commerciales au Maroc.',
    images: [imageUrl('/vila1.jpg')],
  },
}




