/**
 * Customer Onboarding Email Flow
 * 4-email luxury sequence for new customers
 */

export interface NewCustomer {
  name: string
  email: string
  firstOrderDate?: Date
}

/**
 * Email 1: Welcome (Sent immediately after first order)
 */
export function generateOnboardingEmail1({ customer }: { customer: NewCustomer }): {
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
  <title>Bienvenue chez BK Agencements</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f7f5f2; font-family: 'Raleway', Arial, sans-serif;">
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f7f5f2; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="max-width: 600px; background-color: #FCFBFC; border: 1px solid #e5e5e5;">
          <!-- Header -->
          <tr>
            <td style="padding: 50px 40px; background-color: #000000; text-align: center;">
              <h1 style="margin: 0; font-family: 'Bodoni Moda', Georgia, serif; font-size: 32px; font-weight: 400; color: #ffffff; letter-spacing: 2px; text-transform: uppercase; line-height: 1.2;">
                Bienvenue
              </h1>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 40px;">
              <p style="margin: 0 0 16px 0; font-family: 'Raleway', Arial, sans-serif; font-size: 16px; line-height: 1.6; color: #1a1a1a;">
                Bonjour ${customer.name},
              </p>
              <p style="margin: 0 0 24px 0; font-family: 'Raleway', Arial, sans-serif; font-size: 16px; line-height: 1.6; color: #1a1a1a;">
                Nous sommes ravis de vous accueillir dans l'univers BK Agencements. Merci de nous avoir fait confiance pour votre projet d'agencement intérieur.
              </p>

              <p style="margin: 0 0 24px 0; font-family: 'Raleway', Arial, sans-serif; font-size: 16px; line-height: 1.6; color: #1a1a1a;">
                Chez BK Agencements, nous créons des espaces uniques qui reflètent votre personnalité et votre style. Chaque pièce est façonnée avec passion par nos artisans marocains, alliant savoir-faire traditionnel et design contemporain.
              </p>

              <!-- CTA -->
              <div style="text-align: center; margin: 32px 0;">
                <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://bk-agencements.com'}/boutique" style="display: inline-block; padding: 16px 40px; background-color: #000000; color: #ffffff; text-decoration: none; font-family: 'Raleway', Arial, sans-serif; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; font-weight: 500;">
                  Découvrir notre collection
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
BIENVENUE CHEZ BK AGENCEMENTS

Bonjour ${customer.name},

Nous sommes ravis de vous accueillir dans l'univers BK Agencements. Merci de nous avoir fait confiance pour votre projet d'agencement intérieur.

Chez BK Agencements, nous créons des espaces uniques qui reflètent votre personnalité et votre style. Chaque pièce est façonnée avec passion par nos artisans marocains, alliant savoir-faire traditionnel et design contemporain.

Découvrir notre collection: ${process.env.NEXT_PUBLIC_SITE_URL || 'https://bk-agencements.com'}/boutique

BK Agencements — Mobilier sur-mesure d'exception
  `.trim()

  return {
    html,
    text,
    subject: 'Bienvenue chez BK Agencements',
  }
}

/**
 * Email 2: Brand Story (Sent 2 days after welcome)
 */
export function generateOnboardingEmail2({ customer }: { customer: NewCustomer }): {
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
  <title>Notre histoire</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f7f5f2; font-family: 'Raleway', Arial, sans-serif;">
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f7f5f2; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="max-width: 600px; background-color: #FCFBFC; border: 1px solid #e5e5e5;">
          <!-- Header -->
          <tr>
            <td style="padding: 50px 40px; background-color: #000000; text-align: center;">
              <h1 style="margin: 0; font-family: 'Bodoni Moda', Georgia, serif; font-size: 28px; font-weight: 400; color: #ffffff; letter-spacing: 2px; text-transform: uppercase; line-height: 1.2;">
                Notre histoire
              </h1>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 40px;">
              <p style="margin: 0 0 16px 0; font-family: 'Raleway', Arial, sans-serif; font-size: 16px; line-height: 1.6; color: #1a1a1a;">
                Bonjour ${customer.name},
              </p>
              <p style="margin: 0 0 24px 0; font-family: 'Raleway', Arial, sans-serif; font-size: 16px; line-height: 1.6; color: #1a1a1a;">
                Depuis plus de 20 ans, BK Agencements crée des espaces d'exception au Maroc. Notre passion pour l'artisanat et le design nous pousse à repousser les limites de la création.
              </p>

              <p style="margin: 0 0 24px 0; font-family: 'Raleway', Arial, sans-serif; font-size: 16px; line-height: 1.6; color: #1a1a1a;">
                Chaque projet que nous réalisons est une collaboration unique entre nos artisans et nos clients. Nous croyons que votre intérieur doit être le reflet de votre personnalité, et c'est cette conviction qui guide chaque création.
              </p>

              <!-- CTA -->
              <div style="text-align: center; margin: 32px 0;">
                <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://bk-agencements.com'}/about" style="display: inline-block; padding: 16px 40px; background-color: #000000; color: #ffffff; text-decoration: none; font-family: 'Raleway', Arial, sans-serif; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; font-weight: 500;">
                  En savoir plus
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
NOTRE HISTOIRE

Bonjour ${customer.name},

Depuis plus de 20 ans, BK Agencements crée des espaces d'exception au Maroc. Notre passion pour l'artisanat et le design nous pousse à repousser les limites de la création.

Chaque projet que nous réalisons est une collaboration unique entre nos artisans et nos clients. Nous croyons que votre intérieur doit être le reflet de votre personnalité, et c'est cette conviction qui guide chaque création.

En savoir plus: ${process.env.NEXT_PUBLIC_SITE_URL || 'https://bk-agencements.com'}/about

BK Agencements — Mobilier sur-mesure d'exception
  `.trim()

  return {
    html,
    text,
    subject: 'Notre histoire — 20 ans d\'excellence',
  }
}

