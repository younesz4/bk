'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'

interface GalleryItem {
  number: string
  title: string
  description: string
  image: string
}

const galleryItems: GalleryItem[] = [
  {
    number: '01',
    title: 'Collections d\'exception',
    description: 'Les collections de <strong>BK Agencements</strong> sont plus qu\'un simple mobilier, elles incarnent une élégance intemporelle et créent des liens émotionnels.',
    image: '/part1.jpg',
  },
  {
    number: '02',
    title: 'Passion pour le design',
    description: 'La passion de <strong>BK Agencements</strong> pour le mobilier au design intemporel va au-delà de la sélection ; nous sommes là pour vous aider à trouver les pièces parfaites pour vos espaces.',
    image: '/passion.jpg',
  },
  {
    number: '03',
    title: 'Confiance et expertise',
    description: 'La fiabilité est une valeur fondamentale chez <strong>BK Agencements</strong>, garantie par notre expertise approfondie et notre tarification transparente.',
    image: '/trust.jpg',
  },
  {
    number: '04',
    title: 'Relations durables',
    description: 'Avec chaque engagement qu\'ils remplissent, <strong>BK Agencements</strong> construit la confiance et des relations durables.',
    image: '/part4.jpg',
  },
  {
    number: '05',
    title: 'Notre histoire',
    description: 'L\'histoire de <strong>BK Agencements</strong> est une histoire de passion, de dévouement et de connexion authentique avec chaque client.',
    image: '/histoire.jpg',
  },
]

export default function AboutGallery() {
  return (
    <section className="bg-white section-xl">
      <div className="container-arch">
        <div className="space-y-24 md:space-y-32 lg:space-y-40">
          {galleryItems.map((item, index) => (
            <motion.div
              key={item.number}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.8, delay: index * 0.1, ease: [0.25, 0.00, 0.15, 1] }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-16 lg:gap-20 items-center"
            >
              {/* Image - Alternate sides */}
              <motion.div 
                className={`relative w-full aspect-[4/3] overflow-hidden bg-neutral-100 group rounded-[12px] ${index % 2 === 1 ? 'lg:order-2' : ''}`}
                style={{ boxShadow: '0 20px 50px rgba(0,0,0,0.15)' }}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.7, ease: [0.25, 0.00, 0.15, 1] }}
              >
                <motion.div
                  className="absolute inset-0"
                  whileHover={{ scale: 1.06 }}
                  transition={{ duration: 0.7, ease: [0.25, 0.00, 0.15, 1] }}
                >
                  <Image
                    src={item.image}
                    alt={item.title}
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
                <motion.div
                  className="absolute inset-0 bg-black/0 pointer-events-none"
                  whileHover={{ backgroundColor: 'rgba(0,0,0,0.06)' }}
                  transition={{ duration: 0.7, ease: [0.25, 0.00, 0.15, 1] }}
                />
                {/* Warm filter overlay */}
                <div className="absolute inset-0 bg-[rgba(255,245,230,0.08)] pointer-events-none" />
                {/* Bottom gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/15 to-transparent pointer-events-none" />
              </motion.div>

              {/* Content */}
              <div className={`${index % 2 === 1 ? 'lg:order-1' : ''}`}>
                <div className="text-6xl md:text-7xl lg:text-8xl font-serif font-bold text-neutral-200 mb-6">
                  {item.number}
                </div>
                <h3 className="text-black mb-6">
                  {item.title}
                </h3>
                <p 
                  className="text-lg md:text-xl text-neutral-700 leading-relaxed"
                >
                  {/* Render description as plain text - HTML tags are escaped by React */}
                  {item.description.replace(/<[^>]+>/g, '')}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

