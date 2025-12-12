'use client'

import React from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { Product } from '@/lib/data'
import { useImageLoad } from '@/hooks/useImageLoad'

interface ProductCardProps {
  product: Product
}

function ProductCard({ product }: ProductCardProps) {
  // You can add featured/outOfStock/discount properties to your Product interface later
  // For now, we'll keep it simple without badges
  const isFeatured = false
  const isOutOfStock = false
  const hasDiscount = false
  const { className: imageClassName, handleLoad } = useImageLoad()

  return (
    <Link href={`/boutique/${product.slug}`} className="group block luxury-link-ripple">
      <div className="bg-white luxury-card-hover">
        <div className="relative aspect-[5/6] overflow-hidden bg-neutral-50 mb-3 rounded-[12px]" style={{ boxShadow: '0 20px 50px rgba(0,0,0,0.15)' }}>
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
          {/* Hover overlay */}
          <motion.div
            className="absolute inset-0 bg-black/0 pointer-events-none"
            whileHover={{ backgroundColor: 'rgba(0,0,0,0.06)' }}
            transition={{ duration: 0.7, ease: [0.25, 0.00, 0.15, 1] }}
          />
          {isFeatured && (
            <div className="absolute top-2 left-2 bg-black text-white text-[10px] px-1.5 py-0.5 uppercase tracking-wide">
              Featured
            </div>
          )}
          {isOutOfStock && (
            <div className="absolute top-2 left-2 bg-neutral-600 text-white text-[10px] px-1.5 py-0.5 uppercase tracking-wide">
              Out of Stock
            </div>
          )}
          {hasDiscount && !isOutOfStock && (
            <div className="absolute top-2 right-2 bg-orange-500 text-white text-[10px] px-1.5 py-0.5 font-medium">
              {0}%
            </div>
          )}
        </div>
        <div>
          <h3 className="text-xs sm:text-sm font-light text-black mb-1.5 group-hover:opacity-70 transition-opacity">
            {product.name}
          </h3>
          <div className="flex items-center gap-2">
            {hasDiscount ? (
              <>
                <span className="text-sm font-light text-black">
                  {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(product.price)}
                </span>
                <span className="text-xs text-neutral-500 line-through">
                  {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(product.price * 1.2)}
                </span>
              </>
            ) : (
              <span className="text-sm font-light text-black">
                {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(product.price)}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}

export default React.memo(ProductCard)