/**
 * Email 3: Workshop & Craftsmanship (Sent 5 days after welcome)
 */
export function generateOnboardingEmail3({ customer }: { customer: NewCustomer }): {
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
  <title>Notre savoir-faire</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f7f5f2; font-family: 'Raleway', Arial, sans-serif;">
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f7f5f2; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="max-width: 600px; background-color: #FCFBFC; border: 1px solid #e5e5e5;">
          <!-- Header -->
          <tr>
            <td style="padding: 50px 40px; background-color: #000000; text-align: center;">
              <h1 style="margin: 0; font-family: 'Bodoni Moda', Georgia, serif; font-size: 28px; font-weight: 400; color: #ffffff; letter-spacing: 2px; text-transform: uppercase; line-height: 1.2;">
                Notre savoir-faire
              </h1>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 40px;">
              <p style="margin: 0 0 16px 0; font-family: 'Raleway', Arial, sans-serif; font-size: 16px; line-height: 1.6; color: #1a1a1a;">
                Bonjour ${customer.name},
              </p>
              <p style="margin: 0 0 24px 0; font-family: 'Raleway', Arial, sans-serif; font-size: 16px; line-height: 1.6; color: #1a1a1a;">
                Dans nos ateliers au Maroc, nos maîtres artisans façonnent chaque pièce avec un savoir-faire transmis de génération en génération. Menuiserie, tapisserie, ferronnerie : chaque métier est maîtrisé à la perfection.
              </p>

              <!-- Craftsmanship Details -->
              <div style="background-color: #f7f5f2; padding: 24px; margin: 24px 0;">
                <h3 style="margin: 0 0 16px 0; font-family: 'Bodoni Moda', Georgia, serif; font-size: 18px; font-weight: 400; color: #000000; text-transform: uppercase; letter-spacing: 1px;">
                  Nos métiers d'art
                </h3>
                <ul style="margin: 0; padding-left: 20px; font-family: 'Raleway', Arial, sans-serif; font-size: 14px; color: #1a1a1a; line-height: 1.8;">
                  <li><strong>Menuiserie:</strong> Bois massifs sélectionnés, assemblages traditionnels, finitions sur-mesure</li>
                  <li><strong>Tapisserie:</strong> Tissus et cuirs de luxe, mousses haute densité, finitions impeccables</li>
                  <li><strong>Ferronnerie:</strong> Structures métalliques sur-mesure, finitions patinées ou modernes</li>
                </ul>
              </div>

              <!-- CTA -->
              <div style="text-align: center; margin: 32px 0;">
                <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://bk-agencements.com'}/projets" style="display: inline-block; padding: 16px 40px; background-color: #000000; color: #ffffff; text-decoration: none; font-family: 'Raleway', Arial, sans-serif; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; font-weight: 500;">
                  Voir nos réalisations
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
NOTRE SAVOIR-FAIRE

Bonjour ${customer.name},

Dans nos ateliers au Maroc, nos maîtres artisans façonnent chaque pièce avec un savoir-faire transmis de génération en génération. Menuiserie, tapisserie, ferronnerie : chaque métier est maîtrisé à la perfection.

NOS MÉTIERS D'ART
• Menuiserie: Bois massifs sélectionnés, assemblages traditionnels, finitions sur-mesure
• Tapisserie: Tissus et cuirs de luxe, mousses haute densité, finitions impeccables
• Ferronnerie: Structures métalliques sur-mesure, finitions patinées ou modernes

Voir nos réalisations: ${process.env.NEXT_PUBLIC_SITE_URL || 'https://bk-agencements.com'}/projets

BK Agencements — Mobilier sur-mesure d'exception
  `.trim()

  return {
    html,
    text,
    subject: 'Notre savoir-faire - L\'art de l\'artisanat',
  }
}

/**
 * Email 4: Exclusive Offers (Sent 10 days after welcome)
 */
export function generateOnboardingEmail4({ customer }: { customer: NewCustomer }): {
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
  <title>Offre exclusive</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f7f5f2; font-family: 'Raleway', Arial, sans-serif;">
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f7f5f2; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="max-width: 600px; background-color: #FCFBFC; border: 1px solid #e5e5e5;">
          <!-- Header -->
          <tr>
            <td style="padding: 50px 40px; background-color: #000000; text-align: center;">
              <h1 style="margin: 0; font-family: 'Bodoni Moda', Georgia, serif; font-size: 28px; font-weight: 400; color: #ffffff; letter-spacing: 2px; text-transform: uppercase; line-height: 1.2;">
                Offre exclusive
              </h1>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 40px;">
              <p style="margin: 0 0 16px 0; font-family: 'Raleway', Arial, sans-serif; font-size: 16px; line-height: 1.6; color: #1a1a1a;">
                Bonjour ${customer.name},
              </p>
              <p style="margin: 0 0 24px 0; font-family: 'Raleway', Arial, sans-serif; font-size: 16px; line-height: 1.6; color: #1a1a1a;">
                En tant que nouveau client, nous souhaitons vous offrir une consultation gratuite pour votre prochain projet d'agencement intérieur.
              </p>

              <!-- Offer Details -->
              <div style="background-color: #fff9e6; border-left: 4px solid #d4af37; padding: 24px; margin: 24px 0;">
                <h3 style="margin: 0 0 16px 0; font-family: 'Bodoni Moda', Georgia, serif; font-size: 18px; font-weight: 400; color: #000000; text-transform: uppercase; letter-spacing: 1px;">
                  Votre avantage client
                </h3>
                <ul style="margin: 0; padding-left: 20px; font-family: 'Raleway', Arial, sans-serif; font-size: 14px; color: #1a1a1a; line-height: 1.8;">
                  <li>Consultation personnalisée gratuite</li>
                  <li>Accès à notre catalogue exclusif</li>
                  <li>Accompagnement dédié pour votre projet</li>
                  <li>Priorité sur les créations sur-mesure</li>
                </ul>
              </div>

              <!-- CTA -->
              <div style="text-align: center; margin: 32px 0;">
                <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://bk-agencements.com'}/contact" style="display: inline-block; padding: 16px 40px; background-color: #000000; color: #ffffff; text-decoration: none; font-family: 'Raleway', Arial, sans-serif; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; font-weight: 500;">
                  Réserver ma consultation
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
OFFRE EXCLUSIVE

Bonjour ${customer.name},

En tant que nouveau client, nous souhaitons vous offrir une consultation gratuite pour votre prochain projet d'agencement intérieur.

VOTRE AVANTAGE CLIENT
• Consultation personnalisée gratuite
• Accès à notre catalogue exclusif
• Accompagnement dédié pour votre projet
• Priorité sur les créations sur-mesure

Réserver ma consultation: ${process.env.NEXT_PUBLIC_SITE_URL || 'https://bk-agencements.com'}/contact

BK Agencements — Mobilier sur-mesure d'exception
  `.trim()

  return {
    html,
    text,
    subject: 'Offre exclusive — Consultation gratuite',
  }
}

/**
 * Onboarding Flow Configuration
 */
export const onboardingFlowConfig = {
  email1: {
    delay: 0, // Immediate
    template: generateOnboardingEmail1,
    subject: 'Bienvenue chez BK Agencements',
  },
  email2: {
    delay: 2 * 24 * 60 * 60 * 1000, // 2 days
    template: generateOnboardingEmail2,
    subject: 'Notre histoire — 20 ans d\'excellence',
  },
  email3: {
    delay: 5 * 24 * 60 * 60 * 1000, // 5 days
    template: generateOnboardingEmail3,
    subject: 'Notre savoir-faire — L\'art de l\'artisanat',
  },
  email4: {
    delay: 10 * 24 * 60 * 60 * 1000, // 10 days
    template: generateOnboardingEmail4,
    subject: 'Offre exclusive — Consultation gratuite',
  },
}




