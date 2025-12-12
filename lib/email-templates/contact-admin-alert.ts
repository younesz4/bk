/**
 * Admin New Contact Message Alert Email
 * Sent to admin when a new contact message is received
 */

import { generateEmailTemplate } from './global-template'

interface ContactMessage {
  id: string
  firstName: string
  lastName: string
  email: string
  phone?: string
  message: string
  projectType?: string
  budget?: string
  createdAt: string
}

export function generateContactAdminAlertEmail({ contact }: { contact: ContactMessage }): {
  html: string
  text: string
  subject: string
} {
  const fullName = `${contact.firstName} ${contact.lastName}`
  const messageDate = new Date(contact.createdAt).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'

  // Determine priority based on budget or project type
  const isHighPriority = contact.budget && (contact.budget.includes('10000') || contact.budget.includes('6000'))
  const priorityTag = isHighPriority ? '🔴 PRIORITÉ HAUTE' : '🟡 PRIORITÉ NORMALE'

  const content = `
    <div style="background-color: ${isHighPriority ? '#ffebee' : '#e8f5e9'}; border-left: 4px solid ${isHighPriority ? '#f44336' : '#4caf50'}; padding: 20px; margin-bottom: 24px;">
      <p style="margin: 0; font-family: 'Raleway', Arial, sans-serif; font-size: 16px; color: #1a1a1a; line-height: 1.6;">
        ${priorityTag} <strong>Nouveau message de contact reçu</strong>
      </p>
    </div>

    <p style="margin: 0 0 8px 0; font-family: 'Raleway', Arial, sans-serif; font-size: 11px; color: #666666; text-transform: uppercase; letter-spacing: 1px;">
      Référence du message
    </p>
    <p style="margin: 0 0 24px 0; font-family: 'Bodoni Moda', Georgia, serif; font-size: 24px; font-weight: 400; color: #000000; letter-spacing: 1px;">
      #${contact.id.substring(0, 8)}
    </p>

    <!-- Sender Info -->
    <div style="border-top: 1px solid #e5e5e5; padding-top: 24px; margin-bottom: 24px;">
      <h3 style="margin: 0 0 16px 0; font-family: 'Bodoni Moda', Georgia, serif; font-size: 18px; font-weight: 400; color: #000000; text-transform: uppercase; letter-spacing: 1px;">
        Informations expéditeur
      </h3>
      <p style="margin: 8px 0; font-family: 'Raleway', Arial, sans-serif; font-size: 14px; color: #1a1a1a;">
        <strong>Nom:</strong> ${fullName}
      </p>
      <p style="margin: 8px 0; font-family: 'Raleway', Arial, sans-serif; font-size: 14px; color: #1a1a1a;">
        <strong>Email:</strong> <a href="mailto:${contact.email}" style="color: #000000; text-decoration: underline;">${contact.email}</a>
      </p>
      ${contact.phone
        ? `
      <p style="margin: 8px 0; font-family: 'Raleway', Arial, sans-serif; font-size: 14px; color: #1a1a1a;">
        <strong>Téléphone:</strong> <a href="tel:${contact.phone}" style="color: #000000; text-decoration: underline;">${contact.phone}</a>
      </p>
      `
        : ''}
      ${contact.projectType
        ? `
      <p style="margin: 8px 0; font-family: 'Raleway', Arial, sans-serif; font-size: 14px; color: #1a1a1a;">
        <strong>Type de projet:</strong> ${contact.projectType}
      </p>
      `
        : ''}
      ${contact.budget
        ? `
      <p style="margin: 8px 0; font-family: 'Raleway', Arial, sans-serif; font-size: 14px; color: #1a1a1a;">
        <strong>Budget:</strong> ${contact.budget} ${isHighPriority ? '🔴' : ''}
      </p>
      `
        : ''}
    </div>

    <!-- Message Content -->
    <div style="border-top: 1px solid #e5e5e5; padding-top: 24px; margin-bottom: 24px;">
      <h3 style="margin: 0 0 16px 0; font-family: 'Bodoni Moda', Georgia, serif; font-size: 18px; font-weight: 400; color: #000000; text-transform: uppercase; letter-spacing: 1px;">
        Message
      </h3>
      <div style="padding: 16px; background-color: #f7f5f2; border-left: 3px solid #000000;">
        <p style="margin: 0; font-family: 'Raleway', Arial, sans-serif; font-size: 14px; color: #1a1a1a; line-height: 1.6; white-space: pre-wrap;">
          ${contact.message}
        </p>
      </div>
    </div>

    <!-- Action Button -->
    <div style="text-align: center; margin: 24px 0;">
      <a href="${baseUrl}/admin/contacts/${contact.id}" style="display: inline-block; padding: 14px 32px; background-color: #000000; color: #ffffff; text-decoration: none; font-family: 'Raleway', Arial, sans-serif; font-size: 14px; font-weight: 500; text-transform: uppercase; letter-spacing: 1px;">
        Voir le message dans l'admin
      </a>
    </div>

    <p style="margin: 24px 0 0 0; font-family: 'Raleway', Arial, sans-serif; font-size: 12px; color: #666666;">
      Date de réception: ${messageDate}
    </p>
  `

  const html = generateEmailTemplate({
    title: 'Nouveau message de contact',
    content,
    footerText: 'Consultez ce message dans le panneau d\'administration',
  })

  const text = `
NOUVEAU MESSAGE DE CONTACT

${priorityTag} Nouveau message de contact reçu

RÉFÉRENCE DU MESSAGE
#${contact.id.substring(0, 8)}

INFORMATIONS EXPÉDITEUR
Nom: ${fullName}
Email: ${contact.email}
${contact.phone ? `Téléphone: ${contact.phone}` : ''}
${contact.projectType ? `Type de projet: ${contact.projectType}` : ''}
${contact.budget ? `Budget: ${contact.budget} ${isHighPriority ? '🔴' : ''}` : ''}

MESSAGE
${contact.message}

Date de réception: ${messageDate}

Voir le message: ${baseUrl}/admin/contacts/${contact.id}
  `.trim()

  return {
    html,
    text,
    subject: `${isHighPriority ? '[PRIORITÉ HAUTE] ' : ''}Nouveau message de contact - ${fullName}`,
  }
}




