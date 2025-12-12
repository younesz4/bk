/**
 * Invoice Service - Main Entry Point
 * Complete invoice creation workflow
 */

import { createInvoice } from './createInvoice'
import { generateInvoicePDF } from './pdf-generator'
import { savePDF } from './pdf-storage'
import { sendInvoiceEmail, sendAdminInvoiceEmail } from './invoice-email'

interface InvoiceData {
  id: string
  invoiceNumber: string
  orderId: string
  customerName: string
  customerEmail: string
  customerPhone: string
  billingAddress: any
  items: any[]
  subtotal: number
  tax: number
  shipping: number
  total: number
  currency: string
  paymentMethod: string
  status: string
  pdfUrl?: string
  createdAt: Date
  updatedAt: Date
}

/**
 * Complete invoice creation workflow
 * 1. Create invoice in DB
 * 2. Generate PDF
 * 3. Save PDF
 * 4. Update invoice with PDF URL
 * 5. Send emails
 */
export async function createInvoiceWithPDF(orderId: string): Promise<InvoiceData> {
  // 1. Create invoice in database
  const invoice = await createInvoice(orderId)

  // 2. Generate PDF
  const pdfBuffer = await generateInvoicePDF(invoice)

  // 3. Save PDF to storage
  const pdfUrl = await savePDF(pdfBuffer, invoice.invoiceNumber)

  // 4. Update invoice with PDF URL (Invoice model not in schema, so we just update the object)
  const updatedInvoice = {
    ...invoice,
    pdfUrl,
    updatedAt: new Date(),
  }

  // 5. Send emails (non-blocking)
  Promise.all([
    sendInvoiceEmail({
      invoiceNumber: updatedInvoice.invoiceNumber,
      customerName: updatedInvoice.customerName,
      customerEmail: updatedInvoice.customerEmail,
      total: updatedInvoice.total,
      currency: updatedInvoice.currency,
      createdAt: updatedInvoice.createdAt,
      pdfUrl: updatedInvoice.pdfUrl || '',
    }),
    sendAdminInvoiceEmail({
      invoiceNumber: updatedInvoice.invoiceNumber,
      customerName: updatedInvoice.customerName,
      customerEmail: updatedInvoice.customerEmail,
      total: updatedInvoice.total,
      currency: updatedInvoice.currency,
      createdAt: updatedInvoice.createdAt,
      pdfUrl: updatedInvoice.pdfUrl || '',
    }),
  ]).catch((error) => {
    console.error('Error sending invoice emails:', error)
    // Don't fail invoice creation if emails fail
  })

  return updatedInvoice
}

// Re-export all functions
export { createInvoice } from './createInvoice'
export { generateInvoiceNumber } from './invoice-number-generator'
export { generateInvoicePDF } from './pdf-generator'
export { savePDF, getPDFPath, pdfExists, deletePDF } from './pdf-storage'
export { sendInvoiceEmail, sendAdminInvoiceEmail } from './invoice-email'




