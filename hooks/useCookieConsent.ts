'use client'

import { useState, useEffect } from 'react'

interface ConsentData {
  consentDate: string
  essential: boolean
  analytics: boolean
  marketing: boolean
  hotjar?: boolean
  version: string
}

const CONSENT_STORAGE_KEY = 'bk-agencements-cookie-consent'
const CONSENT_VERSION = '1.0'
const CONSENT_DURATION_DAYS = 365

/**
 * Hook to access and manage cookie consent
 */
export function useCookieConsent() {
  const [consent, setConsent] = useState<ConsentData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem(CONSENT_STORAGE_KEY)
    if (stored) {
      try {
        const consentData: ConsentData = JSON.parse(stored)
        // Check if consent is still valid
        const consentDate = new Date(consentData.consentDate)
        const expirationDate = new Date(consentDate)
        expirationDate.setDate(expirationDate.getDate() + CONSENT_DURATION_DAYS)
        
        if (new Date() < expirationDate && consentData.version === CONSENT_VERSION) {
          setConsent(consentData)
        } else {
          // Consent expired, remove it
          localStorage.removeItem(CONSENT_STORAGE_KEY)
        }
      } catch (error) {
        console.error('Error parsing consent data:', error)
        localStorage.removeItem(CONSENT_STORAGE_KEY)
      }
    }
    setIsLoading(false)
  }, [])

  const hasConsent = (type: 'essential' | 'analytics' | 'marketing' | 'hotjar'): boolean => {
    if (!consent) return false
    
    switch (type) {
      case 'essential':
        return consent.essential // Always true if consent exists
      case 'analytics':
        return consent.analytics
      case 'marketing':
        return consent.marketing
      case 'hotjar':
        return consent.hotjar || false // Hotjar requires analytics consent
      default:
        return false
    }
  }

  const updateConsent = (analytics: boolean, marketing: boolean) => {
    const consentData: ConsentData = {
      consentDate: new Date().toISOString(),
      essential: true,
      analytics,
      marketing,
      version: CONSENT_VERSION,
    }
    
    localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(consentData))
    setConsent(consentData)
  }

  const clearConsent = () => {
    localStorage.removeItem(CONSENT_STORAGE_KEY)
    setConsent(null)
  }

  return {
    consent,
    isLoading,
    hasConsent,
    updateConsent,
    clearConsent,
  }
}

