import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Panier',
  description: 'Votre panier BK Agencements - Mobilier sur-mesure haut de gamme. Finalisez votre commande de mobilier d\'exception.',
  keywords: ['panier', 'commande', 'mobilier sur-mesure', 'achat mobilier', 'BK Agencements'],
  alternates: {
    canonical: 'https://bk-agencements.com/cart',
  },
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: 'https://bk-agencements.com/cart',
    siteName: 'BK Agencements',
    title: 'Panier | BK Agencements',
    description: 'Votre panier BK Agencements - Mobilier sur-mesure haut de gamme.',
    images: [
      {
        url: 'https://bk-agencements.com/vila1.jpg',
        width: 1200,
        height: 630,
        alt: 'BK Agencements - Panier',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Panier | BK Agencements',
    description: 'Votre panier BK Agencements - Mobilier sur-mesure haut de gamme.',
    images: ['https://bk-agencements.com/vila1.jpg'],
  },
  robots: {
    index: false,
    follow: false,
  },
}

export default function CartLayout({
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
        name: 'Panier',
        item: 'https://bk-agencements.com/cart',
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

