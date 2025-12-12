import nodemailer from 'nodemailer'

// Create transporter for Gmail SMTP
const createTransporter = () => {
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.warn('SMTP configuration missing. Email functionality will be disabled.')
    return null
  }

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_PORT === '465', // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  })
}

/**
 * Verify SMTP connection
 */
export async function verifyEmailConnection(): Promise<boolean> {
  const transporter = createTransporter()
  if (!transporter) {
    return false
  }

  try {
    await transporter.verify()
    return true
  } catch (error) {
    console.error('SMTP verification failed:', error)
    return false
  }
}

export async function sendEmail(
  to: string,
  subject: string,
  html: string,
  text?: string
): Promise<boolean> {
  const transporter = createTransporter()
  if (!transporter) {
    console.warn('Email transporter not available')
    return false
  }

  try {
    await transporter.sendMail({
      from: process.env.FROM_EMAIL || process.env.SMTP_USER,
      to,
      subject,
      text: text || html.replace(/<[^>]*>/g, ''), // Strip HTML if no text provided
      html,
    })
    return true
  } catch (error) {
    console.error('Error sending email:', error)
    return false
  }
}

export async function sendOrderConfirmationEmail(order: any): Promise<boolean> {
  const html = generateCustomerEmailTemplate(order)
  const text = generateCustomerEmailText(order)

  return sendEmail(
    order.customerEmail,
    'Votre commande a été confirmée | BK Agencements',
    html,
    text
  )
}

export async function sendOrderAdminNotification(order: any): Promise<boolean> {
  if (!process.env.ADMIN_EMAIL) {
    console.warn('ADMIN_EMAIL not configured')
    return false
  }

  const html = generateAdminEmailTemplate(order)
  const text = generateAdminEmailText(order)

  return sendEmail(
    process.env.ADMIN_EMAIL,
    `Nouvelle commande reçue – #${order.id.substring(0, 8)}`,
    html,
    text
  )
}

function generateCustomerEmailTemplate(order: any): string {
  const formatPrice = (cents: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: order.currency || 'EUR',
    }).format(cents / 100)
  }

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  return `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Confirmation de commande</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Raleway', Arial, sans-serif;
      line-height: 1.6;
      color: #1a1a1a;
      background-color: #f7f7f5;
      padding: 40px 20px;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #FCFBFC;
      border: 0.5px solid #e5e5e5;
      box-shadow: 0 2px 8px rgba(0,0,0,0.05);
    }
    .header {
      background-color: #000000;
      color: #ffffff;
      padding: 40px 30px;
      text-align: center;
    }
    .header h1 {
      font-family: 'Bodoni Moda', Georgia, serif;
      font-size: 28px;
      font-weight: 400;
      letter-spacing: 2px;
      margin: 0;
    }
    .content {
      padding: 40px 30px;
    }
    .thank-you {
      font-size: 18px;
      margin-bottom: 30px;
      color: #1a1a1a;
    }
    .order-summary {
      background-color: #f7f7f5;
      padding: 25px;
      margin: 30px 0;
      border: 0.5px solid #e5e5e5;
    }
    .order-item {
      display: flex;
      justify-content: space-between;
      padding: 15px 0;
      border-bottom: 0.5px solid #e5e5e5;
    }
    .order-item:last-child {
      border-bottom: none;
    }
    .total {
      margin-top: 20px;
      padding-top: 20px;
      border-top: 2px solid #000000;
      display: flex;
      justify-content: space-between;
      font-size: 20px;
      font-weight: 600;
      font-family: 'Bodoni Moda', Georgia, serif;
    }
    .delivery-info {
      background-color: #f7f7f5;
      padding: 20px;
      margin: 30px 0;
      border-left: 3px solid #000000;
    }
    .footer {
      background-color: #f7f7f5;
      padding: 30px;
      text-align: center;
      font-size: 12px;
      color: #666666;
      border-top: 0.5px solid #e5e5e5;
    }
    .contact-info {
      margin-top: 20px;
      font-size: 14px;
      color: #666666;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>BK AGENCEMENTS</h1>
    </div>
    <div class="content">
      <p class="thank-you">Bonjour ${order.customerName},</p>
      <p>Nous vous remercions pour votre commande. Votre demande a été enregistrée avec succès.</p>
      
      <div class="order-summary">
        <h2 style="font-family: 'Bodoni Moda', Georgia, serif; margin-bottom: 20px; font-size: 20px;">Résumé de votre commande</h2>
        <p style="margin-bottom: 15px;"><strong>Numéro de commande:</strong> #${order.id.substring(0, 8)}</p>
        <p style="margin-bottom: 20px;"><strong>Date:</strong> ${formatDate(order.createdAt)}</p>
        
        ${order.items.map((item: any) => `
          <div class="order-item">
            <div>
              <strong>${item.product.name}</strong><br>
              <span style="color: #666; font-size: 14px;">Quantité: ${item.quantity}</span>
            </div>
            <div style="font-weight: 600;">${formatPrice(item.subtotal)}</div>
          </div>
        `).join('')}
        
        <div class="total">
          <span>Total</span>
          <span>${formatPrice(order.totalAmount)}</span>
        </div>
      </div>

      <div class="delivery-info">
        <h3 style="font-family: 'Bodoni Moda', Georgia, serif; margin-bottom: 10px;">Livraison</h3>
        <p>Votre commande sera livrée dans un délai de <strong>24 à 72 heures</strong>.</p>
        <p style="margin-top: 10px;"><strong>Mode de paiement:</strong> Paiement à la livraison (Cash on Delivery)</p>
      </div>

      <div class="contact-info">
        <p><strong>Pour toute question, contactez-nous:</strong></p>
        <p>Email: ${process.env.FROM_EMAIL || 'contact@bkagencements.com'}</p>
        <p>Téléphone: +212 XXX XXX XXX</p>
      </div>
    </div>
    <div class="footer">
      <p>BK Agencements — Mobilier sur-mesure d'exception</p>
      <p style="margin-top: 10px;">Casablanca, Maroc</p>
    </div>
  </div>
</body>
</html>
  `.trim()
}

