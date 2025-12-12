/**
 * Invoice Creation Service
 * Creates invoice from order data
 */

import { prisma } from '@/lib/prisma'
import { generateInvoiceNumber } from './invoice-number-generator'

interface InvoiceItem {
  productName: string
  quantity: number
  unitPrice: number // In cents
  total: number // In cents
}

interface InvoiceData {
  id: string
  invoiceNumber: string
  orderId: string
  customerName: string
  customerEmail: string
  customerPhone: string
  billingAddress: {
    address: string
    city: string
    country: string
    postalCode?: string
  }
  items: InvoiceItem[]
  subtotal: number // In cents
  tax: number // In cents
  shipping: number // In cents
  total: number // In cents
  currency: string
  paymentMethod: string
  status: string
  pdfUrl?: string
  createdAt: Date
  updatedAt: Date
}

/**
 * Create invoice from order
 */
export async function createInvoice(orderId: string): Promise<InvoiceData> {
  // 1. Fetch order with items and customer info
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      items: {
        include: {
          product: {
            select: {
              name: true,
              price: true,
            },
          },
        },
      },
    },
  })

  if (!order) {
    throw new Error(`Order not found: ${orderId}`)
  }

  // 2. Generate invoice number
  const invoiceNumber = await generateInvoiceNumber()

  // 3. Build invoice items
  const items: InvoiceItem[] = order.items.map((item) => ({
    productName: item.product.name,
    quantity: item.quantity,
    unitPrice: item.unitPrice,
    total: item.subtotal,
  }))

  // 4. Calculate totals
  const subtotal = items.reduce((sum, item) => sum + item.total, 0)
  const taxRate = 0.20 // 20% VAT
  const tax = Math.round(subtotal * taxRate)
  const shipping = 0 // Free shipping for now, can be calculated later
  const total = subtotal + tax + shipping

  // 5. Build billing address
  const billingAddress = {
    address: order.addressLine1 + (order.addressLine2 ? `, ${order.addressLine2}` : ''),
    city: order.city,
    country: order.country,
    postalCode: order.postalCode || undefined,
  }

  // 6. Determine payment method
  const paymentMethodMap: Record<string, string> = {
    stripe: 'card',
    cod: 'cash_on_delivery',
    bank_transfer: 'bank_transfer',
  }
  const paymentMethod = paymentMethodMap[order.paymentMethod || ''] || 'card'

  // 7. Determine invoice status based on order status
  let invoiceStatus = 'draft'
  if (order.status === 'paid') {
    invoiceStatus = 'paid'
  } else if (order.status === 'pending_payment' || order.status === 'pending_cod') {
    invoiceStatus = 'pending'
  }

  // 8. Return invoice data (Invoice model not in schema yet, so we return data directly)
  const now = new Date()
  return {
    id: `inv_${orderId}_${Date.now()}`,
    invoiceNumber,
    orderId: order.id,
    customerName: order.customerName,
    customerEmail: order.customerEmail,
    customerPhone: order.customerPhone || '',
    billingAddress: billingAddress,
    items: items,
    subtotal,
    tax,
    shipping,
    total,
    currency: order.currency || 'EUR',
    paymentMethod,
    status: invoiceStatus,
    pdfUrl: undefined,
    createdAt: now,
    updatedAt: now,
  }
}




