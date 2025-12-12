'use client'

import { useEffect } from 'react'
import { Project } from '@/lib/data'

interface ProjectStructuredDataProps {
  project: Project
}

export default function ProjectStructuredData({ project }: ProjectStructuredDataProps) {
  useEffect(() => {
    const baseUrl = 'https://bk-agencements.com'
    const projectUrl = `${baseUrl}/projets/${project.slug}`
    const projectImages = project.images?.map(img => img.startsWith('http') ? img : `${baseUrl}${img}`) || []

    // CreativeWork structured data
    const creativeWorkSchema = {
      '@context': 'https://schema.org',
      '@type': 'CreativeWork',
      name: project.name || project.name,
      description: project.description,
      image: projectImages,
      creator: {
        '@type': 'Organization',
        name: 'BK Agencements',
        url: baseUrl,
      },
      locationCreated: {
        '@type': 'Place',
        name: 'Casablanca, Maroc',
      },
      url: projectUrl,
      datePublished: new Date().toISOString(),
    }

    // Breadcrumb structured data
    const breadcrumbSchema = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Accueil',
          item: baseUrl,
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Projets',
          item: `${baseUrl}/projets`,
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: project.name || project.name,
          item: projectUrl,
        },
      ],
    }

    // Add scripts to head
    const addScript = (schema: object, id: string) => {
      const script = document.createElement('script')
      script.type = 'application/ld+json'
      script.id = id
      script.textContent = JSON.stringify(schema)
      document.head.appendChild(script)
    }

    addScript(creativeWorkSchema, 'project-schema')
    addScript(breadcrumbSchema, 'project-breadcrumb')

    return () => {
      const schemaScript = document.getElementById('project-schema')
      const breadcrumbScript = document.getElementById('project-breadcrumb')
      if (schemaScript) schemaScript.remove()
      if (breadcrumbScript) breadcrumbScript.remove()
    }
  }, [project])

  return null
}

