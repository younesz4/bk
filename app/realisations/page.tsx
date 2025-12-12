'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

// Realisations images - 17 images starting with "real"
const REALISATIONS_IMAGES = [
  '/real1.jpg',
  '/real2.jpg',
  '/real3.jpg',
  '/real4.jpg',
  '/real5.jpg',
  '/real6.jpg',
  '/real7.jpg',
  '/real8.jpg',
  '/real9.jpg',
  '/real10.jpg',
  '/real11.jpg',
  '/real12.jpg',
  '/real13.jpg',
  '/real14.jpg',
  '/real15.jpg',
  '/real16.jpg',
  '/real17.jpg',
]

// Varying heights pattern: tall (320px) and short (210px) alternating - smaller sizes
const IMAGE_HEIGHTS = [
  320, 210, 320, 210, 320, 210, 320, 210, 320, 210, 320, 210, 320, 210, 320, 210, 320,
]

// how many times to repeat the strip – feels “infinite” without hacks
const LOOP_MULTIPLIER = 4

export default function RealisationsPage() {
  const [images, setImages] = useState<string[]>([])
  const [mounted, setMounted] = useState(false)
  const [focusedImage, setFocusedImage] = useState<{ src: string; index: number } | null>(null)

  useEffect(() => {
    setMounted(true)
    setImages(REALISATIONS_IMAGES)
  }, [])

  useEffect(() => {
    if (!focusedImage) return

    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setFocusedImage(null)
      }
    }

    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    document.addEventListener('keydown', handleKey)

    return () => {
      document.removeEventListener('keydown', handleKey)
      document.body.style.overflow = originalOverflow
    }
  }, [focusedImage])

  const handleImageOpen = (src: string, index: number) => {
    setFocusedImage({ src, index })
  }

  const handleCloseFocus = () => {
    setFocusedImage(null)
  }

  if (!mounted) {
    return null // Prevent hydration mismatch
  }

  // Build a long strip by repeating the images
  const longStrip = Array.from({ length: LOOP_MULTIPLIER }, (_, loopIndex) =>
    images.map((src, imgIndex) => {
      const globalIndex = loopIndex * images.length + imgIndex
      const height = IMAGE_HEIGHTS[imgIndex % IMAGE_HEIGHTS.length]
      const isShort = height < 400

      return {
        src,
        height,
        isShort,
        originalIndex: imgIndex,
        key: `${src}-${loopIndex}-${imgIndex}`,
      }
    }),
  ).flat()

  return (
    <div className="min-h-screen bg-[#f7f7f5]">
      {/* Top Info Block - Centered */}
      <section className="pt-16 sm:pt-20 md:pt-24 lg:pt-32 pb-2 sm:pb-3 md:pb-4">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
            className="text-center"
          >
            <h1
              className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-light tracking-tight text-neutral-900"
              style={{ fontFamily: 'var(--font-bodoni)', fontSize: 'clamp(1.25rem, 3vw, 2.5rem)' }}
            >
              RÉALISATIONS VILLA
            </h1>
          </motion.div>
        </div>
      </section>

      {/* Horizontal Scrolling Gallery – purely native scroll, very long strip */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
        className="w-full -mt-6 relative"
      >
        {/* Left fade mask */}
        <div className="realisations-fade-mask realisations-fade-mask-left" />
        {/* Right fade mask */}
        <div className="realisations-fade-mask realisations-fade-mask-right" />
        <div className="realisations-track">
          {longStrip.map(({ src, height, isShort, originalIndex, key }) => (
            <div
              key={key}
              className="realisation-card"
              style={{
                alignSelf: isShort ? 'center' : 'flex-start',
                marginTop: isShort ? -70 : -15,
              }}
              role="button"
              tabIndex={0}
              onClick={() => handleImageOpen(src, originalIndex)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault()
                  handleImageOpen(src, originalIndex)
                }
              }}
            >
              <img
                src={src}
                alt={`Réalisation d'agencement intérieur ${originalIndex + 1} - BK Agencements`}
                loading={originalIndex < 3 ? "eager" : "lazy"}
                style={{
                  height: `${height}px`,
                  width: 'auto',
                }}
              />
              <span className="realisation-indicator" aria-hidden="true" />
              <button
                type="button"
                className="realisation-open-button"
                onClick={(event) => {
                  event.stopPropagation()
                  handleImageOpen(src, originalIndex)
                }}
                aria-label={`Ouvrir la réalisation ${originalIndex + 1} en grand`}
              >
                OPEN
              </button>
            </div>
          ))}
        </div>
      </motion.section>

      {/* Centered Text Paragraph */}
      <section className="py-12 sm:py-16 md:py-20 lg:py-24">
        <div className="max-w-[800px] mx-auto px-4 sm:px-6 md:px-8">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
            className="text-center text-neutral-700 leading-relaxed"
            style={{ fontFamily: 'var(--font-raleway)', fontSize: 'clamp(0.95rem, 1.1vw, 1.125rem)' }}
          >
            Une sélection de nos réalisations résidentielles et décoratives,
            capturant l&apos;atmosphère et l&apos;élégance de nos projets.
          </motion.p>
        </div>
      </section>

      {/* Custom scrollbar + cards styling */}
      <style jsx global>{`
        .realisations-track {
          display: flex;
          align-items: flex-start;
          gap: clamp(20px, 3vw, 40px);
          overflow-x: auto;
          scrollbar-width: none;
          padding-top: clamp(30px, 4vh, 50px);
          padding-bottom: clamp(40px, 5vh, 60px);
          padding-left: clamp(16px, 4vw, 40px);
          padding-right: clamp(16px, 4vw, 40px);
          min-height: clamp(300px, 50vh, 460px);
          -webkit-overflow-scrolling: touch;
          scroll-snap-type: x mandatory;
          scroll-padding: 0 clamp(16px, 4vw, 40px);
          scroll-behavior: smooth;
        }

        .realisations-track::-webkit-scrollbar {
          display: none;
        }

        .realisation-card {
          position: relative;
          flex: 0 0 auto;
          padding: clamp(8px, 1vw, 10px);
          background: #FCFBFC;
          border: none;
          box-shadow: inset 0 0 0 0.65px rgba(12, 12, 12, 0.85);
          border-radius: 0;
          scroll-snap-align: center;
          scroll-snap-stop: always;
          transition: border-color 200ms ease, box-shadow 0.4s cubic-bezier(0.25, 0.1, 0.25, 1);
          z-index: 0;
          cursor: pointer;
        }

        .realisation-card img {
          display: block;
          width: auto;
          max-height: clamp(260px, 45vh, 420px);
          border-radius: 0;
          object-fit: cover;
          transition: filter 0.5s cubic-bezier(0.25, 0.1, 0.25, 1), 
                      opacity 0.5s cubic-bezier(0.25, 0.1, 0.25, 1);
        }

        .realisations-track:hover .realisation-card:not(:hover) img {
          filter: grayscale(100%) contrast(85%);
          opacity: 0.25;
        }
        
        .realisation-card:hover {
          z-index: 10;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15), 
                      0 2px 8px rgba(0, 0, 0, 0.1),
                      inset 0 0 0 0.65px rgba(12, 12, 12, 0.85);
          transition: box-shadow 0.4s cubic-bezier(0.25, 0.1, 0.25, 1),
                      z-index 0s;
        }
        
        .realisation-card:not(:hover) {
          transition: box-shadow 0.5s cubic-bezier(0.25, 0.1, 0.25, 1),
                      z-index 0s 0.5s;
        }

        .realisations-track:hover .realisation-card:not(:hover) .realisation-indicator,
        .realisations-track:hover .realisation-card:not(:hover) .realisation-open-button {
          opacity: 0;
          transform: translateX(4px) scale(0.8);
          transition: opacity 0.5s cubic-bezier(0.25, 0.1, 0.25, 1),
                      transform 0.5s cubic-bezier(0.25, 0.1, 0.25, 1);
        }
        
        /* Fade masks for left and right edges */
        .realisations-fade-mask {
          position: absolute;
          top: 0;
          bottom: 0;
          width: clamp(60px, 8vw, 120px);
          pointer-events: none;
          z-index: 20;
        }
        
        .realisations-fade-mask-left {
          left: 0;
          background: linear-gradient(to right, rgba(247, 247, 245, 1) 0%, rgba(247, 247, 245, 0) 100%);
        }
        
        .realisations-fade-mask-right {
          right: 0;
          background: linear-gradient(to left, rgba(247, 247, 245, 1) 0%, rgba(247, 247, 245, 0) 100%);
        }

        .realisation-indicator {
          position: absolute;
          top: 18px;
          right: 18px;
          width: 18px;
          height: 18px;
          border-radius: 999px;
          border: 1px solid rgba(0, 0, 0, 0.7);
          opacity: 0;
          transform: scale(0.7);
          transition: opacity 200ms ease, transform 200ms ease;
        }

        .realisation-open-button {
          position: absolute;
          top: 18px;
          right: 44px;
          font-size: 11px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: rgba(0, 0, 0, 0.7);
          opacity: 0;
          transform: translateX(4px);
          transition: opacity 200ms ease, transform 200ms ease, color 160ms ease;
          background: transparent;
          border: none;
          padding: 0;
          cursor: pointer;
        }

        .realisation-open-button:focus-visible {
          outline: 1px dashed rgba(0, 0, 0, 0.7);
          outline-offset: 2px;
        }

        .realisation-card:hover .realisation-indicator,
        .realisation-card:hover .realisation-open-button {
          opacity: 1;
          transform: none;
        }

        .realisation-focus-overlay {
          position: fixed;
          inset: 0;
          background: rgba(8, 8, 8, 0.85);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 40;
          padding: 32px;
        }

        .realisation-focus-panel {
          position: relative;
          width: min(65vw, 720px);
          max-width: 90vw;
          max-height: 75vh;
          padding: 24px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
          background: rgba(255, 255, 255, 0.02);
        }

        .realisation-focus-panel img {
          width: auto;
          max-width: 100%;
          height: auto;
          max-height: 65vh;
          object-fit: contain;
          border-radius: 0;
          box-shadow: 0 30px 80px rgba(0, 0, 0, 0.45);
        }

        .realisation-focus-close {
          position: absolute;
          top: -12px;
          right: -12px;
          background: rgba(255, 255, 255, 0.92);
          border: none;
          border-radius: 999px;
          width: 40px;
          height: 40px;
          cursor: pointer;
          font-size: 24px;
          line-height: 1;
          color: #111;
        }

        @media (max-width: 768px) {
          .realisation-focus-panel {
            width: 90vw;
            max-height: 70vh;
          }

          .realisation-focus-panel img {
            max-height: 60vh;
          }
        }
      `}</style>

      {focusedImage && (
        <div
          className="realisation-focus-overlay"
          onClick={handleCloseFocus}
          role="dialog"
          aria-modal="true"
          aria-label={`Réalisation ${focusedImage.index + 1}`}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
            className="realisation-focus-panel"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className="realisation-focus-close"
              onClick={handleCloseFocus}
              aria-label="Fermer"
            >
              ×
            </button>
            <img
              src={focusedImage.src}
              alt={`Réalisation d'agencement intérieur ${focusedImage.index + 1} - BK Agencements`}
              loading="eager"
            />
          </motion.div>
        </div>
      )}
    </div>
  )
}
