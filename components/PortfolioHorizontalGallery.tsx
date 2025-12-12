'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { Project } from '@/lib/data'

interface PortfolioHorizontalGalleryProps {
  projects: Project[]
}

export default function PortfolioHorizontalGallery({ projects }: PortfolioHorizontalGalleryProps) {
  // Use images from all projects for the horizontal gallery
  const galleryImages = projects.flatMap(project => 
    project.images.slice(0, 2).map(img => ({ src: img, project: project.name }))
  ).slice(0, 5)

  return (
    <section className="bg-white overflow-hidden">
      <div className="overflow-x-auto overflow-y-hidden scrollbar-hide momentum-scroll">
        <div className="flex gap-8 md:gap-12 lg:gap-16 px-6 md:px-8 lg:px-12" style={{ width: 'max-content' }}>
          {galleryImages.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 1, delay: index * 0.15, ease: 'easeOut' }}
              className="flex-shrink-0 relative w-[75vw] md:w-[65vw] lg:w-[55vw] aspect-[4/3] rounded-[12px] overflow-hidden"
              style={{ boxShadow: 'var(--shadow-soft)' }}
            >
              <Image
                src={item.src}
                alt={item.project}
                fill
                className="object-cover"
                quality={75}
                sizes="(max-width: 640px) 75vw, (max-width: 1024px) 65vw, 55vw"
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
          ))}
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

