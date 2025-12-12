import type { Metadata, Viewport } from 'next'
import { Raleway, Bodoni_Moda } from 'next/font/google'
import './globals.css'
import '../styles/transitions.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { CartProvider } from '@/contexts/CartContext'
import { TransitionProvider } from '@/contexts/TransitionContext'
import Cart from '@/components/Cart'
import CookieConsent from '@/components/CookieConsent'
import Analytics from '@/components/Analytics'
import Hotjar from '@/components/Hotjar'
import ConversionTracking from '@/components/ConversionTracking'
import PageReveal from '@/components/PageReveal'
import TransitionLayout from './transition-layout'
import CustomCursor from '@/components/CustomCursor'
import { Analytics as VercelAnalytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'

const raleway = Raleway({ 
  subsets: ['latin'],
  variable: '--font-raleway',
  weight: ['300', '400', '500', '600'],
  display: 'swap',
  preload: true,
})

const bodoniModa = Bodoni_Moda({ 
  subsets: ['latin'],
  variable: '--font-bodoni',
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  preload: true,
})

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://bk-agencements.com'
const siteName = 'BK Agencements'
const defaultTitle = 'BK Agencements | Mobilier sur-mesure & Agencement intérieur'
const defaultDescription = 'Mobilier sur-mesure haut de gamme, menuiserie, tapisserie et ferronnerie. Agencement intérieur d\'exception au Maroc.'
const defaultImage = `${baseUrl}/vila1.jpg`

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  
  // Title configuration
  title: {
    default: defaultTitle,
    template: `%s | ${siteName}`,
  },
  
  // Description
  description: defaultDescription,
  
  // Keywords
  keywords: [
    'mobilier sur-mesure',
    'agencement intérieur',
    'menuiserie',
    'tapisserie',
    'ferronnerie',
    'mobilier haut de gamme',
    'Casablanca',
    'Maroc',
    'décoration intérieure',
    'mobilier design',
  ],
  
  // Authors
  authors: [
    {
      name: siteName,
    },
  ],
  
  // Creator
  creator: siteName,
  
  // Publisher
  publisher: siteName,
  
  // Canonical URL
  alternates: {
    canonical: baseUrl,
    languages: {
      'fr-FR': baseUrl,
      'fr': baseUrl,
      'ar': `${baseUrl}/ar`,
      'en': `${baseUrl}/en`,
    },
  },
  
  // OpenGraph configuration
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: baseUrl,
    siteName: siteName,
    title: defaultTitle,
    description: defaultDescription,
    images: [
      {
        url: defaultImage,
        width: 1200,
        height: 630,
        alt: `${siteName} - Mobilier sur-mesure`,
        type: 'image/jpeg',
      },
    ],
  },
  
  // Twitter Card configuration
  twitter: {
    card: 'summary_large_image',
    title: defaultTitle,
    description: defaultDescription,
    images: [
      {
        url: defaultImage,
        width: 1200,
        height: 630,
        alt: `${siteName} - Mobilier sur-mesure`,
      },
    ],
    creator: '@bkagencements', // Update with your Twitter handle if available
    site: '@bkagencements', // Update with your Twitter handle if available
  },
  
  // Robots configuration
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  
  // Icons
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/icon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/icon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  
  // Manifest
  manifest: '/manifest.json',
  
  // Category
  category: 'Furniture & Interior Design',
  
  // Classification
  classification: 'Business',
  
  // Other metadata
  other: {
    'mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'black-translucent',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Website structured data
  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${baseUrl}#website`,
    url: baseUrl,
    name: siteName,
    description: defaultDescription,
    publisher: {
      '@id': `${baseUrl}#organization`,
    },
    inLanguage: 'fr-FR',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${baseUrl}/boutique?search={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  }

  // Organization structured data
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${baseUrl}#organization`,
    name: siteName,
    legalName: siteName,
    description: defaultDescription,
    url: baseUrl,
    logo: {
      '@type': 'ImageObject',
      url: `${baseUrl}/logo-1.png`,
      width: 200,
      height: 200,
      '@id': `${baseUrl}#logo`,
    },
    image: {
      '@type': 'ImageObject',
      url: `${baseUrl}/vila1.jpg`,
      width: 1200,
      height: 630,
    },
    address: {
      '@type': 'PostalAddress',
      streetAddress: '123 Rue Royale',
      addressLocality: 'Casablanca',
      postalCode: '20000',
      addressRegion: 'Casablanca-Settat',
      addressCountry: 'MA',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+212-522-123-456',
      contactType: 'Customer Service',
      areaServed: 'MA',
      availableLanguage: ['French', 'Arabic'],
    },
    areaServed: {
      '@type': 'Country',
      name: 'Morocco',
      sameAs: 'https://en.wikipedia.org/wiki/Morocco',
    },
    foundingDate: '2020',
    priceRange: '$$$',
    sameAs: [
      // Add social media profiles here when available
      // 'https://www.facebook.com/bkagencements',
      // 'https://www.instagram.com/bkagencements',
      // 'https://www.linkedin.com/company/bkagencements',
    ],
  }

  // LocalBusiness structured data (for local SEO)
  const localBusinessSchema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${baseUrl}#localbusiness`,
    name: siteName,
    description: defaultDescription,
    url: baseUrl,
    logo: {
      '@type': 'ImageObject',
      url: `${baseUrl}/logo-1.png`,
      width: 200,
      height: 200,
    },
    image: {
      '@type': 'ImageObject',
      url: `${baseUrl}/vila1.jpg`,
      width: 1200,
      height: 630,
    },
    address: {
      '@type': 'PostalAddress',
      streetAddress: '123 Rue Royale',
      addressLocality: 'Casablanca',
      postalCode: '20000',
      addressRegion: 'Casablanca-Settat',
      addressCountry: 'MA',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: '33.5731',
      longitude: '-7.5898',
    },
    telephone: '+212-522-123-456',
    priceRange: '$$$',
    areaServed: {
      '@type': 'Country',
      name: 'Morocco',
    },
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: [
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
      ],
      opens: '09:00',
      closes: '18:00',
    },
  }

  return (
    <html lang="fr" className={`${raleway.variable} ${bodoniModa.variable}`} suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
        />
        {/* Preload critical project images */}
        <link rel="preload" as="image" href="/key.webp" />
        <link rel="preload" as="image" href="/atlantic.webp" />
        <link rel="preload" as="image" href="/nom1.webp" />
        <link rel="preload" as="image" href="/raff.webp" />
      </head>
      <body className="font-sans antialiased">
        <CustomCursor />
        <CartProvider>
          <TransitionProvider>
            {/* Single PageReveal rendered once at root */}
            <PageReveal />
            {/* Skip to main content link */}
            <a
              href="#main-content"
              className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-black focus:text-white focus:rounded focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black"
            >
              Aller au contenu
            </a>
            <Header />
            <main id="main-content" className="min-h-screen" role="main">
              <TransitionLayout>
                {children}
              </TransitionLayout>
            </main>
            <Footer />
            <Cart />
            <CookieConsent />
            <Analytics />
            {/* Vercel Analytics - Always enabled (privacy-friendly) */}
            <VercelAnalytics />
            <SpeedInsights />
            {/* Hotjar - Only loads with analytics consent */}
            {process.env.NEXT_PUBLIC_HOTJAR_ID && (
              <Hotjar siteId={process.env.NEXT_PUBLIC_HOTJAR_ID} />
            )}
            {/* Conversion Tracking - Only loads with marketing consent */}
            <ConversionTracking
              metaPixelId={process.env.NEXT_PUBLIC_META_PIXEL_ID}
              googleAdsId={process.env.NEXT_PUBLIC_GOOGLE_ADS_ID}
            />
          </TransitionProvider>
        </CartProvider>
      </body>
    </html>
  )
}

