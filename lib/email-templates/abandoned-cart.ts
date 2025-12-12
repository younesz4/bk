/**
 * Abandoned Cart Reminder Email Template
 * Luxury tone, soft CTA, no aggressive marketing
 */

import { generateEmailTemplate } from './global-template'

interface CartItem {
  product: {
    name: string
    price: number
    image?: string
  }
  quantity: number
}

interface AbandonedCart {
  customerName: string
  email: string
  items: CartItem[]
  totalPrice: number
  cartUrl: string
}

export function generateAbandonedCartEmail({ cart }: { cart: AbandonedCart }): {
  html: string
  text: string
  subject: string
} {
  const itemsListHtml = cart.items
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
          }).format((item.product.price / 100) * item.quantity)}
        </td>
      </tr>
    `
    )
    .join('')

  const content = `
    <p style="margin: 0 0 16px 0; font-family: 'Raleway', Arial, sans-serif; font-size: 16px; line-height: 1.6; color: #1a1a1a;">
      Bonjour ${cart.customerName},
    </p>
    <p style="margin: 0 0 24px 0; font-family: 'Raleway', Arial, sans-serif; font-size: 16px; line-height: 1.6; color: #1a1a1a;">
      Nous avons remarqué que vous avez laissé quelques articles dans votre panier. Ces pièces d'exception vous attendent toujours.
    </p>

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
        ${itemsListHtml}
      </tbody>
    </table>

    <!-- Total -->
    <div style="border-top: 2px solid #000000; padding-top: 20px; margin-top: 24px; text-align: right;">
      <p style="margin: 0; font-family: 'Bodoni Moda', Georgia, serif; font-size: 28px; font-weight: 400; color: #000000; letter-spacing: 1px;">
        ${new Intl.NumberFormat('fr-FR', {
          style: 'currency',
          currency: 'EUR',
        }).format(cart.totalPrice / 100)}
      </p>
    </div>

    <!-- Soft CTA -->
    <div style="text-align: center; margin: 32px 0;">
      <a href="${cart.cartUrl}" style="display: inline-block; padding: 16px 40px; background-color: #000000; color: #ffffff; text-decoration: none; font-family: 'Raleway', Arial, sans-serif; font-size: 14px; font-weight: 500; text-transform: uppercase; letter-spacing: 1px;">
        Compléter ma commande
      </a>
    </div>

    <p style="margin: 24px 0 0 0; font-family: 'Raleway', Arial, sans-serif; font-size: 14px; color: #666666; line-height: 1.6; text-align: center;">
      Si vous avez des questions ou souhaitez discuter de votre projet, notre équipe est à votre disposition.
    </p>
  `

  const html = generateEmailTemplate({
    title: 'Votre panier vous attend',
    content,
  })

  const text = `
VOTRE PANIER VOUS ATTEND

Bonjour ${cart.customerName},

Nous avons remarqué que vous avez laissé quelques articles dans votre panier. Ces pièces d'exception vous attendent toujours.

ARTICLES DANS VOTRE PANIER
${cart.items
  .map(
    (item) =>
      `- ${item.product.name} (x${item.quantity}) - ${new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: 'EUR',
      }).format((item.product.price / 100) * item.quantity)}`
  )
  .join('\n')}

TOTAL: ${new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
  }).format(cart.totalPrice / 100)}

Compléter ma commande: ${cart.cartUrl}

Si vous avez des questions ou souhaitez discuter de votre projet, notre équipe est à votre disposition.

BK Agencements — Mobilier sur-mesure d'exception
  `.trim()

  return {
    html,
    text,
    subject: 'Votre panier vous attend',
  }
}




