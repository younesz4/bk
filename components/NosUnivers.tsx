'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'

interface MetierBlock {
  title: string
  description: string
  image: string
}

const metiers: MetierBlock[] = [
  {
    title: 'Menuiserie',
    description: 'La chaleur du bois travaillée avec précision pour concevoir un mobilier raffiné et durable.',
    image: '/menuisier.webp',
  },
  {
    title: 'Tapisserie',
    description: 'L\'élégance du textile, le confort parfait et des finitions irréprochables.',
    image: '/tapis.webp',
  },
  {
    title: 'Ferronnerie',
    description: 'La force du métal sculptée pour donner vie à des pièces uniques et intemporelles.',
    image: '/frenorie.webp',
  },
]

export default function NosUnivers() {
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
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-8 sm:mb-12 md:mb-16 lg:mb-20 xl:mb-32 text-center md:text-left"
        >
          <h2 className="text-black mb-4 sm:mb-6" style={{ fontSize: 'clamp(1.75rem, 4vw, 3rem)' }}>
            Nos Univers
          </h2>
          <p className="text-container mx-auto md:mx-0 px-4 md:px-0" style={{ fontSize: 'clamp(0.95rem, 1.1vw, 1.125rem)' }}>
            Trois savoir-faire complémentaires réunis pour créer l'exception.
          </p>
        </motion.div>

        {/* Three Blocks Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 md:gap-10 lg:gap-12 xl:gap-16">
          {metiers.map((metier, index) => (
            <motion.div
              key={metier.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 1, delay: index * 0.1, ease: [0.25, 0.00, 0.15, 1] }}
              className="flex flex-col"
            >
              {/* Image */}
              <div className="relative w-full aspect-[4/3] mb-6 sm:mb-8 rounded-lg overflow-hidden">
                <Image
                  src={metier.image}
                  alt={metier.title}
                  fill
                  className="object-cover"
                  quality={75}
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  loading="lazy"
                />
              </div>

              {/* Content */}
              <div className="flex-1">
                <h3 className="text-black mb-3 sm:mb-4" style={{ fontSize: 'clamp(1.25rem, 2.5vw, 1.875rem)' }}>
                  {metier.title}
                </h3>
                <p className="text-container" style={{ fontSize: 'clamp(0.95rem, 1.1vw, 1.125rem)' }}>
                  {metier.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

