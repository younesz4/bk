/**
 * Contact Form Confirmation Email Template
 * Sent to users after submitting contact form
 */

import { generateEmailTemplate } from './global-template'

interface ContactMessage {
  firstName: string
  lastName: string
  email: string
  phone?: string
  message: string
  projectType?: string
  budget?: string
}

export function generateContactConfirmationEmail({ contact }: { contact: ContactMessage }): {
  html: string
  text: string
  subject: string
} {
  const fullName = `${contact.firstName} ${contact.lastName}`
  const estimatedResponseTime = '24-48 heures'

  const content = `
    <p style="margin: 0 0 16px 0; font-family: 'Raleway', Arial, sans-serif; font-size: 16px; line-height: 1.6; color: #1a1a1a;">
      Bonjour ${contact.firstName},
    </p>
    <p style="margin: 0 0 24px 0; font-family: 'Raleway', Arial, sans-serif; font-size: 16px; line-height: 1.6; color: #1a1a1a;">
      Nous avons bien reçu votre message et vous en remercions. Notre équipe vous répondra dans les plus brefs délais.
    </p>

    <!-- Message Summary -->
    <div style="background-color: #f7f5f2; border: 1px solid #e5e5e5; padding: 24px; margin: 24px 0;">
      <h3 style="margin: 0 0 16px 0; font-family: 'Bodoni Moda', Georgia, serif; font-size: 18px; font-weight: 400; color: #000000; text-transform: uppercase; letter-spacing: 1px;">
        Récapitulatif de votre message
      </h3>
      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
        <tr>
          <td style="padding: 8px 0; font-family: 'Raleway', Arial, sans-serif; font-size: 14px; color: #666666; width: 140px;">
            Nom
          </td>
          <td style="padding: 8px 0; font-family: 'Raleway', Arial, sans-serif; font-size: 14px; color: #1a1a1a; font-weight: 500;">
            ${fullName}
          </td>
        </tr>
        <tr>
          <td style="padding: 8px 0; font-family: 'Raleway', Arial, sans-serif; font-size: 14px; color: #666666;">
            Email
          </td>
          <td style="padding: 8px 0; font-family: 'Raleway', Arial, sans-serif; font-size: 14px; color: #1a1a1a; font-weight: 500;">
            ${contact.email}
          </td>
        </tr>
        ${contact.phone
          ? `
        <tr>
          <td style="padding: 8px 0; font-family: 'Raleway', Arial, sans-serif; font-size: 14px; color: #666666;">
            Téléphone
          </td>
          <td style="padding: 8px 0; font-family: 'Raleway', Arial, sans-serif; font-size: 14px; color: #1a1a1a; font-weight: 500;">
            ${contact.phone}
          </td>
        </tr>
        `
          : ''}
        ${contact.projectType
          ? `
        <tr>
          <td style="padding: 8px 0; font-family: 'Raleway', Arial, sans-serif; font-size: 14px; color: #666666;">
            Type de projet
          </td>
          <td style="padding: 8px 0; font-family: 'Raleway', Arial, sans-serif; font-size: 14px; color: #1a1a1a; font-weight: 500;">
            ${contact.projectType}
          </td>
        </tr>
        `
          : ''}
        ${contact.budget
          ? `
        <tr>
          <td style="padding: 8px 0; font-family: 'Raleway', Arial, sans-serif; font-size: 14px; color: #666666;">
            Budget
          </td>
          <td style="padding: 8px 0; font-family: 'Raleway', Arial, sans-serif; font-size: 14px; color: #1a1a1a; font-weight: 500;">
            ${contact.budget}
          </td>
        </tr>
        `
          : ''}
      </table>
      <div style="margin-top: 16px; padding: 16px; background-color: #FCFBFC; border-left: 3px solid #000000;">
        <p style="margin: 0 0 8px 0; font-family: 'Raleway', Arial, sans-serif; font-size: 12px; color: #666666; text-transform: uppercase; letter-spacing: 1px;">
          Message
        </p>
        <p style="margin: 0; font-family: 'Raleway', Arial, sans-serif; font-size: 14px; color: #1a1a1a; line-height: 1.6;">
          ${contact.message}
        </p>
      </div>
    </div>

    <!-- Response Time -->
    <div style="background-color: #fff9e6; border-left: 4px solid #d4af37; padding: 20px; margin: 24px 0;">
      <h3 style="margin: 0 0 12px 0; font-family: 'Bodoni Moda', Georgia, serif; font-size: 16px; font-weight: 400; color: #000000; text-transform: uppercase; letter-spacing: 1px;">
        Délai de réponse
      </h3>
      <p style="margin: 0; font-family: 'Raleway', Arial, sans-serif; font-size: 14px; color: #1a1a1a; line-height: 1.6;">
        Nous vous répondrons dans un délai de <strong>${estimatedResponseTime}</strong>. Pour toute urgence, n'hésitez pas à nous appeler directement.
      </p>
    </div>

    <!-- Signature -->
    <div style="border-top: 1px solid #e5e5e5; padding-top: 24px; margin-top: 24px; text-align: center;">
      <p style="margin: 0; font-family: 'Raleway', Arial, sans-serif; font-size: 14px; color: #1a1a1a; line-height: 1.6;">
        Cordialement,<br>
        <strong style="font-family: 'Bodoni Moda', Georgia, serif; font-size: 16px; letter-spacing: 1px;">L'équipe BK Agencements</strong>
      </p>
    </div>
  `

  const html = generateEmailTemplate({
    title: 'Message reçu',
    content,
  })

  const text = `
MESSAGE REÇU

Bonjour ${contact.firstName},

Nous avons bien reçu votre message et vous en remercions. Notre équipe vous répondra dans les plus brefs délais.

RÉCAPITULATIF DE VOTRE MESSAGE
Nom: ${fullName}
Email: ${contact.email}
${contact.phone ? `Téléphone: ${contact.phone}` : ''}
${contact.projectType ? `Type de projet: ${contact.projectType}` : ''}
${contact.budget ? `Budget: ${contact.budget}` : ''}

Message:
${contact.message}

DÉLAI DE RÉPONSE
Nous vous répondrons dans un délai de ${estimatedResponseTime}. Pour toute urgence, n'hésitez pas à nous appeler directement.

Cordialement,
L'équipe BK Agencements

BK Agencements — Mobilier sur-mesure d'exception
  `.trim()

  return {
    html,
    text,
    subject: 'Message reçu — BK Agencements',
  }
}




