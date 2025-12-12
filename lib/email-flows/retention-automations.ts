/**
 * Customer Retention Automations
 * Post-purchase, care tips, reviews, cross-sell, interior design advice
 */

export interface Customer {
  name: string
  email: string
  lastOrderDate: Date
  totalSpent: number
  orderCount: number
}

export interface Order {
  id: string
  items: Array<{ productName: string; quantity: number }>
  totalPrice: number
  createdAt: Date
}

/**
 * Post-Purchase Email (Sent 3 days after delivery)
 */
export function generatePostPurchaseEmail({ customer, order }: { customer: Customer; order: Order }): {
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
  <title>Comment se passe votre commande ?</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f7f5f2; font-family: 'Raleway', Arial, sans-serif;">
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f7f5f2; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="max-width: 600px; background-color: #FCFBFC; border: 1px solid #e5e5e5;">
          <tr>
            <td style="padding: 50px 40px; background-color: #000000; text-align: center;">
              <h1 style="margin: 0; font-family: 'Bodoni Moda', Georgia, serif; font-size: 28px; font-weight: 400; color: #ffffff; letter-spacing: 2px; text-transform: uppercase;">
                Comment se passe votre commande ?
              </h1>
            </td>
          </tr>
          <tr>
            <td style="padding: 40px;">
              <p style="margin: 0 0 16px 0; font-family: 'Raleway', Arial, sans-serif; font-size: 16px; line-height: 1.6; color: #1a1a1a;">
                Bonjour ${customer.name},
              </p>
              <p style="margin: 0 0 24px 0; font-family: 'Raleway', Arial, sans-serif; font-size: 16px; line-height: 1.6; color: #1a1a1a;">
                Nous espérons que votre mobilier sur-mesure vous apporte toute la satisfaction attendue. Votre satisfaction est notre priorité.
              </p>
              <div style="text-align: center; margin: 32px 0;">
                <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://bk-agencements.com'}/contact" style="display: inline-block; padding: 16px 40px; background-color: #000000; color: #ffffff; text-decoration: none; font-family: 'Raleway', Arial, sans-serif; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">
                  Nous contacter
                </a>
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

  return {
    html,
    text: `Comment se passe votre commande ?\n\nBonjour ${customer.name},\n\nNous espérons que votre mobilier sur-mesure vous apporte toute la satisfaction attendue.`,
    subject: 'Comment se passe votre commande ?',
  }
}

/**
 * Usage Care Tips Email (Sent 7 days after delivery)
 */
export function generateCareTipsEmail({ customer, order }: { customer: Customer; order: Order }): {
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
  <title>Conseils d'entretien</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f7f5f2; font-family: 'Raleway', Arial, sans-serif;">
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f7f5f2; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="max-width: 600px; background-color: #FCFBFC; border: 1px solid #e5e5e5;">
          <tr>
            <td style="padding: 50px 40px; background-color: #000000; text-align: center;">
              <h1 style="margin: 0; font-family: 'Bodoni Moda', Georgia, serif; font-size: 28px; font-weight: 400; color: #ffffff; letter-spacing: 2px; text-transform: uppercase;">
                Conseils d'entretien
              </h1>
            </td>
          </tr>
          <tr>
            <td style="padding: 40px;">
              <p style="margin: 0 0 16px 0; font-family: 'Raleway', Arial, sans-serif; font-size: 16px; line-height: 1.6; color: #1a1a1a;">
                Bonjour ${customer.name},
              </p>
              <p style="margin: 0 0 24px 0; font-family: 'Raleway', Arial, sans-serif; font-size: 16px; line-height: 1.6; color: #1a1a1a;">
                Pour préserver la beauté et la durabilité de votre mobilier sur-mesure, voici quelques conseils d'entretien essentiels.
              </p>
              <div style="background-color: #f7f5f2; padding: 24px; margin: 24px 0;">
                <h3 style="margin: 0 0 16px 0; font-family: 'Bodoni Moda', Georgia, serif; font-size: 18px; font-weight: 400; color: #000000; text-transform: uppercase;">
                  Entretien du mobilier
                </h3>
                <ul style="margin: 0; padding-left: 20px; font-family: 'Raleway', Arial, sans-serif; font-size: 14px; color: #1a1a1a; line-height: 1.8;">
                  <li>Nettoyage régulier avec un chiffon doux et humide</li>
                  <li>Éviter les produits abrasifs et l'exposition directe au soleil</li>
                  <li>Huiler les surfaces en bois tous les 3-6 mois</li>
                  <li>Protéger les tissus avec des housses lors de non-utilisation</li>
                </ul>
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

  return {
    html,
    text: `Conseils d'entretien\n\nBonjour ${customer.name},\n\nPour préserver la beauté de votre mobilier, voici quelques conseils essentiels.`,
    subject: 'Conseils d\'entretien pour votre mobilier',
  }
}

/**
 * Review Request Email (Sent 14 days after delivery)
 */
