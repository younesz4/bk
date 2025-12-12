/**
 * GDPR-Compliant Email Collection
 * Consent wording, unsubscribe system, privacy requirements
 */

import { prisma } from '@/lib/prisma'

export interface EmailConsent {
  email: string
  consentGiven: boolean
  consentDate: Date
  consentSource: 'contact_form' | 'checkout' | 'newsletter' | 'quote_request'
  marketingConsent: boolean
  marketingConsentDate?: Date
  unsubscribed: boolean
  unsubscribedDate?: Date
  ipAddress?: string
  userAgent?: string
}

/**
 * Consent Wording for Contact Form
 */
export const contactFormConsentWording = `En soumettant ce formulaire, vous acceptez que BK Agencements traite vos données personnelles pour répondre à votre demande. Vous pouvez vous désabonner à tout moment. Consultez notre politique de confidentialité.`

/**
 * Consent Wording for Newsletter
 */
export const newsletterConsentWording = `En vous abonnant à notre newsletter, vous acceptez de recevoir nos communications marketing. Vous pouvez vous désabonner à tout moment en cliquant sur le lien présent dans chaque email.`

/**
 * Consent Wording for Checkout
 */
export const checkoutConsentWording = `En passant commande, vous acceptez que BK Agencements traite vos données pour la gestion de votre commande. Vous pouvez également choisir de recevoir nos communications marketing.`

/**
 * Save Email Consent
 */
export async function saveEmailConsent(consent: EmailConsent): Promise<void> {
  // In production, save to database
  // For now, this is a placeholder
  console.log('Email consent saved:', consent)
}

/**
 * Check if Email is Unsubscribed
 */
export async function isEmailUnsubscribed(email: string): Promise<boolean> {
  // In production, check database
  // For now, return false
  return false
}

/**
 * Unsubscribe Email
 */
export async function unsubscribeEmail(email: string, reason?: string): Promise<void> {
  // In production, update database
  console.log('Email unsubscribed:', email, reason)
}

/**
 * Generate Unsubscribe Link
 */
export function generateUnsubscribeLink(email: string, token?: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://bk-agencements.com'
  if (token) {
    return `${baseUrl}/unsubscribe?email=${encodeURIComponent(email)}&token=${token}`
  }
  return `${baseUrl}/unsubscribe?email=${encodeURIComponent(email)}`
}

/**
 * Generate Privacy Policy Link
 */
export function generatePrivacyPolicyLink(): string {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://bk-agencements.com'
  return `${baseUrl}/politique-de-confidentialite`
}

/**
 * Add Unsubscribe Footer to Email
 */
export function addUnsubscribeFooter(html: string, email: string): string {
  const unsubscribeLink = generateUnsubscribeLink(email)
  const privacyLink = generatePrivacyPolicyLink()
  
  const footer = `
    <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e5e5; text-align: center;">
      <p style="margin: 0 0 8px 0; font-family: 'Raleway', Arial, sans-serif; font-size: 11px; color: #999999;">
        Vous recevez cet email car vous êtes client de BK Agencements ou vous vous êtes abonné à notre newsletter.
      </p>
      <p style="margin: 0; font-family: 'Raleway', Arial, sans-serif; font-size: 11px; color: #999999;">
        <a href="${unsubscribeLink}" style="color: #999999; text-decoration: underline;">Se désabonner</a> | 
        <a href="${privacyLink}" style="color: #999999; text-decoration: underline;">Politique de confidentialité</a>
      </p>
    </div>
  `
  
  // Insert before closing body tag
  return html.replace('</body>', `${footer}</body>`)
}

/**
 * Database Schema for Email Consent (Prisma)
 * Add to schema.prisma:
 */
export const emailConsentSchema = `
model EmailConsent {
  id                    String   @id @default(cuid())
  email                  String   @unique
  consentGiven           Boolean  @default(false)
  consentDate            DateTime
  consentSource          String   // contact_form, checkout, newsletter, quote_request
  marketingConsent       Boolean  @default(false)
  marketingConsentDate   DateTime?
  unsubscribed           Boolean  @default(false)
  unsubscribedDate       DateTime?
  ipAddress             String?
  userAgent              String?
  createdAt              DateTime @default(now())
  updatedAt              DateTime @updatedAt

  @@index([email])
  @@index([unsubscribed])
  @@index([marketingConsent])
}
`




