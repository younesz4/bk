'use client'

import { useRef, useState, useMemo, useEffect } from 'react'
import {
  motion,
  useScroll,
  useTransform,
  useMotionValue,
  animate,
  AnimatePresence,
} from 'framer-motion'
import Image from 'next/image'
import { usePathname, useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import ProjectLink from '@/components/ProjectLink'
import { projects } from '@/lib/data'

// Project background colors - alternating pattern
const DARK_BG = '#000000'  // For 1st, 3rd, 5th projects - pure black
const LIGHT_BG = '#FCFBFC' // For 2nd, 4th, 6th projects - white

function getBackgroundColor(index: number): string {
  return index % 2 === 0 ? DARK_BG : LIGHT_BG
}

function getTextColor(index: number): string {
  return index % 2 === 0 ? '#FCFBFC' : '#000000'
}

function ProjectsPageContent() {
  const slides = useMemo(
    () =>
      projects.map((p, index) => ({
        slug: p.slug,
        title: p.name,
        location: 'Maroc',
        year: '2024',
        description:
          p.description?.slice(0, 120) +
            (p.description && p.description.length > 120 ? '…' : '') ||
          '',
        image: p.heroImage,
        bgColor: getBackgroundColor(index),
      })),
    []
  )

  const pathname = usePathname()
  const searchParams = useSearchParams()
  const containerRef = useRef<HTMLDivElement>(null)

  const [currentIndex, setCurrentIndex] = useState(0)
  const [isEntering, setIsEntering] = useState(true)
  const [mountKey, setMountKey] = useState(Date.now())
  const bgColor = useMotionValue(getBackgroundColor(0))
  const [bgColorString, setBgColorString] = useState(getBackgroundColor(0))

  // 🔹 NEW: detect mobile vs desktop
  const [isMobile, setIsMobile] = useState(false)
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  // Reset animation state when navigating to this page
  useEffect(() => {
    const triggerAnimation = () => {
      setIsEntering(true)
      setMountKey(Date.now())
      const timer = setTimeout(() => {
        setIsEntering(false)
      }, 600)
      return timer
    }

    const timer1 = triggerAnimation()

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && pathname === '/projets') {
        triggerAnimation()
      }
    }
    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      clearTimeout(timer1)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [pathname, searchParams])

  // Scroll tracking (desktop only in practice)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  })

  useEffect(() => {
    if (!slides.length) return

    const unsubscribe = scrollYProgress.on('change', (progress) => {
      const totalSlides = slides.length
      const step = 1 / totalSlides
      const index = Math.min(
        totalSlides - 1,
        Math.max(0, Math.floor(progress / step))
      )

      if (index !== currentIndex) {
        setCurrentIndex(index)
        animate(bgColor, slides[index].bgColor, {
          duration: 0.8,
          ease: 'easeInOut',
        })
        setBgColorString(slides[index].bgColor)
      }
    })

    return () => unsubscribe()
  }, [scrollYProgress, slides, currentIndex, bgColor])

  const slideOpacities = slides.map((_, index) => {
    const totalSlides = slides.length
    const step = 1 / totalSlides
    const slideStart = index * step
    const slideEnd = (index + 1) * step
    const fadeRange = step * 0.2

    return useTransform(scrollYProgress, (progress) => {
      if (progress < slideStart - fadeRange) return 0
      if (progress > slideEnd + fadeRange) return 0
      if (progress >= slideStart && progress <= slideEnd) return 1
      if (progress < slideStart) {
        const t = (progress - (slideStart - fadeRange)) / fadeRange
        return Math.max(0, t)
      }
      if (progress > slideEnd) {
        const t = ((slideEnd + fadeRange) - progress) / fadeRange
        return Math.max(0, t)
      }
      return 0
    })
  })

  const slideScales = slides.map((_, index) => {
    const totalSlides = slides.length
    const step = 1 / totalSlides
    const slideStart = index * step
    const slideEnd = (index + 1) * step

    return useTransform(scrollYProgress, (progress) => {
      if (progress >= slideStart && progress <= slideEnd) return 1
      return 0.95
    })
  })

  if (!slides.length) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <p>Aucun projet disponible pour le moment.</p>
      </div>
    )
  }

  // =====================================================================
  // 📱 MOBILE LAYOUT – simple stacked list, no sticky scroll, no framer
  // =====================================================================
  if (isMobile) {
    return (
      <div className="w-full">
        {slides.map((slide, index) => {
          const textColor = getTextColor(index)
         
          return (
            <section
              key={slide.slug}
              className="px-4 py-10 sm:py-12"
              style={{ backgroundColor: slide.bgColor, color: textColor }}
            >
              <p
                className="text-[10px] tracking-[0.3em] uppercase mb-4 opacity-80"
                style={{ fontFamily: 'var(--font-raleway)', color: textColor }}
              >
                0{index + 1} — PROJECT
              </p>

              <h1
                className="text-2xl sm:text-3xl mb-4 leading-tight"
                style={{ fontFamily: 'var(--font-bodoni)', fontWeight: 400, color: textColor }}
              >
                {slide.title}
              </h1>

              <p
                className="text-xs mb-1 opacity-85"
                style={{ fontFamily: 'var(--font-raleway)', color: textColor }}
              >
                Location: {slide.location}
              </p>
              <p
                className="text-xs mb-4 opacity-85"
                style={{ fontFamily: 'var(--font-raleway)', color: textColor }}
              >
                Year: {slide.year}
              </p>

              <p
                className="text-xs mb-6 leading-relaxed opacity-80 max-w-sm"
                style={{ fontFamily: 'var(--font-raleway)', color: textColor }}
              >
                {slide.description}
              </p>

              <ProjectLink
                href={`/projets/${slide.slug}`}
                className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] border border-current/40 rounded-full px-4 py-2 hover:border-current hover:bg-white/10 transition-colors duration-300"
                style={{ fontFamily: 'var(--font-raleway)', color: textColor }}
              >
                Discover the project
                <span aria-hidden>↗</span>
              </ProjectLink>

              <div className="mt-6 w-full rounded-xl overflow-hidden shadow-2xl">
                <div className="relative w-full aspect-[16/10]">
                  <Image
                    src={slide.image || '/placeholder.webp'}
                    alt={slide.title}
                    fill
                    className="object-cover"
                    quality={75}
                    sizes="100vw"
                    loading="lazy"
                  />
                </div>
              </div>
            </section>
          )
        })}
      </div>
    )
  }

  // =====================================================================
  // 💻 DESKTOP / TABLET LAYOUT – keep your sticky, animated slider
  // =====================================================================

  const currentSlide = slides[currentIndex]
  const textColor = getTextColor(currentIndex)

  return (
    <div
      ref={containerRef}
      className="relative w-full"
      style={{
        height: `${slides.length * 100}vh`,
        backgroundColor: bgColorString,
      }}
    >
      <motion.div
        key={mountKey}
        className="projects-slider"
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
        style={{
          backgroundColor: bgColorString,
          height: '100vh',
          minHeight: '100vh',
          width: '100%',
          maxWidth: '100vw',
          overflow: 'hidden',
          position: 'sticky',
          top: 0,
          transition: isEntering ? 'none' : 'background-color 0.7s ease',
        }}
      >
        {/* LEFT TEXT BLOCK */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            className="project-text px-4 sm:px-6 md:px-8"
            style={{
              position: 'absolute',
              top: 'clamp(15%, 20vh, 25%)',
              left: 'clamp(4%, 8vw, 8%)',
              transform: 'translateY(-50%)',
              width: 'clamp(90%, 32vw, 500px)',
              maxWidth: '500px',
              zIndex: 10,
              pointerEvents: 'none',
              color: textColor,
            }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{
              duration: 0.8,
              delay: isEntering ? 0.6 : 0,
              ease: [0.25, 0.1, 0.25, 1],
            }}
          >
            <p
              className="text-xs sm:text-sm tracking-[0.3em] uppercase mb-4 sm:mb-6 opacity-80"
              style={{ fontFamily: 'var(--font-raleway)', color: textColor }}
            >
              0{currentIndex + 1} — PROJECT
            </p>
            <h1
              className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl mb-4 sm:mb-6 leading-tight"
              style={{
                fontFamily: 'var(--font-bodoni)',
                fontWeight: 400,
                color: textColor,
              }}
            >
              {currentSlide.title}
            </h1>
            <p
              className="text-xs sm:text-sm md:text-base mb-2 opacity-85"
              style={{ fontFamily: 'var(--font-raleway)', color: textColor }}
            >
              Location: {currentSlide.location}
            </p>
            <p
              className="text-xs sm:text-sm md:text-base mb-4 sm:mb-6 opacity-85"
              style={{ fontFamily: 'var(--font-raleway)', color: textColor }}
            >
              Year: {currentSlide.year}
            </p>
            <p
              className="text-xs sm:text-sm md:text-base mb-6 sm:mb-8 leading-relaxed opacity-80 max-w-sm"
              style={{ fontFamily: 'var(--font-raleway)', color: textColor }}
            >
              {currentSlide.description}
            </p>
            <ProjectLink
              href={`/projets/${currentSlide.slug}`}
              className="inline-flex items-center gap-2 text-xs sm:text-sm uppercase tracking-[0.2em] border border-current/40 rounded-full px-4 sm:px-6 py-2 sm:py-3 hover:border-current hover:bg-white/10 transition-colors duration-300"
              style={{
                fontFamily: 'var(--font-raleway)',
                pointerEvents: 'auto',
                color: textColor,
              }}
            >
              Discover the project
              <span aria-hidden>↗</span>
            </ProjectLink>
          </motion.div>
        </AnimatePresence>

        {/* SLIDES (IMAGES) */}
        {slides.map((slide, index) => (
          <motion.div
            key={slide.slug}
            className="slide"
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              opacity: slideOpacities[index],
              pointerEvents: index === currentIndex ? 'auto' : 'none',
            }}
            initial={false}
          >
            <motion.div
              className="project-image px-4 sm:px-6 md:px-8"
              style={{
                position: 'absolute',
                top: 'clamp(15%, 20vh, 25%)',
                right: 'clamp(4%, 8vw, 8%)',
                transform: 'translateY(-50%)',
                width: 'clamp(85%, 45vw, 750px)',
                maxWidth: '750px',
                aspectRatio: '16/10',
                borderRadius: 'clamp(12px, 1.5vw, 20px)',
                overflow: 'hidden',
                boxShadow: '0px 40px 80px rgba(0,0,0,0.35)',
                willChange: 'transform, opacity',
                zIndex: 5,
                scale: slideScales[index],
              }}
              initial={
                isEntering && index === 0
                  ? { opacity: 0, y: 30 }
                  : { opacity: 1, y: 0 }
              }
              animate={{ opacity: 1, y: 0 }}
              transition={
                isEntering && index === 0
                  ? {
                      duration: 0.8,
                      delay: 0.6,
                      ease: [0.25, 0.1, 0.25, 1],
                    }
                  : { duration: 0 }
              }
            >
              <ProjectLink href={`/projets/${slide.slug}`} className="block w-full h-full">
                <Image
                  src={slide.image || '/placeholder.webp'}
                  alt={slide.title}
                  fill
                  className="object-cover"
                  quality={75}
                  sizes="(max-width: 640px) 85vw, (max-width: 1024px) 45vw, 750px"
                  loading="lazy"
                />
              </ProjectLink>
            </motion.div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}

export default function ProjectsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-cream-50 pt-32 pb-24 px-6 md:px-8 flex items-center justify-center">
        <div className="text-lg text-neutral-600" style={{ fontFamily: 'var(--font-raleway)' }}>
          Chargement...
        </div>
      </div>
    }>
      <ProjectsPageContent />
    </Suspense>
  )
}
