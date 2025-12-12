'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Product } from '@/types/product'

interface ProductGridProps {
  products: Product[]
}

export default function ProductGrid({ products }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-neutral-600">Aucun produit trouvé avec ces filtres.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
      {products.map((product, index) => (
        <motion.div
          key={product.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.05 }}
        >
          <Link
            href={`/boutique/${product.slug}`}
            className="group block bg-frost rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300"
          >
            <div className="relative aspect-[4/3] overflow-hidden bg-neutral-100">
              {product.images[0] ? (
                <Image
                  src={product.images[0].url}
                  alt={product.images[0].alt || product.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  quality={70}
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  loading="lazy"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-neutral-200 to-neutral-300" />
              )}
              {product.stock === 0 && (
                <div className="absolute top-2 left-2 bg-red-600 text-white text-xs px-2 py-1 uppercase tracking-wide">
                  Rupture
                </div>
              )}
            </div>
            <div className="p-4">
              <h3 className="text-lg font-serif mb-2 group-hover:text-neutral-600 transition-colors">
                {product.name}
              </h3>
              <p className="text-neutral-600 text-sm mb-3">{product.category.name}</p>
              <p className="text-black font-light text-lg">
                {new Intl.NumberFormat('fr-FR', {
                  style: 'currency',
                  currency: 'EUR',
                }).format((product.price || 0) / 100)}
              </p>
            </div>
          </Link>
        </motion.div>
      ))}
    </div>
  )
}
