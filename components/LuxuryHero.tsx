'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import HeroTitle from '@/components/HeroTitle'
import { useImageLoad } from '@/hooks/useImageLoad'

export default function LuxuryHero() {
  const { className: imageClassName, handleLoad } = useImageLoad()
  
  return (
    <section className="relative w-full h-[60vh] sm:h-[70vh] md:h-[80vh] lg:h-screen overflow-hidden" style={{ minHeight: '60vh' }}>
      {/* Architectural texture background */}
      <div className="absolute inset-0 light-soft" style={{
        backgroundImage: 'var(--texture-noise)',
        backgroundSize: '600px',
        backgroundRepeat: 'repeat',
        opacity: 0.03
      }} />
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src="/hero-image.webp"
          alt="Intérieur luxueux avec mobilier sur-mesure BK Agencements"
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
              target.parentElement.style.background = 'linear-gradient(135deg, #000000 0%, #1a1a1a 100%)'
            }
          }}
        />
        {/* Warm filter overlay */}
        <div className="absolute inset-0 bg-[rgba(255,245,230,0.08)]" />
        {/* Bottom gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/15 to-transparent" />
        {/* Existing dark overlay */}
        <div className="absolute inset-0 bg-black/30" />
      </div>

      {/* Content */}
      <div className="relative h-full flex items-center justify-center z-10">
        <div className="text-center px-6 md:px-8 py-8 md:py-0">
          <HeroTitle
            className="text-white mb-6 sm:mb-5 md:mb-6"
            delay={0}
          >
            <span style={{ fontSize: 'clamp(2rem, 6vw, 5rem)' }}>BK AGENCEMENTS</span>
          </HeroTitle>
          
          <p
            className="subtitle text-white/90 mb-8 sm:mb-8 md:mb-12 px-4"
            style={{ fontSize: 'clamp(0.75rem, 1.2vw, 0.875rem)' }}
          >
            Agencement sur-mesure • Mobilier haut de gamme
          </p>

          <div>
            <Link
              href="/about"
              className="lux-btn lux-btn-white"
              aria-label="Découvrir notre histoire"
            >
              Découvrir
            </Link>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.2 }}
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="w-6 h-10 border border-white/50 rounded-full flex items-start justify-center p-2"
          aria-hidden="true"
        >
          <div className="w-1 h-3 bg-white/50 rounded-full" />
        </motion.div>
      </motion.div>
    </section>
  )
}

