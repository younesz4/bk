'use client'

import React from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'

interface LuxuryProjectGalleryProps {
  images: string[]
  projectName?: string
}

// Custom neutral placeholder (warm beige, no green)
const neutralPlaceholder = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWEREiMxUf/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="

export default function LuxuryProjectGallery({ images, projectName }: LuxuryProjectGalleryProps) {
  const imageCount = images.length

  const fadeIn = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] }
  }

  const ImageWrapper = ({ src, alt, className, priority = false }: {
    src: string
    alt: string
    className?: string
    priority?: boolean
  }) => (
    <motion.div
      {...fadeIn}
      className={`relative overflow-hidden group cursor-pointer ${className || ''}`}
      style={{
        boxShadow: '0 8px 30px rgba(0, 0, 0, 0.05)'
      }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
    >
      <Image
        src={src}
        alt={alt}
        width={1600}
        height={1000}
        quality={75}
        className="w-full h-auto rounded-xl object-cover"
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        placeholder="blur"
        blurDataURL={neutralPlaceholder}
        loading="lazy"
      />
    </motion.div>
  )

  // Layout 1: Single image - full width, centered
  if (imageCount === 1) {
    return (
      <section className="max-w-[1450px] mx-auto px-6 md:px-8 lg:px-12 py-20 md:py-28 lg:py-36">
        <div className="flex justify-center">
          <div className="w-full max-w-5xl">
            <ImageWrapper
              src={images[0]}
              alt={projectName ? `${projectName} - Image 1` : 'Image de projet'}
            />
          </div>
        </div>
      </section>
    )
  }

  // Layout 2: Two images - equal columns, 1/2 + 1/2
  if (imageCount === 2) {
    return (
      <section className="max-w-[1450px] mx-auto px-6 md:px-8 lg:px-12 py-20 md:py-28 lg:py-36">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 lg:gap-16">
          <ImageWrapper
            src={images[0]}
              alt={projectName ? `${projectName} - Image 1` : 'Image de projet'}
          />
          <ImageWrapper
            src={images[1]}
            alt={projectName ? `${projectName} - Image 2` : 'Image de projet 2'}
          />
        </div>
      </section>
    )
  }

  // Layout 3: Three images - three equal cards in a row
  if (imageCount === 3) {
    return (
      <section className="max-w-[1450px] mx-auto px-6 md:px-8 lg:px-12 py-20 md:py-28 lg:py-36">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 lg:gap-16">
          <ImageWrapper
            src={images[0]}
              alt={projectName ? `${projectName} - Image 1` : 'Image de projet'}
          />
          <ImageWrapper
            src={images[1]}
            alt={projectName ? `${projectName} - Image 2` : 'Image de projet 2'}
          />
          <ImageWrapper
            src={images[2]}
            alt={projectName ? `${projectName} - Image 3` : 'Image de projet 3'}
          />
        </div>
      </section>
    )
  }

  // Layout 4: Four images - Masonry: Left 1 large vertical, Right 3 stacked small
  if (imageCount === 4) {
    return (
      <section className="max-w-[1450px] mx-auto px-6 md:px-8 lg:px-12 py-20 md:py-28 lg:py-36">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 lg:gap-16">
          {/* Left: Large vertical image */}
          <div>
            <ImageWrapper
              src={images[0]}
              alt={projectName ? `${projectName} - Image 1` : 'Image de projet'}
            />
          </div>
          {/* Right: 3 stacked images */}
          <div className="flex flex-col gap-8 md:gap-12 lg:gap-16">
            <ImageWrapper
              src={images[1]}
              alt={projectName ? `${projectName} - Image 2` : 'Image de projet 2'}
            />
            <ImageWrapper
              src={images[2]}
              alt={projectName ? `${projectName} - Image 3` : 'Image de projet 3'}
            />
            <ImageWrapper
              src={images[3]}
              alt={projectName ? `${projectName} - Image 4` : 'Image de projet 4'}
            />
          </div>
        </div>
      </section>
    )
  }

  // Layout 5+: Pinterest-style masonry grid
  return (
    <section className="max-w-[1450px] mx-auto px-6 md:px-8 lg:px-12 py-20 md:py-28 lg:py-36">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12 lg:gap-16">
        {images.map((src, index) => (
          <ImageWrapper
            key={index}
            src={src}
            alt={projectName ? `${projectName} - Image ${index + 1}` : `Image de projet ${index + 1}`}
          />
        ))}
      </div>
    </section>
  )
}

