/**
 * Order-specific email templates for BK Agencements
 * Luxury tone, French language, minimal design
 */

import { generateAdminNotificationEmail } from './email-templates'

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
  notes: string | null
  totalPrice: number
  paymentMethod: string | null
  status: string
  createdAt: string
  items: OrderItem[]
}

/**
 * Generate COD customer confirmation email
 * "Confirmation de commande — Paiement à la livraison"
 */
export function generateCODCustomerEmail({ order }: { order: Order }): {
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
        <td style="padding: 12px; border-bottom: 1px solid #e5e5e5; font-family: 'Raleway', Arial, sans-serif; font-size: 14px; color: #1a1a1a;">
          ${item.product.name}
        </td>
        <td style="padding: 12px; border-bottom: 1px solid #e5e5e5; font-family: 'Raleway', Arial, sans-serif; font-size: 14px; color: #1a1a1a; text-align: center;">
          ${item.quantity}
        </td>
        <td style="padding: 12px; border-bottom: 1px solid #e5e5e5; font-family: 'Raleway', Arial, sans-serif; font-size: 14px; color: #1a1a1a; text-align: right;">
          ${new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: 'MAD',
          }).format((item.price / 100) * item.quantity)}
        </td>
      </tr>
    `
    )
    .join('')

  const html = `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Confirmation de commande</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f7f5f2; font-family: 'Raleway', Arial, sans-serif;">
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f7f5f2; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="max-width: 600px; background-color: #ffffff; border: 1px solid #e5e5e5;">
          <!-- Header -->
          <tr>
            <td style="padding: 40px 40px 30px 40px; background-color: #000000; text-align: center;">
              <h1 style="margin: 0; font-family: 'Bodoni Moda', Georgia, serif; font-size: 28px; font-weight: 400; color: #ffffff; letter-spacing: 2px; text-transform: uppercase;">
                Confirmation de commande
              </h1>
              <p style="margin: 12px 0 0 0; font-family: 'Raleway', Arial, sans-serif; font-size: 12px; color: #cccccc; letter-spacing: 1px; text-transform: uppercase;">
                Paiement à la livraison
              </p>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 40px;">
              <p style="margin: 0 0 16px 0; font-family: 'Raleway', Arial, sans-serif; font-size: 16px; line-height: 1.6; color: #1a1a1a;">
                Bonjour ${order.customerName},
              </p>
              <p style="margin: 0 0 24px 0; font-family: 'Raleway', Arial, sans-serif; font-size: 16px; line-height: 1.6; color: #1a1a1a;">
                Nous avons bien reçu votre commande. Le paiement s'effectuera à la livraison.
              </p>

              <!-- Order Number -->
              <div style="background-color: #f7f5f2; border: 1px solid #e5e5e5; padding: 24px; margin: 24px 0; text-align: center;">
                <p style="margin: 0 0 8px 0; font-family: 'Raleway', Arial, sans-serif; font-size: 11px; color: #666666; text-transform: uppercase; letter-spacing: 1px;">
                  Numéro de commande
                </p>
                <p style="margin: 0; font-family: 'Bodoni Moda', Georgia, serif; font-size: 32px; font-weight: 400; color: #000000; letter-spacing: 2px;">
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
                      Qté
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
                <p style="margin: 0; font-family: 'Bodoni Moda', Georgia, serif; font-size: 24px; font-weight: 400; color: #000000; letter-spacing: 1px;">
                  ${new Intl.NumberFormat('fr-FR', {
                    style: 'currency',
                    currency: 'MAD',
                  }).format(order.totalPrice / 100)}
                </p>
              </div>

              <!-- Payment Method -->
              <div style="background-color: #fff9e6; border-left: 4px solid #d4af37; padding: 20px; margin: 24px 0;">
                <p style="margin: 0; font-family: 'Raleway', Arial, sans-serif; font-size: 14px; color: #1a1a1a; line-height: 1.6;">
                  <strong>Mode de paiement:</strong> Paiement à la livraison (Cash on Delivery)
                </p>
                <p style="margin: 12px 0 0 0; font-family: 'Raleway', Arial, sans-serif; font-size: 14px; color: #666666; line-height: 1.6;">
                  Vous paierez le montant total lors de la livraison de votre commande.
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
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 30px 40px; background-color: #f7f5f2; border-top: 1px solid #e5e5e5; text-align: center;">
              <p style="margin: 0; font-family: 'Raleway', Arial, sans-serif; font-size: 12px; color: #999999;">
                BK Agencements — Mobilier sur-mesure d'exception
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim()

  const text = `
CONFIRMATION DE COMMANDE — PAIEMENT À LA LIVRAISON

Bonjour ${order.customerName},

Nous avons bien reçu votre commande. Le paiement s'effectuera à la livraison.

NUMÉRO DE COMMANDE
#${order.id.substring(0, 8)}

PRODUITS COMMANDÉS
${order.items
  .map(
    (item) =>
      `- ${item.product.name} (x${item.quantity}) - ${new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: 'MAD',
      }).format((item.price / 100) * item.quantity)}`
  )
  .join('\n')}

TOTAL: ${new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'MAD',
  }).format(order.totalPrice / 100)}

MODE DE PAIEMENT: Paiement à la livraison (Cash on Delivery)
Vous paierez le montant total lors de la livraison de votre commande.

VOS INFORMATIONS
Email: ${order.email}
Téléphone: ${order.phone}
Adresse: ${order.address}, ${order.city}, ${order.country}

BK Agencements — Mobilier sur-mesure d'exception
  `.trim()

  return {
    html,
    text,
    subject: `Confirmation de commande #${order.id.substring(0, 8)} — Paiement à la livraison`,
  }
}

