'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'

export default function MobilierExcellence() {
  const galleryImages = [
    '/collectio1.webp',
    '/collectio2.webp',
    '/collectio3.webp',
    '/collectio4.webp',
    '/collectio5.webp',
    '/collectio6.webp',
  ]

  return (
    <>
      {/* SECTION 1: HERO VISUAL */}
      <section className="relative w-full overflow-hidden">
        {/* Hero Image */}
        <motion.div
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: [0.25, 0.00, 0.15, 1] }}
          className="relative h-[60vh] sm:h-[70vh] md:h-[80vh] lg:h-screen w-full rounded-[12px] overflow-hidden group"
          style={{ boxShadow: 'var(--shadow-soft)', minHeight: '60vh' }}
        >
          <div className="absolute inset-0">
            <Image
              src="/mobil.jpg"
              alt="Collection de mobilier d'exception - Mobilier sur-mesure haut de gamme"
              fill
              className="object-cover"
              quality={75}
              sizes="100vw"
              loading="lazy"
              onError={(e) => {
                const target = e.target as HTMLImageElement
                target.style.display = 'none'
                if (target.parentElement) {
                  target.parentElement.style.background = 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)'
                }
              }}
            />
          </div>
          {/* Warm filter overlay */}
          <div className="absolute inset-0 bg-[rgba(255,245,230,0.08)] pointer-events-none" />
          {/* Bottom gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/15 to-transparent pointer-events-none" />
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent pointer-events-none" />
          {/* Hover overlay */}
          <motion.div
            className="absolute inset-0 bg-black/0 pointer-events-none"
            whileHover={{ backgroundColor: 'rgba(0,0,0,0.06)' }}
            transition={{ duration: 0.7, ease: [0.25, 0.00, 0.15, 1] }}
          />
          
          {/* Bottom-Left Text Content */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.4, ease: [0.25, 0.00, 0.15, 1] }}
            className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 md:p-12 lg:p-16 z-10"
          >
          <div className="container-arch">
            <div className="text-center md:text-left md:max-w-2xl">
              <motion.h2
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1, delay: 0.6, ease: [0.25, 0.00, 0.15, 1] }}
                className="text-white mb-3 sm:mb-4 md:mb-6 lg:mb-8"
                style={{ fontSize: 'clamp(1.5rem, 4vw, 3rem)' }}
              >
                Mobilier d'Exception
              </motion.h2>
              
              <motion.p
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1, delay: 0.8, ease: [0.25, 0.00, 0.15, 1] }}
                className="body-text-large text-white/90 mb-4 sm:mb-6 md:mb-8 lg:mb-10 text-container mx-auto md:mx-0"
                style={{ fontSize: 'clamp(0.95rem, 1.1vw, 1.125rem)' }}
              >
                Des pièces sculpturales, imaginées pour sublimer chaque espace.
                <br className="hidden sm:block" />
                <span className="sm:hidden"> </span>
                Une vision contemporaine du luxe, entre matière et lumière.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1, delay: 1, ease: [0.25, 0.00, 0.15, 1] }}
                className="flex justify-center md:justify-start"
              >
                <Link
                  href="/boutique"
                  className="lux-btn lux-btn-white"
                  aria-label="Explorer la collection de mobilier"
                >
                  Explorer la collection
                </Link>
              </motion.div>
            </div>
          </div>
          </motion.div>
        </motion.div>
      </section>

      {/* SECTION 2: HORIZONTAL SCROLLING GALLERY - 6 SMALLER BOXES */}
      <section className="section-lg bg-frost overflow-hidden">
        <div className="overflow-x-auto overflow-y-hidden scrollbar-hide -mx-4 sm:mx-0">
          <div className="container-arch flex gap-3 sm:gap-4 md:gap-6 lg:gap-8 xl:gap-10" style={{ width: 'max-content' }}>
            {galleryImages.map((image, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.8, delay: index * 0.1, ease: [0.25, 0.00, 0.15, 1] }}
                className="flex-shrink-0 relative w-[240px] sm:w-[45vw] md:w-[35vw] lg:w-[28vw] xl:w-[320px] aspect-[4/3] rounded-[12px] overflow-hidden group"
              >
                <div
                  className="absolute inset-0"
                  style={{ boxShadow: '0 20px 50px rgba(0,0,0,0.15)' }}
                >
                  <Image
                    src={image}
                    alt={`Mobilier d'exception ${index + 1} - Pièce de mobilier sur-mesure`}
                    fill
                    className="object-cover"
                    quality={75}
                    sizes="(max-width: 640px) 45vw, (max-width: 1024px) 35vw, 28vw"
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
                </div>
                <motion.div
                  className="absolute inset-0 bg-black/0 pointer-events-none"
                  whileHover={{ backgroundColor: 'rgba(0,0,0,0.08)' }}
                  transition={{ duration: 0.7, ease: [0.25, 0.00, 0.15, 1] }}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <style jsx global>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </>
  )
}

