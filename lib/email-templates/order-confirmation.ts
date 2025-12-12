/**
 * Order Confirmation Email Template
 * Complete HTML email for order confirmation
 */

import { generateEmailTemplate } from './global-template'

interface OrderItem {
  product: {
    name: string
    price: number
  }
  quantity: number
  price: number
}

interface Order {
  id: string
  customerName: string
  email: string
  phone: string
  address: string
  city: string
  country: string
  totalPrice: number
  paymentMethod: string | null
  createdAt: string
  items: OrderItem[]
  estimatedResponseTime?: string
}

export function generateOrderConfirmationEmail({ order }: { order: Order }): {
  html: string
  text: string
  subject: string
} {
  const orderDate = new Date(order.createdAt).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  const productsListHtml = order.items
    .map(
      (item) => `
      <tr>
        <td style="padding: 16px 12px; border-bottom: 1px solid #e5e5e5; font-family: 'Raleway', Arial, sans-serif; font-size: 14px; color: #1a1a1a;">
          ${item.product.name}
        </td>
        <td style="padding: 16px 12px; border-bottom: 1px solid #e5e5e5; font-family: 'Raleway', Arial, sans-serif; font-size: 14px; color: #1a1a1a; text-align: center;">
          ${item.quantity}
        </td>
        <td style="padding: 16px 12px; border-bottom: 1px solid #e5e5e5; font-family: 'Raleway', Arial, sans-serif; font-size: 14px; color: #1a1a1a; text-align: right; font-weight: 500;">
          ${new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: 'EUR',
          }).format((item.price / 100) * item.quantity)}
        </td>
      </tr>
    `
    )
    .join('')

  const paymentMethodLabel: Record<string, string> = {
    stripe: 'Carte bancaire',
    cod: 'Paiement à la livraison',
    bank_transfer: 'Virement bancaire',
  }

  const content = `
    <p style="margin: 0 0 16px 0; font-family: 'Raleway', Arial, sans-serif; font-size: 16px; line-height: 1.6; color: #1a1a1a;">
      Bonjour ${order.customerName},
    </p>
    <p style="margin: 0 0 24px 0; font-family: 'Raleway', Arial, sans-serif; font-size: 16px; line-height: 1.6; color: #1a1a1a;">
      Nous avons bien reçu votre commande et nous vous en remercions. Votre commande est en cours de traitement.
    </p>

    <!-- Order Number -->
    <div style="background-color: #f7f5f2; border: 1px solid #e5e5e5; padding: 30px; margin: 24px 0; text-align: center;">
      <p style="margin: 0 0 8px 0; font-family: 'Raleway', Arial, sans-serif; font-size: 11px; color: #666666; text-transform: uppercase; letter-spacing: 1px;">
        Numéro de commande
      </p>
      <p style="margin: 0; font-family: 'Bodoni Moda', Georgia, serif; font-size: 36px; font-weight: 400; color: #000000; letter-spacing: 2px;">
        #${order.id.substring(0, 8)}
      </p>
    </div>

    <!-- Items Table -->
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: 24px 0; border-collapse: collapse;">
      <thead>
        <tr style="background-color: #f7f5f2; border-bottom: 2px solid #000000;">
          <th style="padding: 12px; text-align: left; font-family: 'Raleway', Arial, sans-serif; font-size: 11px; color: #666666; text-transform: uppercase; letter-spacing: 1px; font-weight: 500;">
            Produit
          </th>
          <th style="padding: 12px; text-align: center; font-family: 'Raleway', Arial, sans-serif; font-size: 11px; color: #666666; text-transform: uppercase; letter-spacing: 1px; font-weight: 500;">
            Quantité
          </th>
          <th style="padding: 12px; text-align: right; font-family: 'Raleway', Arial, sans-serif; font-size: 11px; color: #666666; text-transform: uppercase; letter-spacing: 1px; font-weight: 500;">
            Prix
          </th>
        </tr>
      </thead>
      <tbody>
        ${productsListHtml}
      </tbody>
    </table>

    <!-- Total -->
    <div style="border-top: 2px solid #000000; padding-top: 20px; margin-top: 24px; text-align: right;">
      <p style="margin: 0; font-family: 'Bodoni Moda', Georgia, serif; font-size: 28px; font-weight: 400; color: #000000; letter-spacing: 1px;">
        ${new Intl.NumberFormat('fr-FR', {
          style: 'currency',
          currency: 'EUR',
        }).format(order.totalPrice / 100)}
      </p>
    </div>

    <!-- Payment Method -->
    <div style="background-color: #f7f5f2; border: 1px solid #e5e5e5; padding: 20px; margin: 24px 0;">
      <p style="margin: 0 0 8px 0; font-family: 'Raleway', Arial, sans-serif; font-size: 14px; color: #1a1a1a; line-height: 1.6;">
        <strong>Mode de paiement:</strong> ${paymentMethodLabel[order.paymentMethod || ''] || order.paymentMethod || 'Non spécifié'}
      </p>
      <p style="margin: 0; font-family: 'Raleway', Arial, sans-serif; font-size: 12px; color: #666666; line-height: 1.6;">
        Date de commande: ${orderDate}
      </p>
    </div>

    <!-- Customer Info -->
    <div style="border-top: 1px solid #e5e5e5; padding-top: 24px; margin-top: 24px;">
      <h3 style="margin: 0 0 16px 0; font-family: 'Bodoni Moda', Georgia, serif; font-size: 18px; font-weight: 400; color: #000000; text-transform: uppercase; letter-spacing: 1px;">
        Vos informations
      </h3>
      <p style="margin: 8px 0; font-family: 'Raleway', Arial, sans-serif; font-size: 14px; color: #1a1a1a;">
        <strong>Email:</strong> ${order.email}
      </p>
      <p style="margin: 8px 0; font-family: 'Raleway', Arial, sans-serif; font-size: 14px; color: #1a1a1a;">
        <strong>Téléphone:</strong> ${order.phone}
      </p>
      <p style="margin: 8px 0; font-family: 'Raleway', Arial, sans-serif; font-size: 14px; color: #1a1a1a;">
        <strong>Adresse:</strong> ${order.address}, ${order.city}, ${order.country}
      </p>
    </div>

    ${order.estimatedResponseTime
      ? `
    <!-- Estimated Response Time -->
    <div style="background-color: #fff9e6; border-left: 4px solid #d4af37; padding: 20px; margin: 24px 0;">
      <p style="margin: 0; font-family: 'Raleway', Arial, sans-serif; font-size: 14px; color: #1a1a1a; line-height: 1.6;">
        <strong>Délai de traitement estimé:</strong> ${order.estimatedResponseTime}
      </p>
    </div>
    `
      : ''}
  `

  const html = generateEmailTemplate({
    title: 'Confirmation de commande',
    content,
  })

  const text = `
CONFIRMATION DE COMMANDE

Bonjour ${order.customerName},

Nous avons bien reçu votre commande et nous vous en remercions. Votre commande est en cours de traitement.

NUMÉRO DE COMMANDE
#${order.id.substring(0, 8)}

PRODUITS COMMANDÉS
${order.items
  .map(
    (item) =>
      `- ${item.product.name} (x${item.quantity}) - ${new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: 'EUR',
      }).format((item.price / 100) * item.quantity)}`
  )
  .join('\n')}

TOTAL: ${new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
  }).format(order.totalPrice / 100)}

MODE DE PAIEMENT: ${paymentMethodLabel[order.paymentMethod || ''] || order.paymentMethod || 'Non spécifié'}
Date de commande: ${orderDate}

VOS INFORMATIONS
Email: ${order.email}
Téléphone: ${order.phone}
Adresse: ${order.address}, ${order.city}, ${order.country}

${order.estimatedResponseTime ? `Délai de traitement estimé: ${order.estimatedResponseTime}` : ''}

BK Agencements — Mobilier sur-mesure d'exception
  `.trim()

  return {
    html,
    text,
    subject: `Confirmation de commande #${order.id.substring(0, 8)}`,
  }
}




