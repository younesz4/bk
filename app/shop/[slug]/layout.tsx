import type { Metadata } from 'next'
import { products } from '@/lib/data'
import { notFound } from 'next/navigation'

interface ProductLayoutProps {
  children: React.ReactNode
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: ProductLayoutProps): Promise<Metadata> {
  const { slug } = await params
  const product = products.find((p) => p.slug === slug)

  if (!product) {
    return {
      title: 'Produit non trouvé | BK Agencements',
      description: 'Le produit demandé n\'existe pas. Découvrez notre collection de mobilier sur-mesure.',
    }
  }

  // Use metaTitle and metaDescription if available (from Prisma), otherwise fallback to defaults
  // In production, fetch from API/Prisma where metaTitle/metaDescription would be available
  const metaTitle = product.name // In production: product.metaTitle || product.name
  const metaDescription = product.description 
    ? `${product.description} - Mobilier sur-mesure haut de gamme par BK Agencements.`
    : 'Mobilier sur-mesure haut de gamme par BK Agencements.' // In production: product.metaDescription || fallback

  return {
    title: metaTitle,
    description: metaDescription,
    keywords: [product.name, product.category, 'mobilier sur-mesure', 'meuble design', 'BK Agencements'],
    alternates: {
      canonical: `https://bk-agencements.com/shop/${product.slug}`,
    },
    openGraph: {
      type: 'website',
      locale: 'fr_FR',
      url: `https://bk-agencements.com/shop/${product.slug}`,
      siteName: 'BK Agencements',
      title: `${metaTitle} | Mobilier sur-mesure | BK Agencements`,
      description: metaDescription,
      images: product.images && product.images.length > 0 ? [
        {
          url: `https://bk-agencements.com${product.images[0]}`,
          width: 1200,
          height: 630,
          alt: product.name,
        },
      ] : [
        {
          url: 'https://bk-agencements.com/collectio1.jpg',
          width: 1200,
          height: 630,
          alt: product.name,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${metaTitle} | Mobilier sur-mesure | BK Agencements`,
      description: metaDescription,
      images: product.images && product.images.length > 0 ? [`https://bk-agencements.com${product.images[0]}`] : ['https://bk-agencements.com/collectio1.jpg'],
    },
  }
}

export default async function ProductLayout({ children, params }: ProductLayoutProps) {
  const { slug } = await params
  const product = products.find((p) => p.slug === slug)

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
        item: 'https://bk-agencements.com/shop',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: product?.name || 'Produit',
        item: `https://bk-agencements.com/shop/${slug}`,
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

