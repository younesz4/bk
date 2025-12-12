'use client'

import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import { useEffect } from 'react'
import { projects } from '@/lib/data'
import ProjectGallery from '@/components/ProjectGallery'
import { useImageLoad } from '@/hooks/useImageLoad'

export default function ProjectPage() {
  const params = useParams()
  const router = useRouter()
  const slug = params.slug as string
  const project = projects.find((p) => p.slug === slug)
  const { className: imageClassName, handleLoad } = useImageLoad()

  useEffect(() => {
    if (!project) {
      router.push('/projets')
    }
  }, [project, router])

  if (!project) {
    return null
  }

  return (
    <div className="bg-[#F7F5F2] min-h-screen">
      {/* Hero Section - Standardized */}
      <section className="relative w-full h-[70vh] min-h-[600px] overflow-hidden">
        <Image
          src={project.heroImage}
          alt={project.name}
          fill
          className={`w-full h-full object-cover ${imageClassName}`}
          priority
          quality={85}
          sizes="100vw"
          onLoad={handleLoad}
        />
        {/* Soft dark gradient at bottom for readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
      </section>

      {/* Project Title Block - Unified spacing */}
      <section className="max-w-[1300px] mx-auto px-4 py-24 md:py-32">
        <div className="text-center">
          {/* Title */}
          <h1 className="text-4xl md:text-6xl font-light tracking-tight mb-4" style={{ fontFamily: 'var(--font-bodoni)', color: '#0E0E0E' }}>
            {project.name}
          </h1>

          {/* Subtitle */}
          <p className="uppercase text-sm tracking-widest text-neutral-500 mt-4 mb-8" style={{ fontFamily: 'var(--font-raleway)' }}>
            Projet d'agencement intérieur
          </p>

          {/* Description */}
          <p className="text-lg md:text-xl lg:text-2xl font-light leading-[1.8] mx-auto max-w-[70%]" style={{ color: '#0E0E0E', fontFamily: 'var(--font-raleway)' }}>
            {project.description}
          </p>
        </div>
      </section>

      {/* Image Gallery Section - Adaptive layout */}
      {project.images && project.images.length > 0 && (
        <ProjectGallery 
          images={project.images.filter(img => img !== project.heroImage)} 
          projectName={project.name} 
        />
      )}

      {/* Navigation - Return Button */}
      <section className="max-w-[1300px] mx-auto px-4 py-24 md:py-32">
        <div className="border-t border-neutral-300 pt-12">
          <button
            onClick={() => router.push('/projets')}
            className="text-sm md:text-base font-light text-[#0E0E0E] hover:underline transition-all duration-300"
            style={{ fontFamily: 'var(--font-raleway)' }}
          >
            Retour aux projets
          </button>
        </div>
      </section>
    </div>
  )
}
