/**
 * Order Shipped Email Template
 * Notifies customer that their order has been shipped with tracking number
 */

import { generateEmailTemplate } from './global-template'

interface Order {
  id: string
  customerName: string
  address: string
  city: string
  country: string
  trackingNumber: string
  carrier?: string
  estimatedDeliveryDate?: string
}

export function generateOrderShippedEmail({ order }: { order: Order }): {
  html: string
  text: string
  subject: string
} {
  const carrier = order.carrier || 'Transporteur'
  const trackingUrl = order.trackingNumber
    ? `https://tracking.example.com/${order.trackingNumber}`
    : null

  const content = `
    <p style="margin: 0 0 16px 0; font-family: 'Raleway', Arial, sans-serif; font-size: 16px; line-height: 1.6; color: #1a1a1a;">
      Bonjour ${order.customerName},
    </p>
    <p style="margin: 0 0 24px 0; font-family: 'Raleway', Arial, sans-serif; font-size: 16px; line-height: 1.6; color: #1a1a1a;">
      Excellente nouvelle ! Votre commande a été expédiée et est en route vers vous.
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

    <!-- Tracking Number -->
    <div style="background-color: #e8f5e9; border-left: 4px solid #4caf50; padding: 20px; margin: 24px 0;">
      <h3 style="margin: 0 0 12px 0; font-family: 'Bodoni Moda', Georgia, serif; font-size: 18px; font-weight: 400; color: #000000; text-transform: uppercase; letter-spacing: 1px;">
        Numéro de suivi
      </h3>
      <p style="margin: 0 0 8px 0; font-family: 'Raleway', Arial, sans-serif; font-size: 20px; font-weight: 600; color: #1a1a1a; letter-spacing: 1px;">
        ${order.trackingNumber}
      </p>
      <p style="margin: 12px 0 0 0; font-family: 'Raleway', Arial, sans-serif; font-size: 14px; color: #666666;">
        Transporteur: <strong>${carrier}</strong>
      </p>
      ${trackingUrl
        ? `
      <p style="margin: 12px 0 0 0; font-family: 'Raleway', Arial, sans-serif; font-size: 14px;">
        <a href="${trackingUrl}" style="color: #000000; text-decoration: underline;">Suivre mon colis →</a>
      </p>
      `
        : ''}
    </div>

    ${order.estimatedDeliveryDate
      ? `
    <!-- Estimated Delivery -->
    <div style="background-color: #fff9e6; border-left: 4px solid #d4af37; padding: 20px; margin: 24px 0;">
      <h3 style="margin: 0 0 12px 0; font-family: 'Bodoni Moda', Georgia, serif; font-size: 18px; font-weight: 400; color: #000000; text-transform: uppercase; letter-spacing: 1px;">
        Date de livraison estimée
      </h3>
      <p style="margin: 0; font-family: 'Raleway', Arial, sans-serif; font-size: 16px; font-weight: 600; color: #1a1a1a;">
        ${order.estimatedDeliveryDate}
      </p>
    </div>
    `
      : ''}

    <!-- Delivery Address -->
    <div style="border-top: 1px solid #e5e5e5; padding-top: 24px; margin-top: 24px;">
      <h3 style="margin: 0 0 16px 0; font-family: 'Bodoni Moda', Georgia, serif; font-size: 18px; font-weight: 400; color: #000000; text-transform: uppercase; letter-spacing: 1px;">
        Adresse de livraison
      </h3>
      <p style="margin: 0; font-family: 'Raleway', Arial, sans-serif; font-size: 14px; color: #1a1a1a; line-height: 1.8;">
        ${order.customerName}<br>
        ${order.address}<br>
        ${order.city}, ${order.country}
      </p>
    </div>

    <!-- Next Steps -->
    <div style="background-color: #f7f5f2; border: 1px solid #e5e5e5; padding: 20px; margin: 24px 0;">
      <h3 style="margin: 0 0 12px 0; font-family: 'Bodoni Moda', Georgia, serif; font-size: 16px; font-weight: 400; color: #000000; text-transform: uppercase; letter-spacing: 1px;">
        À savoir
      </h3>
      <p style="margin: 0; font-family: 'Raleway', Arial, sans-serif; font-size: 14px; color: #1a1a1a; line-height: 1.6;">
        Vous recevrez une notification lorsque votre colis sera en cours de livraison. En cas d'absence, le transporteur vous contactera pour convenir d'un nouveau rendez-vous.
      </p>
    </div>
  `

  const html = generateEmailTemplate({
    title: 'Votre commande a été expédiée',
    content,
  })

  const text = `
VOTRE COMMANDE A ÉTÉ EXPÉDIÉE

Bonjour ${order.customerName},

Excellente nouvelle ! Votre commande a été expédiée et est en route vers vous.

NUMÉRO DE COMMANDE
#${order.id.substring(0, 8)}

NUMÉRO DE SUIVI
${order.trackingNumber}
Transporteur: ${carrier}
${trackingUrl ? `Suivre mon colis: ${trackingUrl}` : ''}

${order.estimatedDeliveryDate ? `DATE DE LIVRAISON ESTIMÉE\n${order.estimatedDeliveryDate}\n` : ''}

ADRESSE DE LIVRAISON
${order.customerName}
${order.address}
${order.city}, ${order.country}

À SAVOIR
Vous recevrez une notification lorsque votre colis sera en cours de livraison. En cas d'absence, le transporteur vous contactera pour convenir d'un nouveau rendez-vous.

BK Agencements — Mobilier sur-mesure d'exception
  `.trim()

  return {
    html,
    text,
    subject: `Votre commande #${order.id.substring(0, 8)} a été expédiée`,
  }
}




