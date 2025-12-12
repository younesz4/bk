/**
 * VIP Customer Flow
 * 3-email premium sequence for clients who spent > 1500€
 * Exclusive, elegant, intimate tone
 */

export interface VIPCustomer {
  name: string
  email: string
  totalSpent: number
  orderCount: number
  firstOrderDate: Date
  lastOrderDate: Date
}

/**
 * Email 1: VIP Welcome (Sent immediately after reaching VIP threshold)
 */
export function generateVIPEmail1({ customer }: { customer: VIPCustomer }): {
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
  <title>Bienvenue dans notre cercle privilégié</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f7f5f2; font-family: 'Raleway', Arial, sans-serif;">
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f7f5f2; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="max-width: 600px; background-color: #FCFBFC; border: 1px solid #e5e5e5;">
          <tr>
            <td style="padding: 50px 40px; background-color: #000000; text-align: center;">
              <h1 style="margin: 0; font-family: 'Bodoni Moda', Georgia, serif; font-size: 32px; font-weight: 400; color: #ffffff; letter-spacing: 2px; text-transform: uppercase;">
                Bienvenue dans notre cercle privilégié
              </h1>
            </td>
          </tr>
          <tr>
            <td style="padding: 40px;">
              <p style="margin: 0 0 16px 0; font-family: 'Raleway', Arial, sans-serif; font-size: 16px; line-height: 1.6; color: #1a1a1a;">
                Cher ${customer.name},
              </p>
              <p style="margin: 0 0 24px 0; font-family: 'Raleway', Arial, sans-serif; font-size: 16px; line-height: 1.6; color: #1a1a1a;">
                Votre fidélité et votre confiance nous touchent profondément. C'est avec un immense plaisir que nous vous accueillons dans notre cercle de clients privilégiés.
              </p>
              <div style="background-color: #fff9e6; border-left: 4px solid #d4af37; padding: 24px; margin: 24px 0;">
                <h3 style="margin: 0 0 16px 0; font-family: 'Bodoni Moda', Georgia, serif; font-size: 18px; font-weight: 400; color: #000000; text-transform: uppercase;">
                  Vos avantages exclusifs
                </h3>
                <ul style="margin: 0; padding-left: 20px; font-family: 'Raleway', Arial, sans-serif; font-size: 14px; color: #1a1a1a; line-height: 1.8;">
                  <li>Consultation personnalisée avec notre directeur artistique</li>
                  <li>Accès prioritaire aux collections limitées</li>
                  <li>Remise exclusive de 10% sur tous vos futurs projets</li>
                  <li>Accompagnement dédié pour chaque commande</li>
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
    text: `Bienvenue dans notre cercle privilégié\n\nCher ${customer.name},\n\nVotre fidélité nous touche. Nous vous accueillons dans notre cercle de clients privilégiés.`,
    subject: 'Bienvenue dans notre cercle privilégié',
  }
}

/**
 * Email 2: Exclusive Preview (Sent 30 days after VIP status)
 */
export function generateVIPEmail2({ customer }: { customer: VIPCustomer }): {
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
  <title>Accès exclusif — Nouvelle collection</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f7f5f2; font-family: 'Raleway', Arial, sans-serif;">
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f7f5f2; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="max-width: 600px; background-color: #FCFBFC; border: 1px solid #e5e5e5;">
          <tr>
            <td style="padding: 50px 40px; background-color: #000000; text-align: center;">
              <h1 style="margin: 0; font-family: 'Bodoni Moda', Georgia, serif; font-size: 28px; font-weight: 400; color: #ffffff; letter-spacing: 2px; text-transform: uppercase;">
                Accès exclusif
              </h1>
            </td>
          </tr>
          <tr>
            <td style="padding: 40px;">
              <p style="margin: 0 0 16px 0; font-family: 'Raleway', Arial, sans-serif; font-size: 16px; line-height: 1.6; color: #1a1a1a;">
                Cher ${customer.name},
              </p>
              <p style="margin: 0 0 24px 0; font-family: 'Raleway', Arial, sans-serif; font-size: 16px; line-height: 1.6; color: #1a1a1a;">
                En tant que client privilégié, vous avez un accès exclusif à notre nouvelle collection avant sa sortie officielle. Découvrez ces pièces d'exception créées spécialement pour vous.
              </p>
              <div style="text-align: center; margin: 32px 0;">
                <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://bk-agencements.com'}/boutique?vip=true" style="display: inline-block; padding: 16px 40px; background-color: #000000; color: #ffffff; text-decoration: none; font-family: 'Raleway', Arial, sans-serif; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">
                  Découvrir la collection
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
    text: `Accès exclusif — Nouvelle collection\n\nCher ${customer.name},\n\nVous avez un accès exclusif à notre nouvelle collection avant sa sortie officielle.`,
    subject: 'Accès exclusif — Nouvelle collection',
  }
}

/**
 * Email 3: Personal Invitation (Sent 90 days after VIP status)
 */
export function generateVIPEmail3({ customer }: { customer: VIPCustomer }): {
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
  <title>Invitation personnelle</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f7f5f2; font-family: 'Raleway', Arial, sans-serif;">
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f7f5f2; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="max-width: 600px; background-color: #FCFBFC; border: 1px solid #e5e5e5;">
          <tr>
            <td style="padding: 50px 40px; background-color: #000000; text-align: center;">
              <h1 style="margin: 0; font-family: 'Bodoni Moda', Georgia, serif; font-size: 28px; font-weight: 400; color: #ffffff; letter-spacing: 2px; text-transform: uppercase;">
                Invitation personnelle
              </h1>
            </td>
          </tr>
          <tr>
            <td style="padding: 40px;">
              <p style="margin: 0 0 16px 0; font-family: 'Raleway', Arial, sans-serif; font-size: 16px; line-height: 1.6; color: #1a1a1a;">
                Cher ${customer.name},
              </p>
              <p style="margin: 0 0 24px 0; font-family: 'Raleway', Arial, sans-serif; font-size: 16px; line-height: 1.6; color: #1a1a1a;">
                Nous serions ravis de vous accueillir dans nos ateliers pour une visite privée. Découvrez notre savoir-faire de près et échangez avec nos artisans sur votre prochain projet.
              </p>
              <div style="text-align: center; margin: 32px 0;">
                <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://bk-agencements.com'}/contact?type=vip-visit" style="display: inline-block; padding: 16px 40px; background-color: #000000; color: #ffffff; text-decoration: none; font-family: 'Raleway', Arial, sans-serif; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">
                  Réserver ma visite
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
    text: `Invitation personnelle\n\nCher ${customer.name},\n\nNous serions ravis de vous accueillir dans nos ateliers pour une visite privée.`,
    subject: 'Invitation personnelle — Visite de nos ateliers',
  }
}

/**
 * VIP Flow Configuration
 */
export const vipFlowConfig = {
  email1: {
    delay: 0, // Immediate
    template: generateVIPEmail1,
    subject: 'Bienvenue dans notre cercle privilégié',
  },
  email2: {
    delay: 30 * 24 * 60 * 60 * 1000, // 30 days
    template: generateVIPEmail2,
    subject: 'Accès exclusif — Nouvelle collection',
  },
  email3: {
    delay: 90 * 24 * 60 * 60 * 1000, // 90 days
    template: generateVIPEmail3,
    subject: 'Invitation personnelle — Visite de nos ateliers',
  },
}




