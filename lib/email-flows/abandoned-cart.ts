/**
 * Abandoned Cart Email Flow
 * 3-step sequence for luxury furniture brand
 */

export interface CartItem {
  productId: string
  productName: string
  price: number
  quantity: number
  imageUrl?: string
}

export interface AbandonedCart {
  customerEmail: string
  customerName?: string
  items: CartItem[]
  total: number
  abandonedAt: Date
  cartId: string
}

/**
 * Email 1: Gentle Reminder (Sent 2 hours after abandonment)
 */
export function generateAbandonedCartEmail1({ cart }: { cart: AbandonedCart }): {
  html: string
  text: string
  subject: string
} {
  const itemsList = cart.items
    .map(
      (item) =>
        `- ${item.productName} (x${item.quantity}) - ${new Intl.NumberFormat('fr-FR', {
          style: 'currency',
          currency: 'EUR',
        }).format((item.price / 100) * item.quantity)}`
    )
    .join('\n')

  const html = `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Vous avez oublié quelque chose</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f7f5f2; font-family: 'Raleway', Arial, sans-serif;">
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f7f5f2; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="max-width: 600px; background-color: #ffffff; border: 1px solid #e5e5e5;">
          <!-- Header -->
          <tr>
            <td style="padding: 50px 40px; background-color: #000000; text-align: center;">
              <h1 style="margin: 0; font-family: 'Bodoni Moda', Georgia, serif; font-size: 28px; font-weight: 400; color: #ffffff; letter-spacing: 2px; text-transform: uppercase; line-height: 1.2;">
                Vous avez oublié quelque chose
              </h1>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 40px;">
              <p style="margin: 0 0 16px 0; font-family: 'Raleway', Arial, sans-serif; font-size: 16px; line-height: 1.6; color: #1a1a1a;">
                ${cart.customerName ? `Bonjour ${cart.customerName},` : 'Bonjour,'}
              </p>
              <p style="margin: 0 0 24px 0; font-family: 'Raleway', Arial, sans-serif; font-size: 16px; line-height: 1.6; color: #1a1a1a;">
                Nous avons remarqué que vous avez laissé des articles dans votre panier. Ces pièces d'exception vous attendent.
              </p>

              <!-- CTA Button -->
              <div style="text-align: center; margin: 32px 0;">
                <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://bk-agencements.com'}/cart?cart_id=${cart.cartId}" style="display: inline-block; padding: 16px 40px; background-color: #000000; color: #ffffff; text-decoration: none; font-family: 'Raleway', Arial, sans-serif; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; font-weight: 500;">
                  Compléter ma commande
                </a>
              </div>

              <!-- Items Summary -->
              <div style="border-top: 1px solid #e5e5e5; padding-top: 24px; margin-top: 24px;">
                <p style="margin: 0 0 16px 0; font-family: 'Bodoni Moda', Georgia, serif; font-size: 18px; font-weight: 400; color: #000000; text-transform: uppercase; letter-spacing: 1px;">
                  Votre sélection
                </p>
                <p style="margin: 0; font-family: 'Raleway', Arial, sans-serif; font-size: 14px; color: #1a1a1a; line-height: 1.8;">
                  ${itemsList}
                </p>
                <p style="margin: 16px 0 0 0; font-family: 'Bodoni Moda', Georgia, serif; font-size: 20px; font-weight: 400; color: #000000; text-align: right;">
                  Total: ${new Intl.NumberFormat('fr-FR', {
                    style: 'currency',
                    currency: 'EUR',
                  }).format(cart.total / 100)}
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
VOUS AVEZ OUBLIÉ QUELQUE CHOSE

${cart.customerName ? `Bonjour ${cart.customerName},` : 'Bonjour,'}

Nous avons remarqué que vous avez laissé des articles dans votre panier. Ces pièces d'exception vous attendent.

VOTRE SÉLECTION
${itemsList}

Total: ${new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
  }).format(cart.total / 100)}

Compléter ma commande: ${process.env.NEXT_PUBLIC_SITE_URL || 'https://bk-agencements.com'}/cart?cart_id=${cart.cartId}

BK Agencements — Mobilier sur-mesure d'exception
  `.trim()

  return {
    html,
    text,
    subject: 'Vous avez oublié quelque chose dans votre panier',
  }
}

