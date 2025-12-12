import type { Metadata } from 'next'
import { projects } from '@/lib/data'

interface ProjectLayoutProps {
  children: React.ReactNode
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: ProjectLayoutProps): Promise<Metadata> {
  const { slug } = await params
  const project = projects.find((p) => p.slug === slug)

  if (!project) {
    return {
      title: 'Projet non trouvé | BK Agencements',
      description: 'Le projet demandé n\'existe pas. Découvrez nos autres projets d\'agencement intérieur.',
    }
  }

  return {
    title: project.name,
    description: `${project.description} - Projet d'agencement intérieur réalisé par BK Agencements.`,
    keywords: [project.name, 'agencement intérieur', 'projet design', 'décoration intérieure', 'BK Agencements'],
    alternates: {
      canonical: `https://bk-agencements.com/projets/${project.slug}`,
    },
    openGraph: {
      type: 'website',
      locale: 'fr_FR',
      url: `https://bk-agencements.com/projets/${project.slug}`,
      siteName: 'BK Agencements',
      title: `${project.name} | Projet d'agencement intérieur | BK Agencements`,
      description: `${project.description} - Projet d'agencement intérieur réalisé par BK Agencements.`,
      images: project.images && project.images.length > 0 ? [
        {
          url: `https://bk-agencements.com${project.images[0]}`,
          width: 1200,
          height: 630,
          alt: project.name,
        },
      ] : [
        {
          url: 'https://bk-agencements.com/vila1.jpg',
          width: 1200,
          height: 630,
          alt: project.name,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${project.name} | Projet d'agencement intérieur | BK Agencements`,
      description: `${project.description} - Projet réalisé par BK Agencements.`,
      images: project.images && project.images.length > 0 ? [`https://bk-agencements.com${project.images[0]}`] : ['https://bk-agencements.com/vila1.jpg'],
    },
  }
}

export default async function ProjectLayout({ children, params }: ProjectLayoutProps) {
  const { slug } = await params
  const project = projects.find((p) => p.slug === slug)

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
      {
        '@type': 'ListItem',
        position: 3,
        name: project?.name || 'Projet',
        item: `https://bk-agencements.com/projets/${slug}`,
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

