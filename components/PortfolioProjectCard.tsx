'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { Project } from '@/lib/data'
import { useImageLoad } from '@/hooks/useImageLoad'

interface PortfolioProjectCardProps {
  project: Project
  index: number
}

export default function PortfolioProjectCard({ project, index }: PortfolioProjectCardProps) {
  const { className: imageClassName, handleLoad } = useImageLoad()
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.8, delay: index * 0.1 }}
    >
      <Link href={`/projets/${project.slug}`} className="group block luxury-link-ripple">
        <div className="relative aspect-[4/3] overflow-hidden bg-neutral-50 mb-6 rounded-[12px] luxury-card-hover" style={{ boxShadow: 'var(--shadow-soft)' }}>
          <Image
            src={project.heroImage}
            alt={project.name}
            fill
            className={`object-cover luxury-image-hover ${imageClassName}`}
            quality={75}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            loading="lazy"
            onLoad={handleLoad}
            onError={(e) => {
              const target = e.target as HTMLImageElement
              target.style.display = 'none'
              if (target.parentElement) {
                target.parentElement.style.background = 'linear-gradient(135deg, #f5f5f5 0%, #e5e5e5 100%)'
              }
            }}
          />
          {/* Warm filter overlay */}
          <div className="absolute inset-0 bg-[rgba(255,245,230,0.08)] pointer-events-none" />
          {/* Bottom gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/15 to-transparent pointer-events-none" />
          {/* Vignette overlay */}
          <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(circle at center, transparent 70%, rgba(0,0,0,0.25) 100%)' }} />
        </div>
        <div>
          <h3 className="text-black mb-2 group-hover:opacity-70 transition-opacity">
            {project.name}
          </h3>
          <p className="text-neutral-600 leading-relaxed line-clamp-2">
            {project.description}
          </p>
        </div>
      </Link>
    </motion.div>
  )
}

