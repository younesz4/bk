/**
 * Email Service - Automated Email Sending Logic
 * Centralized service for sending all email types
 */

import { sendEmail } from './email'
import { generateOrderConfirmationEmail } from './email-templates/order-confirmation'
import { generateQuoteRequestEmail } from './email-templates/quote-request'
import { generateQuoteReceivedAdminEmail } from './email-templates/quote-received-admin'
import { generateOrderStatusUpdateEmail } from './email-templates/order-status-update'
import { generatePaymentConfirmationEmail } from './email-templates/payment-confirmation'
import { generateAbandonedCartEmail } from './email-templates/abandoned-cart'
import { generateContactConfirmationEmail } from './email-templates/contact-confirmation'
import { generateContactAdminAlertEmail } from './email-templates/contact-admin-alert'
import { generateOrderShippedEmail } from './email-templates/order-shipped'
import { ADMIN_NOTIFICATION_EMAIL, FROM_EMAIL } from './config'

export type EmailEventType =
  | 'order_confirmation'
  | 'quote_request'
  | 'quote_received_admin'
  | 'order_status_update'
  | 'payment_confirmation'
  | 'abandoned_cart'
  | 'contact_confirmation'
  | 'contact_admin_alert'
  | 'order_shipped'

export interface EmailEvent {
  type: EmailEventType
  data: any
  to?: string
  cc?: string[]
  bcc?: string[]
}

/**
 * Send email based on event type
 */
export async function sendEmailByEvent(event: EmailEvent): Promise<{
  success: boolean
  messageId?: string
  error?: string
}> {
  try {
    let emailTemplate: { html: string; text: string; subject: string }
    let recipient: string

    switch (event.type) {
      case 'order_confirmation':
        emailTemplate = generateOrderConfirmationEmail({ order: event.data })
        recipient = event.to || event.data.email
        break

      case 'quote_request':
        emailTemplate = generateQuoteRequestEmail({ quote: event.data })
        recipient = event.to || event.data.email
        break

      case 'quote_received_admin':
        emailTemplate = generateQuoteReceivedAdminEmail({ quote: event.data })
        recipient = event.to || ADMIN_NOTIFICATION_EMAIL || ''
        break

      case 'order_status_update':
        emailTemplate = generateOrderStatusUpdateEmail({ order: event.data })
        recipient = event.to || event.data.email
        break

      case 'payment_confirmation':
        emailTemplate = generatePaymentConfirmationEmail({ order: event.data })
        recipient = event.to || event.data.email
        break

      case 'abandoned_cart':
        emailTemplate = generateAbandonedCartEmail({ cart: event.data })
        recipient = event.to || event.data.email
        break

      case 'contact_confirmation':
        emailTemplate = generateContactConfirmationEmail({ contact: event.data })
        recipient = event.to || event.data.email
        break

      case 'contact_admin_alert':
        emailTemplate = generateContactAdminAlertEmail({ contact: event.data })
        recipient = event.to || ADMIN_NOTIFICATION_EMAIL || ''
        break

      case 'order_shipped':
        emailTemplate = generateOrderShippedEmail({ order: event.data })
        recipient = event.to || event.data.email
        break

      default:
        return {
          success: false,
          error: `Unknown email event type: ${event.type}`,
        }
    }

    if (!recipient) {
      return {
        success: false,
        error: 'No recipient email address provided',
      }
    }

    // Note: sendEmail doesn't support from, cc, bcc - using basic call
    const success = await sendEmail(
      recipient,
      emailTemplate.subject,
      emailTemplate.html,
      emailTemplate.text
    )

    return {
      success,
      messageId: success ? 'sent' : undefined,
      error: success ? undefined : 'Failed to send email',
    }
  } catch (error: any) {
    console.error(`Error sending ${event.type} email:`, error)
    return {
      success: false,
      error: error.message || 'Failed to send email',
    }
  }
}

/**
 * Send multiple emails (batch)
 */
export async function sendEmailBatch(events: EmailEvent[]): Promise<Array<{
  type: EmailEventType
  success: boolean
  messageId?: string
  error?: string
}>> {
  const results = await Promise.allSettled(
    events.map((event) => sendEmailByEvent(event))
  )

  return results.map((result, index) => {
    if (result.status === 'fulfilled') {
      return {
        type: events[index].type,
        ...result.value,
      }
    } else {
      return {
        type: events[index].type,
        success: false,
        error: result.reason?.message || 'Unknown error',
      }
    }
  })
}




