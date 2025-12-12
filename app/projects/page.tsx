'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { projects } from '@/lib/data'

// Warm beige blur placeholder
const warmBlurPlaceholder = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWEREiMxUf/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="

// Determine project type based on name/description
const getProjectType = (name: string, description: string): string => {
  if (name.toLowerCase().includes('appartement') || name.toLowerCase().includes('villa') || name.toLowerCase().includes('penthouse')) {
    return 'Résidentiel'
  }
  if (name.toLowerCase().includes('loft') || name.toLowerCase().includes('industriel')) {
    return 'Commercial'
  }
  return 'Résidentiel'
}

// Render dynamic layout based on image count
const ProjectPreview = ({ project, index }: { project: typeof projects[0], index: number }) => {
  // Get unique images (hero + gallery images, excluding duplicates)
  const galleryImages = project.images?.filter(img => img !== project.heroImage) || []
  const allImages = [project.heroImage, ...galleryImages]
  const imageCount = allImages.length
  
  // 1 image: Full-width landscape
  if (imageCount === 1) {
    return (
      <div className="relative w-full h-screen min-h-[600px] overflow-hidden group">
        <Image
          src={project.heroImage}
          alt={project.name}
          fill
          className="w-full h-full object-cover group-hover:scale-[1.01] transition-transform duration-700 ease-out"
          quality={75}
          sizes="100vw"
          loading="lazy"
          placeholder="blur"
          blurDataURL={warmBlurPlaceholder}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
      </div>
    )
  }

  // 2 images: Two 50/50 side-by-side tall images
  if (allImages.length === 2) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 h-screen min-h-[600px]">
        {allImages.slice(0, 2).map((src, i) => (
          <div key={i} className="relative w-full h-full overflow-hidden group">
            <Image
              src={src}
              alt={`${project.name} - ${i + 1}`}
              fill
              className="w-full h-full object-cover group-hover:scale-[1.01] transition-transform duration-700 ease-out"
              quality={75}
              loading="lazy"
              placeholder="blur"
              blurDataURL={warmBlurPlaceholder}
              sizes="50vw"
            />
            {i === 0 && <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />}
          </div>
        ))}
      </div>
    )
  }

  // 3 images: One big landscape + two smaller stacked portraits
  if (allImages.length === 3) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 h-screen min-h-[600px]">
        <div className="relative md:col-span-2 w-full h-full overflow-hidden group">
          <Image
            src={allImages[0]}
            alt={project.name}
            fill
            className="w-full h-full object-cover group-hover:scale-[1.01] transition-transform duration-700 ease-out"
            quality={75}
            loading="lazy"
            placeholder="blur"
            blurDataURL={warmBlurPlaceholder}
            sizes="66vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
        </div>
        <div className="grid grid-rows-2 h-full">
          {allImages.slice(1, 3).map((src, i) => (
            <div key={i} className="relative w-full h-full overflow-hidden group">
              <Image
                src={src}
                alt={`${project.name} - ${i + 2}`}
                fill
                className="w-full h-full object-cover group-hover:scale-[1.01] transition-transform duration-700 ease-out"
                quality={75}
                loading="lazy"
                placeholder="blur"
                blurDataURL={warmBlurPlaceholder}
                sizes="33vw"
              />
            </div>
          ))}
        </div>
      </div>
    )
  }

  // 4+ images: One large banner + collage beneath
  return (
    <div className="h-screen min-h-[600px] flex flex-col">
      <div className="relative flex-1 w-full overflow-hidden group">
        <Image
          src={allImages[0]}
          alt={project.name}
          fill
          className="w-full h-full object-cover group-hover:scale-[1.01] transition-transform duration-700 ease-out"
          quality={75}
          loading="lazy"
          placeholder="blur"
          blurDataURL={warmBlurPlaceholder}
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
      </div>
      {allImages.length > 1 && (
        <div className="grid grid-cols-2 md:grid-cols-4 h-1/3">
          {allImages.slice(1, 5).map((src, i) => (
            <div key={i} className="relative w-full h-full overflow-hidden group">
              <Image
                src={src}
                alt={`${project.name} - ${i + 2}`}
                fill
                className="w-full h-full object-cover group-hover:scale-[1.01] transition-transform duration-700 ease-out"
                quality={75}
                loading="lazy"
                placeholder="blur"
                blurDataURL={warmBlurPlaceholder}
                sizes="25vw"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default function ProjectsPage() {
  return (
    <div className="bg-[#FAF8F4] min-h-screen relative">
      {/* Subtle noise texture overlay */}
      <div 
        className="fixed inset-0 opacity-[0.03] pointer-events-none z-0"
        style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, #000 1px, transparent 0)',
          backgroundSize: '40px 40px'
        }}
      />

      {/* Page Title */}
      <section className="relative z-10 pt-24 md:pt-32 pb-12 md:pb-16">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-16 text-center">
          <h1 
            className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-serif font-light leading-[0.95] tracking-[-0.02em] text-neutral-900"
            style={{ fontFamily: 'var(--font-bodoni)' }}
          >
            Projets
          </h1>
        </div>
      </section>

      {/* Full-screen project sections */}
      <div className="relative z-10">
        {projects.map((project, index) => {
          const projectType = getProjectType(project.name, project.description)
          
          return (
            <motion.section
              key={project.id}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="relative"
            >
              <Link href={`/projets/${project.slug}`} className="block group">
                {/* Project Preview - Dynamic Layout */}
                <div className="relative">
                  <ProjectPreview project={project} index={index} />
                  
                  {/* Title & Metadata Overlay */}
                  <div className="absolute inset-0 z-20 flex items-end pointer-events-none">
                    <div className="w-full px-6 md:px-12 lg:px-16 pb-8 md:pb-12 lg:pb-16">
                      <div className="max-w-[1400px] mx-auto">
                        <motion.div
                          initial={{ opacity: 0, y: 30 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.8, delay: 0.2 }}
                          className="flex flex-col md:flex-row md:items-end md:justify-between gap-4"
                        >
                          {/* Title */}
                          <div>
                            <h2 
                              className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-serif font-light leading-[0.95] tracking-[-0.02em] text-white mb-4"
                              style={{ fontFamily: 'var(--font-bodoni)' }}
                            >
                              {project.name}
                            </h2>
                          </div>

                          {/* Metadata */}
                          <div className="flex flex-col md:items-end gap-2 text-white/90">
                            <span className="text-xs md:text-sm uppercase tracking-[0.15em] font-light" style={{ fontFamily: 'var(--font-raleway)' }}>
                              {projectType}
                            </span>
                            <span className="text-xs md:text-sm uppercase tracking-[0.15em] font-light" style={{ fontFamily: 'var(--font-raleway)' }}>
                              Maroc
                            </span>
                            <span className="text-xs md:text-sm uppercase tracking-[0.15em] font-light" style={{ fontFamily: 'var(--font-raleway)' }}>
                              2024
                            </span>
                          </div>
                        </motion.div>
                      </div>
                    </div>
                  </div>

                  {/* Subtle hover shadow */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none z-10" style={{ boxShadow: 'inset 0 0 50px rgba(0,0,0,0.1)' }} />
                </div>
              </Link>
            </motion.section>
          )
        })}
      </div>

      {/* Footer CTA */}
      <section className="relative z-10 bg-[#FAF8F4] py-24 md:py-32">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-16 text-center">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-xl md:text-2xl lg:text-3xl font-light mb-8 text-neutral-900"
            style={{ fontFamily: 'var(--font-bodoni)' }}
          >
            Parlons de votre projet.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <Link
              href="/contact"
              className="inline-block px-8 md:px-12 py-4 md:py-5 bg-neutral-900 text-white text-sm md:text-base uppercase tracking-[0.15em] font-light hover:bg-neutral-800 transition-colors duration-300"
              style={{ fontFamily: 'var(--font-raleway)' }}
            >
              Nous contacter
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
