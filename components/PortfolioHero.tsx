'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { Project } from '@/lib/data'
import HeroTitle from '@/components/HeroTitle'
import { useImageLoad } from '@/hooks/useImageLoad'

interface PortfolioHeroProps {
  project: Project
}

export default function PortfolioHero({ project }: PortfolioHeroProps) {
  const { className: imageClassName, handleLoad } = useImageLoad()
  
  return (
    <section className="relative w-full h-[90vh] overflow-hidden">
      <motion.div
        initial={{ opacity: 0, scale: 1.1 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, ease: 'easeOut' }}
        className="absolute inset-0"
      >
        <Image
          src={project.heroImage}
          alt={project.name}
          fill
          className={`object-cover ${imageClassName}`}
          priority
          quality={85}
          sizes="100vw"
          onLoad={handleLoad}
          onError={(e) => {
            const target = e.target as HTMLImageElement
            target.style.display = 'none'
            if (target.parentElement) {
              target.parentElement.style.background = 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)'
            }
          }}
        />
      </motion.div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

      {/* Bottom-Left Text Content */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.4, ease: 'easeOut' }}
        className="absolute bottom-0 left-0 right-0 p-8 md:p-12 lg:p-16 xl:p-20"
      >
        <div className="max-w-7xl mx-auto">
          <div className="max-w-3xl">
            <HeroTitle
              className="text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-serif font-bold text-white mb-6 md:mb-8 leading-tight"
              delay={0.6}
            >
              {project.name}
            </HeroTitle>
            
            <motion.p
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="text-base md:text-lg lg:text-xl xl:text-2xl font-light text-white/90 leading-relaxed max-w-2xl"
            >
              {project.description}
            </motion.p>
          </div>
        </div>
      </motion.div>
    </section>
  )
}

