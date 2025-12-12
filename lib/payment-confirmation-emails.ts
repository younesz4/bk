/**
 * Payment Confirmation Email Templates
 * 3 templates: Payment received, Payment pending (bank transfer), COD confirmation
 */

interface Order {
  id: string
  customerName: string
  email: string
  totalPrice: number
  paymentMethod: string
  createdAt: string
  items: Array<{
    product: {
      name: string
      price: number
    }
    quantity: number
  }>
}

/**
 * 1. Payment Received Email
 */
export function generatePaymentReceivedEmail({ order }: { order: Order }): {
  html: string
  text: string
  subject: string
} {
  const itemsList = order.items
    .map(
      (item) =>
        `- ${item.product.name} (x${item.quantity}) - ${new Intl.NumberFormat('fr-FR', {
          style: 'currency',
          currency: 'EUR',
        }).format((item.product.price / 100) * item.quantity)}`
    )
    .join('\n')

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
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="max-width: 600px; background-color: #FCFBFC; border: 1px solid #e5e5e5;">
          <tr>
            <td style="padding: 50px 40px; background-color: #000000; text-align: center;">
              <h1 style="margin: 0; font-family: 'Bodoni Moda', Georgia, serif; font-size: 32px; font-weight: 400; color: #ffffff; letter-spacing: 2px; text-transform: uppercase;">
                Paiement reçu
              </h1>
            </td>
          </tr>
          <tr>
            <td style="padding: 40px;">
              <div style="background-color: #e8f5e9; border-left: 4px solid #4caf50; padding: 20px; margin-bottom: 24px;">
                <p style="margin: 0; font-family: 'Raleway', Arial, sans-serif; font-size: 16px; color: #1a1a1a;">
                  ✅ <strong>Votre paiement a été confirmé avec succès.</strong>
                </p>
              </div>
              <p style="margin: 0 0 16px 0; font-family: 'Raleway', Arial, sans-serif; font-size: 16px; line-height: 1.6; color: #1a1a1a;">
                Bonjour ${order.customerName},
              </p>
              <p style="margin: 0 0 24px 0; font-family: 'Raleway', Arial, sans-serif; font-size: 16px; line-height: 1.6; color: #1a1a1a;">
                Nous avons bien reçu votre paiement. Votre commande est maintenant confirmée et en cours de préparation.
              </p>
              <div style="background-color: #f7f5f2; border: 1px solid #e5e5e5; padding: 30px; margin: 24px 0; text-align: center;">
                <p style="margin: 0 0 8px 0; font-family: 'Raleway', Arial, sans-serif; font-size: 11px; color: #666666; text-transform: uppercase;">
                  Numéro de commande
                </p>
                <p style="margin: 0; font-family: 'Bodoni Moda', Georgia, serif; font-size: 36px; font-weight: 400; color: #000000; letter-spacing: 2px;">
                  #${order.id.substring(0, 8)}
                </p>
              </div>
              <div style="border-top: 2px solid #000000; padding-top: 20px; margin-top: 24px; text-align: right;">
                <p style="margin: 0; font-family: 'Bodoni Moda', Georgia, serif; font-size: 28px; font-weight: 400; color: #000000; letter-spacing: 1px;">
                  ${new Intl.NumberFormat('fr-FR', {
                    style: 'currency',
                    currency: 'EUR',
                  }).format(order.totalPrice / 100)}
                </p>
              </div>
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
PAIEMENT REÇU

✅ Votre paiement a été confirmé avec succès.

Bonjour ${order.customerName},

Nous avons bien reçu votre paiement. Votre commande est maintenant confirmée et en cours de préparation.

NUMÉRO DE COMMANDE
#${order.id.substring(0, 8)}

TOTAL: ${new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
  }).format(order.totalPrice / 100)}

BK Agencements — Mobilier sur-mesure d'exception
  `.trim()

  return {
    html,
    text,
    subject: `Paiement reçu — Commande #${order.id.substring(0, 8)}`,
  }
}

