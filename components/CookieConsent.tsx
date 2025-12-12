'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'

interface ConsentData {
  consentDate: string
  essential: boolean
  analytics: boolean
  marketing: boolean
  hotjar?: boolean // Hotjar consent (part of analytics)
  version: string
}

const CONSENT_STORAGE_KEY = 'bk-agencements-cookie-consent'
const CONSENT_VERSION = '1.0'
const CONSENT_DURATION_DAYS = 365

export default function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false)
  const [showCustomize, setShowCustomize] = useState(false)
  const [consent, setConsent] = useState<ConsentData | null>(null)
  const [tempConsent, setTempConsent] = useState({
    analytics: false,
    marketing: false,
    hotjar: false,
  })

  useEffect(() => {
    // Check if consent already exists and is valid
    const stored = localStorage.getItem(CONSENT_STORAGE_KEY)
    if (stored) {
      try {
        const consentData: ConsentData = JSON.parse(stored)
        // Check if consent is still valid (not expired)
        const consentDate = new Date(consentData.consentDate)
        const expirationDate = new Date(consentDate)
        expirationDate.setDate(expirationDate.getDate() + CONSENT_DURATION_DAYS)
        
        if (new Date() < expirationDate && consentData.version === CONSENT_VERSION) {
          setConsent(consentData)
          setShowBanner(false)
          // Load scripts based on consent
          loadScripts(consentData)
          return
        }
      } catch (error) {
        console.error('Error parsing consent data:', error)
      }
    }
    
    // No valid consent found, show banner
    setShowBanner(true)
  }, [])

  const saveConsent = (analytics: boolean, marketing: boolean, hotjar: boolean = analytics) => {
    const consentData: ConsentData = {
      consentDate: new Date().toISOString(),
      essential: true, // Always true, required for site functionality
      analytics,
      marketing,
      hotjar: hotjar && analytics, // Hotjar requires analytics consent
      version: CONSENT_VERSION,
    }

    localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(consentData))
    setConsent(consentData)
    setShowBanner(false)
    setShowCustomize(false)
    
    // Dispatch event to notify other components
    window.dispatchEvent(new CustomEvent('cookie-consent-updated', { detail: consentData }))
    
    // Load scripts based on consent
    loadScripts(consentData)
  }

  const handleAcceptAll = () => {
    saveConsent(true, true, true)
  }

  const handleRejectAll = () => {
    saveConsent(false, false, false)
  }

  const handleSavePreferences = () => {
    saveConsent(tempConsent.analytics, tempConsent.marketing, tempConsent.hotjar)
  }

  const loadScripts = (consentData: ConsentData) => {
    // Only load analytics/marketing scripts if user consented
    if (consentData.analytics) {
      // Load analytics script here (e.g., Umami, Plausible)
      // Example: window.umami?.track()
    }
    
    if (consentData.marketing) {
      // Load marketing scripts here (e.g., Facebook Pixel, Google Ads)
      // Example: window.fbq?.('init', 'YOUR_PIXEL_ID')
    }
  }

  if (!showBanner) {
    return null
  }

  return (
    <AnimatePresence>
      {showBanner && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6"
          role="dialog"
          aria-labelledby="cookie-consent-title"
          aria-describedby="cookie-consent-description"
        >
          <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-2xl border border-neutral-200 p-6 md:p-8">
            <div className="mb-6">
              <h2
                id="cookie-consent-title"
                className="text-xl md:text-2xl mb-4 font-bodoni"
                style={{ fontFamily: 'var(--font-bodoni)' }}
              >
                Utilisation des cookies
              </h2>
              <p
                id="cookie-consent-description"
                className="text-sm md:text-base text-neutral-700 leading-relaxed mb-4"
                style={{ fontFamily: 'var(--font-raleway)' }}
              >
                Nous utilisons des cookies pour améliorer votre expérience de navigation et analyser le trafic de notre site. En continuant à utiliser ce site, vous acceptez notre utilisation des cookies.
              </p>
              <Link
                href="/politique-de-confidentialite"
                className="text-sm text-neutral-600 hover:text-neutral-900 underline transition-colors"
                style={{ fontFamily: 'var(--font-raleway)' }}
              >
                En savoir plus sur notre utilisation des cookies
              </Link>
            </div>

            {!showCustomize ? (
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <button
                  onClick={handleAcceptAll}
                  className="px-6 py-3 bg-black text-white uppercase tracking-wider text-sm font-light hover:bg-neutral-800 transition-colors focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
                  style={{ fontFamily: 'var(--font-raleway)' }}
                  aria-label="Accepter tous les cookies"
                >
                  Accepter
                </button>
                <button
                  onClick={handleRejectAll}
                  className="px-6 py-3 bg-white border border-neutral-300 text-neutral-900 uppercase tracking-wider text-sm font-light hover:bg-neutral-50 transition-colors focus:outline-none focus:ring-2 focus:ring-neutral-300 focus:ring-offset-2"
                  style={{ fontFamily: 'var(--font-raleway)' }}
                  aria-label="Continuer sans accepter les cookies non essentiels"
                >
                  Continuer sans accepter
                </button>
                <button
                  onClick={() => setShowCustomize(true)}
                  className="px-6 py-3 bg-transparent text-neutral-700 uppercase tracking-wider text-sm font-light hover:text-neutral-900 underline transition-colors focus:outline-none focus:ring-2 focus:ring-neutral-300 focus:ring-offset-2"
                  style={{ fontFamily: 'var(--font-raleway)' }}
                  aria-label="Personnaliser mes préférences de cookies"
                >
                  Personnaliser
                </button>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-4"
              >
                <h3
                  className="text-lg font-medium mb-4"
                  style={{ fontFamily: 'var(--font-bodoni)' }}
                >
                  Personnaliser mes préférences
                </h3>

                <div className="space-y-4">
                  <div className="flex items-start justify-between p-4 bg-neutral-50 rounded-lg">
                    <div className="flex-1">
                      <h4
                        className="font-semibold mb-1"
                        style={{ fontFamily: 'var(--font-raleway)' }}
                      >
                        Cookies essentiels
                      </h4>
                      <p
                        className="text-sm text-neutral-600"
                        style={{ fontFamily: 'var(--font-raleway)' }}
                      >
                        Nécessaires au fonctionnement du site
                      </p>
                    </div>
                    <span
                      className="text-sm text-neutral-500 ml-4"
                      style={{ fontFamily: 'var(--font-raleway)' }}
                    >
                      Toujours actifs
                    </span>
                  </div>

                  <div className="flex items-start justify-between p-4 bg-white border border-neutral-200 rounded-lg">
                    <div className="flex-1">
                      <h4
                        className="font-semibold mb-1"
                        style={{ fontFamily: 'var(--font-raleway)' }}
                      >
                        Cookies analytiques
                      </h4>
                      <p
                        className="text-sm text-neutral-600"
                        style={{ fontFamily: 'var(--font-raleway)' }}
                      >
                        Nous aident à comprendre comment vous utilisez le site (Vercel Analytics, Umami)
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer ml-4">
                      <input
                        type="checkbox"
                        checked={tempConsent.analytics}
                        onChange={(e) =>
                          setTempConsent({ 
                            ...tempConsent, 
                            analytics: e.target.checked,
                            hotjar: e.target.checked ? tempConsent.hotjar : false, // Disable Hotjar if analytics disabled
                          })
                        }
                        className="sr-only peer"
                        aria-label="Activer les cookies analytiques"
                      />
                      <div className="w-11 h-6 bg-neutral-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-black peer-focus:ring-offset-2 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-black"></div>
                    </label>
                  </div>

                  <div className="flex items-start justify-between p-4 bg-white border border-neutral-200 rounded-lg">
                    <div className="flex-1">
                      <h4
                        className="font-semibold mb-1"
                        style={{ fontFamily: 'var(--font-raleway)' }}
                      >
                        Hotjar (Heatmaps)
                      </h4>
                      <p
                        className="text-sm text-neutral-600"
                        style={{ fontFamily: 'var(--font-raleway)' }}
                      >
                        Analyse du comportement utilisateur avec heatmaps et enregistrements
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer ml-4">
                      <input
                        type="checkbox"
                        checked={tempConsent.hotjar}
                        disabled={!tempConsent.analytics}
                        onChange={(e) =>
                          setTempConsent({ ...tempConsent, hotjar: e.target.checked })
                        }
                        className="sr-only peer"
                        aria-label="Activer Hotjar"
                      />
                      <div className={`w-11 h-6 bg-neutral-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-black peer-focus:ring-offset-2 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-black ${!tempConsent.analytics ? 'opacity-50 cursor-not-allowed' : ''}`}></div>
                    </label>
                  </div>

                  <div className="flex items-start justify-between p-4 bg-white border border-neutral-200 rounded-lg">
                    <div className="flex-1">
                      <h4
                        className="font-semibold mb-1"
                        style={{ fontFamily: 'var(--font-raleway)' }}
                      >
                        Cookies marketing
                      </h4>
                      <p
                        className="text-sm text-neutral-600"
                        style={{ fontFamily: 'var(--font-raleway)' }}
                      >
                        Utilisés pour vous proposer des contenus personnalisés
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer ml-4">
                      <input
                        type="checkbox"
                        checked={tempConsent.marketing}
                        onChange={(e) =>
                          setTempConsent({ ...tempConsent, marketing: e.target.checked })
                        }
                        className="sr-only peer"
                        aria-label="Activer les cookies marketing"
                      />
                      <div className="w-11 h-6 bg-neutral-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-black peer-focus:ring-offset-2 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-black"></div>
                    </label>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4">
                  <button
                    onClick={handleSavePreferences}
                    className="px-6 py-3 bg-black text-white uppercase tracking-wider text-sm font-light hover:bg-neutral-800 transition-colors focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
                    style={{ fontFamily: 'var(--font-raleway)' }}
                    aria-label="Enregistrer mes préférences de cookies"
                  >
                    Enregistrer mes préférences
                  </button>
                  <button
                    onClick={() => setShowCustomize(false)}
                    className="px-6 py-3 bg-transparent text-neutral-700 uppercase tracking-wider text-sm font-light hover:text-neutral-900 underline transition-colors focus:outline-none focus:ring-2 focus:ring-neutral-300 focus:ring-offset-2"
                    style={{ fontFamily: 'var(--font-raleway)' }}
                  >
                    Annuler
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
