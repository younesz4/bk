/**
 * Quote Request Email Template
 * Sent to client after submitting a quote request
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

export function generateQuoteRequestEmail({ quote }: { quote: Quote }): {
  html: string
  text: string
  subject: string
} {
  const quoteDate = new Date(quote.createdAt).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  const content = `
    <p style="margin: 0 0 16px 0; font-family: 'Raleway', Arial, sans-serif; font-size: 16px; line-height: 1.6; color: #1a1a1a;">
      Bonjour ${quote.customerName},
    </p>
    <p style="margin: 0 0 24px 0; font-family: 'Raleway', Arial, sans-serif; font-size: 16px; line-height: 1.6; color: #1a1a1a;">
      Nous avons bien reçu votre demande de devis. Notre équipe l'examine avec attention et vous répondra dans les plus brefs délais.
    </p>

    <!-- Quote Reference -->
    <div style="background-color: #f7f5f2; border: 1px solid #e5e5e5; padding: 30px; margin: 24px 0; text-align: center;">
      <p style="margin: 0 0 8px 0; font-family: 'Raleway', Arial, sans-serif; font-size: 11px; color: #666666; text-transform: uppercase; letter-spacing: 1px;">
        Référence de votre demande
      </p>
      <p style="margin: 0; font-family: 'Bodoni Moda', Georgia, serif; font-size: 36px; font-weight: 400; color: #000000; letter-spacing: 2px;">
        #${quote.id.substring(0, 8)}
      </p>
    </div>

    <!-- Project Details -->
    <div style="border-top: 1px solid #e5e5e5; padding-top: 24px; margin-top: 24px;">
      <h3 style="margin: 0 0 16px 0; font-family: 'Bodoni Moda', Georgia, serif; font-size: 18px; font-weight: 400; color: #000000; text-transform: uppercase; letter-spacing: 1px;">
        Détails de votre projet
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
        <p style="margin: 0; font-family: 'Raleway', Arial, sans-serif; font-size: 14px; color: #1a1a1a; line-height: 1.6;">
          ${quote.message || quote.customDetails}
        </p>
      </div>
      `
        : ''}
    </div>

    <!-- Next Steps -->
    <div style="background-color: #fff9e6; border-left: 4px solid #d4af37; padding: 20px; margin: 24px 0;">
      <h3 style="margin: 0 0 12px 0; font-family: 'Bodoni Moda', Georgia, serif; font-size: 16px; font-weight: 400; color: #000000; text-transform: uppercase; letter-spacing: 1px;">
        Prochaines étapes
      </h3>
      <p style="margin: 0; font-family: 'Raleway', Arial, sans-serif; font-size: 14px; color: #1a1a1a; line-height: 1.6;">
        Notre équipe d'experts étudie votre projet et vous préparera un devis personnalisé. Vous recevrez notre réponse dans un délai de 48 heures.
      </p>
    </div>
  `

  const html = generateEmailTemplate({
    title: 'Demande de devis reçue',
    content,
  })

  const text = `
DEMANDE DE DEVIS REÇUE

Bonjour ${quote.customerName},

Nous avons bien reçu votre demande de devis. Notre équipe l'examine avec attention et vous répondra dans les plus brefs délais.

RÉFÉRENCE DE VOTRE DEMANDE
#${quote.id.substring(0, 8)}

DÉTAILS DE VOTRE PROJET
Type de projet: ${quote.projectType}
${quote.budget ? `Budget: ${quote.budget}` : ''}
${quote.dimensions ? `Dimensions: ${quote.dimensions}` : ''}
${quote.materials ? `Matériaux: ${quote.materials}` : ''}
${quote.finishes ? `Finitions: ${quote.finishes}` : ''}

${quote.message || quote.customDetails ? `Message:\n${quote.message || quote.customDetails}` : ''}

PROCHAINES ÉTAPES
Notre équipe d'experts étudie votre projet et vous préparera un devis personnalisé. Vous recevrez notre réponse dans un délai de 48 heures.

BK Agencements — Mobilier sur-mesure d'exception
  `.trim()

  return {
    html,
    text,
    subject: `Demande de devis reçue — Référence #${quote.id.substring(0, 8)}`,
  }
}




