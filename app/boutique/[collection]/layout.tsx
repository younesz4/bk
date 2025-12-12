import type { Metadata } from 'next'
import { prisma } from '@/lib/prisma'

interface CategoryLayoutProps {
  children: React.ReactNode
  params: Promise<{ collection: string }>
}

async function getCategoryBySlug(slug: string) {
  try {
    const category = await prisma.category.findUnique({
      where: { slug },
    })
    return category
  } catch (error: any) {
    if (error?.code === 'P2001' || error?.message?.includes('does not exist') || error?.message?.includes('no such table')) {
      return null
    }
    console.error('Error fetching category:', error)
    return null
  }
}

export async function generateMetadata({ params }: CategoryLayoutProps): Promise<Metadata> {
  const { collection } = await params
  const category = await getCategoryBySlug(collection)
  
  if (!category) {
    return {
      title: 'Catégorie introuvable | BK Agencements',
      description: 'La catégorie demandée n\'existe pas. Retournez à la boutique BK Agencements.',
    }
  }

  return {
    title: `${category.name} | Mobilier sur-mesure haut de gamme | BK Agencements`,
    description: `Découvrez notre collection de ${category.name.toLowerCase()}. Mobilier sur-mesure haut de gamme. Fabrication artisanale au Maroc.`,
    keywords: [`${category.name.toLowerCase()}`, 'mobilier sur-mesure', 'meubles haut de gamme', 'fabrication artisanale', 'BK Agencements'],
    alternates: {
      canonical: `https://bk-agencements.com/boutique/${category.slug}`,
    },
    openGraph: {
      type: 'website',
      locale: 'fr_FR',
      url: `https://bk-agencements.com/boutique/${category.slug}`,
      siteName: 'BK Agencements',
      title: `${category.name} | Mobilier sur-mesure haut de gamme | BK Agencements`,
      description: `Découvrez notre collection de ${category.name.toLowerCase()}. Mobilier sur-mesure haut de gamme. Fabrication artisanale au Maroc.`,
      images: [
        {
          url: 'https://bk-agencements.com/collectio1.jpg',
          width: 1200,
          height: 630,
          alt: `${category.name} - BK Agencements`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${category.name} | Mobilier sur-mesure haut de gamme | BK Agencements`,
      description: `Découvrez notre collection de ${category.name.toLowerCase()}. Mobilier sur-mesure haut de gamme.`,
      images: ['https://bk-agencements.com/collectio1.jpg'],
    },
  }
}

export default async function CategoryLayout({ children, params }: CategoryLayoutProps) {
  const { collection } = await params
  const category = await getCategoryBySlug(collection)

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
      {
        '@type': 'ListItem',
        position: 3,
        name: category?.name || 'Catégorie',
        item: `https://bk-agencements.com/boutique/${collection}`,
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