function generateCustomerEmailText(order: any): string {
  const formatPrice = (cents: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: order.currency || 'EUR',
    }).format(cents / 100)
  }

  return `
Bonjour ${order.customerName},

Nous vous remercions pour votre commande. Votre demande a été enregistrée avec succès.

Numéro de commande: #${order.id.substring(0, 8)}
Date: ${new Date(order.createdAt).toLocaleDateString('fr-FR')}

Articles:
${order.items.map((item: any) => `- ${item.product.name} (x${item.quantity}): ${formatPrice(item.subtotal)}`).join('\n')}

Total: ${formatPrice(order.totalAmount)}

Livraison: Votre commande sera livrée dans un délai de 24 à 72 heures.
Mode de paiement: Paiement à la livraison (Cash on Delivery)

Pour toute question, contactez-nous:
Email: ${process.env.FROM_EMAIL || 'contact@bkagencements.com'}

Cordialement,
L'équipe BK Agencements
  `.trim()
}

function generateAdminEmailTemplate(order: any): string {
  const formatPrice = (cents: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: order.currency || 'EUR',
    }).format(cents / 100)
  }

  const adminUrl = process.env.NEXT_PUBLIC_APP_URL
    ? `${process.env.NEXT_PUBLIC_APP_URL}/admin/orders/${order.id}`
    : `http://localhost:3000/admin/orders/${order.id}`

  return `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Nouvelle commande</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Raleway', Arial, sans-serif;
      line-height: 1.6;
      color: #1a1a1a;
      background-color: #f7f7f5;
      padding: 40px 20px;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #FCFBFC;
      border: 0.5px solid #e5e5e5;
      box-shadow: 0 2px 8px rgba(0,0,0,0.05);
    }
    .header {
      background-color: #000000;
      color: #ffffff;
      padding: 40px 30px;
      text-align: center;
    }
    .header h1 {
      font-family: 'Bodoni Moda', Georgia, serif;
      font-size: 28px;
      font-weight: 400;
      letter-spacing: 2px;
      margin: 0;
    }
    .content {
      padding: 40px 30px;
    }
    .section {
      margin: 25px 0;
      padding: 20px;
      background-color: #f7f7f5;
      border: 0.5px solid #e5e5e5;
    }
    .section h2 {
      font-family: 'Bodoni Moda', Georgia, serif;
      font-size: 18px;
      margin-bottom: 15px;
    }
    .button {
      display: inline-block;
      padding: 12px 24px;
      background-color: #000000;
      color: #ffffff;
      text-decoration: none;
      margin-top: 20px;
      font-size: 14px;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    .footer {
      background-color: #f7f7f5;
      padding: 30px;
      text-align: center;
      font-size: 12px;
      color: #666666;
      border-top: 0.5px solid #e5e5e5;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>NOUVELLE COMMANDE</h1>
    </div>
    <div class="content">
      <p>Une nouvelle commande a été reçue:</p>
      
      <div class="section">
        <h2>Informations client</h2>
        <p><strong>Nom:</strong> ${order.customerName}</p>
        <p><strong>Email:</strong> ${order.customerEmail}</p>
        ${order.customerPhone ? `<p><strong>Téléphone:</strong> ${order.customerPhone}</p>` : ''}
        <p><strong>Adresse:</strong> ${order.addressLine1}${order.addressLine2 ? `, ${order.addressLine2}` : ''}</p>
        <p><strong>Ville:</strong> ${order.city}, ${order.country}</p>
      </div>

      <div class="section">
        <h2>Articles commandés</h2>
        ${order.items.map((item: any) => `
          <p style="margin: 10px 0;">
            <strong>${item.product.name}</strong><br>
            Quantité: ${item.quantity} × ${formatPrice(item.unitPrice)} = ${formatPrice(item.subtotal)}
          </p>
        `).join('')}
        <p style="margin-top: 15px; font-size: 18px; font-weight: 600;">
          <strong>Total: ${formatPrice(order.totalAmount)}</strong>
        </p>
      </div>

      <div class="section">
        <h2>Détails de la commande</h2>
        <p><strong>Numéro:</strong> #${order.id.substring(0, 8)}</p>
        <p><strong>Statut:</strong> ${order.status}</p>
        <p><strong>Mode de paiement:</strong> ${order.paymentMethod === 'CASH_ON_DELIVERY' || order.paymentMethod === 'COD' ? 'À la livraison' : order.paymentMethod}</p>
        ${order.notes ? `<p><strong>Notes:</strong> ${order.notes}</p>` : ''}
      </div>

      <a href="${adminUrl}" class="button">Voir la commande dans le panneau d'administration</a>
    </div>
    <div class="footer">
      <p>BK Agencements — Mobilier sur-mesure d'exception</p>
    </div>
  </div>
</body>
</html>
  `.trim()
}

