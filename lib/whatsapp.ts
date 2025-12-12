interface WhatsAppMessageOptions {
  to: string // Phone number in international format (e.g., +33123456789)
  message: string
}

interface WhatsAppSendResult {
  success: boolean
  messageId?: string
  error?: string
}

/**
 * Send a WhatsApp message using WhatsApp Cloud API
 */
import {
  WHATSAPP_PHONE_NUMBER_ID,
  WHATSAPP_ACCESS_TOKEN,
  maskSensitiveData,
} from '@/lib/config'

export async function sendWhatsAppMessage({
  to,
  message,
}: WhatsAppMessageOptions): Promise<WhatsAppSendResult> {
  try {
    if (!WHATSAPP_PHONE_NUMBER_ID || !WHATSAPP_ACCESS_TOKEN) {
      throw new Error(
        'Missing WhatsApp configuration. Please set WHATSAPP_PHONE_NUMBER_ID and WHATSAPP_ACCESS_TOKEN environment variables.'
      )
    }

    // Validate phone number format (should be in international format)
    const cleanPhoneNumber = to.replace(/[^0-9+]/g, '')
    if (!cleanPhoneNumber.startsWith('+')) {
      throw new Error('Phone number must be in international format (e.g., +33123456789)')
    }

    const url = `https://graph.facebook.com/v21.0/${WHATSAPP_PHONE_NUMBER_ID}/messages`

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${WHATSAPP_ACCESS_TOKEN}`,
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        to: cleanPhoneNumber,
        type: 'text',
        text: {
          body: message,
        },
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      // Log error but mask sensitive details
      console.error('WhatsApp API error:', {
        error: data.error?.message,
        // Don't log full response or tokens
      })
      return {
        success: false,
        error: data.error?.message || 'Failed to send WhatsApp message',
      }
    }

    return {
      success: true,
      messageId: data.messages?.[0]?.id,
    }
  } catch (error: any) {
    console.error('Error sending WhatsApp message:', error)
    return {
      success: false,
      error: error.message || 'Failed to send WhatsApp message',
    }
  }
}

/**
 * Format order details for WhatsApp message
 */
export function formatOrderWhatsAppMessage(
  orderId: string,
  customerName: string,
  customerPhone: string,
  items: Array<{ product: { name: string }; quantity: number; price: number }>,
  totalPrice: number
): string {
  const orderNumber = orderId.substring(0, 8)
  
  const productsList = items
    .map(
      (item) =>
        `• ${item.product.name} (x${item.quantity}) - ${new Intl.NumberFormat('fr-FR', {
          style: 'currency',
          currency: 'EUR',
        }).format((item.price / 100) * item.quantity)}`
    )
    .join('\n')

  return `🛒 *Nouvelle commande reçue*

📋 *Commande #${orderNumber}*

👤 *Client:*
${customerName}
📞 ${customerPhone}

🛍️ *Produits:*
${productsList}

💰 *Total: ${new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
  }).format(totalPrice / 100)}*

Consultez la commande dans le panneau d'administration.`
}

