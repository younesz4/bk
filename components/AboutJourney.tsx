'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'

export default function AboutJourney() {
  return (
    <section className="bg-white section-lg">
      <div className="container-arch">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-16 lg:gap-20 items-center">
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease: [0.25, 0.00, 0.15, 1] }}
          >
            <h2 className="text-black mb-8">
              UN
              <br />
              PARCOURS
              <br />
              DE
              <br />
              PASSION
              <br />
              ET
              <br />
              D'EXCELLENCE
            </h2>
            <p className="text-container">
              Animé par la passion, la mission de <span className="font-normal">BK Agencements</span> est de sélectionner un mobilier qui transcende les tendances et le temps.
            </p>
          </motion.div>

          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, delay: 0.2, ease: [0.25, 0.00, 0.15, 1] }}
            className="relative w-full aspect-[4/5] overflow-hidden bg-neutral-100"
          >
            <Image
              src="/a propos .jpg"
              alt="Parcours de passion et d'excellence - BK Agencements"
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
          </motion.div>
        </div>
      </div>
    </section>
  )
}