function generateAdminEmailText(order: any): string {
  const formatPrice = (cents: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: order.currency || 'EUR',
    }).format(cents / 100)
  }

  const adminUrl = process.env.NEXT_PUBLIC_APP_URL
    ? `${process.env.NEXT_PUBLIC_APP_URL}/admin/orders/${order.id}`
    : `http://localhost:3000/admin/orders/${order.id}`

  return `
Nouvelle commande reçue:

Informations client:
- Nom: ${order.customerName}
- Email: ${order.customerEmail}
${order.customerPhone ? `- Téléphone: ${order.customerPhone}` : ''}
- Adresse: ${order.addressLine1}${order.addressLine2 ? `, ${order.addressLine2}` : ''}
- Ville: ${order.city}, ${order.country}

Articles commandés:
${order.items.map((item: any) => `- ${item.product.name} (x${item.quantity}): ${formatPrice(item.subtotal)}`).join('\n')}

Total: ${formatPrice(order.totalAmount)}

Détails:
- Numéro: #${order.id.substring(0, 8)}
- Statut: ${order.status}
- Mode de paiement: ${order.paymentMethod === 'CASH_ON_DELIVERY' || order.paymentMethod === 'COD' ? 'À la livraison' : order.paymentMethod}
${order.notes ? `- Notes: ${order.notes}` : ''}

Voir la commande: ${adminUrl}
  `.trim()
}
