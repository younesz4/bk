'use client'

import { useParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { useEffect, useMemo } from 'react'
import Link from 'next/link'
import { projects } from '@/lib/data'
import ProjectStructuredData from '@/components/ProjectStructuredData'

// Custom neutral placeholder (warm beige, no green)
const neutralPlaceholder = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWEREiMxUf/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="

// Helper function to extract project metadata
function getProjectMetadata(project: typeof projects[0], index: number) {
  const projectNumber = String(index + 1).padStart(2, '0')
  
  // Extract location from name (e.g., "Appartement Parisien - Le Marais" -> "Le Marais, Paris")
  let location = 'Maroc'
  let country = 'Maroc'
  if (project.name.includes('Parisien') || project.name.includes('Marais')) {
    location = 'Le Marais'
    country = 'France'
  } else if (project.name.includes('Lyon')) {
    location = 'Lyon'
    country = 'France'
  } else if (project.name.includes('Côte d\'Azur')) {
    location = 'Côte d\'Azur'
    country = 'France'
  } else if (project.name.includes('Montréal')) {
    location = 'Montréal'
    country = 'Canada'
  }
  
  // Determine category
  let category = 'Residential'
  if (project.name.toLowerCase().includes('visa') || project.name.toLowerCase().includes('commercial')) {
    category = 'Commercial'
  }
  
  const year = '2024'
  
  return { projectNumber, category, location, country, year }
}

export default function ProjectPage() {
  const params = useParams()
  const router = useRouter()
  const slug = params.slug as string
  const project = projects.find((p) => p.slug === slug)
  const projectIndex = projects.findIndex((p) => p.slug === slug)

  useEffect(() => {
    if (!project) {
      router.push('/projets')
    }
  }, [project, router])

  if (!project) {
    return null
  }

  const metadata = getProjectMetadata(project, projectIndex)
  
  // Get gallery images (exclude hero if it's in the images array)
  let galleryImages = project.images?.filter(img => img !== project.heroImage) || project.images || []
  
  // Project-specific image removal:
  // Project 5 (projet-visa): Remove all gallery images
  if (project.slug === 'projet-visa') {
    galleryImages = []
  }
  
  // Get secondary image for hero (first gallery image or second image)
  const secondaryImage = galleryImages[0] || project.images?.[1] || project.heroImage

  // Layout gallery images into rows
  // Row 1: tall image (3rd) on left (60%), box image (4th) on right (40%)
  const galleryLayout = useMemo(() => {
    if (galleryImages.length === 0) return { row1: { left: null, right: null }, row2: null, row3: null }
    
    const images = [...galleryImages]
    
    // Find tall and box images
    const tallImage = images.find(img => img.includes('tall'))
    const boxImage = images.find(img => img.includes('box'))
    
    // Row 1: tall image (left, 60%) + box image (right, 40%)
    const row1 = {
      left: tallImage || null,
      right: boxImage || null
    }
    
    // No Row 2 or Row 3 needed
    const row2 = null
    const row3 = null
    
    return { row1, row2, row3 }
  }, [galleryImages])

  return (
    <>
      <ProjectStructuredData project={project} />
      <motion.div
        className="bg-white min-h-screen"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.35,
          ease: [0.25, 0.1, 0.25, 1],
          delay: 0.4, // Start after reveal covers screen
        }}
      >
        {/* HERO SECTION - Radaville Style */}
        <section 
          className="relative w-full min-h-screen flex items-center"
          style={{ paddingTop: '5vh' }}
        >
          <div className="w-full max-w-[1600px] mx-auto px-6 md:px-8 lg:px-12 grid grid-cols-1 lg:grid-cols-[70%_30%] gap-8 lg:gap-12 items-center">
            {/* LEFT: Full-height hero image (70% width) */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full h-[60vh] md:h-[70vh] lg:h-[85vh] overflow-hidden"
              style={{ borderRadius: '20px' }}
            >
              <Image
                src={project.heroImage}
                alt={project.name}
                fill
                priority
                quality={85}
                sizes="(max-width: 1024px) 100vw, 70vw"
                className="object-cover object-center"
                placeholder="blur"
                blurDataURL={neutralPlaceholder}
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.style.display = 'none'
                  if (target.parentElement) {
                    target.parentElement.style.background = 'linear-gradient(135deg, #f5f5f0 0%, #e8e8e0 100%)'
                  }
                }}
              />
            </motion.div>

            {/* RIGHT: Metadata (30% width) */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col justify-center space-y-6 md:space-y-8"
            >
              {/* Project Number */}
              <p
                className="text-xs uppercase tracking-[0.25em] text-neutral-500"
                style={{
                  fontFamily: 'var(--font-raleway)',
                  fontWeight: 400,
                  letterSpacing: '0.25em'
                }}
              >
                {metadata.projectNumber}
              </p>

              {/* Category */}
              <p
                className="text-sm uppercase tracking-[0.15em] text-neutral-600"
                style={{
                  fontFamily: 'var(--font-raleway)',
                  fontWeight: 400,
                  letterSpacing: '0.15em'
                }}
              >
                {metadata.category}
              </p>

              {/* Country & Year */}
              <div className="flex flex-col space-y-1">
                <p
                  className="text-sm text-neutral-700"
                  style={{
                    fontFamily: 'var(--font-raleway)',
                    fontWeight: 300
                  }}
                >
                  {metadata.country}
                </p>
                <p
                  className="text-sm text-neutral-700"
                  style={{
                    fontFamily: 'var(--font-raleway)',
                    fontWeight: 300
                  }}
                >
                  {metadata.year}
                </p>
              </div>

              {/* Title */}
              <h1
                className="text-4xl md:text-5xl lg:text-6xl font-medium leading-tight tracking-tight text-neutral-900"
                style={{
                  fontFamily: 'var(--font-bodoni)',
                  fontWeight: 400,
                  letterSpacing: '-0.02em',
                  lineHeight: '1.05'
                }}
              >
                {project.name}
              </h1>

              {/* Short Description */}
              <p
                className="text-base md:text-lg leading-relaxed text-neutral-700 max-w-md"
                style={{
                  fontFamily: 'var(--font-raleway)',
                  fontWeight: 300,
                  lineHeight: '1.6',
                  letterSpacing: '0.01em'
                }}
              >
                {project.description}
              </p>

              {/* Small Secondary Image */}
              {secondaryImage && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  className="relative w-full max-w-[280px] aspect-[4/3] overflow-hidden mt-4"
                  style={{ borderRadius: '20px' }}
                >
                  <Image
                    src={secondaryImage}
                    alt={`${project.name} - Detail`}
                    fill
                    quality={75}
                    sizes="(max-width: 1024px) 100vw, 30vw"
                    className="object-cover object-center"
                    placeholder="blur"
                    blurDataURL={neutralPlaceholder}
                    loading="lazy"
                  />
                </motion.div>
              )}
            </motion.div>
          </div>
        </section>

        {/* COLLAGE SECTION - Radaville Style */}
        {galleryImages.length > 0 && (
          <section 
            className="w-full py-16 md:py-20"
            style={{ backgroundColor: '#f7f6f2' }}
          >
            <div className="w-full max-w-[1600px] mx-auto px-6 md:px-8 lg:px-12 space-y-[30px]">
              {/* Row 1: Tall image (left, 60%) + Box image (right, 40%) */}
              {(galleryLayout.row1.left || galleryLayout.row1.right) && (
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-100px' }}
                  transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  className="grid grid-cols-1 md:grid-cols-[60%_40%] gap-[30px]"
                >
                  {/* Left: Tall image (3rd image) */}
                  {galleryLayout.row1.left && (
                    <div className="relative w-full aspect-[3/4] md:aspect-[2/3] overflow-hidden" style={{ borderRadius: '20px' }}>
                      <Image
                        src={galleryLayout.row1.left}
                        alt={`${project.name} - Gallery`}
                        fill
                        quality={75}
                        sizes="(max-width: 1024px) 100vw, 60vw"
                        className="object-cover"
                        placeholder="blur"
                        blurDataURL={neutralPlaceholder}
                        loading="lazy"
                      />
                    </div>
                  )}
                  
                  {/* Right: Box image (4th image) */}
                  {galleryLayout.row1.right && (
                    <div className="relative w-full aspect-square overflow-hidden" style={{ borderRadius: '20px' }}>
                      <Image
                        src={galleryLayout.row1.right}
                        alt={`${project.name} - Gallery`}
                        fill
                        quality={75}
                        sizes="(max-width: 1024px) 100vw, 40vw"
                        className="object-cover"
                        placeholder="blur"
                        blurDataURL={neutralPlaceholder}
                        loading="lazy"
                      />
                    </div>
                  )}
                </motion.div>
              )}


            </div>
          </section>
        )}

        {/* BACK TO PROJECTS CTA */}
        <section className="relative pt-20 md:pt-28 lg:pt-36 pb-32 md:pb-40 lg:pb-48 bg-white">
          <div className="max-w-[1600px] mx-auto px-6 md:px-8 lg:px-12">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              <Link
                href="/projets"
                className="group inline-flex items-center gap-2 text-neutral-900 hover:text-neutral-700 transition-colors duration-300"
                style={{
                  fontFamily: 'var(--font-raleway)',
                  fontSize: '0.9rem',
                  fontWeight: 400,
                  letterSpacing: '0.08em'
                }}
              >
                <span className="relative inline-block">
                  ← Retour aux projets
                  <span className="absolute bottom-[-2px] left-0 w-0 h-[1px] bg-neutral-900 group-hover:w-full transition-all duration-[400ms]" style={{ transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)' }} />
                </span>
              </Link>
            </motion.div>
          </div>
        </section>
      </motion.div>
    </>
  )
}