/**
 * Generate COD admin notification email
 * "Nouvelle commande (COD)"
 */
export function generateCODAdminEmail({ order }: { order: Order }): {
  html: string
  text: string
  subject: string
} {
  return generateAdminNotificationEmail({ order })
}

/**
 * Generate pending payment admin email
 * "Commande en attente de paiement"
 */
export function generatePendingPaymentAdminEmail({ order }: { order: Order }): {
  html: string
  text: string
  subject: string
} {
  const orderDate = new Date(order.createdAt).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })

  const productsListHtml = order.items
    .map(
      (item) => `
      <tr>
        <td style="padding: 12px; border-bottom: 1px solid #e5e5e5; font-family: 'Raleway', Arial, sans-serif; font-size: 14px; color: #1a1a1a;">
          ${item.product.name}
        </td>
        <td style="padding: 12px; border-bottom: 1px solid #e5e5e5; font-family: 'Raleway', Arial, sans-serif; font-size: 14px; color: #1a1a1a; text-align: center;">
          ${item.quantity}
        </td>
        <td style="padding: 12px; border-bottom: 1px solid #e5e5e5; font-family: 'Raleway', Arial, sans-serif; font-size: 14px; color: #1a1a1a; text-align: right;">
          ${new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: 'MAD',
          }).format((item.price / 100) * item.quantity)}
        </td>
      </tr>
    `
    )
    .join('')

  const html = `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Commande en attente de paiement</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f7f5f2; font-family: 'Raleway', Arial, sans-serif;">
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f7f5f2; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="max-width: 600px; background-color: #ffffff; border: 1px solid #e5e5e5;">
          <!-- Header -->
          <tr>
            <td style="padding: 40px 40px 30px 40px; background-color: #000000; text-align: center;">
              <h1 style="margin: 0; font-family: 'Bodoni Moda', Georgia, serif; font-size: 28px; font-weight: 400; color: #ffffff; letter-spacing: 2px; text-transform: uppercase;">
                Commande en attente
              </h1>
              <p style="margin: 12px 0 0 0; font-family: 'Raleway', Arial, sans-serif; font-size: 12px; color: #cccccc; letter-spacing: 1px; text-transform: uppercase;">
                Paiement en attente
              </p>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 40px;">
              <div style="background-color: #fff9e6; border-left: 4px solid #d4af37; padding: 20px; margin-bottom: 24px;">
                <p style="margin: 0; font-family: 'Raleway', Arial, sans-serif; font-size: 14px; color: #1a1a1a; line-height: 1.6;">
                  <strong>⚠️ ATTENTION:</strong> Cette commande est en attente de paiement via Stripe. Le client n'a pas encore complété le paiement.
                </p>
              </div>

              <p style="margin: 0 0 8px 0; font-family: 'Raleway', Arial, sans-serif; font-size: 11px; color: #666666; text-transform: uppercase; letter-spacing: 1px;">
                Numéro de commande
              </p>
              <p style="margin: 0 0 24px 0; font-family: 'Bodoni Moda', Georgia, serif; font-size: 24px; font-weight: 400; color: #000000; letter-spacing: 1px;">
                #${order.id.substring(0, 8)}
              </p>

              <!-- Customer Info -->
              <div style="border-top: 1px solid #e5e5e5; padding-top: 24px; margin-bottom: 24px;">
                <h3 style="margin: 0 0 16px 0; font-family: 'Bodoni Moda', Georgia, serif; font-size: 18px; font-weight: 400; color: #000000; text-transform: uppercase; letter-spacing: 1px;">
                  Informations client
                </h3>
                <p style="margin: 8px 0; font-family: 'Raleway', Arial, sans-serif; font-size: 14px; color: #1a1a1a;">
                  <strong>Nom:</strong> ${order.customerName}
                </p>
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

              <!-- Items Table -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: 24px 0; border-collapse: collapse;">
                <thead>
                  <tr style="background-color: #f7f5f2; border-bottom: 2px solid #000000;">
                    <th style="padding: 12px; text-align: left; font-family: 'Raleway', Arial, sans-serif; font-size: 11px; color: #666666; text-transform: uppercase; letter-spacing: 1px; font-weight: 500;">
                      Produit
                    </th>
                    <th style="padding: 12px; text-align: center; font-family: 'Raleway', Arial, sans-serif; font-size: 11px; color: #666666; text-transform: uppercase; letter-spacing: 1px; font-weight: 500;">
                      Qté
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
                <p style="margin: 0; font-family: 'Bodoni Moda', Georgia, serif; font-size: 24px; font-weight: 400; color: #000000; letter-spacing: 1px;">
                  ${new Intl.NumberFormat('fr-FR', {
                    style: 'currency',
                    currency: 'MAD',
                  }).format(order.totalPrice / 100)}
                </p>
              </div>

              <p style="margin: 24px 0 0 0; font-family: 'Raleway', Arial, sans-serif; font-size: 12px; color: #666666;">
                Date: ${orderDate}
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 30px 40px; background-color: #f7f5f2; border-top: 1px solid #e5e5e5; text-align: center;">
              <p style="margin: 0; font-family: 'Raleway', Arial, sans-serif; font-size: 12px; color: #999999;">
                Consultez cette commande dans le panneau d'administration
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim()

  const text = `
