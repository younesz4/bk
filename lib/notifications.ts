/**
 * Admin Notifications System
 * Creates and manages notifications for admins
 */

// import { prisma } from '@/lib/prisma' // Not needed until Notification model is added

export interface NotificationData {
  adminId?: string // null = broadcast to all admins
  type: string
  title: string
  message: string
  link?: string
}

/**
 * Create a notification
 * Note: Notification model not in schema yet, so this is a no-op for now
 */
export async function createNotification(data: NotificationData): Promise<void> {
  // TODO: Add Notification model to Prisma schema
  // For now, just log the notification
  console.log('Notification:', data)
}

/**
 * Notification types
 */
export const NotificationTypes = {
  NEW_ORDER: 'new_order',
  NEW_QUOTE: 'new_quote',
  PAYMENT_RECEIVED: 'payment_received',
  COD_CONFIRMATION: 'cod_confirmation',
  BANK_TRANSFER_RECEIVED: 'bank_transfer_received',
  CONTACT_MESSAGE: 'contact_message',
  ORDER_STATUS_CHANGED: 'order_status_changed',
  QUOTE_APPROVED: 'quote_approved',
  PAYMENT_PENDING: 'payment_pending',
} as const

/**
 * Create notification for new order
 */
export async function notifyNewOrder(orderId: string, customerName: string, amount: number): Promise<void> {
  await createNotification({
    type: NotificationTypes.NEW_ORDER,
    title: 'Nouvelle commande',
    message: `Nouvelle commande de ${customerName} - ${new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
    }).format(amount / 100)}`,
    link: `/admin/orders/${orderId}`,
  })
}

/**
 * Create notification for new quote
 */
export async function notifyNewQuote(quoteId: string, customerName: string): Promise<void> {
  await createNotification({
    type: NotificationTypes.NEW_QUOTE,
    title: 'Nouvelle demande de devis',
    message: `Nouvelle demande de devis de ${customerName}`,
    link: `/admin/quotes/${quoteId}`,
  })
}

/**
 * Create notification for payment received
 */
export async function notifyPaymentReceived(orderId: string, amount: number, method: string): Promise<void> {
  await createNotification({
    type: NotificationTypes.PAYMENT_RECEIVED,
    title: 'Paiement reçu',
    message: `Paiement de ${new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
    }).format(amount / 100)} reçu (${method})`,
    link: `/admin/orders/${orderId}`,
  })
}

/**
 * Create notification for new contact message
 */
export async function notifyContactMessage(messageId: string, customerName: string): Promise<void> {
  await createNotification({
    type: NotificationTypes.CONTACT_MESSAGE,
    title: 'Nouveau message',
    message: `Nouveau message de ${customerName}`,
    link: `/admin/contacts/${messageId}`,
  })
}




