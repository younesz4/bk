import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Projets',
  description: 'Découvrez nos projets d\'agencement intérieur réalisés. Des intérieurs d\'exception qui reflètent notre vision du luxe et de l\'élégance au Maroc.',
  keywords: ['projets agencement', 'intérieur design', 'décoration intérieure', 'projets réalisés', 'agencement maroc', 'design intérieur casablanca'],
  alternates: {
    canonical: 'https://bk-agencements.com/projets',
  },
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: 'https://bk-agencements.com/projets',
    siteName: 'BK Agencements',
    title: 'Projets réalisés | Agencement intérieur d\'exception | BK Agencements',
    description: 'Découvrez nos projets d\'agencement intérieur réalisés. Des intérieurs d\'exception qui reflètent notre vision du luxe et de l\'élégance au Maroc.',
    images: [
      {
        url: 'https://bk-agencements.com/vila1.jpg',
        width: 1200,
        height: 630,
        alt: 'BK Agencements - Projets réalisés',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Projets réalisés | Agencement intérieur d\'exception | BK Agencements',
    description: 'Découvrez nos projets d\'agencement intérieur réalisés. Des intérieurs d\'exception au Maroc.',
    images: ['https://bk-agencements.com/vila1.jpg'],
  },
}

export default function ProjetsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Accueil',
        item: 'https://bk-agencements.com',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Projets',
        item: 'https://bk-agencements.com/projets',
      },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {children}
    </>
  )
}

