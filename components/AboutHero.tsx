'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import HeroTitle from '@/components/HeroTitle'
import { useImageLoad } from '@/hooks/useImageLoad'

export default function AboutHero() {
  const { className: imageClassName, handleLoad } = useImageLoad()
  
  return (
    <section className="relative w-full min-h-[90vh] flex items-center justify-center bg-white" style={{ minHeight: '90vh' }}>
      <div className="absolute inset-0 z-0">
        <Image
          src="/a propo hero.jpg"
          alt="Intérieur d'exception - BK Agencements"
          fill
          className={`object-cover object-center ${imageClassName}`}
          priority={true}
          quality={85}
          sizes="100vw"
          loading="eager"
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
        <div className="absolute inset-0 bg-[rgba(255,245,230,0.08)]" />
        {/* Bottom gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/15 to-transparent" />
      </div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-8 text-center py-8 md:py-0">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.25, 0.00, 0.15, 1] }}
        >
          <HeroTitle className="text-white mb-8 md:mb-8" delay={0.2}>
            Un
            <br />
            Curateur
            <br />
            d'élégance
            <br />
            intemporelle
          </HeroTitle>
          <p className="body-text-large text-white/90 text-container mx-auto mt-8 md:mt-8">
            En tant que curateur éminent, <span className="font-normal">BK Agencements</span> s'engage à apporter des pièces exceptionnelles dans votre espace.
          </p>
        </motion.div>
      </div>
    </section>
  )
}

