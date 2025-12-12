'use client'

import { motion } from 'framer-motion'

interface Pillar {
  title: string
  description: string
}

const pillars: Pillar[] = [
  {
    title: 'Sur-Mesure',
    description: 'Chaque projet est conçu spécifiquement selon vos besoins.',
  },
  {
    title: 'Matériaux Nobles',
    description: 'Bois précieux, textiles haut de gamme et métal travaillé avec soin.',
  },
  {
    title: 'Fabrication & Installation',
    description: 'Des équipes internes pour un contrôle total de la qualité.',
  },
]

export default function NotreSignature() {
  return (
    <section className="bg-white section-lg">
      <div className="container-arch">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-12 sm:mb-16 md:mb-20 lg:mb-24"
        >
          <h2 className="text-black mb-6 sm:mb-8 md:mb-10">
            Notre Signature
          </h2>
          <p className="text-container-wide">
            BK Agencements réunit artisanat d'excellence et design sur-mesure.{' '}
            <br className="hidden md:block" />
            Partenaires des architectes, nous donnons vie à des projets uniques où la qualité,{' '}
            <br className="hidden md:block" />
            la précision et la fabrication intégrée sont au cœur de chaque réalisation.
          </p>
        </motion.div>

        {/* Three Vertical Pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 sm:gap-10 md:gap-12 lg:gap-16 xl:gap-20 mt-12 sm:mt-16 md:mt-20 lg:mt-24 xl:mt-32">
          {pillars.map((pillar, index) => (
            <motion.div
              key={pillar.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 1, delay: index * 0.1, ease: [0.25, 0.00, 0.15, 1] }}
              className="relative"
            >
              {/* Subtle Separator - Only show between items on desktop */}
              {index > 0 && (
                <div className="hidden md:block absolute left-0 top-0 bottom-0 w-px bg-neutral-200 -ml-8 lg:-ml-10" />
              )}

              <div className="h-full flex flex-col">
                <h3 className="text-black mb-3 sm:mb-4 md:mb-6">
                  {pillar.title}
                </h3>
                <p className="flex-1 text-container">
                  {pillar.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

