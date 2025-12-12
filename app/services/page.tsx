'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import HeroTitle from '@/components/HeroTitle'
import ScrollSection, { ScrollStagger } from '@/components/ScrollSection'

export default function ServicesPage() {
  const services = [
    {
      id: 1,
      title: 'Menuiserie',
      description: 'Travaux de menuiserie haut de gamme, mobilier sur-mesure, boiseries et agencements intérieurs. Chaque pièce est conçue et réalisée avec un savoir-faire artisanal exceptionnel.',
      image: '/men.jpg',
      smallImage: '/projet4.webp',
    },
    {
      id: 2,
      title: 'Tapisserie',
      description: 'Sofas, fauteuils, revêtements muraux et pièces sur-mesure. Notre atelier de tapisserie transforme les intérieurs avec des finitions d\'exception et des matériaux de qualité supérieure.',
      image: '/tap.jpg',
      smallImage: '/hotel atlantic3.webp',
    },
    {
      id: 3,
      title: 'Ferronnerie',
      description: 'Structures métalliques, encadrements et ferronnerie décorative. Nous créons des éléments uniques qui allient robustesse et esthétique raffinée pour vos projets d\'agencement.',
      image: '/fre.jpg',
      smallImage: '/nomai2.webp',
    },
  ]

  return (
    <div className="bg-frost">
      {/* 1. FULL-WIDTH HERO SECTION */}
      <section className="relative h-[85vh] md:h-screen w-full flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/vila1.webp"
            alt="Services BK Agencements - Menuiserie, tapisserie et ferronnerie sur-mesure"
            fill
            className="object-cover object-center"
            priority={true}
            quality={85}
            sizes="100vw"
            loading="eager"
            onError={(e) => {
              const target = e.target as HTMLImageElement
              target.style.display = 'none'
              if (target.parentElement) {
                target.parentElement.style.background = 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)'
              }
            }}
          />
          {/* Subtle overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/40" />
        </div>

        {/* Centered Text Block */}
        <div className="relative z-10 text-center px-6 md:px-8 lg:px-12 max-w-6xl mx-auto">
          <HeroTitle
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-bold leading-[0.95] text-white mb-8 md:mb-12 lg:mb-16"
            delay={0}
            style={{ 
              fontFamily: 'var(--font-bodoni)',
            }}
          >
            Nos Services
          </HeroTitle>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-lg md:text-xl lg:text-2xl font-normal text-white/95 max-w-[70ch] mx-auto leading-relaxed"
            style={{ 
              fontFamily: 'var(--font-raleway)',
              letterSpacing: '0.01em',
              lineHeight: '1.6'
            }}
          >
            Excellence artisanale au service de vos projets d'agencement. Nous façonnons des espaces d'exception, façonnés par la maîtrise de trois métiers complémentaires : la menuiserie, la tapisserie, et la ferronnerie.
          </motion.p>
        </div>
      </section>

      {/* 2. INTRO EDITORIAL SECTION */}
      <section className="bg-[#faf8f4] py-32 md:py-40 lg:py-48">
        <div className="max-w-7xl mx-auto px-6 md:px-8 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Large Headline */}
            <motion.h2
              className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-medium leading-[1.1] tracking-tight text-neutral-900 mb-8 md:mb-10 lg:mb-12"
              style={{ 
                fontFamily: 'var(--font-bodoni)',
                letterSpacing: '-0.03em'
              }}
            >
              Chaque projet est traité comme une pièce unique. Du concept à la fabrication, jusqu'à l'installation finale, notre mission est de transformer votre vision en une réalité parfaitement exécutée.
            </motion.h2>

            {/* Two Column Body Text */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 lg:gap-16">
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                className="text-base md:text-lg leading-relaxed text-neutral-700"
                style={{ 
                  fontFamily: 'var(--font-raleway)',
                  lineHeight: '1.7',
                  letterSpacing: '0.01em'
                }}
              >
                Excellence artisanale au service de vos projets d'agencement. Nous façonnons des espaces d'exception, façonnés par la maîtrise de trois métiers complémentaires : la menuiserie, la tapisserie, et la ferronnerie. Chaque réalisation témoigne de notre engagement envers la qualité, l'innovation et le respect des traditions artisanales.
              </motion.p>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="text-base md:text-lg leading-relaxed text-neutral-700"
                style={{ 
                  fontFamily: 'var(--font-raleway)',
                  lineHeight: '1.7',
                  letterSpacing: '0.01em'
                }}
              >
                Avec une expertise interne couvrant la conception, la fabrication et la gestion de projet, nous offrons un service entièrement intégré qui garantit la cohérence et l'excellence de chaque réalisation. Nous collaborons avec un réseau international d'artisans et de fournisseurs, sélectionnant des matériaux nobles et créant des pièces à la fois intemporelles et distinctives.
              </motion.p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 3. SERVICES - ELICYON-STYLE SPLIT LAYOUT */}
      <div className="m-0 p-0">
        {services.map((service, index) => (
          <ServiceBlock 
            key={service.id} 
            service={service} 
            index={index}
          />
        ))}
      </div>

      {/* 4. WHY CHOOSE US / OUR APPROACH SECTION */}
      <section className="relative bg-[#faf8f4] py-32 md:py-40 lg:py-48" style={{
        backgroundImage: 'var(--texture-noise)',
        backgroundSize: '600px',
        backgroundRepeat: 'repeat',
        backgroundPosition: 'center'
      }}>
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" />
        <div className="relative max-w-7xl mx-auto px-6 md:px-8 lg:px-12 z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="text-center mb-20 md:mb-28 lg:mb-32"
          >
            <h2 
              className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-medium leading-tight tracking-tight text-neutral-900 mb-8 md:mb-12"
              style={{ 
                fontFamily: 'var(--font-bodoni)',
                letterSpacing: '-0.03em'
              }}
            >
              Notre Approche
            </h2>
            <motion.div 
              className="w-32 md:w-44 lg:w-56 h-[2px] bg-neutral-900 mx-auto mb-12 md:mb-16"
              initial={{ scaleX: 0, originX: 0.5 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            />
          </motion.div>

          {/* Multi-column layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 md:gap-16 lg:gap-20">
            {[
              {
                title: 'Matériaux Nobles',
                description: 'Bois précieux, textiles haut de gamme et métal travaillé avec soin. Nous sélectionnons rigoureusement les matériaux les plus nobles pour chaque projet.',
              },
              {
                title: 'Fabrication sur-mesure',
                description: 'Chaque pièce est conçue spécifiquement selon vos besoins. Des équipes internes pour un contrôle total de la qualité et une finition irréprochable.',
              },
              {
                title: 'Installation Expert',
                description: 'Pose et installation par nos équipes expertes. Nous garantissons une finition parfaite et un rendu conforme à vos attentes les plus élevées.',
              },
            ].map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.8, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="text-center md:text-left"
              >
                <h3 
                  className="text-2xl md:text-3xl lg:text-4xl font-medium leading-tight tracking-tight text-neutral-900 mb-6 md:mb-8"
                  style={{ 
                    fontFamily: 'var(--font-bodoni)',
                    letterSpacing: '-0.02em'
                  }}
                >
                  {item.title}
                </h3>
                <p 
                  className="text-lg md:text-xl leading-relaxed text-neutral-700"
                  style={{ 
                    fontFamily: 'var(--font-raleway)',
                    lineHeight: '1.7',
                    letterSpacing: '0.01em'
                  }}
                >
                  {item.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. CTA SECTION */}
      <section className="bg-frost py-32 md:py-40 lg:py-48">
        <div className="max-w-4xl mx-auto px-6 md:px-8 lg:px-12 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-12 md:space-y-16"
          >
            <h2 
              className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-medium leading-tight tracking-tight text-neutral-900"
              style={{ 
                fontFamily: 'var(--font-bodoni)',
                letterSpacing: '-0.03em'
              }}
            >
              Démarrer votre projet
            </h2>
            <p 
              className="text-lg md:text-xl lg:text-2xl font-normal text-neutral-700 max-w-2xl mx-auto leading-relaxed"
              style={{ 
                fontFamily: 'var(--font-raleway)',
                lineHeight: '1.7',
                letterSpacing: '0.01em'
              }}
            >
              Parlons de votre espace, de vos besoins et de vos ambitions. Notre équipe est à votre écoute pour transformer votre vision en réalité.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center pt-8">
              <Link href="/contact">
                <motion.button
                  whileHover={{ 
                    backgroundColor: 'rgba(0, 0, 0, 0.05)',
                    scale: 1.02,
                  }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  className="px-8 md:px-10 py-4 md:py-5 border border-[rgba(0,0,0,0.25)] text-neutral-900 uppercase tracking-[0.1em] font-light text-sm md:text-base min-h-[56px] md:min-h-[60px]"
                  style={{ 
                    fontFamily: 'var(--font-raleway)',
                    letterSpacing: '0.1em'
                  }}
                >
                  Nous contacter
                </motion.button>
              </Link>
              <Link href="/devis">
                <motion.button
                  whileHover={{ 
                    backgroundColor: 'rgba(0, 0, 0, 0.05)',
                    scale: 1.02,
                  }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  className="px-8 md:px-10 py-4 md:py-5 border border-[rgba(0,0,0,0.25)] text-neutral-900 uppercase tracking-[0.1em] font-light text-sm md:text-base min-h-[56px] md:min-h-[60px]"
                  style={{ 
                    fontFamily: 'var(--font-raleway)',
                    letterSpacing: '0.1em'
                  }}
                >
                  Demander un devis
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

// Service Block Component - Big picture full height, small picture centered in left space
function ServiceBlock({ 
  service, 
  index
}: { 
  service: { id: number; title: string; description: string; image: string; smallImage: string }
  index: number
}) {
  // Project links for each service
  const projectLinks = [
    '/projets/table3',      // Menuiserie -> Table3
    '/projets/hotel-atlantic', // Tapisserie -> Hotel Atlantic
    '/projets/nomai',       // Ferronnerie -> Nomai
  ]
  
  const projectLink = projectLinks[index]
  return (
    <section className="relative w-full border-b border-neutral-100 last:border-0" style={{ minHeight: '100vh', margin: 0, padding: 0 }}>
      {/* Mobile/Tablet Layout: Black background, small image on top, big image underneath */}
      <div className="lg:hidden">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="bg-black p-6 sm:p-8 md:p-12 flex flex-col items-center"
        >
          {/* Title at top */}
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-2xl sm:text-3xl md:text-4xl font-medium leading-tight tracking-tight text-white mb-4 sm:mb-6 text-center"
            style={{ 
              fontFamily: 'var(--font-bodoni)',
              letterSpacing: '-0.03em'
            }}
          >
            {service.title}
          </motion.h3>

          {/* Small Image - On top */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full aspect-[3/4] max-w-[180px] sm:max-w-[200px] mx-auto mb-4 sm:mb-6 overflow-hidden rounded-lg"
            style={{ boxShadow: '0 20px 50px rgba(0, 0, 0, 0.3)' }}
          >
            <Image
              src={service.smallImage}
              alt={`${service.title} - Détail`}
              fill
              className="object-cover object-center"
              quality={75}
              sizes="(max-width: 640px) 180px, 200px"
              loading="lazy"
              onError={(e) => {
                const target = e.target as HTMLImageElement
                target.style.display = 'none'
                if (target.parentElement) {
                  target.parentElement.style.background = 'linear-gradient(135deg, #f5f5f5 0%, #e5e5e5 100%)'
                }
              }}
            />
          </motion.div>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="text-sm sm:text-base md:text-lg leading-relaxed text-white text-center max-w-lg mx-auto mb-6 sm:mb-8"
            style={{ 
              fontFamily: 'var(--font-raleway)',
              lineHeight: '1.7',
              letterSpacing: '0.01em'
            }}
          >
            {service.description}
          </motion.p>
        </motion.div>

        {/* Big Image - Underneath */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full aspect-[4/3] sm:aspect-[16/9] overflow-hidden group"
          style={{ margin: 0, padding: 0 }}
        >
          <Image
            src={service.image}
            alt={service.title}
            fill
            className="object-cover object-center"
            quality={75}
            sizes="100vw"
            loading="lazy"
            onError={(e) => {
              const target = e.target as HTMLImageElement
              target.style.display = 'none'
              if (target.parentElement) {
                target.parentElement.style.background = 'linear-gradient(135deg, #f5f5f5 0%, #e5e5e5 100%)'
              }
            }}
          />
          {/* Button overlay */}
          {projectLink && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/20 transition-colors duration-300">
              <Link href={projectLink}>
                <motion.button
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  className="px-6 py-3 bg-frost/95 hover:bg-frost text-black uppercase tracking-[0.1em] text-sm font-light"
                  style={{ fontFamily: 'var(--font-raleway)' }}
                >
                  Voir le projet
                </motion.button>
              </Link>
            </div>
          )}
        </motion.div>
      </div>

      {/* Desktop Layout: Side by side */}
      <div className="hidden lg:grid lg:grid-cols-2 h-full" style={{ margin: 0, padding: 0, minHeight: '100vh' }}>
        {/* Left Side - Big Picture (Full Height) */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full h-full overflow-hidden group"
          style={{ margin: 0, padding: 0 }}
        >
          <Image
            src={service.image}
            alt={service.title}
            fill
            className="object-cover object-center"
            quality={75}
            sizes="50vw"
            loading="lazy"
            onError={(e) => {
              const target = e.target as HTMLImageElement
              target.style.display = 'none'
              if (target.parentElement) {
                target.parentElement.style.background = 'linear-gradient(135deg, #f5f5f5 0%, #e5e5e5 100%)'
              }
            }}
          />
          {/* Button overlay */}
          {projectLink && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/20 transition-colors duration-300">
              <Link href={projectLink}>
                <motion.button
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  className="px-6 py-3 bg-frost/95 hover:bg-frost text-black uppercase tracking-[0.1em] text-sm font-light"
                  style={{ fontFamily: 'var(--font-raleway)' }}
                >
                  Voir le projet
                </motion.button>
              </Link>
            </div>
          )}
        </motion.div>

        {/* Right Side - Title, Small Image (centered), Description */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="bg-black p-8 md:p-12 lg:p-16 flex flex-col justify-center items-center h-full"
        >
          {/* Title at top - Centered */}
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="text-3xl md:text-4xl lg:text-5xl font-medium leading-tight tracking-tight text-white mb-6 md:mb-8 text-center"
            style={{ 
              fontFamily: 'var(--font-bodoni)',
              letterSpacing: '-0.03em'
            }}
          >
            {service.title}
          </motion.h3>

          {/* Small Image - Centered, Smaller, Positioned Higher */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full aspect-[3/4] max-w-[200px] md:max-w-[240px] mx-auto mb-6 md:mb-8 overflow-hidden"
            style={{ boxShadow: '0 20px 50px rgba(0, 0, 0, 0.1)' }}
          >
            <Image
              src={service.smallImage}
              alt={`${service.title} - Détail`}
              fill
              className="object-cover object-center"
              quality={75}
              sizes="240px"
              loading="lazy"
              onError={(e) => {
                const target = e.target as HTMLImageElement
                target.style.display = 'none'
                if (target.parentElement) {
                  target.parentElement.style.background = 'linear-gradient(135deg, #f5f5f5 0%, #e5e5e5 100%)'
                }
              }}
            />
          </motion.div>

          {/* Description at bottom - Centered */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.8, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="text-base md:text-lg leading-relaxed text-white text-center max-w-lg mx-auto"
            style={{ 
              fontFamily: 'var(--font-raleway)',
              lineHeight: '1.7',
              letterSpacing: '0.01em'
            }}
          >
            {service.description}
          </motion.p>
        </motion.div>
      </div>
    </section>
  )
}
