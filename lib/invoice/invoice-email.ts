/**
 * Invoice Email Service
 * Sends invoice emails to customer and admin
 */

import { sendEmail } from '@/lib/email'
import { generateEmailTemplate } from '@/lib/email-templates/global-template'
import { ADMIN_NOTIFICATION_EMAIL, FROM_EMAIL } from '@/lib/config'
import fs from 'fs'
import path from 'path'
import { getPDFPath } from './pdf-storage'

interface InvoiceData {
  invoiceNumber: string
  customerName: string
  customerEmail: string
  total: number // In cents
  currency: string
  createdAt: Date
  pdfUrl: string
}

/**
 * Send invoice email to customer
 */
export async function sendInvoiceEmail(invoiceData: InvoiceData): Promise<{
  success: boolean
  messageId?: string
  error?: string
}> {
  try {
    const invoiceDate = new Date(invoiceData.createdAt).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })

    const content = `
      <p style="margin: 0 0 16px 0; font-family: 'Raleway', Arial, sans-serif; font-size: 16px; line-height: 1.6; color: #1a1a1a;">
        Bonjour ${invoiceData.customerName},
      </p>
      <p style="margin: 0 0 24px 0; font-family: 'Raleway', Arial, sans-serif; font-size: 16px; line-height: 1.6; color: #1a1a1a;">
        Veuillez trouver ci-joint votre facture pour votre commande.
      </p>

      <!-- Invoice Details -->
      <div style="background-color: #f7f5f2; border: 1px solid #e5e5e5; padding: 30px; margin: 24px 0; text-align: center;">
        <p style="margin: 0 0 8px 0; font-family: 'Raleway', Arial, sans-serif; font-size: 11px; color: #666666; text-transform: uppercase; letter-spacing: 1px;">
          Numéro de facture
        </p>
        <p style="margin: 0; font-family: 'Bodoni Moda', Georgia, serif; font-size: 36px; font-weight: 400; color: #000000; letter-spacing: 2px;">
          ${invoiceData.invoiceNumber}
        </p>
      </div>

      <!-- Total -->
      <div style="background-color: #000000; padding: 30px; margin: 24px 0; text-align: center;">
        <p style="margin: 0 0 8px 0; font-family: 'Raleway', Arial, sans-serif; font-size: 11px; color: #cccccc; text-transform: uppercase; letter-spacing: 1px;">
          Montant total
        </p>
        <p style="margin: 0; font-family: 'Bodoni Moda', Georgia, serif; font-size: 36px; font-weight: 400; color: #ffffff; letter-spacing: 2px;">
          ${new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: invoiceData.currency,
          }).format(invoiceData.total / 100)}
        </p>
      </div>

      <p style="margin: 24px 0 0 0; font-family: 'Raleway', Arial, sans-serif; font-size: 14px; color: #666666; line-height: 1.6;">
        Date d'émission: ${invoiceDate}
      </p>
    `

    const html = generateEmailTemplate({
      title: 'Votre facture',
      content,
    })

    const text = `
VOTRE FACTURE

Bonjour ${invoiceData.customerName},

Veuillez trouver ci-joint votre facture pour votre commande.

NUMÉRO DE FACTURE
${invoiceData.invoiceNumber}

MONTANT TOTAL
${new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: invoiceData.currency,
    }).format(invoiceData.total / 100)}

Date d'émission: ${invoiceDate}

BK Agencements — Mobilier sur-mesure d'exception
    `.trim()

    // Send email (attachments not supported by basic sendEmail, PDF URL included in email body)
    const success = await sendEmail(
      invoiceData.customerEmail,
      `Votre facture - BK Agencements`,
      html,
      text
    )

    return {
      success,
      messageId: success ? 'sent' : undefined,
      error: success ? undefined : 'Failed to send invoice email',
    }
  } catch (error: any) {
    console.error('Error sending invoice email:', error)
    return {
      success: false,
      error: error.message || 'Failed to send invoice email',
    }
  }
}

/**
 * Send invoice email to admin
 */
