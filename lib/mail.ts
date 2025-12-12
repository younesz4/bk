import sgMail from '@sendgrid/mail'

if (!process.env.SENDGRID_API_KEY) {
  console.warn('SENDGRID_API_KEY is not set. Email functionality will be disabled.')
}

if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY)
}

interface BookingData {
  fullName: string
  email: string
  phone?: string
  projectType?: string
  budget?: string
  message?: string
  date: string
  timeSlot: string
  bookingId: string
}

/**
 * Send confirmation email to client
 */
export async function sendClientConfirmation(data: BookingData): Promise<boolean> {
  if (!process.env.SENDGRID_API_KEY || !process.env.FROM_EMAIL) {
    return false
  }

  const formattedDate = new Date(data.date).toLocaleDateString('fr-FR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  const msg = {
    to: data.email,
    from: process.env.FROM_EMAIL,
    subject: 'Confirmation de votre rendez-vous - BK Agencements',
    text: `
Bonjour ${data.fullName},

Nous avons bien reçu votre demande de rendez-vous.

Détails de votre rendez-vous :
- Date : ${formattedDate}
- Horaire : ${data.timeSlot}
${data.projectType ? `- Type de projet : ${data.projectType}` : ''}
${data.message ? `- Message : ${data.message}` : ''}

Notre équipe vous contactera dans les plus brefs délais pour confirmer votre rendez-vous.

Numéro de référence : ${data.bookingId}

Cordialement,
L'équipe BK Agencements
    `.trim(),
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background-color: #000; color: #fff; padding: 20px; text-align: center; }
    .content { padding: 20px; background-color: #f9f9f9; }
    .details { background-color: #fff; padding: 15px; margin: 15px 0; border-left: 3px solid #000; }
    .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>BK Agencements</h1>
    </div>
    <div class="content">
      <p>Bonjour <strong>${data.fullName}</strong>,</p>
      <p>Nous avons bien reçu votre demande de rendez-vous.</p>
      
      <div class="details">
        <h3>Détails de votre rendez-vous :</h3>
        <ul>
          <li><strong>Date :</strong> ${formattedDate}</li>
          <li><strong>Horaire :</strong> ${data.timeSlot}</li>
          ${data.projectType ? `<li><strong>Type de projet :</strong> ${data.projectType}</li>` : ''}
          ${data.message ? `<li><strong>Message :</strong> ${data.message}</li>` : ''}
        </ul>
      </div>
      
      <p>Notre équipe vous contactera dans les plus brefs délais pour confirmer votre rendez-vous.</p>
      <p><strong>Numéro de référence :</strong> ${data.bookingId}</p>
    </div>
    <div class="footer">
      <p>Cordialement,<br>L'équipe BK Agencements</p>
    </div>
  </div>
</body>
</html>
    `.trim(),
  }

  try {
    await sgMail.send(msg)
    return true
  } catch (error) {
    console.error('Error sending client confirmation email:', error)
    return false
  }
}

/**
 * Send notification email to admin
 */
export async function sendAdminNotification(data: BookingData): Promise<boolean> {
  if (!process.env.SENDGRID_API_KEY || !process.env.FROM_EMAIL || !process.env.ADMIN_EMAIL) {
    return false
  }

  const formattedDate = new Date(data.date).toLocaleDateString('fr-FR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  const adminUrl = process.env.NEXT_PUBLIC_APP_URL 
    ? `${process.env.NEXT_PUBLIC_APP_URL}/api/bookings`
    : 'http://localhost:3000/api/bookings'

  const msg = {
    to: process.env.ADMIN_EMAIL,
    from: process.env.FROM_EMAIL,
    subject: `Nouvelle demande de rendez-vous - ${data.fullName}`,
    text: `
Nouvelle demande de rendez-vous reçue :

Informations client :
- Nom : ${data.fullName}
- Email : ${data.email}
${data.phone ? `- Téléphone : ${data.phone}` : ''}

Détails du rendez-vous :
- Date : ${formattedDate}
- Horaire : ${data.timeSlot}
${data.projectType ? `- Type de projet : ${data.projectType}` : ''}
${data.budget ? `- Budget : ${data.budget}` : ''}
${data.message ? `- Message : ${data.message}` : ''}

Référence : ${data.bookingId}

Voir toutes les réservations : ${adminUrl}
    `.trim(),
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background-color: #000; color: #fff; padding: 20px; text-align: center; }
    .content { padding: 20px; background-color: #f9f9f9; }
    .details { background-color: #fff; padding: 15px; margin: 15px 0; border-left: 3px solid #000; }
    .button { display: inline-block; padding: 10px 20px; background-color: #000; color: #fff; text-decoration: none; margin-top: 15px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Nouvelle demande de rendez-vous</h1>
    </div>
    <div class="content">
      <h3>Informations client :</h3>
      <div class="details">
        <ul>
          <li><strong>Nom :</strong> ${data.fullName}</li>
          <li><strong>Email :</strong> ${data.email}</li>
          ${data.phone ? `<li><strong>Téléphone :</strong> ${data.phone}</li>` : ''}
        </ul>
      </div>
      
      <h3>Détails du rendez-vous :</h3>
      <div class="details">
        <ul>
          <li><strong>Date :</strong> ${formattedDate}</li>
          <li><strong>Horaire :</strong> ${data.timeSlot}</li>
          ${data.projectType ? `<li><strong>Type de projet :</strong> ${data.projectType}</li>` : ''}
          ${data.budget ? `<li><strong>Budget :</strong> ${data.budget}</li>` : ''}
          ${data.message ? `<li><strong>Message :</strong> ${data.message}</li>` : ''}
        </ul>
      </div>
      
      <p><strong>Référence :</strong> ${data.bookingId}</p>
      <a href="${adminUrl}" class="button">Voir toutes les réservations</a>
    </div>
  </div>
</body>
</html>
    `.trim(),
  }

  try {
    await sgMail.send(msg)
    return true
  } catch (error) {
    console.error('Error sending admin notification email:', error)
    return false
  }
}

/**
 * Generic email sending function
 */
export async function sendEmail(to: string, subject: string, html: string, text?: string): Promise<boolean> {
  if (!process.env.SENDGRID_API_KEY || !process.env.FROM_EMAIL) {
    console.warn('SENDGRID_API_KEY or FROM_EMAIL not set. Email functionality disabled.')
    return false
  }

  const msg = {
    to,
    from: process.env.FROM_EMAIL,
    subject,
    text: text || html.replace(/<[^>]*>/g, ''), // Strip HTML if no text provided
    html,
  }

  try {
    await sgMail.send(msg)
    return true
  } catch (error) {
    console.error('Error sending email:', error)
    return false
  }
}

/**
 * Send admin login 2FA code email
 */
export async function sendAdminLoginCodeEmail(to: string, code: string): Promise<boolean> {
  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body {
      font-family: 'Raleway', Arial, sans-serif;
      line-height: 1.6;
      color: #1a1a1a;
      background-color: #f7f5f2;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 600px;
      margin: 40px auto;
      background-color: #ffffff;
      border: 1px solid #e5e5e5;
    }
    .header {
      background-color: #000000;
      color: #ffffff;
      padding: 40px 30px;
      text-align: center;
    }
    .header h1 {
      margin: 0;
      font-family: 'Bodoni Moda', Georgia, serif;
      font-size: 28px;
      font-weight: 400;
      letter-spacing: 2px;
      text-transform: uppercase;
    }
    .content {
      padding: 40px 30px;
    }
    .code-container {
      background-color: #f7f5f2;
      border: 2px solid #000000;
      padding: 30px;
      text-align: center;
      margin: 30px 0;
    }
    .code {
      font-family: 'Bodoni Moda', Georgia, serif;
      font-size: 48px;
      font-weight: 400;
      letter-spacing: 8px;
      color: #000000;
      margin: 10px 0;
    }
    .warning {
      background-color: #fff9e6;
      border-left: 4px solid #d4af37;
      padding: 15px;
      margin: 20px 0;
      font-size: 14px;
      color: #666666;
    }
    .footer {
      background-color: #f7f5f2;
      padding: 20px 30px;
      text-align: center;
      font-size: 12px;
      color: #666666;
      border-top: 1px solid #e5e5e5;
    }
    p {
      margin: 16px 0;
      color: #1a1a1a;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>BK Agencements</h1>
    </div>
    <div class="content">
      <p style="font-size: 16px; margin-bottom: 24px;">Votre code de connexion</p>
      
      <div class="code-container">
        <div class="code">${code}</div>
      </div>
      
      <div class="warning">
        <strong>Important :</strong> Ce code est valable 10 minutes. Ne le partagez avec personne.
      </div>
      
      <p style="font-size: 14px; color: #666666; margin-top: 30px;">
        Si vous n'avez pas demandé ce code, veuillez ignorer cet email.
      </p>
    </div>
    <div class="footer">
      <p>BK Agencements — Mobilier sur-mesure d'exception</p>
    </div>
  </div>
</body>
</html>
  `.trim()

  const text = `
BK Agencements - Votre code de connexion

Votre code de vérification : ${code}

Ce code est valable 10 minutes. Ne le partagez avec personne.

Si vous n'avez pas demandé ce code, veuillez ignorer cet email.

BK Agencements — Mobilier sur-mesure d'exception
  `.trim()

  return sendEmail(to, 'Votre code de connexion BK Agencements', html, text)
}

import { InvoiceOrder, generateInvoiceHtml } from './invoice'

export async function sendOrderConfirmationEmail(order: InvoiceOrder): Promise<boolean> {
  if (!process.env.SENDGRID_API_KEY || !process.env.FROM_EMAIL) {
    return false
  }

  const invoiceHtml = generateInvoiceHtml(order)

  const text = `
Bonjour ${order.customerName},

Nous avons bien reçu votre commande.

Numéro de commande: ${order.id}
Date: ${new Date(order.createdAt).toLocaleDateString('fr-FR')}
Total: ${new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: order.currency || 'EUR',
  }).format(order.totalAmount / 100)}

Veuillez trouver la facture en pièce jointe.

Cordialement,
L'équipe BK Agencements
  `.trim()

  return sendEmail(
    order.customerEmail,
    `Confirmation de commande ${order.id} - BK Agencements`,
    invoiceHtml,
    text
  )
}

export async function sendOrderAdminNotification(order: InvoiceOrder): Promise<boolean> {
  if (!process.env.SENDGRID_API_KEY || !process.env.FROM_EMAIL || !process.env.ADMIN_EMAIL) {
    return false
  }

  const invoiceHtml = generateInvoiceHtml(order)

  const adminUrl = process.env.NEXT_PUBLIC_APP_URL
    ? `${process.env.NEXT_PUBLIC_APP_URL}/admin/orders/${order.id}`
    : `http://localhost:3000/admin/orders/${order.id}`

  const text = `
Nouvelle commande reçue:

Numéro: ${order.id}
Client: ${order.customerName}
Email: ${order.customerEmail}
Total: ${new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: order.currency || 'EUR',
  }).format(order.totalAmount / 100)}
Statut: ${order.status}
Mode de paiement: ${order.paymentMethod}

Voir la commande: ${adminUrl}
  `.trim()

  return sendEmail(
    process.env.ADMIN_EMAIL,
    `Nouvelle commande ${order.id} - ${order.customerName}`,
    invoiceHtml,
    text
  )
}



