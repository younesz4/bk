'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import HeroTitle from '@/components/HeroTitle'

export default function BoutiqueHero() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start']
  })

  // Parallax effect for header
  const headerY = useTransform(scrollYProgress, [0, 0.5], [0, -30])
  const headerOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0.4])

  return (
    <section 
      ref={containerRef}
      className="bg-white section-xl overflow-hidden relative"
    >
      {/* Subtle background texture */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, #000 1px, transparent 0)',
          backgroundSize: '40px 40px'
        }} />
      </div>

      <div className="container-arch relative z-10">
        {/* Header Section */}
        <motion.div
          style={{ y: headerY, opacity: headerOpacity }}
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            duration: 1.2, 
            ease: [0.16, 1, 0.3, 1],
            delay: 0.1
          }}
        >
          {/* Category Label */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ 
              duration: 0.8,
              ease: [0.16, 1, 0.3, 1],
              delay: 0.15
            }}
            className="mb-6 md:mb-8"
          >
            <span className="subtitle text-neutral-500">
              Collection
            </span>
          </motion.div>

          {/* Main Title */}
          <HeroTitle 
            className="mb-8 md:mb-10 lg:mb-12 text-neutral-900"
            delay={0.2}
          >
            Boutique
          </HeroTitle>

          {/* Decorative Line */}
          <motion.div 
            className="w-32 md:w-40 h-[1px] bg-neutral-900 mb-10 md:mb-12"
            initial={{ scaleX: 0, originX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ 
              duration: 1,
              ease: [0.16, 1, 0.3, 1],
              delay: 0.5
            }}
          />

          {/* Description */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              duration: 0.8,
              ease: [0.16, 1, 0.3, 1],
              delay: 0.6
            }}
            className="max-w-2xl"
          >
            <p className="mb-4">
              Découvrez notre collection exclusive de mobilier sur-mesure, où l&apos;artisanat rencontre le design contemporain pour créer des pièces d&apos;exception.
            </p>
            <p className="text-small" style={{ color: '#777' }}>
              Chaque pièce est soigneusement sélectionnée et fabriquée au Maroc avec un savoir-faire traditionnel et une attention aux détails inégalée.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

