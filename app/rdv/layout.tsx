import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Prendre rendez-vous | BK Agencements',
  description: 'Réservez votre consultation pour votre projet d\'agencement sur-mesure. Planifions ensemble votre espace avec nos experts en menuiserie, tapisserie et ferronnerie.',
  keywords: ['rendez-vous', 'consultation', 'agencement sur-mesure', 'BK Agencements', 'menuiserie', 'tapisserie', 'ferronnerie'],
  alternates: {
    canonical: 'https://bk-agencements.com/rdv',
  },
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: 'https://bk-agencements.com/rdv',
    siteName: 'BK Agencements',
    title: 'Prendre rendez-vous | BK Agencements',
    description: 'Réservez votre consultation pour votre projet d\'agencement sur-mesure.',
    images: [
      {
        url: 'https://bk-agencements.com/vila1.jpg',
        width: 1200,
        height: 630,
        alt: 'BK Agencements - Prendre rendez-vous',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Prendre rendez-vous | BK Agencements',
    description: 'Réservez votre consultation pour votre projet d\'agencement sur-mesure.',
    images: ['https://bk-agencements.com/vila1.jpg'],
  },
}

export default function RendezVousLayout({
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
        name: 'Prendre rendez-vous',
        item: 'https://bk-agencements.com/rdv',
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

