/**
 * Quote Request Follow-up Flow
 * 3-step sequence for high-ticket furniture (600€–6000€+)
 * Luxury tone, confident, persuasive
 */

export interface Quote {
  id: string
  customerName: string
  email: string
  phone: string
  projectType: string
  budget: string
  message: string
  createdAt: Date
  quoteAmount?: number
}

/**
 * Email 1: Value Reinforcement (Sent 3 days after quote request)
 */
export function generateQuoteFollowupEmail1({ quote }: { quote: Quote }): {
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
  <title>Votre projet d'exception</title>
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
                Votre projet d'exception
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
                Il y a quelques jours, vous nous avez confié votre vision d'un agencement intérieur d'exception. Nous souhaitons vous rappeler que chaque projet que nous réalisons est une œuvre unique, façonnée avec passion et savoir-faire.
              </p>

              <!-- Value Proposition -->
              <div style="background-color: #f7f5f2; padding: 24px; margin: 24px 0;">
                <h3 style="margin: 0 0 16px 0; font-family: 'Bodoni Moda', Georgia, serif; font-size: 18px; font-weight: 400; color: #000000; text-transform: uppercase; letter-spacing: 1px;">
                  Pourquoi choisir BK Agencements
                </h3>
                <p style="margin: 0 0 12px 0; font-family: 'Raleway', Arial, sans-serif; font-size: 14px; color: #1a1a1a; line-height: 1.8;">
                  <strong>Artisanat d'exception:</strong> Chaque pièce est créée sur-mesure par nos maîtres artisans marocains, alliant tradition et modernité.
                </p>
                <p style="margin: 0 0 12px 0; font-family: 'Raleway', Arial, sans-serif; font-size: 14px; color: #1a1a1a; line-height: 1.8;">
                  <strong>Matériaux nobles:</strong> Nous sélectionnons les plus beaux bois, tissus et finitions pour garantir une qualité irréprochable.
                </p>
                <p style="margin: 0; font-family: 'Raleway', Arial, sans-serif; font-size: 14px; color: #1a1a1a; line-height: 1.8;">
                  <strong>Accompagnement personnalisé:</strong> De la conception à la livraison, nous vous accompagnons à chaque étape de votre projet.
                </p>
              </div>

              <!-- CTA -->
              <div style="text-align: center; margin: 32px 0;">
                <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://bk-agencements.com'}/contact" style="display: inline-block; padding: 16px 40px; background-color: #000000; color: #ffffff; text-decoration: none; font-family: 'Raleway', Arial, sans-serif; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; font-weight: 500;">
                  Discuter de mon projet
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
VOTRE PROJET D'EXCEPTION

Bonjour ${quote.customerName},

Il y a quelques jours, vous nous avez confié votre vision d'un agencement intérieur d'exception. Nous souhaitons vous rappeler que chaque projet que nous réalisons est une œuvre unique, façonnée avec passion et savoir-faire.

POURQUOI CHOISIR BK AGENCEMENTS

Artisanat d'exception: Chaque pièce est créée sur-mesure par nos maîtres artisans marocains, alliant tradition et modernité.

Matériaux nobles: Nous sélectionnons les plus beaux bois, tissus et finitions pour garantir une qualité irréprochable.

Accompagnement personnalisé: De la conception à la livraison, nous vous accompagnons à chaque étape de votre projet.

Discuter de mon projet: ${process.env.NEXT_PUBLIC_SITE_URL || 'https://bk-agencements.com'}/contact

BK Agencements — Mobilier sur-mesure d'exception
  `.trim()

  return {
    html,
    text,
    subject: 'Votre projet d\'agencement intérieur d\'exception',
  }
}

/**
 * Email 2: Social Proof & Testimonials (Sent 7 days after quote request)
 */
export function generateQuoteFollowupEmail2({ quote }: { quote: Quote }): {
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
  <title>Ils nous ont fait confiance</title>
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
                Ils nous ont fait confiance
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
                Depuis plus de 20 ans, nous transformons les intérieurs de nos clients en espaces d'exception. Leur satisfaction est notre plus grande récompense.
              </p>

              <!-- Testimonial -->
              <div style="background-color: #f7f5f2; padding: 24px; margin: 24px 0; border-left: 4px solid #000000;">
                <p style="margin: 0 0 12px 0; font-family: 'Raleway', Arial, sans-serif; font-size: 14px; color: #1a1a1a; line-height: 1.8; font-style: italic;">
                  "BK Agencements a transformé notre salon en un véritable écrin de raffinement. Le mobilier sur-mesure dépasse toutes nos attentes. Un savoir-faire exceptionnel."
                </p>
                <p style="margin: 0; font-family: 'Raleway', Arial, sans-serif; font-size: 12px; color: #666666; text-align: right;">
                  — Client satisfait, Casablanca
                </p>
              </div>

              <!-- Portfolio CTA -->
              <div style="text-align: center; margin: 32px 0;">
                <p style="margin: 0 0 16px 0; font-family: 'Raleway', Arial, sans-serif; font-size: 14px; color: #666666;">
                  Découvrez nos réalisations
                </p>
                <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://bk-agencements.com'}/projets" style="display: inline-block; padding: 16px 40px; background-color: #000000; color: #ffffff; text-decoration: none; font-family: 'Raleway', Arial, sans-serif; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; font-weight: 500;">
                  Voir nos projets
                </a>
              </div>

              <!-- Contact CTA -->
              <div style="text-align: center; margin: 24px 0;">
                <p style="margin: 0; font-family: 'Raleway', Arial, sans-serif; font-size: 14px; color: #1a1a1a;">
                  Prêt à donner vie à votre projet ?
                </p>
                <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://bk-agencements.com'}/contact" style="color: #000000; text-decoration: underline; font-family: 'Raleway', Arial, sans-serif; font-size: 14px; margin-top: 8px; display: inline-block;">
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
ILS NOUS ONT FAIT CONFIANCE

Bonjour ${quote.customerName},

Depuis plus de 20 ans, nous transformons les intérieurs de nos clients en espaces d'exception. Leur satisfaction est notre plus grande récompense.

TÉMOIGNAGE
"BK Agencements a transformé notre salon en un véritable écrin de raffinement. Le mobilier sur-mesure dépasse toutes nos attentes. Un savoir-faire exceptionnel."
— Client satisfait, Casablanca

Découvrez nos réalisations: ${process.env.NEXT_PUBLIC_SITE_URL || 'https://bk-agencements.com'}/projets

Prêt à donner vie à votre projet ? Contactez-nous: ${process.env.NEXT_PUBLIC_SITE_URL || 'https://bk-agencements.com'}/contact

BK Agencements — Mobilier sur-mesure d'exception
  `.trim()

  return {
    html,
    text,
    subject: 'Ils nous ont fait confiance — Découvrez nos réalisations',
  }
}