COMMANDE EN ATTENTE DE PAIEMENT

⚠️ ATTENTION: Cette commande est en attente de paiement via Stripe. Le client n'a pas encore complété le paiement.

NUMÉRO DE COMMANDE
#${order.id.substring(0, 8)}

INFORMATIONS CLIENT
Nom: ${order.customerName}
Email: ${order.email}
Téléphone: ${order.phone}
Adresse: ${order.address}, ${order.city}, ${order.country}

PRODUITS COMMANDÉS
${order.items
  .map(
    (item) =>
      `- ${item.product.name} (x${item.quantity}) - ${new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: 'MAD',
      }).format((item.price / 100) * item.quantity)}`
  )
  .join('\n')}

TOTAL: ${new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'MAD',
  }).format(order.totalPrice / 100)}

Date: ${orderDate}
  `.trim()

  return {
    html,
    text,
    subject: `Commande en attente de paiement #${order.id.substring(0, 8)}`,
  }
}

/**
 * Generate payment confirmed customer email
 * "Paiement confirmé — Votre commande"
 */
export function generatePaymentConfirmedCustomerEmail({ order }: { order: Order }): {
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
        <td style="padding: 12px; border-bottom: 1px solid #e5e5e5; font-family: 'Raleway', Arial, sans-serif; font-size: 14px; color: #1a1a1a;">
          ${item.product.name}
        </td>
        <td style="padding: 12px; border-bottom: 1px solid #e5e5e5; font-family: 'Raleway', Arial, sans-serif; font-size: 14px; color: #1a1a1a; text-align: center;">
          ${item.quantity}
        </td>
        <td style="padding: 12px; border-bottom: 1px solid #e5e5e5; font-family: 'Raleway', Arial, sans-serif; font-size: 14px; color: #1a1a1a; text-align: right;">
          ${new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: 'MAD',
          }).format((item.price / 100) * item.quantity)}
        </td>
      </tr>
    `
    )
    .join('')

  const html = `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Paiement confirmé</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f7f5f2; font-family: 'Raleway', Arial, sans-serif;">
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f7f5f2; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="max-width: 600px; background-color: #ffffff; border: 1px solid #e5e5e5;">
          <!-- Header -->
          <tr>
            <td style="padding: 40px 40px 30px 40px; background-color: #000000; text-align: center;">
              <h1 style="margin: 0; font-family: 'Bodoni Moda', Georgia, serif; font-size: 28px; font-weight: 400; color: #ffffff; letter-spacing: 2px; text-transform: uppercase;">
                Paiement confirmé
              </h1>
              <p style="margin: 12px 0 0 0; font-family: 'Raleway', Arial, sans-serif; font-size: 12px; color: #cccccc; letter-spacing: 1px; text-transform: uppercase;">
                Votre commande
              </p>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 40px;">
              <div style="background-color: #e8f5e9; border-left: 4px solid #4caf50; padding: 20px; margin-bottom: 24px;">
                <p style="margin: 0; font-family: 'Raleway', Arial, sans-serif; font-size: 16px; color: #1a1a1a; line-height: 1.6;">
                  ✅ <strong>Votre paiement a été confirmé avec succès.</strong>
                </p>
              </div>

              <p style="margin: 0 0 16px 0; font-family: 'Raleway', Arial, sans-serif; font-size: 16px; line-height: 1.6; color: #1a1a1a;">
                Bonjour ${order.customerName},
              </p>
              <p style="margin: 0 0 24px 0; font-family: 'Raleway', Arial, sans-serif; font-size: 16px; line-height: 1.6; color: #1a1a1a;">
                Nous avons bien reçu votre paiement. Votre commande est maintenant confirmée et en cours de préparation.
              </p>

              <!-- Order Number -->
              <div style="background-color: #f7f5f2; border: 1px solid #e5e5e5; padding: 24px; margin: 24px 0; text-align: center;">
                <p style="margin: 0 0 8px 0; font-family: 'Raleway', Arial, sans-serif; font-size: 11px; color: #666666; text-transform: uppercase; letter-spacing: 1px;">
                  Numéro de commande
                </p>
                <p style="margin: 0; font-family: 'Bodoni Moda', Georgia, serif; font-size: 32px; font-weight: 400; color: #000000; letter-spacing: 2px;">
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
                      Qté
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
                <p style="margin: 0; font-family: 'Bodoni Moda', Georgia, serif; font-size: 24px; font-weight: 400; color: #000000; letter-spacing: 1px;">
                  ${new Intl.NumberFormat('fr-FR', {
                    style: 'currency',
                    currency: 'MAD',
                  }).format(order.totalPrice / 100)}
                </p>
              </div>

              <!-- Payment Method -->
              <div style="background-color: #f7f5f2; border: 1px solid #e5e5e5; padding: 20px; margin: 24px 0;">
                <p style="margin: 0; font-family: 'Raleway', Arial, sans-serif; font-size: 14px; color: #1a1a1a; line-height: 1.6;">
                  <strong>Mode de paiement:</strong> Carte bancaire (Stripe)
                </p>
                <p style="margin: 8px 0 0 0; font-family: 'Raleway', Arial, sans-serif; font-size: 14px; color: #666666; line-height: 1.6;">
                  Date de paiement: ${orderDate}
                </p>
              </div>

              <!-- Next Steps -->
              <div style="background-color: #fff9e6; border-left: 4px solid #d4af37; padding: 20px; margin: 24px 0;">
                <h3 style="margin: 0 0 12px 0; font-family: 'Bodoni Moda', Georgia, serif; font-size: 16px; font-weight: 400; color: #000000; text-transform: uppercase; letter-spacing: 1px;">
                  Prochaines étapes
                </h3>
                <p style="margin: 0; font-family: 'Raleway', Arial, sans-serif; font-size: 14px; color: #1a1a1a; line-height: 1.6;">
                  Votre commande est maintenant en cours de préparation. Nous vous contacterons dès que votre commande sera prête à être expédiée.
                </p>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 30px 40px; background-color: #f7f5f2; border-top: 1px solid #e5e5e5; text-align: center;">
              <p style="margin: 0; font-family: 'Raleway', Arial, sans-serif; font-size: 12px; color: #999999;">
                BK Agencements — Mobilier sur-mesure d'exception
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim()

  const text = `
PAIEMENT CONFIRMÉ — VOTRE COMMANDE

✅ Votre paiement a été confirmé avec succès.

Bonjour ${order.customerName},

Nous avons bien reçu votre paiement. Votre commande est maintenant confirmée et en cours de préparation.

NUMÉRO DE COMMANDE
#${order.id.substring(0, 8)}

PRODUITS COMMANDÉS
${order.items
  .map(
    (item) =>
      `- ${item.product.name} (x${item.quantity}) - ${new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: 'MAD',
      }).format((item.price / 100) * item.quantity)}`
  )
  .join('\n')}

TOTAL: ${new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'MAD',
  }).format(order.totalPrice / 100)}

MODE DE PAIEMENT: Carte bancaire (Stripe)
Date de paiement: ${orderDate}

PROCHAINES ÉTAPES
Votre commande est maintenant en cours de préparation. Nous vous contacterons dès que votre commande sera prête à être expédiée.

BK Agencements — Mobilier sur-mesure d'exception
  `.trim()

  return {
    html,
    text,
    subject: `Paiement confirmé — Votre commande #${order.id.substring(0, 8)}`,
  }
}

