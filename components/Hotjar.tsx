/**
 * Hotjar Component
 * Loads Hotjar only if user has consented to analytics
 */

'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { useCookieConsent } from '@/hooks/useCookieConsent'

interface HotjarProps {
  siteId: string
}

/**
 * Hotjar Analytics Component
 * Respects GDPR cookie consent
 */
export default function Hotjar({ siteId }: HotjarProps) {
  const pathname = usePathname()
  const { hasConsent, isLoading } = useCookieConsent()

  useEffect(() => {
    // Don't load on admin pages
    if (pathname?.startsWith('/admin')) {
      return
    }

    // Wait for consent check
    if (isLoading) return

    // Only load if user consented to analytics
    if (!hasConsent('analytics')) {
      return
    }

    // Check if already loaded
    if (window._hj) {
      return
    }

    // Load Hotjar script
    ;(function (h: any, o: any, t: any, j: any, a?: any, r?: any) {
      h.hj =
        h.hj ||
        function () {
          ;(h.hj.q = h.hj.q || []).push(arguments)
        }
      h._hjSettings = { hjid: siteId, hjsv: 6 }
      a = o.getElementsByTagName('head')[0]
      r = o.createElement('script')
      r.async = 1
      r.src = t + h._hjSettings.hjid + j + h._hjSettings.hjsv
      a.appendChild(r)
    })(window, document, 'https://static.hotjar.com/c/hotjar-', '.js?sv=')

    // Track page view
    if (window._hj) {
      window._hj('stateChange', pathname)
    }
  }, [hasConsent, isLoading, pathname, siteId])

  useEffect(() => {
    // Track page changes
    if (!isLoading && hasConsent('analytics') && window._hj && pathname) {
      window._hj('stateChange', pathname)
    }
  }, [pathname, hasConsent, isLoading])

  return null
}




