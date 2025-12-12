/**
 * Settings Page
 * Store configuration: name, logo, contact email, currency, tax rate, COD enabled/disabled
 */

'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

interface Settings {
  storeName: string
  contactEmail: string
  currency: string
  taxRate: number
  codEnabled: boolean
  logoUrl: string | null
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings>({
    storeName: 'BK Agencements',
    contactEmail: '',
    currency: 'EUR',
    taxRate: 20,
    codEnabled: true,
    logoUrl: null,
  })
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [saveStatus, setSaveStatus] = useState<{ success: boolean; message: string } | null>(null)

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/admin/settings')
      if (response.ok) {
        const data = await response.json()
        if (data.settings) {
          setSettings(data.settings)
        }
      }
    } catch (error) {
      console.error('Error fetching settings:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setSaveStatus(null)

    try {
      const response = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      })

      const data = await response.json()

      if (response.ok) {
        setSaveStatus({ success: true, message: 'Paramètres enregistrés avec succès' })
      } else {
        setSaveStatus({ success: false, message: data.error || 'Erreur lors de l\'enregistrement' })
      }
    } catch (error) {
      setSaveStatus({ success: false, message: 'Erreur lors de l\'enregistrement' })
    } finally {
      setIsSaving(false)
    }
  }

  const handleInputChange = (field: keyof Settings, value: any) => {
    setSettings((prev) => ({ ...prev, [field]: value }))
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-neutral-600 dark:text-neutral-400">Chargement...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1
          className="text-3xl font-light text-neutral-900 dark:text-white mb-2"
          style={{ fontFamily: 'var(--font-bodoni)' }}
        >
          Paramètres
        </h1>
        <p className="text-neutral-600 dark:text-neutral-400" style={{ fontFamily: 'var(--font-raleway)' }}>
          Configurez les paramètres de votre boutique
        </p>
      </div>

      {/* Settings Form */}
      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={handleSave}
        className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm border border-neutral-200 dark:border-neutral-700 p-6 md:p-8 space-y-6"
      >
        {/* Store Name */}
        <div>
          <label
            htmlFor="storeName"
            className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2"
            style={{ fontFamily: 'var(--font-raleway)' }}
          >
            Nom de la boutique
          </label>
          <input
            type="text"
            id="storeName"
            value={settings.storeName}
            onChange={(e) => handleInputChange('storeName', e.target.value)}
            className="w-full px-4 py-3 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white"
            style={{ fontFamily: 'var(--font-raleway)' }}
            required
          />
        </div>

        {/* Contact Email */}
        <div>
          <label
            htmlFor="contactEmail"
            className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2"
            style={{ fontFamily: 'var(--font-raleway)' }}
          >
            Email de contact
          </label>
          <input
            type="email"
            id="contactEmail"
            value={settings.contactEmail}
            onChange={(e) => handleInputChange('contactEmail', e.target.value)}
            className="w-full px-4 py-3 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white"
            style={{ fontFamily: 'var(--font-raleway)' }}
            required
          />
        </div>

        {/* Currency */}
        <div>
          <label
            htmlFor="currency"
            className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2"
            style={{ fontFamily: 'var(--font-raleway)' }}
          >
            Devise
          </label>
          <select
            id="currency"
            value={settings.currency}
            onChange={(e) => handleInputChange('currency', e.target.value)}
            className="w-full px-4 py-3 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white"
            style={{ fontFamily: 'var(--font-raleway)' }}
          >
            <option value="EUR">EUR (€)</option>
            <option value="USD">USD ($)</option>
            <option value="MAD">MAD (د.م.)</option>
          </select>
        </div>

        {/* Tax Rate */}
        <div>
          <label
            htmlFor="taxRate"
            className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2"
            style={{ fontFamily: 'var(--font-raleway)' }}
          >
            Taux de TVA (%)
          </label>
          <input
            type="number"
            id="taxRate"
            min="0"
            max="100"
            step="0.1"
            value={settings.taxRate}
            onChange={(e) => handleInputChange('taxRate', parseFloat(e.target.value))}
            className="w-full px-4 py-3 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white"
            style={{ fontFamily: 'var(--font-raleway)' }}
            required
          />
        </div>

        {/* COD Enabled */}
        <div className="flex items-center justify-between p-4 border border-neutral-200 dark:border-neutral-700 rounded-lg">
          <div>
            <label
              htmlFor="codEnabled"
              className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1"
              style={{ fontFamily: 'var(--font-raleway)' }}
            >
              Paiement à la livraison (COD)
            </label>
            <p className="text-xs text-neutral-500 dark:text-neutral-400" style={{ fontFamily: 'var(--font-raleway)' }}>
              Autoriser les commandes avec paiement à la livraison
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              id="codEnabled"
              checked={settings.codEnabled}
              onChange={(e) => handleInputChange('codEnabled', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-neutral-300 dark:peer-focus:ring-neutral-800 rounded-full peer dark:bg-neutral-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-neutral-600 peer-checked:bg-black dark:peer-checked:bg-white"></div>
          </label>
        </div>

        {/* Logo Upload */}
        <div>
          <label
            className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2"
            style={{ fontFamily: 'var(--font-raleway)' }}
          >
            Logo
          </label>
          <div className="flex items-center gap-4">
            {settings.logoUrl && (
              <img
                src={settings.logoUrl}
                alt="Logo"
                className="w-24 h-24 object-contain border border-neutral-200 dark:border-neutral-700 rounded-lg"
              />
            )}
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) {
                  // Handle file upload (would need upload API)
                  console.log('File selected:', file)
                }
              }}
              className="text-sm text-neutral-600 dark:text-neutral-400"
              style={{ fontFamily: 'var(--font-raleway)' }}
            />
          </div>
        </div>

        {/* Save Status */}
        {saveStatus && (
          <div
            className={`p-4 rounded-lg ${
              saveStatus.success
                ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-800 dark:text-green-200'
                : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-200'
            }`}
          >
            <p style={{ fontFamily: 'var(--font-raleway)' }}>{saveStatus.message}</p>
          </div>
        )}

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="px-8 py-3 bg-black dark:bg-white text-white dark:text-black hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wider text-sm font-light"
            style={{ fontFamily: 'var(--font-raleway)' }}
          >
            {isSaving ? 'Enregistrement...' : 'Enregistrer'}
          </button>
        </div>
      </motion.form>
    </div>
  )
}




