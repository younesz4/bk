'use client'

import Image from 'next/image'

import { useRef, useEffect } from 'react'

export default function BrandPartners() {
  const brands = [
    { name: 'Four Seasons', logo: '/fourseasons.png' },
    { name: 'Sheraton', logo: '/NewSheratonLogo.png' },
    { name: 'Novotel', logo: '/Novotel.png' },
    { name: 'Rafinity', logo: '/rafinity.png' },
    { name: 'Royal Air Maroc', logo: '/royal-air-maroc.png' },
    { name: 'Visa', logo: '/Visalogo.png' },
  ]

  const duplicated = [...brands, ...brands]

  const trackRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const track = trackRef.current
    if (!track) return

    let pos = 0
    const speed = 0.55 // lower = slower, works on ALL devices

    const step = () => {
      pos -= speed

      // Reset position (infinite scroll)
      if (track.scrollWidth > 0 && Math.abs(pos) >= track.scrollWidth / 2) {
        pos = 0
      }

      track.style.transform = `translateX(${pos}px)`
      requestAnimationFrame(step)
    }

    requestAnimationFrame(step)
  }, [])

  return (
    <section className="bg-white py-20 overflow-hidden relative">
      <div className="w-full overflow-hidden">
        <div
          ref={trackRef}
          className="flex items-center gap-16 px-10"
          style={{ whiteSpace: 'nowrap' }}
        >
          {duplicated.map((b, i) => (
            <div
              key={i}
              className="flex flex-col items-center justify-center flex-shrink-0"
            >
              <div className="relative w-28 h-28 sm:w-32 sm:h-32 grayscale opacity-60 hover:opacity-100 hover:grayscale-0 transition-all duration-500">
                <Image
                  src={b.logo}
                  alt={b.name}
                  fill
                  className="object-contain"
                  quality={70}
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  loading="lazy"
                />
              </div>
              <span className="text-black text-xs sm:text-sm font-light uppercase tracking-[0.12em] mt-3 text-center">
                {b.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