/**
 * Email 3: Final Call with Urgency (Sent 14 days after quote request)
 */
export function generateQuoteFollowupEmail3({ quote }: { quote: Quote }): {
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
  <title>Un dernier mot</title>
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
                Un dernier mot
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
                Nous comprenons que chaque projet mérite réflexion. Si vous avez des questions, des doutes, ou souhaitez simplement discuter de votre vision, nous sommes là pour vous.
              </p>

              <!-- Personal Touch -->
              <div style="background-color: #fff9e6; border-left: 4px solid #d4af37; padding: 20px; margin: 24px 0;">
                <p style="margin: 0; font-family: 'Raleway', Arial, sans-serif; font-size: 14px; color: #1a1a1a; line-height: 1.8;">
                  <strong>Notre engagement:</strong> Nous croyons que votre intérieur mérite le meilleur. C'est pourquoi nous mettons tout notre savoir-faire et notre passion au service de votre projet.
                </p>
              </div>

              <!-- CTA -->
              <div style="text-align: center; margin: 32px 0;">
                <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://bk-agencements.com'}/contact" style="display: inline-block; padding: 16px 40px; background-color: #000000; color: #ffffff; text-decoration: none; font-family: 'Raleway', Arial, sans-serif; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; font-weight: 500;">
                  Discutons de votre projet
                </a>
              </div>

              <!-- Alternative -->
              <div style="text-align: center; margin: 24px 0;">
                <p style="margin: 0; font-family: 'Raleway', Arial, sans-serif; font-size: 14px; color: #666666;">
                  Ou appelez-nous directement pour un échange plus personnel
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
UN DERNIER MOT

Bonjour ${quote.customerName},

Nous comprenons que chaque projet mérite réflexion. Si vous avez des questions, des doutes, ou souhaitez simplement discuter de votre vision, nous sommes là pour vous.

NOTRE ENGAGEMENT
Nous croyons que votre intérieur mérite le meilleur. C'est pourquoi nous mettons tout notre savoir-faire et notre passion au service de votre projet.

Discutons de votre projet: ${process.env.NEXT_PUBLIC_SITE_URL || 'https://bk-agencements.com'}/contact

Ou appelez-nous directement pour un échange plus personnel.

BK Agencements — Mobilier sur-mesure d'exception
  `.trim()

  return {
    html,
    text,
    subject: 'Un dernier mot — Discutons de votre projet',
  }
}

/**
 * Quote Follow-up Flow Configuration
 */
export const quoteFollowupFlowConfig = {
  email1: {
    delay: 3 * 24 * 60 * 60 * 1000, // 3 days
    template: generateQuoteFollowupEmail1,
    subject: 'Votre projet d\'agencement intérieur d\'exception',
  },
  email2: {
    delay: 7 * 24 * 60 * 60 * 1000, // 7 days
    template: generateQuoteFollowupEmail2,
    subject: 'Ils nous ont fait confiance — Découvrez nos réalisations',
  },
  email3: {
    delay: 14 * 24 * 60 * 60 * 1000, // 14 days
    template: generateQuoteFollowupEmail3,
    subject: 'Un dernier mot — Discutons de votre projet',
  },
}




