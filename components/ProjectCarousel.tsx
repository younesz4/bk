'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Project } from '@/lib/data'

interface ProjectCarouselProps {
  projects: Project[]
}

export default function ProjectCarousel({ projects }: ProjectCarouselProps) {
  const CAROUSEL_IMAGES = [
    '/caro1.jpg',
    '/caro2.jpg',
    '/caro3.jpg',
    '/caro4.jpg',
    '/caro5.jpg',
    '/caro6.jpg',
  ]

  const speed = 2// same speed on all devices
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    let x = 0
    const totalWidth = container.scrollWidth / 2

    const animate = () => {
      x -= speed
      if (Math.abs(x) >= totalWidth) x = 0
      container.style.transform = `translateX(${x}px)`
      requestAnimationFrame(animate)
    }

    const frame = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(frame)
  }, [])

  return (
    <div className="relative w-full overflow-hidden py-10">
      <div className="overflow-hidden w-full relative">
        
        {/* MOVING ROW */}
        <div
          ref={containerRef}
          className="flex"
          style={{ width: 'max-content', willChange: 'transform' }}
        >
          {[...CAROUSEL_IMAGES, ...CAROUSEL_IMAGES].map((src, index) => {
            const project = projects[index % projects.length]

            return (
              <Link
                href={`/projets/${project.slug}`}
                key={index}
                className="inline-block mx-6 group"
                style={{
                  width: 340,
                  height: 520,
                }}
              >
                <div className="gallery-frame w-full h-full">
                  <div className="relative w-full h-full overflow-hidden">
                    <Image
                      src={src}
                      alt={project.name}
                      fill
                      className="object-cover object-center transition-transform duration-500 group-hover:scale-110"
                      quality={70}
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      loading="lazy"
                    />
                    <div className="absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-black/80 to-transparent">
                      <h3 className="text-2xl text-white font-bodoni">
                        {project.name}
                      </h3>
                    </div>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>

      <style jsx>{`
        .gallery-frame {
          background: #ffffff;
          padding: 10px;
          border: 1px solid #000;
          box-shadow: 0 8px 30px rgba(0,0,0,0.15);
          transition: transform 0.4s ease, box-shadow 0.4s ease;
        }
        .gallery-frame:hover {
          transform: scale(1.05);
          box-shadow: 0 20px 60px rgba(0,0,0,0.25);
        }

        /* Radaville hover logic */
        .group:hover ~ .group {
          filter: grayscale(1);
          opacity: 0.4;
        }
        .group:hover {
          filter: grayscale(0) !important;
          opacity: 1 !important;
        }
      `}</style>
    </div>
  )
}
