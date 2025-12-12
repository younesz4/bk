/**
 * Order Status Update Email Template
 * Customizable email for every order status update
 */

import { generateEmailTemplate } from './global-template'

interface Order {
  id: string
  customerName: string
  totalPrice: number
  status: string
  updatedAt: string
}

const statusConfig: Record<string, { title: string; message: string; color: string }> = {
  pending_payment: {
    title: 'Commande en attente de paiement',
    message: 'Votre commande est en attente de paiement. Veuillez compléter le paiement pour confirmer votre commande.',
    color: '#d4af37',
  },
  pending_cod: {
    title: 'Commande confirmée',
    message: 'Votre commande a été confirmée. Le paiement s\'effectuera à la livraison.',
    color: '#4caf50',
  },
  paid: {
    title: 'Paiement confirmé',
    message: 'Votre paiement a été confirmé. Votre commande est maintenant en cours de préparation.',
    color: '#4caf50',
  },
  preparing: {
    title: 'Commande en préparation',
    message: 'Votre commande est actuellement en cours de préparation dans notre atelier.',
    color: '#2196f3',
  },
  shipped: {
    title: 'Commande expédiée',
    message: 'Excellente nouvelle ! Votre commande a été expédiée et est en route vers vous.',
    color: '#2196f3',
  },
  delivered: {
    title: 'Commande livrée',
    message: 'Votre commande a été livrée avec succès. Nous espérons que vous serez satisfait de votre achat.',
    color: '#4caf50',
  },
  cancelled: {
    title: 'Commande annulée',
    message: 'Votre commande a été annulée. Si vous avez des questions, n\'hésitez pas à nous contacter.',
    color: '#f44336',
  },
  refunded: {
    title: 'Remboursement effectué',
    message: 'Votre remboursement a été effectué. Le montant sera crédité sur votre compte dans les prochains jours.',
    color: '#4caf50',
  },
}

export function generateOrderStatusUpdateEmail({ order }: { order: Order }): {
  html: string
  text: string
  subject: string
} {
  const config = statusConfig[order.status] || {
    title: 'Mise à jour de commande',
    message: 'Le statut de votre commande a été mis à jour.',
    color: '#666666',
  }

  const updateDate = new Date(order.updatedAt).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })

  const content = `
    <p style="margin: 0 0 16px 0; font-family: 'Raleway', Arial, sans-serif; font-size: 16px; line-height: 1.6; color: #1a1a1a;">
      Bonjour ${order.customerName},
    </p>

    <!-- Status Update Box -->
    <div style="background-color: ${config.color}15; border-left: 4px solid ${config.color}; padding: 20px; margin: 24px 0;">
      <h3 style="margin: 0 0 12px 0; font-family: 'Bodoni Moda', Georgia, serif; font-size: 18px; font-weight: 400; color: #000000; text-transform: uppercase; letter-spacing: 1px;">
        ${config.title}
      </h3>
      <p style="margin: 0; font-family: 'Raleway', Arial, sans-serif; font-size: 14px; color: #1a1a1a; line-height: 1.6;">
        ${config.message}
      </p>
    </div>

    <!-- Order Number -->
    <div style="background-color: #f7f5f2; border: 1px solid #e5e5e5; padding: 30px; margin: 24px 0; text-align: center;">
      <p style="margin: 0 0 8px 0; font-family: 'Raleway', Arial, sans-serif; font-size: 11px; color: #666666; text-transform: uppercase; letter-spacing: 1px;">
        Numéro de commande
      </p>
      <p style="margin: 0; font-family: 'Bodoni Moda', Georgia, serif; font-size: 36px; font-weight: 400; color: #000000; letter-spacing: 2px;">
        #${order.id.substring(0, 8)}
      </p>
    </div>

    <!-- Status Timeline -->
    <div style="border-top: 1px solid #e5e5e5; padding-top: 24px; margin-top: 24px;">
      <h3 style="margin: 0 0 16px 0; font-family: 'Bodoni Moda', Georgia, serif; font-size: 18px; font-weight: 400; color: #000000; text-transform: uppercase; letter-spacing: 1px;">
        Statut actuel
      </h3>
      <p style="margin: 0 0 8px 0; font-family: 'Raleway', Arial, sans-serif; font-size: 14px; color: #1a1a1a; font-weight: 500;">
        ${config.title}
      </p>
      <p style="margin: 0; font-family: 'Raleway', Arial, sans-serif; font-size: 12px; color: #666666;">
        Mis à jour le: ${updateDate}
      </p>
    </div>

    ${order.status === 'shipped' || order.status === 'delivered'
      ? `
    <!-- Tracking Info (if available) -->
    <div style="background-color: #fff9e6; border-left: 4px solid #d4af37; padding: 20px; margin: 24px 0;">
      <p style="margin: 0; font-family: 'Raleway', Arial, sans-serif; font-size: 14px; color: #1a1a1a; line-height: 1.6;">
        Vous pouvez suivre votre commande en utilisant le numéro de suivi fourni dans l'email d'expédition.
      </p>
    </div>
    `
      : ''}
  `

  const html = generateEmailTemplate({
    title: config.title,
    content,
  })

  const text = `
${config.title.toUpperCase()}

Bonjour ${order.customerName},

${config.message}

NUMÉRO DE COMMANDE
#${order.id.substring(0, 8)}

STATUT ACTUEL
${config.title}
Mis à jour le: ${updateDate}

BK Agencements — Mobilier sur-mesure d'exception
  `.trim()

  return {
    html,
    text,
    subject: `${config.title} — Commande #${order.id.substring(0, 8)}`,
  }
}