/**
 * Email 2: Value Proposition (Sent 24 hours after abandonment)
 */
export function generateAbandonedCartEmail2({ cart }: { cart: AbandonedCart }): {
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
  <title>Mobilier d'exception vous attend</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f7f5f2; font-family: 'Raleway', Arial, sans-serif;">
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f7f5f2; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="max-width: 600px; background-color: #ffffff; border: 1px solid #e5e5e5;">
          <!-- Header -->
          <tr>
            <td style="padding: 50px 40px; background-color: #000000; text-align: center;">
              <h1 style="margin: 0; font-family: 'Bodoni Moda', Georgia, serif; font-size: 28px; font-weight: 400; color: #ffffff; letter-spacing: 2px; text-transform: uppercase; line-height: 1.2;">
                Mobilier d'exception vous attend
              </h1>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 40px;">
              <p style="margin: 0 0 16px 0; font-family: 'Raleway', Arial, sans-serif; font-size: 16px; line-height: 1.6; color: #1a1a1a;">
                ${cart.customerName ? `Bonjour ${cart.customerName},` : 'Bonjour,'}
              </p>
              <p style="margin: 0 0 24px 0; font-family: 'Raleway', Arial, sans-serif; font-size: 16px; line-height: 1.6; color: #1a1a1a;">
                Chaque pièce de votre sélection est façonnée à la main par nos artisans marocains. Un savoir-faire d'exception qui transforme votre intérieur en espace unique.
              </p>

              <!-- Benefits -->
              <div style="background-color: #f7f5f2; padding: 24px; margin: 24px 0;">
                <h3 style="margin: 0 0 16px 0; font-family: 'Bodoni Moda', Georgia, serif; font-size: 18px; font-weight: 400; color: #000000; text-transform: uppercase; letter-spacing: 1px;">
                  Pourquoi choisir BK Agencements
                </h3>
                <ul style="margin: 0; padding-left: 20px; font-family: 'Raleway', Arial, sans-serif; font-size: 14px; color: #1a1a1a; line-height: 1.8;">
                  <li>Fabrication artisanale sur-mesure</li>
                  <li>Matériaux nobles sélectionnés avec soin</li>
                  <li>Finitions impeccables et durables</li>
                  <li>Accompagnement personnalisé de A à Z</li>
                </ul>
              </div>

              <!-- CTA Button -->
              <div style="text-align: center; margin: 32px 0;">
                <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://bk-agencements.com'}/cart?cart_id=${cart.cartId}" style="display: inline-block; padding: 16px 40px; background-color: #000000; color: #ffffff; text-decoration: none; font-family: 'Raleway', Arial, sans-serif; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; font-weight: 500;">
                  Finaliser ma commande
                </a>
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
MOBILIER D'EXCEPTION VOUS ATTEND

${cart.customerName ? `Bonjour ${cart.customerName},` : 'Bonjour,'}

Chaque pièce de votre sélection est façonnée à la main par nos artisans marocains. Un savoir-faire d'exception qui transforme votre intérieur en espace unique.

POURQUOI CHOISIR BK AGENCEMENTS
• Fabrication artisanale sur-mesure
• Matériaux nobles sélectionnés avec soin
• Finitions impeccables et durables
• Accompagnement personnalisé de A à Z

Finaliser ma commande: ${process.env.NEXT_PUBLIC_SITE_URL || 'https://bk-agencements.com'}/cart?cart_id=${cart.cartId}

BK Agencements — Mobilier sur-mesure d'exception
  `.trim()

  return {
    html,
    text,
    subject: 'Mobilier d\'exception vous attend — Finalisez votre commande',
  }
}

/**
 * Email 3: Final Call (Sent 72 hours after abandonment)
 */
export function generateAbandonedCartEmail3({ cart }: { cart: AbandonedCart }): {
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
  <title>Dernière chance</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f7f5f2; font-family: 'Raleway', Arial, sans-serif;">
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f7f5f2; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="max-width: 600px; background-color: #ffffff; border: 1px solid #e5e5e5;">
          <!-- Header -->
          <tr>
            <td style="padding: 50px 40px; background-color: #000000; text-align: center;">
              <h1 style="margin: 0; font-family: 'Bodoni Moda', Georgia, serif; font-size: 28px; font-weight: 400; color: #ffffff; letter-spacing: 2px; text-transform: uppercase; line-height: 1.2;">
                Dernière chance
              </h1>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 40px;">
              <p style="margin: 0 0 16px 0; font-family: 'Raleway', Arial, sans-serif; font-size: 16px; line-height: 1.6; color: #1a1a1a;">
                ${cart.customerName ? `Bonjour ${cart.customerName},` : 'Bonjour,'}
              </p>
              <p style="margin: 0 0 24px 0; font-family: 'Raleway', Arial, sans-serif; font-size: 16px; line-height: 1.6; color: #1a1a1a;">
                Votre sélection de mobilier sur-mesure vous attend toujours. Si vous avez des questions ou souhaitez discuter de votre projet, notre équipe est à votre disposition.
              </p>

              <!-- CTA Button -->
              <div style="text-align: center; margin: 32px 0;">
                <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://bk-agencements.com'}/cart?cart_id=${cart.cartId}" style="display: inline-block; padding: 16px 40px; background-color: #000000; color: #ffffff; text-decoration: none; font-family: 'Raleway', Arial, sans-serif; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; font-weight: 500;">
                  Compléter ma commande
                </a>
              </div>

              <!-- Alternative CTA -->
              <div style="text-align: center; margin: 24px 0;">
                <p style="margin: 0 0 8px 0; font-family: 'Raleway', Arial, sans-serif; font-size: 14px; color: #666666;">
                  Ou contactez-nous pour discuter de votre projet
                </p>
                <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://bk-agencements.com'}/contact" style="color: #000000; text-decoration: underline; font-family: 'Raleway', Arial, sans-serif; font-size: 14px;">
                  Nous contacter
                </a>
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
DERNIÈRE CHANCE

${cart.customerName ? `Bonjour ${cart.customerName},` : 'Bonjour,'}

Votre sélection de mobilier sur-mesure vous attend toujours. Si vous avez des questions ou souhaitez discuter de votre projet, notre équipe est à votre disposition.

Compléter ma commande: ${process.env.NEXT_PUBLIC_SITE_URL || 'https://bk-agencements.com'}/cart?cart_id=${cart.cartId}

Ou contactez-nous pour discuter de votre projet: ${process.env.NEXT_PUBLIC_SITE_URL || 'https://bk-agencements.com'}/contact

BK Agencements — Mobilier sur-mesure d'exception
  `.trim()

  return {
    html,
    text,
    subject: 'Dernière chance — Votre sélection vous attend',
  }
}

/**
 * Abandoned Cart Flow Configuration
 */
export const abandonedCartFlowConfig = {
  email1: {
    delay: 2 * 60 * 60 * 1000, // 2 hours
    template: generateAbandonedCartEmail1,
    subject: 'Vous avez oublié quelque chose dans votre panier',
  },
  email2: {
    delay: 24 * 60 * 60 * 1000, // 24 hours
    template: generateAbandonedCartEmail2,
    subject: 'Mobilier d\'exception vous attend — Finalisez votre commande',
  },
  email3: {
    delay: 72 * 60 * 60 * 1000, // 72 hours
    template: generateAbandonedCartEmail3,
    subject: 'Dernière chance — Votre sélection vous attend',
  },
}




