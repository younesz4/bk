'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { Product } from '@/lib/data'
import { useImageLoad } from '@/hooks/useImageLoad'

interface LuxuryProductCardProps {
  product: Product
  index: number
}

export default function LuxuryProductCard({ product, index }: LuxuryProductCardProps) {
  const { className: imageClassName, handleLoad } = useImageLoad()
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.8, delay: index * 0.1, ease: [0.25, 0.00, 0.15, 1] }}
      className="group"
    >
      <Link href={`/boutique/${product.slug}`} className="block luxury-link-ripple">
        <div className="relative aspect-[5/6] overflow-hidden bg-neutral-100 rounded-[12px] luxury-card-hover" style={{ boxShadow: '0 20px 50px rgba(0,0,0,0.15)' }}>
          <motion.div
            className="absolute inset-0"
            whileHover={{ scale: 1.03 }}
            transition={{ duration: 0.4, ease: [0.34, 1.56, 0.64, 1] }}
          >
            <Image
              src={product.images[0] || '/placeholder.jpg'}
              alt={product.name}
              fill
              className={`object-cover object-center luxury-image-hover ${imageClassName}`}
              quality={70}
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              loading="lazy"
              onLoad={handleLoad}
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
          <motion.div
            className="absolute inset-0 bg-black/0 pointer-events-none"
            whileHover={{ backgroundColor: 'rgba(0,0,0,0.08)' }}
            transition={{ duration: 0.7, ease: [0.25, 0.00, 0.15, 1] }}
          />
          
          {/* Product Info */}
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 transform translate-y-0">
            <p className="text-xs font-light text-black/60 mb-2 tracking-[0.15em] uppercase">
              {product.category}
            </p>
            <h3 className="text-xl md:text-2xl font-extralight text-black mb-2 tracking-[0.02em]">
              {product.name}
            </h3>
            <p className="text-sm font-light text-black/80">
              {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(product.price)}
            </p>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

