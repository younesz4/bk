'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { useImageLoad } from '@/hooks/useImageLoad'

interface Category {
  id: string
  name: string
  slug: string
  imageUrl?: string | null
}

interface CategoryGridProps {
  categories: Category[]
}

// Direct mapping object - maps category name/slug to image path
const CATEGORY_IMAGE_MAP: Record<string, string> = {
  // Exact name matches (case-insensitive keys)
  'chaise': '/chaise.jpg',
  'chaises': '/chaise.jpg',
  'fauteuil': '/fauteuil.jpg',
  'fauteuils': '/fauteuil.jpg',
  'console': '/console.jpg',
  'consoles': '/console.jpg',
  'table basse': '/table basse.jpg',
  'tables basses': '/table basse.jpg',
  'table-basse': '/table basse.jpg',
  'table d\'appoint': '/Table dappoint.jpg',
  'table dappoint': '/Table dappoint.jpg',
  'table-dappoint': '/Table dappoint.jpg',
  'table-d-appoint': '/Table dappoint.jpg',
  'tables dappoint': '/Table dappoint.jpg',
  'meuble tv': '/meuble tv.jpg',
  'meubles tv': '/meuble tv.jpg',
  'meuble-tv': '/meuble tv.jpg',
  'meubletv': '/meuble tv.jpg',
}

// Helper to get image path - direct lookup
const getCategoryImagePath = (categoryName: string, categorySlug?: string): string => {
  if (!categoryName) return '/placeholder.jpg'
  
  // Try exact match first (case-insensitive)
  const nameLower = categoryName.toLowerCase().trim()
  if (CATEGORY_IMAGE_MAP[nameLower]) {
    return CATEGORY_IMAGE_MAP[nameLower]
  }
  
  // Try slug if available
  if (categorySlug) {
    const slugLower = categorySlug.toLowerCase().trim()
    if (CATEGORY_IMAGE_MAP[slugLower]) {
      return CATEGORY_IMAGE_MAP[slugLower]
    }
  }
  
  // Try partial match - check if any key contains the name or vice versa
  for (const [key, path] of Object.entries(CATEGORY_IMAGE_MAP)) {
    const keyLower = key.toLowerCase()
    const nameLower = categoryName.toLowerCase().trim()
    
    // Check if name contains key or key contains name
    if (nameLower.includes(keyLower) || keyLower.includes(nameLower)) {
      // But make sure it's not too generic (avoid "table" matching everything)
      if (keyLower.length > 3 || nameLower === keyLower) {
        return path
      }
    }
  }
  
  // Last resort: check first word
  const firstWord = categoryName.toLowerCase().trim().split(/\s+/)[0]
  if (firstWord && CATEGORY_IMAGE_MAP[firstWord]) {
    return CATEGORY_IMAGE_MAP[firstWord]
  }
  
  return '/placeholder.jpg'
}

export default function CategoryGrid({ categories }: CategoryGridProps) {
  if (categories.length === 0) {
    return null
  }


  return (
    <section className="bg-frost py-4 sm:py-8 md:py-12 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-1.5 sm:gap-2 md:gap-3 lg:gap-4">
          {categories.map((category, index) => {
            const CategoryItem = () => {
              const { className: imageClassName, handleLoad } = useImageLoad()
              return (
                <Link
                  href={`/boutique?category=${encodeURIComponent(category.slug)}`}
                  className="group block relative aspect-square overflow-hidden rounded-sm luxury-link-ripple"
                >
                  <div className="relative w-full h-full bg-neutral-100 luxury-card-hover">
                    <Image
                      src={category.imageUrl || getCategoryImagePath(category.name, category.slug)}
                      alt={category.name}
                      fill
                      className={`object-cover luxury-image-hover ${imageClassName}`}
                      quality={70}
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      loading="lazy"
                      onLoad={handleLoad}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        // Try fallback image path
                        const fallbackPath = getCategoryImagePath(category.name, category.slug)
                        if (target.src !== fallbackPath && !target.src.includes(fallbackPath)) {
                          target.src = fallbackPath
                        } else {
                          target.style.display = 'none'
                          if (target.parentElement) {
                            target.parentElement.style.background = 'linear-gradient(135deg, #f5f5f5 0%, #e5e5e5 100%)'
                          }
                        }
                      }}
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                    <div className="absolute top-2 left-2 sm:top-3 sm:left-3">
                      <h3 className="text-white text-xs sm:text-sm md:text-base font-light tracking-wide drop-shadow-lg">
                        {category.name}
                      </h3>
                    </div>
                  </div>
                </Link>
              )
            }
            
            return (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <CategoryItem />
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
