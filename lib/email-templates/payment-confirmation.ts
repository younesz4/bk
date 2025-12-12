/**
 * Payment Confirmation Email Template
 * Supports: Online payment, COD, Bank transfer
 */

import { generateEmailTemplate } from './global-template'

interface Order {
  id: string
  customerName: string
  totalPrice: number
  paymentMethod: string | null
  createdAt: string
  invoiceNumber?: string
}

export function generatePaymentConfirmationEmail({ order }: { order: Order }): {
  html: string
  text: string
  subject: string
} {
  const paymentDate = new Date(order.createdAt).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })

  const invoiceNumber = order.invoiceNumber || `INV-${order.id.substring(0, 8).toUpperCase()}`

  const paymentMethodConfig: Record<string, { label: string; message: string; icon: string }> = {
    stripe: {
      label: 'Carte bancaire',
      message: 'Votre paiement par carte bancaire a été confirmé avec succès.',
      icon: '💳',
    },
    cod: {
      label: 'Paiement à la livraison',
      message: 'Votre commande a été confirmée. Le paiement s\'effectuera à la livraison.',
      icon: '📦',
    },
    bank_transfer: {
      label: 'Virement bancaire',
      message: 'Votre commande a été confirmée. Veuillez effectuer le virement bancaire aux coordonnées fournies.',
      icon: '🏦',
    },
  }

  const config = paymentMethodConfig[order.paymentMethod || ''] || {
    label: 'Paiement',
    message: 'Votre paiement a été confirmé.',
    icon: '✅',
  }

  const content = `
    <div style="background-color: #e8f5e9; border-left: 4px solid #4caf50; padding: 20px; margin-bottom: 24px;">
      <p style="margin: 0; font-family: 'Raleway', Arial, sans-serif; font-size: 16px; color: #1a1a1a; line-height: 1.6;">
        ${config.icon} <strong>${config.message}</strong>
      </p>
    </div>

    <p style="margin: 0 0 16px 0; font-family: 'Raleway', Arial, sans-serif; font-size: 16px; line-height: 1.6; color: #1a1a1a;">
      Bonjour ${order.customerName},
    </p>

    <!-- Invoice Number -->
    <div style="background-color: #f7f5f2; border: 1px solid #e5e5e5; padding: 30px; margin: 24px 0; text-align: center;">
      <p style="margin: 0 0 8px 0; font-family: 'Raleway', Arial, sans-serif; font-size: 11px; color: #666666; text-transform: uppercase; letter-spacing: 1px;">
        Numéro de facture
      </p>
      <p style="margin: 0; font-family: 'Bodoni Moda', Georgia, serif; font-size: 36px; font-weight: 400; color: #000000; letter-spacing: 2px;">
        ${invoiceNumber}
      </p>
    </div>

    <!-- Payment Amount -->
    <div style="background-color: #000000; padding: 30px; margin: 24px 0; text-align: center;">
      <p style="margin: 0 0 8px 0; font-family: 'Raleway', Arial, sans-serif; font-size: 11px; color: #cccccc; text-transform: uppercase; letter-spacing: 1px;">
        Montant payé
      </p>
      <p style="margin: 0; font-family: 'Bodoni Moda', Georgia, serif; font-size: 36px; font-weight: 400; color: #ffffff; letter-spacing: 2px;">
        ${new Intl.NumberFormat('fr-FR', {
          style: 'currency',
          currency: 'EUR',
        }).format(order.totalPrice / 100)}
      </p>
    </div>

    <!-- Payment Method -->
    <div style="background-color: #f7f5f2; border: 1px solid #e5e5e5; padding: 20px; margin: 24px 0;">
      <p style="margin: 0 0 8px 0; font-family: 'Raleway', Arial, sans-serif; font-size: 14px; color: #1a1a1a; line-height: 1.6;">
        <strong>Mode de paiement:</strong> ${config.label}
      </p>
      <p style="margin: 0; font-family: 'Raleway', Arial, sans-serif; font-size: 12px; color: #666666; line-height: 1.6;">
        Date: ${paymentDate}
      </p>
    </div>

    ${order.paymentMethod === 'bank_transfer'
      ? `
    <!-- Bank Transfer Instructions -->
    <div style="background-color: #fff9e6; border-left: 4px solid #d4af37; padding: 20px; margin: 24px 0;">
      <h3 style="margin: 0 0 16px 0; font-family: 'Bodoni Moda', Georgia, serif; font-size: 18px; font-weight: 400; color: #000000; text-transform: uppercase; letter-spacing: 1px;">
        Instructions de virement
      </h3>
      <p style="margin: 8px 0; font-family: 'Raleway', Arial, sans-serif; font-size: 14px; color: #1a1a1a;">
        <strong>Banque:</strong> [VOTRE BANQUE]
      </p>
      <p style="margin: 8px 0; font-family: 'Raleway', Arial, sans-serif; font-size: 14px; color: #1a1a1a;">
        <strong>RIB:</strong> [VOTRE RIB]
      </p>
      <p style="margin: 8px 0; font-family: 'Raleway', Arial, sans-serif; font-size: 14px; color: #1a1a1a;">
        <strong>BIC:</strong> [VOTRE BIC]
      </p>
      <p style="margin: 8px 0; font-family: 'Raleway', Arial, sans-serif; font-size: 14px; color: #1a1a1a;">
        <strong>Référence:</strong> ${invoiceNumber}
      </p>
      <p style="margin: 16px 0 0 0; font-family: 'Raleway', Arial, sans-serif; font-size: 12px; color: #666666; line-height: 1.6;">
        Une fois le virement effectué, votre commande sera traitée. Nous vous contacterons pour confirmer la réception du paiement.
      </p>
    </div>
    `
      : ''}

    ${order.paymentMethod === 'cod'
      ? `
    <!-- COD Instructions -->
    <div style="background-color: #fff9e6; border-left: 4px solid #d4af37; padding: 20px; margin: 24px 0;">
      <p style="margin: 0; font-family: 'Raleway', Arial, sans-serif; font-size: 14px; color: #1a1a1a; line-height: 1.6;">
        Vous paierez le montant total lors de la livraison de votre commande. Le livreur acceptera le paiement en espèces ou par carte bancaire.
      </p>
    </div>
    `
      : ''}
  `

  const html = generateEmailTemplate({
    title: 'Confirmation de paiement',
    content,
  })

  const text = `
CONFIRMATION DE PAIEMENT

${config.icon} ${config.message}

Bonjour ${order.customerName},

NUMÉRO DE FACTURE
${invoiceNumber}

MONTANT PAYÉ
${new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
  }).format(order.totalPrice / 100)}

MODE DE PAIEMENT: ${config.label}
Date: ${paymentDate}

${order.paymentMethod === 'bank_transfer'
    ? `
INSTRUCTIONS DE VIREMENT
Banque: [VOTRE BANQUE]
RIB: [VOTRE RIB]
BIC: [VOTRE BIC]
Référence: ${invoiceNumber}

Une fois le virement effectué, votre commande sera traitée.
`
    : order.paymentMethod === 'cod'
    ? `
Vous paierez le montant total lors de la livraison de votre commande.
`
    : ''}

BK Agencements — Mobilier sur-mesure d'exception
  `.trim()

  return {
    html,
    text,
    subject: `Confirmation de paiement — ${invoiceNumber}`,
  }
}




