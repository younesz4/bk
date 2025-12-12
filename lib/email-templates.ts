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
  createdAt: string
  items: OrderItem[]
}

interface EmailTemplateOptions {
  order: Order
  estimatedDeliveryDays?: number
}

interface StatusChangeEmailOptions {
  orderId: string
  oldStatus: string
  newStatus: string
  changedAt: string
}

/**
 * Generate admin notification email template
 */
export function generateAdminNotificationEmail({ order }: EmailTemplateOptions): {
  html: string
  text: string
  subject: string
} {
  const orderDate = new Date(order.createdAt).toLocaleString('fr-FR', {
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
        <td style="padding: 16px 12px; border-bottom: 1px solid #e5e5e5; font-family: 'Helvetica Neue', Arial, sans-serif; font-size: 14px; color: #1a1a1a;">
          ${item.product.name}
        </td>
        <td style="padding: 16px 12px; border-bottom: 1px solid #e5e5e5; font-family: 'Helvetica Neue', Arial, sans-serif; font-size: 14px; color: #1a1a1a; text-align: center;">
          ${item.quantity}
        </td>
        <td style="padding: 16px 12px; border-bottom: 1px solid #e5e5e5; font-family: 'Helvetica Neue', Arial, sans-serif; font-size: 14px; color: #1a1a1a; text-align: right; font-weight: 500;">
          ${new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: 'EUR',
          }).format((item.price / 100) * item.quantity)}
        </td>
      </tr>
    `
    )
    .join('')

  const productsListText = order.items
    .map(
      (item) =>
        `- ${item.product.name} (x${item.quantity}) - ${new Intl.NumberFormat('fr-FR', {
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
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>Nouvelle commande</title>
  <!--[if mso]>
  <style type="text/css">
    body, table, td {font-family: Arial, sans-serif !important;}
  </style>
  <![endif]-->
</head>
<body style="margin: 0; padding: 0; background-color: #f5f5f5; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale;">
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f5f5f5; padding: 40px 0;">
    <tr>
      <td align="center">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="max-width: 600px; background-color: #ffffff; border-radius: 0; box-shadow: 0 2px 8px rgba(0,0,0,0.08);">
          <!-- Header -->
          <tr>
            <td style="padding: 40px 40px 30px 40px; background-color: #000000; border-radius: 0 0 0 0;">
              <h1 style="margin: 0; font-family: 'Georgia', 'Times New Roman', serif; font-size: 28px; font-weight: 400; color: #ffffff; letter-spacing: 1px; text-transform: uppercase;">
                Nouvelle commande
              </h1>
            </td>
          </tr>

          <!-- Order Info Section -->
          <tr>
            <td style="padding: 30px 40px; background-color: #fafafa; border-bottom: 1px solid #e5e5e5;">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                <tr>
                  <td>
                    <p style="margin: 0 0 8px 0; font-family: 'Helvetica Neue', Arial, sans-serif; font-size: 11px; color: #666666; text-transform: uppercase; letter-spacing: 0.5px;">
                      Numéro de commande
                    </p>
                    <p style="margin: 0; font-family: 'Helvetica Neue', Arial, sans-serif; font-size: 20px; font-weight: 600; color: #000000; letter-spacing: 1px;">
                      #${order.id.substring(0, 8)}
                    </p>
                  </td>
                  <td align="right">
                    <p style="margin: 0 0 8px 0; font-family: 'Helvetica Neue', Arial, sans-serif; font-size: 11px; color: #666666; text-transform: uppercase; letter-spacing: 0.5px;">
                      Date
                    </p>
                    <p style="margin: 0; font-family: 'Helvetica Neue', Arial, sans-serif; font-size: 14px; color: #1a1a1a;">
                      ${orderDate}
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Customer Info Section -->
          <tr>
            <td style="padding: 30px 40px;">
              <h2 style="margin: 0 0 20px 0; font-family: 'Georgia', 'Times New Roman', serif; font-size: 18px; font-weight: 400; color: #000000; text-transform: uppercase; letter-spacing: 1px;">
                Informations client
              </h2>
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                <tr>
                  <td style="padding: 8px 0; font-family: 'Helvetica Neue', Arial, sans-serif; font-size: 14px; color: #666666; width: 120px;">
                    Nom
                  </td>
                  <td style="padding: 8px 0; font-family: 'Helvetica Neue', Arial, sans-serif; font-size: 14px; color: #1a1a1a; font-weight: 500;">
                    ${order.customerName}
                  </td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-family: 'Helvetica Neue', Arial, sans-serif; font-size: 14px; color: #666666;">
                    Téléphone
                  </td>
                  <td style="padding: 8px 0; font-family: 'Helvetica Neue', Arial, sans-serif; font-size: 14px; color: #1a1a1a; font-weight: 500;">
                    ${order.phone}
                  </td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-family: 'Helvetica Neue', Arial, sans-serif; font-size: 14px; color: #666666;">
                    Email
                  </td>
                  <td style="padding: 8px 0; font-family: 'Helvetica Neue', Arial, sans-serif; font-size: 14px; color: #1a1a1a; font-weight: 500;">
                    ${order.email}
                  </td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-family: 'Helvetica Neue', Arial, sans-serif; font-size: 14px; color: #666666; vertical-align: top;">
                    Adresse
                  </td>
                  <td style="padding: 8px 0; font-family: 'Helvetica Neue', Arial, sans-serif; font-size: 14px; color: #1a1a1a; font-weight: 500;">
                    ${order.address}<br>
                    ${order.city}, ${order.country}
                  </td>
                </tr>
                ${order.notes
                  ? `
                <tr>
                  <td style="padding: 8px 0; font-family: 'Helvetica Neue', Arial, sans-serif; font-size: 14px; color: #666666; vertical-align: top;">
                    Notes
                  </td>
                  <td style="padding: 8px 0; font-family: 'Helvetica Neue', Arial, sans-serif; font-size: 14px; color: #1a1a1a;">
                    ${order.notes}
                  </td>
                </tr>
                `
                  : ''}
              </table>
            </td>
          </tr>

          <!-- Products Section -->
          <tr>
            <td style="padding: 0 40px 30px 40px;">
              <h2 style="margin: 0 0 20px 0; font-family: 'Georgia', 'Times New Roman', serif; font-size: 18px; font-weight: 400; color: #000000; text-transform: uppercase; letter-spacing: 1px;">
                Produits commandés
              </h2>
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="border-collapse: collapse;">
                <thead>
                  <tr style="background-color: #fafafa; border-bottom: 2px solid #000000;">
                    <th style="padding: 12px; text-align: left; font-family: 'Helvetica Neue', Arial, sans-serif; font-size: 11px; color: #666666; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 500;">
                      Produit
                    </th>
                    <th style="padding: 12px; text-align: center; font-family: 'Helvetica Neue', Arial, sans-serif; font-size: 11px; color: #666666; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 500;">
                      Quantité
                    </th>
                    <th style="padding: 12px; text-align: right; font-family: 'Helvetica Neue', Arial, sans-serif; font-size: 11px; color: #666666; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 500;">
                      Prix
                    </th>
                  </tr>
                </thead>
                <tbody>
                  ${productsListHtml}
                </tbody>
              </table>
            </td>
          </tr>

          <!-- Total Section -->
          <tr>
            <td style="padding: 30px 40px; background-color: #000000;">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                <tr>
                  <td align="right">
                    <p style="margin: 0; font-family: 'Georgia', 'Times New Roman', serif; font-size: 24px; font-weight: 400; color: #ffffff; letter-spacing: 1px;">
                      ${new Intl.NumberFormat('fr-FR', {
                        style: 'currency',
                        currency: 'EUR',
                      }).format(order.totalPrice / 100)}
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 30px 40px; background-color: #fafafa; border-top: 1px solid #e5e5e5;">
              <p style="margin: 0; font-family: 'Helvetica Neue', Arial, sans-serif; font-size: 12px; color: #999999; text-align: center;">
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
NOUVELLE COMMANDE REÇUE

Numéro de commande: #${order.id.substring(0, 8)}
Date: ${orderDate}

INFORMATIONS CLIENT
Nom: ${order.customerName}
Téléphone: ${order.phone}
Email: ${order.email}
Adresse: ${order.address}, ${order.city}, ${order.country}
${order.notes ? `Notes: ${order.notes}` : ''}

PRODUITS COMMANDÉS
${productsListText}

TOTAL: ${new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
  }).format(order.totalPrice / 100)}
  `.trim()

  return {
    html,
    text,
    subject: `Nouvelle commande #${order.id.substring(0, 8)} - ${order.customerName}`,
  }
}