export async function sendAdminInvoiceEmail(invoiceData: InvoiceData): Promise<{
  success: boolean
  messageId?: string
  error?: string
}> {
  try {
    if (!ADMIN_NOTIFICATION_EMAIL) {
      return {
        success: false,
        error: 'Admin email not configured',
      }
    }

    const invoiceDate = new Date(invoiceData.createdAt).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })

    const content = `
      <div style="background-color: #e8f5e9; border-left: 4px solid #4caf50; padding: 20px; margin-bottom: 24px;">
        <p style="margin: 0; font-family: 'Raleway', Arial, sans-serif; font-size: 16px; color: #1a1a1a; line-height: 1.6;">
          ✅ <strong>Nouvelle facture générée</strong>
        </p>
      </div>

      <p style="margin: 0 0 8px 0; font-family: 'Raleway', Arial, sans-serif; font-size: 11px; color: #666666; text-transform: uppercase; letter-spacing: 1px;">
        Numéro de facture
      </p>
      <p style="margin: 0 0 24px 0; font-family: 'Bodoni Moda', Georgia, serif; font-size: 24px; font-weight: 400; color: #000000; letter-spacing: 1px;">
        ${invoiceData.invoiceNumber}
      </p>

      <!-- Customer Info -->
      <div style="border-top: 1px solid #e5e5e5; padding-top: 24px; margin-bottom: 24px;">
        <h3 style="margin: 0 0 16px 0; font-family: 'Bodoni Moda', Georgia, serif; font-size: 18px; font-weight: 400; color: #000000; text-transform: uppercase; letter-spacing: 1px;">
          Informations client
        </h3>
        <p style="margin: 8px 0; font-family: 'Raleway', Arial, sans-serif; font-size: 14px; color: #1a1a1a;">
          <strong>Nom:</strong> ${invoiceData.customerName}
        </p>
        <p style="margin: 8px 0; font-family: 'Raleway', Arial, sans-serif; font-size: 14px; color: #1a1a1a;">
          <strong>Email:</strong> ${invoiceData.customerEmail}
        </p>
      </div>

      <!-- Total -->
      <div style="background-color: #000000; padding: 30px; margin: 24px 0; text-align: center;">
        <p style="margin: 0 0 8px 0; font-family: 'Raleway', Arial, sans-serif; font-size: 11px; color: #cccccc; text-transform: uppercase; letter-spacing: 1px;">
          Montant total
        </p>
        <p style="margin: 0; font-family: 'Bodoni Moda', Georgia, serif; font-size: 36px; font-weight: 400; color: #ffffff; letter-spacing: 2px;">
          ${new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: invoiceData.currency,
          }).format(invoiceData.total / 100)}
        </p>
      </div>

      <p style="margin: 24px 0 0 0; font-family: 'Raleway', Arial, sans-serif; font-size: 12px; color: #666666;">
        Date d'émission: ${invoiceDate}
      </p>
    `

    const html = generateEmailTemplate({
      title: 'Nouvelle facture générée',
      content,
      footerText: 'Consultez cette facture dans le panneau d\'administration',
    })

    const text = `
NOUVELLE FACTURE GÉNÉRÉE

✅ Nouvelle facture générée

NUMÉRO DE FACTURE
${invoiceData.invoiceNumber}

INFORMATIONS CLIENT
Nom: ${invoiceData.customerName}
Email: ${invoiceData.customerEmail}

MONTANT TOTAL
${new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: invoiceData.currency,
    }).format(invoiceData.total / 100)}

Date d'émission: ${invoiceDate}
    `.trim()

    // Send email (attachments not supported by basic sendEmail, PDF URL included in email body)
    const success = await sendEmail(
      ADMIN_NOTIFICATION_EMAIL,
      `Nouvelle facture générée - #${invoiceData.invoiceNumber}`,
      html,
      text
    )

    return {
      success,
      messageId: success ? 'sent' : undefined,
      error: success ? undefined : 'Failed to send admin invoice email',
    }
  } catch (error: any) {
    console.error('Error sending admin invoice email:', error)
    return {
      success: false,
      error: error.message || 'Failed to send admin invoice email',
    }
  }
}




