/**
 * Premium Transactional Email Templates
 * Luxury furniture brand - Minimalist design, luxury tone
 */

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
  createdAt: string
  items: OrderItem[]
  trackingNumber?: string
  estimatedDeliveryDate?: string
}

interface Quote {
  id: string
  customerName: string
  email: string
  phone: string
  projectType: string
  budget: string
  message: string
  createdAt: string
  quoteAmount?: number
  quoteValidUntil?: string
}

/**
 * 1. Order Confirmation Email
 * Sent immediately after order is placed
 */
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
            <td style="padding: 50px 40px; background-color: #000000; text-align: center;">
              <h1 style="margin: 0; font-family: 'Bodoni Moda', Georgia, serif; font-size: 32px; font-weight: 400; color: #ffffff; letter-spacing: 2px; text-transform: uppercase; line-height: 1.2;">
                Merci pour votre commande
              </h1>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 40px;">
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
MERCI POUR VOTRE COMMANDE

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

BK Agencements — Mobilier sur-mesure d'exception
  `.trim()

  return {
    html,
    text,
    subject: `Confirmation de commande #${order.id.substring(0, 8)}`,
  }
}

/**
 * 2. Order Shipped Email
 * Sent when order status changes to "shipped"
 */
export function generateOrderShippedEmail({ order }: { order: Order }): {
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
  <title>Votre commande a été expédiée</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f7f5f2; font-family: 'Raleway', Arial, sans-serif;">
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f7f5f2; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="max-width: 600px; background-color: #ffffff; border: 1px solid #e5e5e5;">
          <!-- Header -->
          <tr>
            <td style="padding: 50px 40px; background-color: #000000; text-align: center;">
              <h1 style="margin: 0; font-family: 'Bodoni Moda', Georgia, serif; font-size: 32px; font-weight: 400; color: #ffffff; letter-spacing: 2px; text-transform: uppercase; line-height: 1.2;">
                Votre commande a été expédiée
              </h1>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 40px;">
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

              ${order.trackingNumber
                ? `
              <!-- Tracking Number -->
              <div style="background-color: #e8f5e9; border-left: 4px solid #4caf50; padding: 20px; margin: 24px 0;">
                <h3 style="margin: 0 0 12px 0; font-family: 'Bodoni Moda', Georgia, serif; font-size: 18px; font-weight: 400; color: #000000; text-transform: uppercase; letter-spacing: 1px;">
                  Numéro de suivi
                </h3>
                <p style="margin: 0; font-family: 'Raleway', Arial, sans-serif; font-size: 16px; font-weight: 600; color: #1a1a1a;">
                  ${order.trackingNumber}
                </p>
                <p style="margin: 12px 0 0 0; font-family: 'Raleway', Arial, sans-serif; font-size: 14px; color: #666666;">
                  Vous pouvez suivre votre colis en utilisant ce numéro sur le site du transporteur.
                </p>
              </div>
              `
                : ''}

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
VOTRE COMMANDE A ÉTÉ EXPÉDIÉE

Bonjour ${order.customerName},

Excellente nouvelle ! Votre commande a été expédiée et est en route vers vous.

NUMÉRO DE COMMANDE
#${order.id.substring(0, 8)}

${order.trackingNumber ? `NUMÉRO DE SUIVI\n${order.trackingNumber}\n` : ''}
${order.estimatedDeliveryDate ? `DATE DE LIVRAISON ESTIMÉE\n${order.estimatedDeliveryDate}\n` : ''}

ADRESSE DE LIVRAISON
${order.customerName}
${order.address}
${order.city}, ${order.country}

BK Agencements — Mobilier sur-mesure d'exception
  `.trim()

  return {
    html,
    text,
    subject: `Votre commande #${order.id.substring(0, 8)} a été expédiée`,
  }
}

/**
 * 3. Quote Request Received Email
 * Sent immediately when quote request is submitted
 */
