export interface OrderItem {
  productId: string
  quantity: number
}

export interface PlaceOrderData {
  customerName: string
  customerEmail?: string
  customerPhone?: string
  addressLine1: string
  addressLine2?: string
  city: string
  postalCode?: string
  country: string
  notes?: string
  paymentMethod: 'CASH_ON_DELIVERY' | 'BANK_TRANSFER' | 'QUOTE_ONLY' | 'COD'
  items: OrderItem[]
}

export interface PlaceOrderResponse {
  success: boolean
  orderId?: string
  error?: string
}

export async function placeOrder(
  orderData: PlaceOrderData
): Promise<PlaceOrderResponse> {
  try {
    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData),
    })

    const data = await res.json()

    if (!res.ok) {
      return {
        success: false,
        error: data.error || 'Échec de la commande',
      }
    }

    return {
      success: true,
      orderId: data.orderId,
    }
  } catch (error) {
    console.error('Error placing order:', error)
    return {
      success: false,
      error: 'Erreur réseau. Veuillez vérifier votre connexion et réessayer.',
    }
  }
}
