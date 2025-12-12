'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'

export default function SavoirFaire() {
  return (
    <section className="relative section-lg" style={{
      background: 'linear-gradient(to bottom, #F7F6F3, #F3F2EE)',
      backgroundImage: 'var(--texture-noise)',
      backgroundSize: 'auto, 600px',
      backgroundRepeat: 'repeat'
    }}>
      <div className="absolute inset-0 light-soft" style={{
        backgroundImage: 'var(--texture-noise)',
        backgroundSize: '600px',
        backgroundRepeat: 'repeat',
        opacity: 0.025
      }} />
      <div className="relative container-arch z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12 md:gap-16 lg:gap-24 items-center">
          {/* Left Column - Text */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="order-2 md:order-1"
          >
            <h2 className="text-black mb-4 sm:mb-6 md:mb-8" style={{ fontSize: 'clamp(1.75rem, 4vw, 3rem)' }}>
              SAVOIR-FAIRE
            </h2>
            <div className="w-16 sm:w-20 md:w-24 h-px bg-black mb-6 sm:mb-8 md:mb-12" />
            
            <div className="space-y-4 sm:space-y-5 md:space-y-6 text-container">
              <p style={{ fontSize: 'clamp(0.95rem, 1.1vw, 1.125rem)' }}>
                BK Agencements allie tradition artisanale 
                et innovation pour créer des espaces d'exception.
              </p>
              <p style={{ fontSize: 'clamp(0.95rem, 1.1vw, 1.125rem)' }}>
                Chaque projet est une œuvre unique, façonnée par nos artisans maîtrisant 
                les techniques ancestrales de la menuiserie, de la tapisserie et de la ferronnerie.
              </p>
              <p style={{ fontSize: 'clamp(0.95rem, 1.1vw, 1.125rem)' }}>
                Nous sélectionnons rigoureusement les matériaux les plus nobles et travaillons 
                en étroite collaboration avec nos clients pour donner vie à leurs visions les plus ambitieuses.
              </p>
            </div>
          </motion.div>

          {/* Right Column - Image */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
            className="relative aspect-[4/3] bg-neutral-100 rounded-[12px] overflow-hidden order-1 md:order-2"
            style={{ boxShadow: 'var(--shadow-soft)' }}
          >
            <Image
              src="/savoir.webp"
              alt="Atelier de fabrication - Savoir-faire artisanal en menuiserie, tapisserie et ferronnerie"
              fill
              className="object-cover"
              quality={75}
              sizes="(max-width: 1024px) 100vw, 50vw"
              loading="lazy"
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
          </motion.div>
        </div>
      </div>
    </section>
  )
}

