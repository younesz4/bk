import dynamic from 'next/dynamic'
import AboutHero from '@/components/AboutHero'
import { aboutMetadata } from '@/lib/metadata-templates'

// Export metadata for SEO
export { aboutMetadata as metadata }

// Code splitting for heavy carousel component
const AboutCarousel = dynamic(() => import('@/components/AboutCarousel'), {
  loading: () => <div style={{height:"300px"}} />
})

const AboutJourney = dynamic(() => import('@/components/AboutJourney'), {
  loading: () => <div style={{height:"300px"}} />
})

const AboutGallery = dynamic(() => import('@/components/AboutGallery'), {
  loading: () => <div style={{height:"300px"}} />
})

export default function AboutPage() {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <AboutHero />

      {/* Journey Section */}
      <AboutJourney />

      {/* Gallery Section */}
      <AboutGallery />

      {/* Carousel Section */}
      <AboutCarousel />
    </div>
  )
}