/**
 * Generate payment received admin email
 * "Paiement reçu (Stripe)"
 */
export function generatePaymentReceivedAdminEmail({ order }: { order: Order }): {
  html: string
  text: string
  subject: string
} {
  const orderDate = new Date(order.createdAt).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })

  const productsListHtml = order.items
    .map(
      (item) => `
      <tr>
        <td style="padding: 12px; border-bottom: 1px solid #e5e5e5; font-family: 'Raleway', Arial, sans-serif; font-size: 14px; color: #1a1a1a;">
          ${item.product.name}
        </td>
        <td style="padding: 12px; border-bottom: 1px solid #e5e5e5; font-family: 'Raleway', Arial, sans-serif; font-size: 14px; color: #1a1a1a; text-align: center;">
          ${item.quantity}
        </td>
        <td style="padding: 12px; border-bottom: 1px solid #e5e5e5; font-family: 'Raleway', Arial, sans-serif; font-size: 14px; color: #1a1a1a; text-align: right;">
          ${new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: 'MAD',
          }).format((item.price / 100) * item.quantity)}
        </td>
      </tr>
    `
    )
    .join('')

  const html = `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Paiement reçu</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f7f5f2; font-family: 'Raleway', Arial, sans-serif;">
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f7f5f2; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="max-width: 600px; background-color: #ffffff; border: 1px solid #e5e5e5;">
          <!-- Header -->
          <tr>
            <td style="padding: 40px 40px 30px 40px; background-color: #000000; text-align: center;">
              <h1 style="margin: 0; font-family: 'Bodoni Moda', Georgia, serif; font-size: 28px; font-weight: 400; color: #ffffff; letter-spacing: 2px; text-transform: uppercase;">
                Paiement reçu
              </h1>
              <p style="margin: 12px 0 0 0; font-family: 'Raleway', Arial, sans-serif; font-size: 12px; color: #cccccc; letter-spacing: 1px; text-transform: uppercase;">
                Stripe
              </p>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 40px;">
              <div style="background-color: #e8f5e9; border-left: 4px solid #4caf50; padding: 20px; margin-bottom: 24px;">
                <p style="margin: 0; font-family: 'Raleway', Arial, sans-serif; font-size: 16px; color: #1a1a1a; line-height: 1.6;">
                  ✅ <strong>Paiement confirmé via Stripe.</strong> La commande peut maintenant être préparée.
                </p>
              </div>

              <p style="margin: 0 0 8px 0; font-family: 'Raleway', Arial, sans-serif; font-size: 11px; color: #666666; text-transform: uppercase; letter-spacing: 1px;">
                Numéro de commande
              </p>
              <p style="margin: 0 0 24px 0; font-family: 'Bodoni Moda', Georgia, serif; font-size: 24px; font-weight: 400; color: #000000; letter-spacing: 1px;">
                #${order.id.substring(0, 8)}
              </p>

              <!-- Customer Info -->
              <div style="border-top: 1px solid #e5e5e5; padding-top: 24px; margin-bottom: 24px;">
                <h3 style="margin: 0 0 16px 0; font-family: 'Bodoni Moda', Georgia, serif; font-size: 18px; font-weight: 400; color: #000000; text-transform: uppercase; letter-spacing: 1px;">
                  Informations client
                </h3>
                <p style="margin: 8px 0; font-family: 'Raleway', Arial, sans-serif; font-size: 14px; color: #1a1a1a;">
                  <strong>Nom:</strong> ${order.customerName}
                </p>
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

              <!-- Items Table -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: 24px 0; border-collapse: collapse;">
                <thead>
                  <tr style="background-color: #f7f5f2; border-bottom: 2px solid #000000;">
                    <th style="padding: 12px; text-align: left; font-family: 'Raleway', Arial, sans-serif; font-size: 11px; color: #666666; text-transform: uppercase; letter-spacing: 1px; font-weight: 500;">
                      Produit
                    </th>
                    <th style="padding: 12px; text-align: center; font-family: 'Raleway', Arial, sans-serif; font-size: 11px; color: #666666; text-transform: uppercase; letter-spacing: 1px; font-weight: 500;">
                      Qté
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
                <p style="margin: 0; font-family: 'Bodoni Moda', Georgia, serif; font-size: 24px; font-weight: 400; color: #000000; letter-spacing: 1px;">
                  ${new Intl.NumberFormat('fr-FR', {
                    style: 'currency',
                    currency: 'MAD',
                  }).format(order.totalPrice / 100)}
                </p>
              </div>

              <p style="margin: 24px 0 0 0; font-family: 'Raleway', Arial, sans-serif; font-size: 12px; color: #666666;">
                Date: ${orderDate}
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 30px 40px; background-color: #f7f5f2; border-top: 1px solid #e5e5e5; text-align: center;">
              <p style="margin: 0; font-family: 'Raleway', Arial, sans-serif; font-size: 12px; color: #999999;">
                Consultez cette commande dans le panneau d'administration
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim()

  const text = `
PAIEMENT REÇU (STRIPE)

✅ Paiement confirmé via Stripe. La commande peut maintenant être préparée.

NUMÉRO DE COMMANDE
#${order.id.substring(0, 8)}

INFORMATIONS CLIENT
Nom: ${order.customerName}
Email: ${order.email}
Téléphone: ${order.phone}
Adresse: ${order.address}, ${order.city}, ${order.country}

PRODUITS COMMANDÉS
${order.items
  .map(
    (item) =>
      `- ${item.product.name} (x${item.quantity}) - ${new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: 'MAD',
      }).format((item.price / 100) * item.quantity)}`
  )
  .join('\n')}

TOTAL: ${new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'MAD',
  }).format(order.totalPrice / 100)}

Date: ${orderDate}
  `.trim()

  return {
    html,
    text,
    subject: `Paiement reçu (Stripe) — Commande #${order.id.substring(0, 8)}`,
  }
}

// Re-export admin notification from existing templates
export { generateAdminNotificationEmail } from './email-templates'




