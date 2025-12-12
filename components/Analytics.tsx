'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { useCookieConsent } from '@/hooks/useCookieConsent'
import { loadUmamiAnalytics, trackPageView } from '@/lib/analytics'

/**
 * Analytics component that respects user consent
 * Only loads and tracks if user has consented to analytics
 */
export default function Analytics() {
  const pathname = usePathname()
  const { hasConsent, isLoading } = useCookieConsent()

  useEffect(() => {
    // Wait for consent check to complete
    if (isLoading) return

    // Only load analytics if user consented
    if (hasConsent('analytics')) {
      loadUmamiAnalytics()
    }

    // Listen for consent changes
    const handleConsentChange = () => {
      if (hasConsent('analytics')) {
        loadUmamiAnalytics()
      }
    }

    window.addEventListener('analytics-consent-given', handleConsentChange)

    return () => {
      window.removeEventListener('analytics-consent-given', handleConsentChange)
    }
  }, [hasConsent, isLoading])

  useEffect(() => {
    // Track page views when route changes
    if (!isLoading && hasConsent('analytics')) {
      // Small delay to ensure Umami is loaded
      const timer = setTimeout(() => {
        trackPageView(pathname)
      }, 100)

      return () => clearTimeout(timer)
    }
  }, [pathname, hasConsent, isLoading])

  // This component doesn't render anything
  return null
}

