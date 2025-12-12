/**
 * Monthly Newsletter System
 * 12 newsletter topics for high-end furniture & interior design brand
 */

export interface NewsletterTopic {
  month: string
  subject: string
  thumbnail: string
  content: {
    headline: string
    sections: string[]
    cta: string
  }
}

export const newsletterTopics: NewsletterTopic[] = [
  {
    month: 'Janvier',
    subject: 'Nouvelle année, nouvel intérieur — Nos inspirations 2024',
    thumbnail: '/newsletter/janvier-inspirations.jpg',
    content: {
      headline: 'Démarrez l\'année avec un intérieur d\'exception',
      sections: [
        'Tendances design 2024 : les couleurs et matériaux à suivre',
        'Nos nouvelles collections de mobilier sur-mesure',
        'Témoignages clients : transformations d\'intérieurs',
        'Conseils d\'experts : comment choisir son mobilier sur-mesure',
      ],
      cta: 'Découvrir nos collections',
    },
  },
  {
    month: 'Février',
    subject: 'L\'art de l\'amour : créer un intérieur romantique',
    thumbnail: '/newsletter/fevrier-romantique.jpg',
    content: {
      headline: 'Transformez votre intérieur en havre de paix',
      sections: [
        'Ambiance romantique : éclairage et textiles',
        'Mobilier d\'exception pour chambres à coucher',
        'Matériaux nobles : velours, soie, bois précieux',
        'Réalisations : projets résidentiels intimistes',
      ],
      cta: 'Voir nos réalisations',
    },
  },
  {
    month: 'Mars',
    subject: 'Printemps : renouveau et design contemporain',
    thumbnail: '/newsletter/mars-printemps.jpg',
    content: {
      headline: 'Le printemps s\'invite dans votre intérieur',
      sections: [
        'Nouveautés printanières : collections fraîches et modernes',
        'Agencement d\'espaces lumineux et aérés',
        'Matériaux naturels : bois clairs, tissus légers',
        'Projets commerciaux : restaurants et hôtels',
      ],
      cta: 'Découvrir nos nouveautés',
    },
  },
  {
    month: 'Avril',
    subject: 'Artisanat marocain : savoir-faire d\'exception',
    thumbnail: '/newsletter/avril-artisanat.jpg',
    content: {
      headline: 'Découvrez nos ateliers et notre savoir-faire',
      sections: [
        'Visite virtuelle de nos ateliers au Maroc',
        'Les métiers d\'art : menuiserie, tapisserie, ferronnerie',
        'Processus de fabrication : de la conception à la livraison',
        'Portraits d\'artisans : rencontres avec nos maîtres',
      ],
      cta: 'En savoir plus sur notre savoir-faire',
    },
  },
  {
    month: 'Mai',
    subject: 'Luxe et élégance : mobilier haut de gamme',
    thumbnail: '/newsletter/mai-luxe.jpg',
    content: {
      headline: 'L\'élégance à la française rencontre l\'artisanat marocain',
      sections: [
        'Collections premium : pièces uniques et exclusives',
        'Matériaux de luxe : marbre, cuir, bois exotiques',
        'Finitions sur-mesure : patines et vernis personnalisés',
        'Projets VIP : réalisations pour clients exigeants',
      ],
      cta: 'Découvrir nos collections premium',
    },
  },
  {
    month: 'Juin',
    subject: 'Été : espaces de vie ouverts et conviviaux',
    thumbnail: '/newsletter/juin-ete.jpg',
    content: {
      headline: 'Créez des espaces de vie estivaux',
      sections: [
        'Mobilier pour terrasses et espaces extérieurs',
        'Agencement de salles à manger conviviales',
        'Matériaux résistants : teck, aluminium, résine',
        'Projets résidentiels : villas et maisons d\'architecte',
      ],
      cta: 'Voir nos projets résidentiels',
    },
  },
  {
    month: 'Juillet',
    subject: 'Vacances : inspirations méditerranéennes',
    thumbnail: '/newsletter/juillet-mediterranee.jpg',
    content: {
      headline: 'Inspirations méditerranéennes pour votre intérieur',
      sections: [
        'Style méditerranéen : couleurs chaudes et matériaux naturels',
        'Mobilier d\'extérieur : pergolas et espaces de détente',
        'Projets hôteliers : chambres et suites d\'exception',
        'Conseils : entretenir son mobilier en extérieur',
      ],
      cta: 'Découvrir nos inspirations',
    },
  },
  {
    month: 'Août',
    subject: 'Rentrée : préparer son intérieur pour l\'automne',
    thumbnail: '/newsletter/aout-rentree.jpg',
    content: {
      headline: 'Préparez votre intérieur pour la rentrée',
      sections: [
        'Nouveautés automne : collections chaleureuses',
        'Agencement de bureaux et espaces de travail',
        'Bibliothèques et rangements sur-mesure',
        'Conseils : optimiser l\'espace dans son intérieur',
      ],
      cta: 'Voir nos solutions de rangement',
    },
  },
  {
    month: 'Septembre',
    subject: 'Design scandinave : minimalisme et fonctionnalité',
    thumbnail: '/newsletter/septembre-scandinave.jpg',
    content: {
      headline: 'Le minimalisme scandinave revisité',
      sections: [
        'Style nordique : lignes épurées et fonctionnalité',
        'Mobilier modulaire et adaptable',
        'Matériaux naturels : bois clairs, textiles doux',
        'Projets : appartements modernes et espaces réduits',
      ],
      cta: 'Découvrir notre style scandinave',
    },
  },
  {
    month: 'Octobre',
    subject: 'Automne : chaleur et convivialité',
    thumbnail: '/newsletter/octobre-automne.jpg',
    content: {
      headline: 'Créez une ambiance chaleureuse pour l\'automne',
      sections: [
        'Couleurs automnales : marrons, beiges, ors',
        'Mobilier de salon : canapés et fauteuils confortables',
        'Éclairage d\'ambiance : lampes et appliques sur-mesure',
        'Conseils : créer une atmosphère cosy',
      ],
      cta: 'Voir nos collections automne',
    },
  },
  {
    month: 'Novembre',
    subject: 'Noël approche : préparer son intérieur pour les fêtes',
    thumbnail: '/newsletter/novembre-noel.jpg',
    content: {
      headline: 'Préparez votre intérieur pour les fêtes',
      sections: [
        'Mobilier pour recevoir : tables extensibles, buffets',
        'Décorations de Noël : créations artisanales',
        'Agencement de salles de réception',
        'Conseils : organiser un dîner d\'exception',
      ],
      cta: 'Découvrir nos solutions pour recevoir',
    },
  },
  {
    month: 'Décembre',
    subject: 'Bilan de l\'année : nos plus belles réalisations',
    thumbnail: '/newsletter/decembre-bilan.jpg',
    content: {
      headline: 'Retour sur une année d\'excellence',
      sections: [
        'Nos plus belles réalisations de l\'année',
        'Témoignages clients : projets marquants',
        'Nouveautés à venir en 2025',
        'Remerciements et vœux de fin d\'année',
      ],
      cta: 'Découvrir nos réalisations',
    },
  },
]

