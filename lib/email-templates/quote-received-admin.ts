/**
 * Quote Received Admin Notification Email
 * Sent to admin when a new quote request is received
 */

import { generateEmailTemplate } from './global-template'

interface Quote {
  id: string
  customerName: string
  email: string
  phone: string
  projectType: string
  budget: string | null
  message: string | null
  dimensions: string | null
  materials: string | null
  finishes: string | null
  customDetails: string | null
  createdAt: string
}

export function generateQuoteReceivedAdminEmail({ quote }: { quote: Quote }): {
  html: string
  text: string
  subject: string
} {
  const quoteDate = new Date(quote.createdAt).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'

  const content = `
    <div style="background-color: #e8f5e9; border-left: 4px solid #4caf50; padding: 20px; margin-bottom: 24px;">
      <p style="margin: 0; font-family: 'Raleway', Arial, sans-serif; font-size: 16px; color: #1a1a1a; line-height: 1.6;">
        ✅ <strong>Nouvelle demande de devis reçue</strong>
      </p>
    </div>

    <p style="margin: 0 0 8px 0; font-family: 'Raleway', Arial, sans-serif; font-size: 11px; color: #666666; text-transform: uppercase; letter-spacing: 1px;">
      Référence du devis
    </p>
    <p style="margin: 0 0 24px 0; font-family: 'Bodoni Moda', Georgia, serif; font-size: 24px; font-weight: 400; color: #000000; letter-spacing: 1px;">
      #${quote.id.substring(0, 8)}
    </p>

    <!-- Customer Info -->
    <div style="border-top: 1px solid #e5e5e5; padding-top: 24px; margin-bottom: 24px;">
      <h3 style="margin: 0 0 16px 0; font-family: 'Bodoni Moda', Georgia, serif; font-size: 18px; font-weight: 400; color: #000000; text-transform: uppercase; letter-spacing: 1px;">
        Informations client
      </h3>
      <p style="margin: 8px 0; font-family: 'Raleway', Arial, sans-serif; font-size: 14px; color: #1a1a1a;">
        <strong>Nom:</strong> ${quote.customerName}
      </p>
      <p style="margin: 8px 0; font-family: 'Raleway', Arial, sans-serif; font-size: 14px; color: #1a1a1a;">
        <strong>Email:</strong> <a href="mailto:${quote.email}" style="color: #000000; text-decoration: underline;">${quote.email}</a>
      </p>
      <p style="margin: 8px 0; font-family: 'Raleway', Arial, sans-serif; font-size: 14px; color: #1a1a1a;">
        <strong>Téléphone:</strong> <a href="tel:${quote.phone}" style="color: #000000; text-decoration: underline;">${quote.phone}</a>
      </p>
    </div>

    <!-- Project Details -->
    <div style="border-top: 1px solid #e5e5e5; padding-top: 24px; margin-bottom: 24px;">
      <h3 style="margin: 0 0 16px 0; font-family: 'Bodoni Moda', Georgia, serif; font-size: 18px; font-weight: 400; color: #000000; text-transform: uppercase; letter-spacing: 1px;">
        Détails du projet
      </h3>
      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
        <tr>
          <td style="padding: 8px 0; font-family: 'Raleway', Arial, sans-serif; font-size: 14px; color: #666666; width: 140px;">
            Type de projet
          </td>
          <td style="padding: 8px 0; font-family: 'Raleway', Arial, sans-serif; font-size: 14px; color: #1a1a1a; font-weight: 500;">
            ${quote.projectType}
          </td>
        </tr>
        ${quote.budget
          ? `
        <tr>
          <td style="padding: 8px 0; font-family: 'Raleway', Arial, sans-serif; font-size: 14px; color: #666666;">
            Budget
          </td>
          <td style="padding: 8px 0; font-family: 'Raleway', Arial, sans-serif; font-size: 14px; color: #1a1a1a; font-weight: 500;">
            ${quote.budget}
          </td>
        </tr>
        `
          : ''}
        ${quote.dimensions
          ? `
        <tr>
          <td style="padding: 8px 0; font-family: 'Raleway', Arial, sans-serif; font-size: 14px; color: #666666;">
            Dimensions
          </td>
          <td style="padding: 8px 0; font-family: 'Raleway', Arial, sans-serif; font-size: 14px; color: #1a1a1a; font-weight: 500;">
            ${quote.dimensions}
          </td>
        </tr>
        `
          : ''}
        ${quote.materials
          ? `
        <tr>
          <td style="padding: 8px 0; font-family: 'Raleway', Arial, sans-serif; font-size: 14px; color: #666666;">
            Matériaux
          </td>
          <td style="padding: 8px 0; font-family: 'Raleway', Arial, sans-serif; font-size: 14px; color: #1a1a1a; font-weight: 500;">
            ${quote.materials}
          </td>
        </tr>
        `
          : ''}
        ${quote.finishes
          ? `
        <tr>
          <td style="padding: 8px 0; font-family: 'Raleway', Arial, sans-serif; font-size: 14px; color: #666666;">
            Finitions
          </td>
          <td style="padding: 8px 0; font-family: 'Raleway', Arial, sans-serif; font-size: 14px; color: #1a1a1a; font-weight: 500;">
            ${quote.finishes}
          </td>
        </tr>
        `
          : ''}
      </table>
      ${quote.message || quote.customDetails
        ? `
      <div style="margin-top: 16px; padding: 16px; background-color: #f7f5f2; border-left: 3px solid #000000;">
        <p style="margin: 0 0 8px 0; font-family: 'Raleway', Arial, sans-serif; font-size: 12px; color: #666666; text-transform: uppercase; letter-spacing: 1px;">
          Message / Détails
        </p>
        <p style="margin: 0; font-family: 'Raleway', Arial, sans-serif; font-size: 14px; color: #1a1a1a; line-height: 1.6;">
          ${quote.message || quote.customDetails}
        </p>
      </div>
      `
        : ''}
    </div>

    <!-- Action Button -->
    <div style="text-align: center; margin: 24px 0;">
      <a href="${baseUrl}/admin/quotes/${quote.id}" style="display: inline-block; padding: 14px 32px; background-color: #000000; color: #ffffff; text-decoration: none; font-family: 'Raleway', Arial, sans-serif; font-size: 14px; font-weight: 500; text-transform: uppercase; letter-spacing: 1px;">
        Voir le devis dans l'admin
      </a>
    </div>

    <p style="margin: 24px 0 0 0; font-family: 'Raleway', Arial, sans-serif; font-size: 12px; color: #666666;">
      Date de réception: ${quoteDate}
    </p>
  `

  const html = generateEmailTemplate({
    title: 'Nouvelle demande de devis',
    content,
    footerText: 'Consultez cette demande dans le panneau d\'administration',
  })

  const text = `
NOUVELLE DEMANDE DE DEVIS

✅ Nouvelle demande de devis reçue

RÉFÉRENCE DU DEVIS
#${quote.id.substring(0, 8)}

INFORMATIONS CLIENT
Nom: ${quote.customerName}
Email: ${quote.email}
Téléphone: ${quote.phone}

DÉTAILS DU PROJET
Type de projet: ${quote.projectType}
${quote.budget ? `Budget: ${quote.budget}` : ''}
${quote.dimensions ? `Dimensions: ${quote.dimensions}` : ''}
${quote.materials ? `Matériaux: ${quote.materials}` : ''}
${quote.finishes ? `Finitions: ${quote.finishes}` : ''}

${quote.message || quote.customDetails ? `Message / Détails:\n${quote.message || quote.customDetails}` : ''}

Date de réception: ${quoteDate}

Voir le devis: ${baseUrl}/admin/quotes/${quote.id}
  `.trim()

  return {
    html,
    text,
    subject: `Nouvelle demande de devis #${quote.id.substring(0, 8)} - ${quote.customerName}`,
  }
}




