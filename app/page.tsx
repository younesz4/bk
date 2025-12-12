import Link from 'next/link'
import dynamic from 'next/dynamic'
import LuxuryHero from '@/components/LuxuryHero'
import ProjectCTA from '@/components/ProjectCTA'
import ScrollSection from '@/components/ScrollSection'
import { projects } from '@/lib/data'
import { homeMetadata } from '@/lib/metadata-templates'

// Export metadata for SEO
export { homeMetadata as metadata }

// Code splitting for heavy components
const ProjectCarousel = dynamic(() => import('@/components/ProjectCarousel'), {
  loading: () => <div style={{height:"300px"}} />
})

const BrandPartners = dynamic(() => import('@/components/BrandPartners'), {
  loading: () => <div style={{height:"300px"}} />
})

const MobilierExcellence = dynamic(() => import('@/components/MobilierExcellence'), {
  loading: () => <div style={{height:"300px"}} />
})

const NosUnivers = dynamic(() => import('@/components/NosUnivers'), {
  loading: () => <div style={{height:"300px"}} />
})

const NotreSignature = dynamic(() => import('@/components/NotreSignature'), {
  loading: () => <div style={{height:"300px"}} />
})

const SavoirFaire = dynamic(() => import('@/components/SavoirFaire'), {
  loading: () => <div style={{height:"300px"}} />
})

export default function Home() {
  const featuredProjects = projects.slice(0, 6) // Use all 6 projects for 6 carousel images

  return (
    <>
      {/* Hero Section */}
      <LuxuryHero />

      {/* MOBILIER D'EXCEPTION Section */}
      <MobilierExcellence />

      {/* PROJETS RÉALISÉS Section */}
      <section className="bg-white section-lg" aria-label="Projets réalisés">
        <div className="container-arch">
          {/* Section Title */}
          <ScrollSection className="mb-16 md:mb-24">
            <h2 className="text-black mb-4">
              PROJETS RÉALISÉS
            </h2>
            <div className="w-24 h-px bg-black" />
          </ScrollSection>
        </div>
        
        {/* Project Carousel - Full Width */}
        <ProjectCarousel projects={featuredProjects} />
      </section>

      {/* NOS UNIVERS Section */}
      <NosUnivers />

      {/* NOTRE SIGNATURE Section */}
      <NotreSignature />

      {/* SAVOIR-FAIRE Section */}
      <SavoirFaire />

      {/* PROJECT CTA Section */}
      <ProjectCTA />

      {/* Brand Partners Section */}
      <BrandPartners />

      {/* Prendre rendez-vous Button */}
      <section className="bg-white section-md" aria-label="Prendre rendez-vous">
        <div className="container-arch">
          <ScrollSection className="flex justify-center">
            <Link
              href="/rdv"
              className="lux-btn lux-btn-secondary w-full md:w-auto"
            >
              Prendre rendez-vous
            </Link>
          </ScrollSection>
        </div>
      </section>
    </>
  )
}
