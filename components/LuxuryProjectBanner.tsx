'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { Project } from '@/lib/data'

interface LuxuryProjectBannerProps {
  project: Project
  index: number
}

export default function LuxuryProjectBanner({ project, index }: LuxuryProjectBannerProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.8, delay: index * 0.2, ease: [0.25, 0.00, 0.15, 1] }}
      className="group"
    >
      <Link href={`/projets/${project.slug}`} className="block">
        <div className="relative aspect-[4/3] overflow-hidden bg-neutral-100 rounded-[12px]" style={{ boxShadow: '0 20px 50px rgba(0,0,0,0.15)' }}>
          <motion.div
            className="absolute inset-0"
            whileHover={{ scale: 1.06 }}
            transition={{ duration: 0.7, ease: [0.25, 0.00, 0.15, 1] }}
          >
            <Image
              src={project.heroImage || '/placeholder.jpg'}
              alt={project.name}
              fill
              className="object-cover"
              quality={75}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              loading="lazy"
              onError={(e) => {
                const target = e.target as HTMLImageElement
                target.style.display = 'none'
                if (target.parentElement) {
                  target.parentElement.style.background = 'linear-gradient(135deg, #f5f5f5 0%, #e5e5e5 100%)'
                }
              }}
            />
          </motion.div>
          {/* Warm filter overlay */}
          <div className="absolute inset-0 bg-[rgba(255,245,230,0.08)] pointer-events-none" />
          {/* Bottom gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/15 to-transparent pointer-events-none" />
          {/* Vignette overlay */}
          <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(circle at center, transparent 70%, rgba(0,0,0,0.25) 100%)' }} />
          
          {/* Overlay on hover */}
          <motion.div
            className="absolute inset-0 bg-black/0 flex items-center justify-center pointer-events-none"
            whileHover={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
            transition={{ duration: 0.7, ease: [0.25, 0.00, 0.15, 1] }}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileHover={{ opacity: 1, y: 0 }}
              className="text-center px-6"
            >
              <p className="text-white text-sm font-light tracking-[0.2em] uppercase mb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                Découvrir le projet
              </p>
              <h3 className="text-3xl md:text-4xl lg:text-5xl font-extralight text-white tracking-[0.02em] opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                {project.name}
              </h3>
            </motion.div>
          </motion.div>

          {/* Title always visible at bottom */}
          <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
            <h3 className="text-3xl md:text-4xl lg:text-5xl font-extralight text-black group-hover:text-white transition-colors duration-500 tracking-[0.02em]">
              {project.name}
            </h3>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

