/**
 * Refund Email Service
 * Sends refund emails to customer and admin
 */

import { sendEmail } from '@/lib/email'
import { generateEmailTemplate } from '@/lib/email-templates/global-template'
import { ADMIN_NOTIFICATION_EMAIL, FROM_EMAIL } from '@/lib/config'
import { getPDFPath } from '@/lib/invoice/pdf-storage'
import fs from 'fs'

interface RefundData {
  id: string
  orderId: string
  invoiceId: string | null
  amount: number // In cents
  reason: string
  status: string
  method: string
  customerName: string
  customerEmail: string
  orderTotal: number // In cents
  currency: string
  createdAt: Date
}

/**
 * Send refund email to customer
 */
export async function sendRefundEmail(refundData: RefundData): Promise<{
  success: boolean
  messageId?: string
  error?: string
}> {
  try {
    const refundDate = new Date(refundData.createdAt).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })

    const content = `
      <p style="margin: 0 0 16px 0; font-family: 'Raleway', Arial, sans-serif; font-size: 16px; line-height: 1.6; color: #1a1a1a;">
        Bonjour ${refundData.customerName},
      </p>
      <p style="margin: 0 0 24px 0; font-family: 'Raleway', Arial, sans-serif; font-size: 16px; line-height: 1.6; color: #1a1a1a;">
        Nous avons enregistré votre demande de remboursement. Veuillez trouver ci-dessous les détails de votre remboursement.
      </p>

      <!-- Refund Details -->
      <div style="background-color: #f7f5f2; border: 1px solid #e5e5e5; padding: 30px; margin: 24px 0; text-align: center;">
        <p style="margin: 0 0 8px 0; font-family: 'Raleway', Arial, sans-serif; font-size: 11px; color: #666666; text-transform: uppercase; letter-spacing: 1px;">
          Montant du remboursement
        </p>
        <p style="margin: 0; font-family: 'Bodoni Moda', Georgia, serif; font-size: 36px; font-weight: 400; color: #000000; letter-spacing: 2px;">
          ${new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: refundData.currency,
          }).format(refundData.amount / 100)}
        </p>
      </div>

      <!-- Refund Summary -->
      <div style="border-top: 1px solid #e5e5e5; padding-top: 24px; margin-top: 24px;">
        <h3 style="margin: 0 0 16px 0; font-family: 'Bodoni Moda', Georgia, serif; font-size: 18px; font-weight: 400; color: #000000; text-transform: uppercase; letter-spacing: 1px;">
          Détails du remboursement
        </h3>
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
          <tr>
            <td style="padding: 8px 0; font-family: 'Raleway', Arial, sans-serif; font-size: 14px; color: #666666; width: 140px;">
              Numéro de commande
            </td>
            <td style="padding: 8px 0; font-family: 'Raleway', Arial, sans-serif; font-size: 14px; color: #1a1a1a; font-weight: 500;">
              #${refundData.orderId.substring(0, 8)}
            </td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-family: 'Raleway', Arial, sans-serif; font-size: 14px; color: #666666;">
              Montant de la commande
            </td>
            <td style="padding: 8px 0; font-family: 'Raleway', Arial, sans-serif; font-size: 14px; color: #1a1a1a; font-weight: 500;">
              ${new Intl.NumberFormat('fr-FR', {
                style: 'currency',
                currency: refundData.currency,
              }).format(refundData.orderTotal / 100)}
            </td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-family: 'Raleway', Arial, sans-serif; font-size: 14px; color: #666666;">
              Montant remboursé
            </td>
            <td style="padding: 8px 0; font-family: 'Raleway', Arial, sans-serif; font-size: 14px; color: #1a1a1a; font-weight: 500;">
              ${new Intl.NumberFormat('fr-FR', {
                style: 'currency',
                currency: refundData.currency,
              }).format(refundData.amount / 100)}
            </td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-family: 'Raleway', Arial, sans-serif; font-size: 14px; color: #666666;">
              Raison
            </td>
            <td style="padding: 8px 0; font-family: 'Raleway', Arial, sans-serif; font-size: 14px; color: #1a1a1a; font-weight: 500;">
              ${refundData.reason}
            </td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-family: 'Raleway', Arial, sans-serif; font-size: 14px; color: #666666;">
              Méthode
            </td>
            <td style="padding: 8px 0; font-family: 'Raleway', Arial, sans-serif; font-size: 14px; color: #1a1a1a; font-weight: 500;">
              ${refundData.method === 'original' ? 'Méthode originale' : refundData.method === 'manual' ? 'Manuel' : 'Espèces'}
            </td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-family: 'Raleway', Arial, sans-serif; font-size: 14px; color: #666666;">
              Date
            </td>
            <td style="padding: 8px 0; font-family: 'Raleway', Arial, sans-serif; font-size: 14px; color: #1a1a1a; font-weight: 500;">
              ${refundDate}
            </td>
          </tr>
        </table>
      </div>

      <!-- Refund Summary JSON (for reference) -->
      <div style="background-color: #f7f5f2; border: 1px solid #e5e5e5; padding: 16px; margin: 24px 0;">
        <p style="margin: 0 0 8px 0; font-family: 'Raleway', Arial, sans-serif; font-size: 12px; color: #666666; text-transform: uppercase; letter-spacing: 1px;">
          Résumé du remboursement
        </p>
        <pre style="margin: 0; font-family: 'Raleway', Arial, sans-serif; font-size: 11px; color: #1a1a1a; line-height: 1.6; white-space: pre-wrap;">${JSON.stringify(
          {
            refundId: refundData.id,
            orderId: refundData.orderId,
            amount: refundData.amount / 100,
            currency: refundData.currency,
            reason: refundData.reason,
            method: refundData.method,
            status: refundData.status,
            date: refundDate,
          },
          null,
          2
        )}</pre>
      </div>

      <!-- Next Steps -->
      <div style="background-color: #fff9e6; border-left: 4px solid #d4af37; padding: 20px; margin: 24px 0;">
        <h3 style="margin: 0 0 12px 0; font-family: 'Bodoni Moda', Georgia, serif; font-size: 16px; font-weight: 400; color: #000000; text-transform: uppercase; letter-spacing: 1px;">
          Prochaines étapes
        </h3>
        <p style="margin: 0; font-family: 'Raleway', Arial, sans-serif; font-size: 14px; color: #1a1a1a; line-height: 1.6;">
          Votre remboursement est en cours de traitement. Le montant sera crédité selon la méthode de remboursement choisie dans les prochains jours ouvrables.
        </p>
      </div>
    `

    const html = generateEmailTemplate({
      title: 'Votre remboursement',
      content,
    })

    const text = `
VOTRE REMBOURSEMENT

Bonjour ${refundData.customerName},

Nous avons enregistré votre demande de remboursement. Veuillez trouver ci-dessous les détails de votre remboursement.

MONTANT DU REMBOURSEMENT
${new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: refundData.currency,
    }).format(refundData.amount / 100)}

DÉTAILS DU REMBOURSEMENT
Numéro de commande: #${refundData.orderId.substring(0, 8)}
Montant de la commande: ${new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: refundData.currency,
    }).format(refundData.orderTotal / 100)}
Montant remboursé: ${new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: refundData.currency,
    }).format(refundData.amount / 100)}
Raison: ${refundData.reason}
Méthode: ${refundData.method === 'original' ? 'Méthode originale' : refundData.method === 'manual' ? 'Manuel' : 'Espèces'}
Date: ${refundDate}

PROCHAINES ÉTAPES
Votre remboursement est en cours de traitement. Le montant sera crédité selon la méthode de remboursement choisie dans les prochains jours ouvrables.

BK Agencements — Mobilier sur-mesure d'exception
    `.trim()

    // Get invoice PDF for attachment if available
    // Note: Invoice model not in schema yet, so PDF attachments are disabled
    let attachment: { filename: string; path: string } | undefined
    /*
    if (refundData.invoiceId) {
      // Try to find invoice and get PDF
      const { prisma } = await import('@/lib/prisma')
      const invoice = await prisma.invoice.findUnique({
        where: { id: refundData.invoiceId },
        select: { invoiceNumber: true, pdfUrl: true },
      })

      if (invoice?.pdfUrl) {
        const pdfPath = getPDFPath(invoice.invoiceNumber)
        if (fs.existsSync(pdfPath)) {
          attachment = {
            filename: `${invoice.invoiceNumber}.pdf`,
            path: pdfPath,
          }
        }
      }
    }
    */

    const success = await sendEmail(
      refundData.customerEmail,
      'Votre remboursement - BK Agencements',
      html,
      text
    )

    return {
      success,
      messageId: success ? 'sent' : undefined,
      error: success ? undefined : 'Failed to send refund email',
    }
  } catch (error: any) {
    console.error('Error sending refund email:', error)
    return {
      success: false,
      error: error.message || 'Failed to send refund email',
    }
  }
}

