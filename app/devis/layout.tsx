import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Demander un devis',
  description: 'Demandez un devis gratuit pour votre projet d\'agencement intérieur et mobilier sur-mesure. BK Agencements - Expertise en menuiserie, tapisserie et ferronnerie au Maroc.',
  keywords: ['devis', 'devis gratuit', 'devis agencement', 'devis mobilier', 'devis sur-mesure', 'BK Agencements'],
  alternates: {
    canonical: 'https://bk-agencements.com/devis',
  },
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: 'https://bk-agencements.com/devis',
    siteName: 'BK Agencements',
    title: 'Demander un devis | BK Agencements',
    description: 'Demandez un devis gratuit pour votre projet d\'agencement intérieur et mobilier sur-mesure.',
    images: [
      {
        url: 'https://bk-agencements.com/vila1.jpg',
        width: 1200,
        height: 630,
        alt: 'BK Agencements - Demander un devis',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Demander un devis | BK Agencements',
    description: 'Demandez un devis gratuit pour votre projet d\'agencement intérieur et mobilier sur-mesure.',
    images: ['https://bk-agencements.com/vila1.jpg'],
  },
}

export default function DevisLayout({
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
        name: 'Demander un devis',
        item: 'https://bk-agencements.com/devis',
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

