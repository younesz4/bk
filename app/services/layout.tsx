import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Services',
  description: 'Menuiserie sur-mesure, tapisserie d\'exception, ferronnerie artisanale et installation professionnelle. Services haut de gamme pour votre agencement intérieur au Maroc.',
  keywords: ['menuiserie sur-mesure', 'tapisserie', 'ferronnerie', 'installation professionnelle', 'agencement intérieur', 'services mobilier', 'fabrication sur-mesure'],
  alternates: {
    canonical: 'https://bk-agencements.com/services',
  },
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: 'https://bk-agencements.com/services',
    siteName: 'BK Agencements',
    title: 'Services | Menuiserie, Tapisserie & Ferronnerie sur-mesure | BK Agencements',
    description: 'Menuiserie sur-mesure, tapisserie d\'exception, ferronnerie artisanale et installation professionnelle. Services haut de gamme pour votre agencement intérieur au Maroc.',
    images: [
      {
        url: 'https://bk-agencements.com/vila1.jpg',
        width: 1200,
        height: 630,
        alt: 'BK Agencements - Services',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Services | Menuiserie, Tapisserie & Ferronnerie sur-mesure | BK Agencements',
    description: 'Menuiserie sur-mesure, tapisserie d\'exception, ferronnerie artisanale et installation professionnelle au Maroc.',
    images: ['https://bk-agencements.com/vila1.jpg'],
  },
}

export default function ServicesLayout({
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
        name: 'Services',
        item: 'https://bk-agencements.com/services',
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

