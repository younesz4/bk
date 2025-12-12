/**
 * Conversion Tracking Component
 * Loads Meta Pixel and Google Ads only if user has consented to marketing
 */

'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { useCookieConsent } from '@/hooks/useCookieConsent'
import {
  initMetaPixel,
  initGoogleAds,
  trackPageView,
} from '@/lib/tracking'

interface ConversionTrackingProps {
  metaPixelId?: string
  googleAdsId?: string
}

/**
 * Conversion Tracking Component
 * Respects GDPR cookie consent
 */
export default function ConversionTracking({
  metaPixelId,
  googleAdsId,
}: ConversionTrackingProps) {
  const pathname = usePathname()
  const { hasConsent, isLoading } = useCookieConsent()

  useEffect(() => {
    // Wait for consent check
    if (isLoading) return

    // Only load if user consented to marketing
    if (!hasConsent('marketing')) {
      return
    }

    // Initialize Meta Pixel
    if (metaPixelId) {
      initMetaPixel(metaPixelId)
    }

    // Initialize Google Ads
    if (googleAdsId) {
      initGoogleAds(googleAdsId)
    }
  }, [hasConsent, isLoading, metaPixelId, googleAdsId])

  useEffect(() => {
    // Track page views when route changes
    if (!isLoading && hasConsent('marketing') && pathname) {
      trackPageView(pathname)
    }
  }, [pathname, hasConsent, isLoading])

  return null
}




