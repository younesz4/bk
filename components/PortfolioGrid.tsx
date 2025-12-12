// components/PortfolioGrid.tsx
'use client'

import React, { useState } from 'react'
import { motion, useMotionValue, useTransform } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { Project } from '@/lib/data'

interface PortfolioGridProps {
  projects: Project[]
}

export default function PortfolioGrid({ projects }: PortfolioGridProps) {
  return (
    <div className="w-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 lg:gap-10">
        {projects.map((project, index) => {
          const patternIndex = index % 6
          const isWide = patternIndex === 1 || patternIndex === 5

          return (
            <ProjectCard
              key={project.id}
              project={project}
              index={index}
              isWide={isWide}
            />
          )
        })}
      </div>
    </div>
  )
}

interface ProjectCardProps {
  project: Project
  index: number
  isWide: boolean
}

const ProjectCard = React.memo(function ProjectCard({ project, index, isWide }: ProjectCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const imageX = useTransform(x, [-100, 100], [-12, 12], { clamp: true })
  const imageY = useTransform(y, [-100, 100], [-12, 12], { clamp: true })

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    x.set(e.clientX - centerX)
    y.set(e.clientY - centerY)
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
    x.set(0)
    y.set(0)
  }

  const gridSpan = isWide ? 'sm:col-span-2' : ''

  return (
    <motion.div
      layoutId={`project-${project.id}`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{
        opacity: { duration: 1, delay: index * 0.1, ease: [0.25, 0.00, 0.15, 1] },
        y: { duration: 1, delay: index * 0.1, ease: [0.25, 0.00, 0.15, 1] },
        layout: { duration: 0.9, ease: [0.25, 0.00, 0.15, 1] },
        scale: { duration: 0.7, ease: [0.25, 0.00, 0.15, 1] }
      }}
      whileHover={{ scale: 1.02 }}
      exit={{ scale: 0.95, opacity: 0, transition: { duration: 0.6, ease: [0.25, 0.00, 0.15, 1] } }}
      className={`group relative ${gridSpan} w-full h-[360px] md:h-[420px] lg:h-[520px] overflow-hidden bg-neutral-900 cursor-pointer rounded-xl shadow-sm transition-all duration-500`}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
    >
      <Link href={`/projets/${project.slug}`} className="absolute inset-0 z-10">
        {/* Shared image container - morphs to detail page */}
        <motion.div
          layoutId={`image-${project.id}`}
          className="absolute inset-0"
          style={{
            x: imageX,
            y: imageY,
            willChange: 'transform'
          }}
          transition={{
            layout: { duration: 0.9, ease: [0.25, 0.00, 0.15, 1] },
            default: { duration: 0.7, ease: [0.25, 0.00, 0.15, 1] },
            scale: { duration: 0.6, ease: [0.25, 0.00, 0.15, 1] }
          }}
        >
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: index * 0.08 + 0.2, ease: [0.25, 0.00, 0.15, 1] }}
            className="absolute inset-0"
          >
            <motion.div
              className="absolute inset-0"
              whileHover={{ scale: 1.06 }}
              transition={{ duration: 0.7, ease: [0.25, 0.00, 0.15, 1] }}
            >
              <Image
                src={project.heroImage || '/placeholder.webp'}
                alt={project.name}
                fill
                className="w-full h-full object-cover"
                quality={75}
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                loading="lazy"
              />
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Gradient overlay for readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent z-20 pointer-events-none" />

        {/* Title block */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 p-6 md:p-8 z-30"
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: index * 0.1 + 0.3, ease: [0.25, 0.00, 0.15, 1] }}
          style={{ pointerEvents: 'none' }}
        >
          <h3 className="text-white mb-1 text-xl md:text-2xl font-light" style={{ fontFamily: 'var(--font-bodoni)' }}>
            {project.name}
          </h3>
          <p className="text-white/70 text-sm md:text-base font-light" style={{ fontFamily: 'var(--font-raleway)' }}>
            {project.description.split('.').slice(0, 1).join('.')}
          </p>
        </motion.div>
      </Link>
    </motion.div>
  )
})

ProjectCard.displayName = 'ProjectCard'