/**
 * 2. Payment Pending (Bank Transfer) Email
 */
export function generatePaymentPendingEmail({ order }: { order: Order }): {
  html: string
  text: string
  subject: string
} {
  const html = `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Paiement en attente</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f7f5f2; font-family: 'Raleway', Arial, sans-serif;">
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f7f5f2; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="max-width: 600px; background-color: #FCFBFC; border: 1px solid #e5e5e5;">
          <tr>
            <td style="padding: 50px 40px; background-color: #000000; text-align: center;">
              <h1 style="margin: 0; font-family: 'Bodoni Moda', Georgia, serif; font-size: 32px; font-weight: 400; color: #ffffff; letter-spacing: 2px; text-transform: uppercase;">
                Paiement en attente
              </h1>
            </td>
          </tr>
          <tr>
            <td style="padding: 40px;">
              <div style="background-color: #fff9e6; border-left: 4px solid #d4af37; padding: 20px; margin-bottom: 24px;">
                <p style="margin: 0; font-family: 'Raleway', Arial, sans-serif; font-size: 16px; color: #1a1a1a;">
                  ⏳ <strong>Votre commande est en attente de paiement.</strong>
                </p>
              </div>
              <p style="margin: 0 0 16px 0; font-family: 'Raleway', Arial, sans-serif; font-size: 16px; line-height: 1.6; color: #1a1a1a;">
                Bonjour ${order.customerName},
              </p>
              <p style="margin: 0 0 24px 0; font-family: 'Raleway', Arial, sans-serif; font-size: 16px; line-height: 1.6; color: #1a1a1a;">
                Votre commande a été créée. Veuillez effectuer le virement bancaire aux coordonnées suivantes :
              </p>
              <div style="background-color: #f7f5f2; border: 1px solid #e5e5e5; padding: 24px; margin: 24px 0;">
                <h3 style="margin: 0 0 16px 0; font-family: 'Bodoni Moda', Georgia, serif; font-size: 18px; font-weight: 400; color: #000000; text-transform: uppercase;">
                  Coordonnées bancaires
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
                  <strong>Montant:</strong> ${new Intl.NumberFormat('fr-FR', {
                    style: 'currency',
                    currency: 'EUR',
                  }).format(order.totalPrice / 100)}
                </p>
                <p style="margin: 8px 0; font-family: 'Raleway', Arial, sans-serif; font-size: 14px; color: #1a1a1a;">
                  <strong>Référence:</strong> COMMANDE-${order.id.substring(0, 8).toUpperCase()}
                </p>
              </div>
              <p style="margin: 24px 0 0 0; font-family: 'Raleway', Arial, sans-serif; font-size: 14px; color: #666666;">
                Une fois le virement effectué, votre commande sera traitée. Nous vous contacterons pour confirmer la réception du paiement.
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
PAIEMENT EN ATTENTE

⏳ Votre commande est en attente de paiement.

Bonjour ${order.customerName},

Votre commande a été créée. Veuillez effectuer le virement bancaire aux coordonnées suivantes :

COORDONNÉES BANCAIRES
Banque: [VOTRE BANQUE]
RIB: [VOTRE RIB]
BIC: [VOTRE BIC]
Montant: ${new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
  }).format(order.totalPrice / 100)}
Référence: COMMANDE-${order.id.substring(0, 8).toUpperCase()}

Une fois le virement effectué, votre commande sera traitée.

BK Agencements — Mobilier sur-mesure d'exception
  `.trim()

  return {
    html,
    text,
    subject: `Paiement en attente — Commande #${order.id.substring(0, 8)}`,
  }
}

/**
 * 3. Cash-on-Delivery Confirmation Email
 * Already exists in order-email-templates.ts, but included for completeness
 */
export { generateCODCustomerEmail } from './order-email-templates'