/**
 * Send refund admin notification
 */
export async function sendRefundAdminEmail(refundData: RefundData): Promise<{
  success: boolean
  messageId?: string
  error?: string
}> {
  try {
    if (!ADMIN_NOTIFICATION_EMAIL) {
      return {
        success: false,
        error: 'Admin email not configured',
      }
    }

    const refundDate = new Date(refundData.createdAt).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })

    const methodLabels: Record<string, string> = {
      original: 'Méthode originale',
      manual: 'Manuel',
      cash: 'Espèces',
    }

    const content = `
      <div style="background-color: #e8f5e9; border-left: 4px solid #4caf50; padding: 20px; margin-bottom: 24px;">
        <p style="margin: 0; font-family: 'Raleway', Arial, sans-serif; font-size: 16px; color: #1a1a1a; line-height: 1.6;">
          ✅ <strong>Remboursement enregistré</strong>
        </p>
      </div>

      <p style="margin: 0 0 8px 0; font-family: 'Raleway', Arial, sans-serif; font-size: 11px; color: #666666; text-transform: uppercase; letter-spacing: 1px;">
        Numéro de remboursement
      </p>
      <p style="margin: 0 0 24px 0; font-family: 'Bodoni Moda', Georgia, serif; font-size: 24px; font-weight: 400; color: #000000; letter-spacing: 1px;">
        #${refundData.id.substring(0, 8)}
      </p>

      <!-- Refund Details -->
      <div style="border-top: 1px solid #e5e5e5; padding-top: 24px; margin-bottom: 24px;">
        <h3 style="margin: 0 0 16px 0; font-family: 'Bodoni Moda', Georgia, serif; font-size: 18px; font-weight: 400; color: #000000; text-transform: uppercase; letter-spacing: 1px;">
          Détails du remboursement
        </h3>
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
          <tr>
            <td style="padding: 8px 0; font-family: 'Raleway', Arial, sans-serif; font-size: 14px; color: #666666; width: 140px;">
              Numéro de commande
            </td>
            <td style="padding: 8px 0; font-family: 'Raleway', Arial, sans-serif; font-size: 14px; color: #1a1a1a; font-weight: 500;">
              #${refundData.orderId.substring(0, 8)}
            </td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-family: 'Raleway', Arial, sans-serif; font-size: 14px; color: #666666;">
              Client
            </td>
            <td style="padding: 8px 0; font-family: 'Raleway', Arial, sans-serif; font-size: 14px; color: #1a1a1a; font-weight: 500;">
              ${refundData.customerName}
            </td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-family: 'Raleway', Arial, sans-serif; font-size: 14px; color: #666666;">
              Email
            </td>
            <td style="padding: 8px 0; font-family: 'Raleway', Arial, sans-serif; font-size: 14px; color: #1a1a1a; font-weight: 500;">
              ${refundData.customerEmail}
            </td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-family: 'Raleway', Arial, sans-serif; font-size: 14px; color: #666666;">
              Montant
            </td>
            <td style="padding: 8px 0; font-family: 'Raleway', Arial, sans-serif; font-size: 14px; color: #1a1a1a; font-weight: 500;">
              ${new Intl.NumberFormat('fr-FR', {
                style: 'currency',
                currency: refundData.currency,
              }).format(refundData.amount / 100)}
            </td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-family: 'Raleway', Arial, sans-serif; font-size: 14px; color: #666666;">
              Raison
            </td>
            <td style="padding: 8px 0; font-family: 'Raleway', Arial, sans-serif; font-size: 14px; color: #1a1a1a; font-weight: 500;">
              ${refundData.reason}
            </td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-family: 'Raleway', Arial, sans-serif; font-size: 14px; color: #666666;">
              Type
            </td>
            <td style="padding: 8px 0; font-family: 'Raleway', Arial, sans-serif; font-size: 14px; color: #1a1a1a; font-weight: 500;">
              ${methodLabels[refundData.method] || refundData.method}
            </td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-family: 'Raleway', Arial, sans-serif; font-size: 14px; color: #666666;">
              Statut
            </td>
            <td style="padding: 8px 0; font-family: 'Raleway', Arial, sans-serif; font-size: 14px; color: #1a1a1a; font-weight: 500;">
              ${refundData.status}
            </td>
          </tr>
        </table>
      </div>

      <!-- Action Button -->
      <div style="text-align: center; margin: 24px 0;">
        <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/admin/orders/${refundData.orderId}" style="display: inline-block; padding: 14px 32px; background-color: #000000; color: #ffffff; text-decoration: none; font-family: 'Raleway', Arial, sans-serif; font-size: 14px; font-weight: 500; text-transform: uppercase; letter-spacing: 1px;">
          Voir la commande dans l'admin
        </a>
      </div>

      <p style="margin: 24px 0 0 0; font-family: 'Raleway', Arial, sans-serif; font-size: 12px; color: #666666;">
        Date: ${refundDate}
      </p>
    `

    const html = generateEmailTemplate({
      title: 'Remboursement enregistré',
      content,
      footerText: 'Consultez ce remboursement dans le panneau d\'administration',
    })

    const text = `
REMBOURSEMENT ENREGISTRÉ

✅ Remboursement enregistré

NUMÉRO DE REMBOURSEMENT
#${refundData.id.substring(0, 8)}

DÉTAILS DU REMBOURSEMENT
Numéro de commande: #${refundData.orderId.substring(0, 8)}
Client: ${refundData.customerName}
Email: ${refundData.customerEmail}
Montant: ${new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: refundData.currency,
    }).format(refundData.amount / 100)}
Raison: ${refundData.reason}
Type: ${methodLabels[refundData.method] || refundData.method}
Statut: ${refundData.status}

Date: ${refundDate}
    `.trim()

    const success = await sendEmail(
      ADMIN_NOTIFICATION_EMAIL,
      `Remboursement enregistré - #${refundData.id.substring(0, 8)}`,
      html,
      text
    )

    return {
      success,
      messageId: success ? 'sent' : undefined,
      error: success ? undefined : 'Failed to send admin refund email',
    }
  } catch (error: any) {
    console.error('Error sending admin refund email:', error)
    return {
      success: false,
      error: error.message || 'Failed to send admin refund email',
    }
  }
}




