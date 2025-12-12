// components/ProjectGallery.tsx
'use client'

import React from 'react'
import Image from 'next/image'
import { useImageLoad } from '@/hooks/useImageLoad'

// Helper component for gallery images with loading animation
function GalleryImage({ src, alt, className, sizes }: { src: string; alt: string; className?: string; sizes: string }) {
  const { className: imageClassName, handleLoad } = useImageLoad()
  
  return (
    <Image
      src={src}
      alt={alt}
      fill
      className={`w-full h-full object-cover group-hover:scale-[1.01] transition-transform duration-500 ${imageClassName} ${className || ''}`}
      quality={75}
      sizes={sizes}
      loading="lazy"
      onLoad={handleLoad}
    />
  )
}

interface ProjectGalleryProps {
  images: string[]
  projectName?: string
}

export default function ProjectGallery({ images, projectName }: ProjectGalleryProps) {
  if (!images || images.length === 0) return null

  const imageCount = images.length

  // Render adaptive layouts based on image count
  const renderGallery = () => {
    // 1 image: Center it, limit width
    if (imageCount === 1) {
      return (
        <div className="max-w-[1100px] mx-auto">
          <div className="relative w-full h-[380px] md:h-[420px] lg:h-[460px] overflow-hidden rounded-xl group" style={{ boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)' }}>
            <GalleryImage
              src={images[0]}
              alt={projectName ? `${projectName} - image 2` : 'Image de projet 2'}
              sizes="(max-width: 1024px) 100vw, 1100px"
            />
          </div>
        </div>
      )
    }

    // 2 images: Two equal columns with max width
    if (imageCount === 2) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 max-w-[1400px] mx-auto">
          {images.map((src, i) => (
            <div
              key={i}
              className="relative w-full h-[380px] md:h-[420px] lg:h-[460px] overflow-hidden rounded-xl group"
              style={{
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
              }}
            >
              <GalleryImage
                src={src}
                alt={projectName ? `${projectName} - image ${i + 2}` : `Image de projet ${i + 2}`}
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          ))}
        </div>
      )
    }

    // 3 images: Three equal columns
    if (imageCount === 3) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-[1400px] mx-auto">
          {images.map((src, i) => (
            <div
              key={i}
              className="relative w-full h-[380px] md:h-[420px] lg:h-[460px] overflow-hidden rounded-xl group"
              style={{
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
              }}
            >
              <GalleryImage
                src={src}
                alt={projectName ? `${projectName} - image ${i + 2}` : `Image de projet ${i + 2}`}
                sizes="(max-width: 1024px) 100vw, 33vw"
              />
            </div>
          ))}
        </div>
      )
    }

    // 4 images: Large hero + three supporting images
    if (imageCount === 4) {
      return (
        <div className="space-y-6 md:space-y-8 max-w-[1400px] mx-auto">
          {/* Large full-width image */}
          <div className="relative w-full h-[380px] md:h-[420px] lg:h-[460px] overflow-hidden rounded-xl group" style={{ boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)' }}>
            <GalleryImage
              src={images[0]}
              alt={projectName ? `${projectName} - image 2` : 'Image de projet 2'}
              sizes="(max-width: 1024px) 100vw, 1400px"
            />
          </div>
          {/* Three smaller images */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {images.slice(1).map((src, i) => (
              <div
                key={i + 1}
                className="relative w-full h-[380px] md:h-[420px] lg:h-[460px] overflow-hidden rounded-xl group"
                style={{
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                }}
              >
                <Image
                  src={src}
                  alt={projectName ? `${projectName} - image ${i + 3}` : `Image de projet ${i + 3}`}
                  fill
                  className="w-full h-full object-cover group-hover:scale-[1.01] transition-transform duration-500"
                  quality={75}
                  sizes="(max-width: 1024px) 100vw, 33vw"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </div>
      )
    }

    // 5-8 images: Mixed editorial grid
    if (imageCount >= 5 && imageCount <= 8) {
      return (
        <div className="space-y-6 md:space-y-8 max-w-[1400px] mx-auto">
          {/* Large image */}
          <div className="relative w-full h-[380px] md:h-[420px] lg:h-[460px] overflow-hidden rounded-xl group" style={{ boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)' }}>
            <GalleryImage
              src={images[0]}
              alt={projectName ? `${projectName} - image 2` : 'Image de projet 2'}
              sizes="(max-width: 1024px) 100vw, 1400px"
            />
          </div>
          {/* Medium images grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {images.slice(1, 3).map((src, i) => (
              <div
                key={i + 1}
                className="relative w-full h-[380px] md:h-[420px] lg:h-[460px] overflow-hidden rounded-xl group"
                style={{
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                }}
              >
                <Image
                  src={src}
                  alt={projectName ? `${projectName} - image ${i + 3}` : `Image de projet ${i + 3}`}
                  fill
                  className="w-full h-full object-cover group-hover:scale-[1.01] transition-transform duration-500"
                  quality={75}
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
          {/* Remaining images in 3-column grid */}
          {images.length > 3 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
              {images.slice(3).map((src, i) => (
                <div
                  key={i + 3}
                  className="relative w-full h-[380px] md:h-[420px] lg:h-[460px] overflow-hidden rounded-xl group"
                  style={{
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                  }}
                >
                  <Image
                    src={src}
                    alt={projectName ? `${projectName} - image ${i + 4}` : `Image de projet ${i + 4}`}
                    fill
                    className="w-full h-full object-cover group-hover:scale-[1.01] transition-transform duration-500"
                    quality={75}
                    sizes="(max-width: 1024px) 100vw, 33vw"
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      )
    }

    // 9+ images: Clean 3-column uniform gallery
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-[1400px] mx-auto">
        {images.map((src, i) => (
          <div
            key={i}
            className="relative w-full h-[380px] md:h-[420px] lg:h-[460px] overflow-hidden rounded-xl group"
            style={{
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
            }}
          >
            <Image
              src={src}
              alt={projectName ? `${projectName} - image ${i + 2}` : `Image de projet ${i + 2}`}
              fill
              className="w-full h-full object-cover group-hover:scale-[1.01] transition-transform duration-500"
              quality={75}
              sizes="(max-width: 1024px) 100vw, 33vw"
              loading="lazy"
            />
          </div>
        ))}
      </div>
    )
  }

  return (
    <section className="w-full max-w-[1400px] mx-auto px-4 py-12 md:py-16">
      <div className="mt-16 grid gap-8 md:gap-12">
        {renderGallery()}
      </div>
    </section>
  )
}