export function generateReviewRequestEmail({ customer, order }: { customer: Customer; order: Order }): {
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
  <title>Partagez votre expérience</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f7f5f2; font-family: 'Raleway', Arial, sans-serif;">
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f7f5f2; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="max-width: 600px; background-color: #FCFBFC; border: 1px solid #e5e5e5;">
          <tr>
            <td style="padding: 50px 40px; background-color: #000000; text-align: center;">
              <h1 style="margin: 0; font-family: 'Bodoni Moda', Georgia, serif; font-size: 28px; font-weight: 400; color: #ffffff; letter-spacing: 2px; text-transform: uppercase;">
                Partagez votre expérience
              </h1>
            </td>
          </tr>
          <tr>
            <td style="padding: 40px;">
              <p style="margin: 0 0 16px 0; font-family: 'Raleway', Arial, sans-serif; font-size: 16px; line-height: 1.6; color: #1a1a1a;">
                Bonjour ${customer.name},
              </p>
              <p style="margin: 0 0 24px 0; font-family: 'Raleway', Arial, sans-serif; font-size: 16px; line-height: 1.6; color: #1a1a1a;">
                Votre avis compte énormément pour nous. Partagez votre expérience avec BK Agencements et aidez d'autres clients à découvrir notre savoir-faire.
              </p>
              <div style="text-align: center; margin: 32px 0;">
                <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://bk-agencements.com'}/review?order=${order.id}" style="display: inline-block; padding: 16px 40px; background-color: #000000; color: #ffffff; text-decoration: none; font-family: 'Raleway', Arial, sans-serif; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">
                  Laisser un avis
                </a>
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

  return {
    html,
    text: `Partagez votre expérience\n\nBonjour ${customer.name},\n\nVotre avis compte énormément. Partagez votre expérience avec BK Agencements.`,
    subject: 'Partagez votre expérience — Votre avis compte',
  }
}

/**
 * Cross-sell Suggestions Email (Sent 30 days after delivery)
 */
export function generateCrossSellEmail({ customer }: { customer: Customer }): {
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
  <title>Complétez votre intérieur</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f7f5f2; font-family: 'Raleway', Arial, sans-serif;">
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f7f5f2; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="max-width: 600px; background-color: #FCFBFC; border: 1px solid #e5e5e5;">
          <tr>
            <td style="padding: 50px 40px; background-color: #000000; text-align: center;">
              <h1 style="margin: 0; font-family: 'Bodoni Moda', Georgia, serif; font-size: 28px; font-weight: 400; color: #ffffff; letter-spacing: 2px; text-transform: uppercase;">
                Complétez votre intérieur
              </h1>
            </td>
          </tr>
          <tr>
            <td style="padding: 40px;">
              <p style="margin: 0 0 16px 0; font-family: 'Raleway', Arial, sans-serif; font-size: 16px; line-height: 1.6; color: #1a1a1a;">
                Bonjour ${customer.name},
              </p>
              <p style="margin: 0 0 24px 0; font-family: 'Raleway', Arial, sans-serif; font-size: 16px; line-height: 1.6; color: #1a1a1a;">
                Découvrez nos suggestions pour compléter votre intérieur et créer un espace harmonieux et cohérent.
              </p>
              <div style="text-align: center; margin: 32px 0;">
                <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://bk-agencements.com'}/boutique" style="display: inline-block; padding: 16px 40px; background-color: #000000; color: #ffffff; text-decoration: none; font-family: 'Raleway', Arial, sans-serif; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">
                  Découvrir nos suggestions
                </a>
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

  return {
    html,
    text: `Complétez votre intérieur\n\nBonjour ${customer.name},\n\nDécouvrez nos suggestions pour compléter votre intérieur.`,
    subject: 'Complétez votre intérieur — Suggestions personnalisées',
  }
}

/**
 * Interior Design Advice Email (Sent 60 days after delivery)
 */
export function generateInteriorDesignAdviceEmail({ customer }: { customer: Customer }): {
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
  <title>Conseils d'agencement</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f7f5f2; font-family: 'Raleway', Arial, sans-serif;">
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f7f5f2; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="max-width: 600px; background-color: #FCFBFC; border: 1px solid #e5e5e5;">
          <tr>
            <td style="padding: 50px 40px; background-color: #000000; text-align: center;">
              <h1 style="margin: 0; font-family: 'Bodoni Moda', Georgia, serif; font-size: 28px; font-weight: 400; color: #ffffff; letter-spacing: 2px; text-transform: uppercase;">
                Conseils d'agencement
              </h1>
            </td>
          </tr>
          <tr>
            <td style="padding: 40px;">
              <p style="margin: 0 0 16px 0; font-family: 'Raleway', Arial, sans-serif; font-size: 16px; line-height: 1.6; color: #1a1a1a;">
                Bonjour ${customer.name},
              </p>
              <p style="margin: 0 0 24px 0; font-family: 'Raleway', Arial, sans-serif; font-size: 16px; line-height: 1.6; color: #1a1a1a;">
                Nos experts en agencement intérieur partagent leurs conseils pour créer un espace harmonieux et élégant.
              </p>
              <div style="background-color: #f7f5f2; padding: 24px; margin: 24px 0;">
                <h3 style="margin: 0 0 16px 0; font-family: 'Bodoni Moda', Georgia, serif; font-size: 18px; font-weight: 400; color: #000000; text-transform: uppercase;">
                  Conseils d'experts
                </h3>
                <ul style="margin: 0; padding-left: 20px; font-family: 'Raleway', Arial, sans-serif; font-size: 14px; color: #1a1a1a; line-height: 1.8;">
                  <li>Harmoniser les couleurs et les matériaux</li>
                  <li>Jouer avec les volumes et les proportions</li>
                  <li>Créer des points focaux dans chaque pièce</li>
                  <li>Optimiser l'éclairage naturel et artificiel</li>
                </ul>
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

  return {
    html,
    text: `Conseils d'agencement\n\nBonjour ${customer.name},\n\nNos experts partagent leurs conseils pour créer un espace harmonieux.`,
    subject: 'Conseils d\'agencement — Expertise BK Agencements',
  }
}