export function generateQuoteRequestReceivedEmail({ quote }: { quote: Quote }): {
  html: string
  text: string
  subject: string
} {
  const quoteDate = new Date(quote.createdAt).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  const html = `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Demande de devis reçue</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f7f5f2; font-family: 'Raleway', Arial, sans-serif;">
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f7f5f2; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="max-width: 600px; background-color: #ffffff; border: 1px solid #e5e5e5;">
          <!-- Header -->
          <tr>
            <td style="padding: 50px 40px; background-color: #000000; text-align: center;">
              <h1 style="margin: 0; font-family: 'Bodoni Moda', Georgia, serif; font-size: 32px; font-weight: 400; color: #ffffff; letter-spacing: 2px; text-transform: uppercase; line-height: 1.2;">
                Demande de devis reçue
              </h1>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 40px;">
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
                </table>
                ${quote.message
                  ? `
                <div style="margin-top: 16px; padding: 16px; background-color: #f7f5f2; border-left: 3px solid #000000;">
                  <p style="margin: 0; font-family: 'Raleway', Arial, sans-serif; font-size: 14px; color: #1a1a1a; line-height: 1.6;">
                    ${quote.message}
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
DEMANDE DE DEVIS REÇUE

Bonjour ${quote.customerName},

Nous avons bien reçu votre demande de devis. Notre équipe l'examine avec attention et vous répondra dans les plus brefs délais.

RÉFÉRENCE DE VOTRE DEMANDE
#${quote.id.substring(0, 8)}

DÉTAILS DE VOTRE PROJET
Type de projet: ${quote.projectType}
${quote.budget ? `Budget: ${quote.budget}` : ''}

${quote.message ? `Message:\n${quote.message}` : ''}

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

/**
 * 4. Quote Accepted Email
 * Sent when admin accepts/approves a quote
 */
export function generateQuoteAcceptedEmail({ quote }: { quote: Quote }): {
  html: string
  text: string
  subject: string
} {
  const validUntil = quote.quoteValidUntil
    ? new Date(quote.quoteValidUntil).toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : null

  const html = `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Votre devis est prêt</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f7f5f2; font-family: 'Raleway', Arial, sans-serif;">
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f7f5f2; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="max-width: 600px; background-color: #ffffff; border: 1px solid #e5e5e5;">
          <!-- Header -->
          <tr>
            <td style="padding: 50px 40px; background-color: #000000; text-align: center;">
              <h1 style="margin: 0; font-family: 'Bodoni Moda', Georgia, serif; font-size: 32px; font-weight: 400; color: #ffffff; letter-spacing: 2px; text-transform: uppercase; line-height: 1.2;">
                Votre devis est prêt
              </h1>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 40px;">
              <p style="margin: 0 0 16px 0; font-family: 'Raleway', Arial, sans-serif; font-size: 16px; line-height: 1.6; color: #1a1a1a;">
                Bonjour ${quote.customerName},
              </p>
              <p style="margin: 0 0 24px 0; font-family: 'Raleway', Arial, sans-serif; font-size: 16px; line-height: 1.6; color: #1a1a1a;">
                Nous avons le plaisir de vous présenter votre devis personnalisé pour votre projet d'agencement intérieur.
              </p>

              <!-- Quote Reference -->
              <div style="background-color: #f7f5f2; border: 1px solid #e5e5e5; padding: 30px; margin: 24px 0; text-align: center;">
                <p style="margin: 0 0 8px 0; font-family: 'Raleway', Arial, sans-serif; font-size: 11px; color: #666666; text-transform: uppercase; letter-spacing: 1px;">
                  Référence du devis
                </p>
                <p style="margin: 0; font-family: 'Bodoni Moda', Georgia, serif; font-size: 36px; font-weight: 400; color: #000000; letter-spacing: 2px;">
                  #${quote.id.substring(0, 8)}
                </p>
              </div>

              ${quote.quoteAmount
                ? `
              <!-- Quote Amount -->
              <div style="background-color: #000000; padding: 30px; margin: 24px 0; text-align: center;">
                <p style="margin: 0 0 8px 0; font-family: 'Raleway', Arial, sans-serif; font-size: 11px; color: #cccccc; text-transform: uppercase; letter-spacing: 1px;">
                  Montant du devis
                </p>
                <p style="margin: 0; font-family: 'Bodoni Moda', Georgia, serif; font-size: 36px; font-weight: 400; color: #ffffff; letter-spacing: 2px;">
                  ${new Intl.NumberFormat('fr-FR', {
                    style: 'currency',
                    currency: 'EUR',
                  }).format(quote.quoteAmount / 100)}
                </p>
              </div>
              `
                : ''}

              ${validUntil
                ? `
              <!-- Valid Until -->
              <div style="background-color: #fff9e6; border-left: 4px solid #d4af37; padding: 20px; margin: 24px 0;">
                <p style="margin: 0; font-family: 'Raleway', Arial, sans-serif; font-size: 14px; color: #1a1a1a; line-height: 1.6;">
                  <strong>Ce devis est valable jusqu'au:</strong> ${validUntil}
                </p>
              </div>
              `
                : ''}

              <!-- Next Steps -->
              <div style="border-top: 1px solid #e5e5e5; padding-top: 24px; margin-top: 24px;">
                <h3 style="margin: 0 0 16px 0; font-family: 'Bodoni Moda', Georgia, serif; font-size: 18px; font-weight: 400; color: #000000; text-transform: uppercase; letter-spacing: 1px;">
                  Prochaines étapes
                </h3>
                <p style="margin: 0 0 16px 0; font-family: 'Raleway', Arial, sans-serif; font-size: 14px; color: #1a1a1a; line-height: 1.6;">
                  Pour accepter ce devis et lancer votre projet, veuillez nous contacter par téléphone ou email. Notre équipe se tient à votre disposition pour répondre à toutes vos questions.
                </p>
                <p style="margin: 0; font-family: 'Raleway', Arial, sans-serif; font-size: 14px; color: #1a1a1a; line-height: 1.6;">
                  Nous avons hâte de donner vie à votre projet d'agencement intérieur.
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
VOTRE DEVIS EST PRÊT

Bonjour ${quote.customerName},

Nous avons le plaisir de vous présenter votre devis personnalisé pour votre projet d'agencement intérieur.

RÉFÉRENCE DU DEVIS
#${quote.id.substring(0, 8)}

${quote.quoteAmount
  ? `MONTANT DU DEVIS\n${new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
    }).format(quote.quoteAmount / 100)}\n`
  : ''}
${validUntil ? `Ce devis est valable jusqu'au: ${validUntil}\n` : ''}

PROCHAINES ÉTAPES
Pour accepter ce devis et lancer votre projet, veuillez nous contacter par téléphone ou email. Notre équipe se tient à votre disposition pour répondre à toutes vos questions.

Nous avons hâte de donner vie à votre projet d'agencement intérieur.

BK Agencements — Mobilier sur-mesure d'exception
  `.trim()

  return {
    html,
    text,
    subject: `Votre devis est prêt — Référence #${quote.id.substring(0, 8)}`,
  }
}

/**
 * 5. Cash-on-Delivery Confirmation Email
 * Already exists in order-email-templates.ts, but included here for completeness
 */
export { generateCODCustomerEmail } from './order-email-templates'