/**
 * Generate customer confirmation email template
 */
export function generateCustomerConfirmationEmail({
  order,
  estimatedDeliveryDays = 21,
}: EmailTemplateOptions): {
  html: string
  text: string
  subject: string
} {
  const estimatedDeliveryDate = new Date(order.createdAt)
  estimatedDeliveryDate.setDate(estimatedDeliveryDate.getDate() + estimatedDeliveryDays)

  const productsListHtml = order.items
    .map(
      (item) => `
      <tr>
        <td style="padding: 16px 12px; border-bottom: 1px solid #e5e5e5; font-family: 'Helvetica Neue', Arial, sans-serif; font-size: 14px; color: #1a1a1a;">
          ${item.product.name}
        </td>
        <td style="padding: 16px 12px; border-bottom: 1px solid #e5e5e5; font-family: 'Helvetica Neue', Arial, sans-serif; font-size: 14px; color: #1a1a1a; text-align: center;">
          ${item.quantity}
        </td>
        <td style="padding: 16px 12px; border-bottom: 1px solid #e5e5e5; font-family: 'Helvetica Neue', Arial, sans-serif; font-size: 14px; color: #1a1a1a; text-align: right; font-weight: 500;">
          ${new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: 'EUR',
          }).format((item.price / 100) * item.quantity)}
        </td>
      </tr>
    `
    )
    .join('')

  const productsListText = order.items
    .map(
      (item) =>
        `- ${item.product.name} (x${item.quantity}) - ${new Intl.NumberFormat('fr-FR', {
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
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>Confirmation de commande</title>
  <!--[if mso]>
  <style type="text/css">
    body, table, td {font-family: Arial, sans-serif !important;}
  </style>
  <![endif]-->
</head>
<body style="margin: 0; padding: 0; background-color: #f5f5f5; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale;">
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f5f5f5; padding: 40px 0;">
    <tr>
      <td align="center">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="max-width: 600px; background-color: #ffffff; border-radius: 0; box-shadow: 0 2px 8px rgba(0,0,0,0.08);">
          <!-- Header -->
          <tr>
            <td style="padding: 50px 40px 40px 40px; background-color: #000000; border-radius: 0 0 0 0; text-align: center;">
              <h1 style="margin: 0; font-family: 'Georgia', 'Times New Roman', serif; font-size: 32px; font-weight: 400; color: #ffffff; letter-spacing: 2px; text-transform: uppercase; line-height: 1.2;">
                Merci pour votre commande
              </h1>
            </td>
          </tr>

          <!-- Thank You Message -->
          <tr>
            <td style="padding: 40px 40px 30px 40px;">
              <p style="margin: 0 0 16px 0; font-family: 'Helvetica Neue', Arial, sans-serif; font-size: 16px; line-height: 1.6; color: #1a1a1a;">
                Bonjour ${order.customerName},
              </p>
              <p style="margin: 0; font-family: 'Helvetica Neue', Arial, sans-serif; font-size: 16px; line-height: 1.6; color: #1a1a1a;">
                Nous avons bien reçu votre commande et nous vous en remercions. Votre commande est en cours de traitement.
              </p>
            </td>
          </tr>

          <!-- Order Number Section -->
          <tr>
            <td style="padding: 0 40px 30px 40px;">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #fafafa; border: 1px solid #e5e5e5;">
                <tr>
                  <td style="padding: 30px 40px; text-align: center;">
                    <p style="margin: 0 0 8px 0; font-family: 'Helvetica Neue', Arial, sans-serif; font-size: 11px; color: #666666; text-transform: uppercase; letter-spacing: 0.5px;">
                      Numéro de commande
                    </p>
                    <p style="margin: 0; font-family: 'Georgia', 'Times New Roman', serif; font-size: 32px; font-weight: 400; color: #000000; letter-spacing: 2px;">
                      #${order.id.substring(0, 8)}
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Order Summary Section -->
          <tr>
            <td style="padding: 0 40px 30px 40px;">
              <h2 style="margin: 0 0 20px 0; font-family: 'Georgia', 'Times New Roman', serif; font-size: 18px; font-weight: 400; color: #000000; text-transform: uppercase; letter-spacing: 1px;">
                Résumé de votre commande
              </h2>
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="border-collapse: collapse;">
                <thead>
                  <tr style="background-color: #fafafa; border-bottom: 2px solid #000000;">
                    <th style="padding: 12px; text-align: left; font-family: 'Helvetica Neue', Arial, sans-serif; font-size: 11px; color: #666666; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 500;">
                      Produit
                    </th>
                    <th style="padding: 12px; text-align: center; font-family: 'Helvetica Neue', Arial, sans-serif; font-size: 11px; color: #666666; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 500;">
                      Quantité
                    </th>
                    <th style="padding: 12px; text-align: right; font-family: 'Helvetica Neue', Arial, sans-serif; font-size: 11px; color: #666666; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 500;">
                      Prix
                    </th>
                  </tr>
                </thead>
                <tbody>
                  ${productsListHtml}
                </tbody>
              </table>
            </td>
          </tr>

          <!-- Total Section -->
          <tr>
            <td style="padding: 0 40px 30px 40px;">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                <tr>
                  <td align="right" style="padding: 20px 0; border-top: 2px solid #000000;">
                    <p style="margin: 0; font-family: 'Georgia', 'Times New Roman', serif; font-size: 24px; font-weight: 400; color: #000000; letter-spacing: 1px;">
                      ${new Intl.NumberFormat('fr-FR', {
                        style: 'currency',
                        currency: 'EUR',
                      }).format(order.totalPrice / 100)}
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Delivery Estimate Section -->
          <tr>
            <td style="padding: 0 40px 30px 40px;">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #fff9e6; border-left: 4px solid #d4af37;">
                <tr>
                  <td style="padding: 25px 30px;">
                    <h3 style="margin: 0 0 12px 0; font-family: 'Georgia', 'Times New Roman', serif; font-size: 16px; font-weight: 400; color: #000000; text-transform: uppercase; letter-spacing: 0.5px;">
                      Délai de fabrication / Livraison estimé
                    </h3>
                    <p style="margin: 0 0 8px 0; font-family: 'Helvetica Neue', Arial, sans-serif; font-size: 18px; font-weight: 600; color: #000000;">
                      ${estimatedDeliveryDays} jours ouvrables
                    </p>
                    <p style="margin: 0 0 12px 0; font-family: 'Helvetica Neue', Arial, sans-serif; font-size: 14px; color: #666666; line-height: 1.5;">
                      Date estimée de livraison: <strong style="color: #000000;">${estimatedDeliveryDate.toLocaleDateString('fr-FR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}</strong>
                    </p>
                    <p style="margin: 0; font-family: 'Helvetica Neue', Arial, sans-serif; font-size: 13px; color: #666666; line-height: 1.5;">
                      Nous vous contacterons dès que votre commande sera prête à être expédiée.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Delivery Address Section -->
          <tr>
            <td style="padding: 0 40px 30px 40px;">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #fafafa; border: 1px solid #e5e5e5;">
                <tr>
                  <td style="padding: 25px 30px;">
                    <h3 style="margin: 0 0 12px 0; font-family: 'Georgia', 'Times New Roman', serif; font-size: 16px; font-weight: 400; color: #000000; text-transform: uppercase; letter-spacing: 0.5px;">
                      Adresse de livraison
                    </h3>
                    <p style="margin: 0; font-family: 'Helvetica Neue', Arial, sans-serif; font-size: 14px; color: #1a1a1a; line-height: 1.8;">
                      ${order.customerName}<br>
                      ${order.address}<br>
                      ${order.city}, ${order.country}
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Contact Message -->
          <tr>
            <td style="padding: 0 40px 40px 40px;">
              <p style="margin: 0; font-family: 'Helvetica Neue', Arial, sans-serif; font-size: 15px; line-height: 1.6; color: #1a1a1a;">
                Si vous avez des questions concernant votre commande, n'hésitez pas à nous contacter.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 30px 40px; background-color: #fafafa; border-top: 1px solid #e5e5e5;">
              <p style="margin: 0; font-family: 'Helvetica Neue', Arial, sans-serif; font-size: 11px; color: #999999; text-align: center; line-height: 1.5;">
                Cet email a été envoyé automatiquement, merci de ne pas y répondre directement.
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

RÉSUMÉ DE VOTRE COMMANDE
${productsListText}

TOTAL: ${new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
  }).format(order.totalPrice / 100)}

DÉLAI DE FABRICATION / LIVRAISON ESTIMÉ
${estimatedDeliveryDays} jours ouvrables
Date estimée de livraison: ${estimatedDeliveryDate.toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })}

Nous vous contacterons dès que votre commande sera prête à être expédiée.

ADRESSE DE LIVRAISON
${order.customerName}
${order.address}
${order.city}, ${order.country}

Si vous avez des questions concernant votre commande, n'hésitez pas à nous contacter.
  `.trim()

  return {
    html,
    text,
    subject: `Confirmation de commande #${order.id.substring(0, 8)}`,
  }
}

/**
 * Generate order status change notification email template
 */
export function generateStatusChangeEmail({
  orderId,
  oldStatus,
  newStatus,
  changedAt,
}: StatusChangeEmailOptions): {
  html: string
  text: string
  subject: string
} {
  const orderNumber = orderId.substring(0, 8)
  const changeDate = new Date(changedAt).toLocaleString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })

  const statusLabels: Record<string, string> = {
    New: 'Nouvelle',
    'In progress': 'En cours',
    Completed: 'Terminée',
  }

  const oldStatusLabel = statusLabels[oldStatus] || oldStatus
  const newStatusLabel = statusLabels[newStatus] || newStatus

  const html = `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>Changement de statut de commande</title>
  <!--[if mso]>
  <style type="text/css">
    body, table, td {font-family: Arial, sans-serif !important;}
  </style>
  <![endif]-->
</head>
<body style="margin: 0; padding: 0; background-color: #f5f5f5; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale;">
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f5f5f5; padding: 40px 0;">
    <tr>
      <td align="center">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="max-width: 600px; background-color: #ffffff; border-radius: 0; box-shadow: 0 2px 8px rgba(0,0,0,0.08);">
          <!-- Header -->
          <tr>
            <td style="padding: 40px 40px 30px 40px; background-color: #000000; border-radius: 0 0 0 0;">
              <h1 style="margin: 0; font-family: 'Georgia', 'Times New Roman', serif; font-size: 28px; font-weight: 400; color: #ffffff; letter-spacing: 1px; text-transform: uppercase;">
                Statut de commande modifié
              </h1>
            </td>
          </tr>

          <!-- Order Info Section -->
          <tr>
            <td style="padding: 30px 40px; background-color: #fafafa; border-bottom: 1px solid #e5e5e5;">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                <tr>
                  <td>
                    <p style="margin: 0 0 8px 0; font-family: 'Helvetica Neue', Arial, sans-serif; font-size: 11px; color: #666666; text-transform: uppercase; letter-spacing: 0.5px;">
                      Numéro de commande
                    </p>
                    <p style="margin: 0; font-family: 'Helvetica Neue', Arial, sans-serif; font-size: 20px; font-weight: 600; color: #000000; letter-spacing: 1px;">
                      #${orderNumber}
                    </p>
                  </td>
                  <td align="right">
                    <p style="margin: 0 0 8px 0; font-family: 'Helvetica Neue', Arial, sans-serif; font-size: 11px; color: #666666; text-transform: uppercase; letter-spacing: 0.5px;">
                      Date de modification
                    </p>
                    <p style="margin: 0; font-family: 'Helvetica Neue', Arial, sans-serif; font-size: 14px; color: #1a1a1a;">
                      ${changeDate}
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Status Change Section -->
          <tr>
            <td style="padding: 40px 40px;">
              <h2 style="margin: 0 0 30px 0; font-family: 'Georgia', 'Times New Roman', serif; font-size: 18px; font-weight: 400; color: #000000; text-transform: uppercase; letter-spacing: 1px; text-align: center;">
                Changement de statut
              </h2>
              
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: 0 auto;">
                <tr>
                  <td align="center" style="padding: 20px; background-color: #f5f5f5; border: 1px solid #e5e5e5;">
                    <p style="margin: 0 0 8px 0; font-family: 'Helvetica Neue', Arial, sans-serif; font-size: 11px; color: #666666; text-transform: uppercase; letter-spacing: 0.5px;">
                      Ancien statut
                    </p>
                    <p style="margin: 0; font-family: 'Helvetica Neue', Arial, sans-serif; font-size: 18px; font-weight: 500; color: #666666;">
                      ${oldStatusLabel}
                    </p>
                  </td>
                  <td align="center" style="padding: 20px; width: 60px;">
                    <p style="margin: 0; font-family: 'Helvetica Neue', Arial, sans-serif; font-size: 24px; color: #000000; font-weight: 300;">
                      →
                    </p>
                  </td>
                  <td align="center" style="padding: 20px; background-color: #000000; border: 1px solid #000000;">
                    <p style="margin: 0 0 8px 0; font-family: 'Helvetica Neue', Arial, sans-serif; font-size: 11px; color: #ffffff; text-transform: uppercase; letter-spacing: 0.5px;">
                      Nouveau statut
                    </p>
                    <p style="margin: 0; font-family: 'Helvetica Neue', Arial, sans-serif; font-size: 18px; font-weight: 600; color: #ffffff;">
                      ${newStatusLabel}
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 30px 40px; background-color: #fafafa; border-top: 1px solid #e5e5e5;">
              <p style="margin: 0; font-family: 'Helvetica Neue', Arial, sans-serif; font-size: 12px; color: #999999; text-align: center;">
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
STATUT DE COMMANDE MODIFIÉ

Numéro de commande: #${orderNumber}
Date de modification: ${changeDate}

CHANGEMENT DE STATUT
Ancien statut: ${oldStatusLabel}
Nouveau statut: ${newStatusLabel}

Consultez cette commande dans le panneau d'administration.
  `.trim()

  return {
    html,
    text,
    subject: `Statut modifié - Commande #${orderNumber} (${oldStatusLabel} → ${newStatusLabel})`,
  }
}