/**
 * Generate newsletter email template
 */
export function generateNewsletterEmail(topic: NewsletterTopic): {
  html: string
  text: string
  subject: string
} {
  const sectionsHtml = topic.content.sections
    .map(
      (section) => `
      <li style="margin: 8px 0; font-family: 'Raleway', Arial, sans-serif; font-size: 14px; color: #1a1a1a; line-height: 1.6;">
        ${section}
      </li>
    `
    )
    .join('')

  const html = `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${topic.subject}</title>
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
                ${topic.content.headline}
              </h1>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 40px;">
              <p style="margin: 0 0 24px 0; font-family: 'Raleway', Arial, sans-serif; font-size: 16px; line-height: 1.6; color: #1a1a1a;">
                Bonjour,
              </p>
              <p style="margin: 0 0 24px 0; font-family: 'Raleway', Arial, sans-serif; font-size: 16px; line-height: 1.6; color: #1a1a1a;">
                Ce mois-ci, nous vous proposons de découvrir ${topic.content.headline.toLowerCase()}.
              </p>

              <!-- Sections -->
              <div style="background-color: #f7f5f2; padding: 24px; margin: 24px 0;">
                <ul style="margin: 0; padding-left: 20px; list-style: none;">
                  ${sectionsHtml}
                </ul>
              </div>

              <!-- CTA -->
              <div style="text-align: center; margin: 32px 0;">
                <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://bk-agencements.com'}/boutique" style="display: inline-block; padding: 16px 40px; background-color: #000000; color: #ffffff; text-decoration: none; font-family: 'Raleway', Arial, sans-serif; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; font-weight: 500;">
                  ${topic.content.cta}
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
              <p style="margin: 12px 0 0 0; font-family: 'Raleway', Arial, sans-serif; font-size: 11px; color: #999999;">
                <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://bk-agencements.com'}/unsubscribe" style="color: #999999; text-decoration: underline;">Se désabonner</a>
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
${topic.content.headline.toUpperCase()}

Bonjour,

Ce mois-ci, nous vous proposons de découvrir ${topic.content.headline.toLowerCase()}.

${topic.content.sections.map((s, i) => `${i + 1}. ${s}`).join('\n')}

${topic.content.cta}: ${process.env.NEXT_PUBLIC_SITE_URL || 'https://bk-agencements.com'}/boutique

BK Agencements — Mobilier sur-mesure d'exception

Se désabonner: ${process.env.NEXT_PUBLIC_SITE_URL || 'https://bk-agencements.com'}/unsubscribe
  `.trim()

  return {
    html,
    text,
    subject: topic.subject,
  }
}




