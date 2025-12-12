import type { Metadata } from 'next'
import { projects } from '@/lib/data'

interface ProjectLayoutProps {
  params: Promise<{ slug: string }>
  children: React.ReactNode
}

// Extract location from project name or description
function extractLocation(projectName: string, description: string): string {
  // Try to extract from name (e.g., "Appartement Parisien - Le Marais" -> "Le Marais, Paris")
  const nameParts = projectName.split(' - ')
  if (nameParts.length > 1) {
    const locationPart = nameParts[1].trim()
    // Map known locations
    const locationMap: Record<string, string> = {
      'le marais': 'Le Marais, Paris, France',
      'lyon': 'Lyon, France',
      'côte d\'azur': 'Côte d\'Azur, France',
      'montréal': 'Montréal, Canada',
    }
    const lowerLocation = locationPart.toLowerCase()
    if (locationMap[lowerLocation]) {
      return locationMap[lowerLocation]
    }
    return locationPart
  }
  
  // Try to extract from description
  const locationKeywords = ['paris', 'lyon', 'marseille', 'montréal', 'casablanca', 'maroc']
  for (const keyword of locationKeywords) {
    if (description.toLowerCase().includes(keyword)) {
      const capitalized = keyword.charAt(0).toUpperCase() + keyword.slice(1)
      if (keyword === 'maroc' || keyword === 'casablanca') {
        return 'Casablanca, Maroc'
      }
      return `${capitalized}, France`
    }
  }
  
  // Default location
  return 'Maroc'
}

// Extract year from project (default to current year or project creation)
function extractYear(projectName: string, description: string): string {
  // Try to find year in description
  const yearMatch = description.match(/\b(20\d{2})\b/)
  if (yearMatch) {
    return yearMatch[1]
  }
  
  // Default to current year
  return new Date().getFullYear().toString()
}

export async function generateMetadata({ params }: ProjectLayoutProps): Promise<Metadata> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://bk-agencements.com'
  const siteName = 'BK Agencements'
  
  const { slug } = await params
  const project = projects.find((p) => p.slug === slug)
  
  // Handle project not found
  if (!project) {
    return {
      title: 'Projet introuvable',
      description: 'Ce projet n\'existe pas ou n\'est plus disponible.',
      alternates: {
        canonical: `${baseUrl}/projets/${slug}`,
      },
    }
  }
  
  // Use project title
  const projectTitle = project.name
  
  // Extract location
  const location = extractLocation(project.name, project.description)
  
  // Extract year
  const year = extractYear(project.name, project.description)
  
  // Use hero image as OpenGraph image
  const heroImage = project.heroImage
  const absoluteImageUrl = heroImage.startsWith('http') 
    ? heroImage 
    : `${baseUrl}${heroImage}`
  
  // Generate description with location and year
  const projectDescription = project.description 
    ? project.description.length > 120
      ? `${project.description.substring(0, 117)}...`
      : project.description
    : `Découvrez ${projectTitle} - Projet d'agencement intérieur réalisé par ${siteName}.`
  
  const metaDescription = `${projectDescription} Localisation: ${location}. Année: ${year}.`
  
  // Generate dynamic title
  const title = `${projectTitle} | ${siteName}`
  
  // Build canonical URL
  const canonicalUrl = `${baseUrl}/projets/${project.slug}`
  
  // Determine project type
  const getProjectType = (name: string, description: string): string => {
    if (name.toLowerCase().includes('appartement') || name.toLowerCase().includes('villa') || name.toLowerCase().includes('penthouse')) {
      return 'Résidentiel'
    }
    if (name.toLowerCase().includes('loft') || name.toLowerCase().includes('industriel')) {
      return 'Commercial'
    }
    return 'Résidentiel'
  }
  
  const projectType = getProjectType(project.name, project.description)
  
  return {
    title,
    description: metaDescription,
    keywords: [
      projectTitle.toLowerCase(),
      'projet',
      'agencement intérieur',
      'décoration intérieure',
      projectType.toLowerCase(),
      location.toLowerCase(),
      year,
      'mobilier sur-mesure',
      'Maroc',
      'Casablanca',
    ],
    alternates: {
      canonical: canonicalUrl,
      languages: {
        'fr-FR': canonicalUrl,
        'fr': canonicalUrl,
      },
    },
    openGraph: {
      type: 'article',
      locale: 'fr_FR',
      url: canonicalUrl,
      siteName: siteName,
      title,
      description: metaDescription,
      images: [
        {
          url: absoluteImageUrl,
          width: 1200,
          height: 630,
          alt: `${projectTitle} - ${siteName}`,
          type: 'image/webp',
        },
      ],
      publishedTime: `${year}-01-01T00:00:00Z`,
      section: projectType,
      tags: [projectType, location, year],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: metaDescription,
      images: [absoluteImageUrl],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    other: {
      'article:published_time': `${year}-01-01T00:00:00Z`,
      'article:section': projectType,
      'article:tag': `${projectType}, ${location}, ${year}`,
      'og:locale': 'fr_FR',
    },
  }
}

export default function ProjectLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
