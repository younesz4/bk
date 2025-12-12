'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'

const carouselImages = [
  '/swipe1.jpg',
  '/swipe2.jpg',
  '/swipe3.jpg',
  '/swipe4.jpg',
  '/swipe5.jpg',
  '/swipe6.jpg',
  '/swipe7.jpg',
]

export default function AboutCarousel() {
  return (
    <section className="bg-white section-lg">
      <div className="container-arch">
        {/* Section Title */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-16 md:mb-24 text-center"
        >
          <h2 className="text-black mb-8">
            APPORTER
            <br />
            DES
            <br />
            CRÉATIONS
            <br />
            LÉGENDAIRES
            <br />
            AUX
            <br />
            HISTOIRES
            <br />
            REMARQUABLES
          </h2>
          <p className="text-container-wide mx-auto">
            Chaque pièce de la collection de <span className="font-normal">BK Agencements</span> est soigneusement choisie pour son savoir-faire exceptionnel, ses histoires riches et sa valeur intrinsèque, garantissant qu'elle apporte à la fois fonctionnalité et chaleur à votre espace.
          </p>
        </motion.div>

        {/* Image Carousel */}
        <div className="relative">
          <div className="overflow-x-auto overflow-y-hidden scrollbar-hide">
            <div className="flex gap-6 md:gap-8 lg:gap-12" style={{ width: 'max-content' }}>
              {carouselImages.map((image, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: index * 0.1, ease: [0.25, 0.00, 0.15, 1] }}
                  className="flex-shrink-0 relative w-[80vw] md:w-[60vw] lg:w-[45vw] aspect-[4/3] overflow-hidden bg-neutral-100 rounded-[12px] group"
                  style={{ boxShadow: '0 20px 50px rgba(0,0,0,0.15)' }}
                >
                  <motion.div
                    className="absolute inset-0"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.7, ease: [0.25, 0.00, 0.15, 1] }}
                  >
                    <Image
                      src={image}
                      alt={`Création légendaire ${index + 1} - Collection BK Agencements`}
                      fill
                      className="object-cover"
                      quality={70}
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
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
                  <motion.div
                    className="absolute inset-0 bg-black/0 pointer-events-none"
                    whileHover={{ backgroundColor: 'rgba(0,0,0,0.08)' }}
                    transition={{ duration: 0.7, ease: [0.25, 0.00, 0.15, 1] }}
                  />
                  {/* Warm filter overlay */}
                  <div className="absolute inset-0 bg-[rgba(255,245,230,0.08)] pointer-events-none" />
                  {/* Bottom gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/15 to-transparent pointer-events-none" />
                  {/* Vignette overlay */}
                  <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(circle at center, transparent 70%, rgba(0,0,0,0.25) 100%)' }} />
                </motion.div>
              ))}
            </div>
          </div>
          
          {/* Drag indicator */}
          <div className="flex items-center justify-center mt-8 caption">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
            </svg>
            <span>Glisser pour voir plus</span>
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  )
}

