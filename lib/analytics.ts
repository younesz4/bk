/**
 * Privacy-Safe Analytics Integration
 * 
 * This module provides analytics functionality that respects user consent.
 * Currently configured for Umami (privacy-first, GDPR-compliant, no cookies).
 * 
 * Alternative options:
 * - Plausible: Similar to Umami, privacy-first
 * - Matomo: Self-hosted, full control
 */

import { useCookieConsent } from '@/hooks/useCookieConsent'

// Umami configuration
const UMAMI_WEBSITE_ID = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID
const UMAMI_SCRIPT_URL = process.env.NEXT_PUBLIC_UMAMI_SCRIPT_URL || 'https://analytics.umami.is/script.js'

/**
 * Load Umami analytics script
 * Only loads if user has consented to analytics
 */
export function loadUmamiAnalytics() {
  // Check if we're in the browser
  if (typeof window === 'undefined') return

  // Check if script already loaded
  if (document.querySelector(`script[src="${UMAMI_SCRIPT_URL}"]`)) {
    return
  }

  // Check consent (this is a client-side check)
  // Note: In a real implementation, you'd use the useCookieConsent hook
  // For server-side rendering, we check localStorage directly
  try {
    const consent = localStorage.getItem('bk-agencements-cookie-consent')
    if (consent) {
      const consentData = JSON.parse(consent)
      if (!consentData.analytics) {
        return // User hasn't consented to analytics
      }
    } else {
      return // No consent given yet
    }
  } catch (error) {
    console.error('Error checking consent:', error)
    return
  }

  // Only load if website ID is configured
  if (!UMAMI_WEBSITE_ID) {
    console.warn('Umami website ID not configured')
    return
  }

  // Create and append script
  const script = document.createElement('script')
  script.async = true
  script.defer = true
  script.src = UMAMI_SCRIPT_URL
  script.setAttribute('data-website-id', UMAMI_WEBSITE_ID)
  document.head.appendChild(script)
}

/**
 * Track a page view
 * Only tracks if analytics consent is given
 */
export function trackPageView(url: string) {
  if (typeof window === 'undefined') return

  // Check consent
  try {
    const consent = localStorage.getItem('bk-agencements-cookie-consent')
    if (consent) {
      const consentData = JSON.parse(consent)
      if (consentData.analytics && (window as any).umami) {
        ;(window as any).umami.track(url)
      }
    }
  } catch (error) {
    console.error('Error tracking page view:', error)
  }
}

/**
 * Track a custom event
 * Only tracks if analytics consent is given
 */
export function trackEvent(eventName: string, eventData?: Record<string, any>) {
  if (typeof window === 'undefined') return

  // Check consent
  try {
    const consent = localStorage.getItem('bk-agencements-cookie-consent')
    if (consent) {
      const consentData = JSON.parse(consent)
      if (consentData.analytics && (window as any).umami) {
        ;(window as any).umami.track(eventName, eventData)
      }
    }
  } catch (error) {
    console.error('Error tracking event:', error)
  }
}

/**
 * Initialize analytics when consent is given
 * Call this after user accepts analytics cookies
 */
export function initializeAnalytics() {
  loadUmamiAnalytics()
}

