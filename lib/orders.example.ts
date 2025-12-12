/**
 * Example usage of the placeOrder function
 * 
 * This file demonstrates how to use the order system in your cart component
 */

import { placeOrder, type PlaceOrderData } from './orders'

// Example: Place order from cart
export async function examplePlaceOrder() {
  // Example cart items
  const cartItems = [
    { productId: 'product-id-1', quantity: 2 },
    { productId: 'product-id-2', quantity: 1 },
  ]

  // Example customer info
  const customerInfo = {
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+1234567890',
    address: '123 Main St, City, Country',
  }

  // Example order data
  const orderData: PlaceOrderData = {
    items: cartItems,
    customer: customerInfo,
    notes: 'Please deliver during business hours.',
  }

  // Place the order
  const result = await placeOrder(orderData)

  if (result.success) {
    console.log('Order placed successfully!', result.orderId)
    // Redirect to success page or show confirmation
    return result
  } else {
    console.error('Failed to place order:', result.error)
    // Show error message to user
    return result
  }
}

/**
 * Example React component usage:
 * 
 * ```tsx
 * 'use client'
 * 
 * import { placeOrder } from '@/lib/orders'
 * import { useCart } from '@/contexts/CartContext'
 * 
 * export default function CheckoutButton() {
 *   const { items, clearCart } = useCart()
 *   const [loading, setLoading] = useState(false)
 * 
 *   const handleCheckout = async () => {
 *     setLoading(true)
 *     
 *     const result = await placeOrder({
 *       items: items.map(item => ({
 *         productId: item.id,
 *         quantity: item.quantity,
 *       })),
 *       customer: {
 *         name: 'Customer Name',
 *         email: 'customer@example.com',
 *         phone: '+1234567890',
 *         address: '123 Main St',
 *       },
 *       notes: 'Delivery instructions...',
 *     })
 * 
 *     setLoading(false)
 * 
 *     if (result.success) {
 *       clearCart()
 *       router.push(`/order-confirmation/${result.orderId}`)
 *     } else {
 *       alert(result.error)
 *     }
 *   }
 * 
 *   return (
 *     <button onClick={handleCheckout} disabled={loading}>
 *       {loading ? 'Placing Order...' : 'Place Order'}
 *     </button>
 *   )
 * }
 * ```
 */

