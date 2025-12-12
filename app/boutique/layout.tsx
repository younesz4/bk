import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Boutique | Mobilier sur-mesure haut de gamme | BK Agencements',
  description: 'Découvrez notre collection de mobilier haut de gamme. Chaises, fauteuils, tables, consoles et meubles TV sur-mesure. Fabrication artisanale au Maroc.',
  keywords: ['mobilier boutique', 'meubles sur-mesure', 'chaises design', 'fauteuils luxe', 'tables artisanales', 'consoles maroc', 'meubles TV', 'BK Agencements'],
  alternates: {
    canonical: 'https://bk-agencements.com/boutique',
  },
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: 'https://bk-agencements.com/boutique',
    siteName: 'BK Agencements',
    title: 'Boutique | Mobilier sur-mesure haut de gamme | BK Agencements',
    description: 'Découvrez notre collection de mobilier haut de gamme. Fabrication artisanale au Maroc.',
    images: [
      {
        url: 'https://bk-agencements.com/collectio1.jpg',
        width: 1200,
        height: 630,
        alt: 'BK Agencements - Collection mobilier',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Boutique | Mobilier sur-mesure haut de gamme | BK Agencements',
    description: 'Découvrez notre collection de mobilier haut de gamme. Fabrication artisanale au Maroc.',
    images: ['https://bk-agencements.com/collectio1.jpg'],
  },
}

export default function BoutiqueLayout({
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
        name: 'Boutique',
        item: 'https://bk-agencements.com/boutique',
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


