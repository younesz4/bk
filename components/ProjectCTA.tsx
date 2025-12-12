'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

export default function ProjectCTA() {
  return (
    <section className="bg-white section-lg">
      <div className="container-arch">
        <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="space-y-6 sm:space-y-8 md:space-y-10"
        >
          {/* Title */}
          <h2 className="text-black text-2xl sm:text-3xl md:text-4xl lg:text-5xl">
            Donnez vie à votre projet
          </h2>

          {/* Subtitle */}
          <p className="text-container mx-auto px-4">
            Parlons de votre espace, de vos besoins et de vos ambitions.
          </p>

          {/* Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-3 sm:gap-4 md:gap-6 justify-center items-center pt-4 px-4"
          >
            <Link
              href="/contact"
              className="lux-btn lux-btn-primary w-full sm:w-auto"
            >
              Contact
            </Link>
            <Link
              href="/devis"
              className="lux-btn lux-btn-secondary w-full sm:w-auto"
            >
              Demander un devis
            </Link>
          </motion.div>
        </motion.div>
        </div>
      </div>
    </section>
  )
}

