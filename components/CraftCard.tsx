'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'

interface CraftCardProps {
  title: string
  description: string
  image: string
  href: string
  index: number
}

export default function CraftCard({ title, description, image, href, index }: CraftCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 1, delay: index * 0.1, ease: [0.25, 0.00, 0.15, 1] }}
      className="group"
    >
      <Link href={href} className="block luxury-link-ripple">
        <div className="relative aspect-[4/3] overflow-hidden bg-neutral-100 rounded-[12px] luxury-card-hover" style={{ boxShadow: '0 20px 50px rgba(0,0,0,0.15)' }}>
          <motion.div
            className="absolute inset-0"
            whileHover={{ scale: 1.03 }}
            transition={{ duration: 0.4, ease: [0.34, 1.56, 0.64, 1] }}
          >
            <Image
              src={image}
              alt={title}
              fill
              className="object-cover luxury-image-hover"
              quality={75}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
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
          {/* Warm filter overlay */}
          <div className="absolute inset-0 bg-[rgba(255,245,230,0.08)] pointer-events-none" />
          {/* Bottom gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/15 to-transparent pointer-events-none" />
          {/* Vignette overlay */}
          <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(circle at center, transparent 70%, rgba(0,0,0,0.25) 100%)' }} />
          <motion.div
            className="absolute inset-0 bg-black/0 pointer-events-none"
            whileHover={{ backgroundColor: 'rgba(0,0,0,0.06)' }}
            transition={{ duration: 0.7, ease: [0.25, 0.00, 0.15, 1] }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          
          {/* Content Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-700">
            <h3 className="text-3xl md:text-4xl font-extralight mb-3 tracking-[0.05em]">
              {title}
            </h3>
            <p className="text-sm font-light text-white/90 tracking-[0.1em] uppercase">
              {description}
            </p>
          </div>

          {/* Title always visible at bottom */}
          <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
            <h3 className="text-3xl md:text-4xl font-extralight text-black group-hover:text-white transition-colors duration-700 tracking-[0.05em]">
              {title}
            </h3>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
