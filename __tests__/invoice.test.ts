/**
 * Invoice System Integration Tests
 * Tests complete invoice creation workflow
 */

import { describe, it, expect, beforeAll, afterAll } from '@jest/globals'
import { prisma } from '@/lib/prisma'
import { createInvoiceWithPDF } from '@/lib/invoice'
import { generateInvoiceNumber } from '@/lib/invoice/invoice-number-generator'
import { pdfExists, getPDFPath } from '@/lib/invoice/pdf-storage'
import fs from 'fs'
import path from 'path'

// Mock data
const mockOrderData = {
  customerName: 'Test Customer',
  email: 'test@example.com',
  phone: '+212612345678',
  address: '123 Test Street',
  city: 'Casablanca',
  country: 'Morocco',
  totalPrice: 100000, // 1000 EUR in cents
  status: 'paid',
  paymentMethod: 'stripe',
}

const mockProductData = {
  name: 'Test Product',
  slug: 'test-product',
  description: 'Test description',
  price: 50000, // 500 EUR in cents
  stock: 10,
  isPublished: true,
}

describe('Invoice System Integration Tests', () => {
  let testOrderId: string
  let testProductId: string
  let testCategoryId: string

  beforeAll(async () => {
    // Create test category
    const category = await prisma.category.create({
      data: {
        name: 'Test Category',
        slug: 'test-category',
      },
    })
    testCategoryId = category.id

    // Create test product
    const product = await prisma.product.create({
      data: {
        ...mockProductData,
        categoryId: testCategoryId,
      },
    })
    testProductId = product.id

    // Create test order
    const order = await prisma.order.create({
      data: {
        ...mockOrderData,
        items: {
          create: {
            productId: testProductId,
            quantity: 2,
            price: mockProductData.price,
          },
        },
      },
    })
    testOrderId = order.id
  })

  afterAll(async () => {
    // Cleanup: Delete test data
    try {
      await prisma.order.deleteMany({
        where: { id: testOrderId },
      })
      await prisma.product.deleteMany({
        where: { id: testProductId },
      })
      await prisma.category.deleteMany({
        where: { id: testCategoryId },
      })

      // Cleanup invoices
      const invoices = await prisma.invoice.findMany({
        where: { orderId: testOrderId },
      })
      for (const invoice of invoices) {
        // Delete PDF file if exists
        const pdfPath = getPDFPath(invoice.invoiceNumber)
        if (fs.existsSync(pdfPath)) {
          fs.unlinkSync(pdfPath)
        }
        await prisma.invoice.delete({
          where: { id: invoice.id },
        })
      }
    } catch (error) {
      console.error('Cleanup error:', error)
    }
  })

  describe('Invoice Number Generator', () => {
    it('should generate invoice number in correct format', async () => {
      const invoiceNumber = await generateInvoiceNumber()
      
      expect(invoiceNumber).toMatch(/^BK-\d{4}-\d{6}$/)
      
      const parts = invoiceNumber.split('-')
      expect(parts[0]).toBe('BK')
      expect(parts[1]).toBe(new Date().getFullYear().toString())
      expect(parts[2].length).toBe(6)
      expect(parseInt(parts[2], 10)).toBeGreaterThan(0)
    })

    it('should auto-increment sequence', async () => {
      const invoiceNumber1 = await generateInvoiceNumber()
      const invoiceNumber2 = await generateInvoiceNumber()
      
      const seq1 = parseInt(invoiceNumber1.split('-')[2], 10)
      const seq2 = parseInt(invoiceNumber2.split('-')[2], 10)
      
      expect(seq2).toBeGreaterThan(seq1)
    })
  })

  describe('Invoice Creation', () => {
    it('should create invoice from order', async () => {
      const invoice = await createInvoiceWithPDF(testOrderId)

      expect(invoice).toBeDefined()
      expect(invoice.orderId).toBe(testOrderId)
      expect(invoice.invoiceNumber).toMatch(/^BK-\d{4}-\d{6}$/)
      expect(invoice.customerName).toBe(mockOrderData.customerName)
      expect(invoice.customerEmail).toBe(mockOrderData.email)
      expect(invoice.total).toBeGreaterThan(0)
      expect(invoice.currency).toBe('EUR')
    })

    it('should calculate totals correctly', async () => {
      const invoice = await createInvoiceWithPDF(testOrderId)

      const expectedSubtotal = mockProductData.price * 2 // 2 items
      const expectedTax = Math.round(expectedSubtotal * 0.20) // 20% VAT
      const expectedTotal = expectedSubtotal + expectedTax

      expect(invoice.subtotal).toBe(expectedSubtotal)
      expect(invoice.tax).toBe(expectedTax)
      expect(invoice.total).toBe(expectedTotal)
    })

    it('should save invoice to database', async () => {
      const invoice = await createInvoiceWithPDF(testOrderId)

      const dbInvoice = await prisma.invoice.findUnique({
        where: { id: invoice.id },
      })

      expect(dbInvoice).toBeDefined()
      expect(dbInvoice?.invoiceNumber).toBe(invoice.invoiceNumber)
      expect(dbInvoice?.orderId).toBe(testOrderId)
    })
  })

  describe('PDF Generation', () => {
    it('should generate PDF file', async () => {
      const invoice = await createInvoiceWithPDF(testOrderId)

      expect(invoice.pdfUrl).toBeDefined()
      expect(invoice.pdfUrl).toMatch(/^\/invoices\/BK-\d{4}-\d{6}\.pdf$/)

      const pdfPath = getPDFPath(invoice.invoiceNumber)
      expect(fs.existsSync(pdfPath)).toBe(true)
    })

    it('should confirm PDF file exists', async () => {
      const invoice = await createInvoiceWithPDF(testOrderId)

      const exists = pdfExists(invoice.invoiceNumber)
      expect(exists).toBe(true)
    })

    it('should have correct PDF file size', async () => {
      const invoice = await createInvoiceWithPDF(testOrderId)

      const pdfPath = getPDFPath(invoice.invoiceNumber)
      const stats = fs.statSync(pdfPath)

      expect(stats.size).toBeGreaterThan(0)
      expect(stats.isFile()).toBe(true)
    })
  })

  describe('Invoice Number Format', () => {
    it('should match format BK-YYYY-XXXXXX', async () => {
      const invoice = await createInvoiceWithPDF(testOrderId)

      const pattern = /^BK-\d{4}-\d{6}$/
      expect(invoice.invoiceNumber).toMatch(pattern)
    })

    it('should have correct year', async () => {
      const invoice = await createInvoiceWithPDF(testOrderId)

      const year = invoice.invoiceNumber.split('-')[1]
      expect(year).toBe(new Date().getFullYear().toString())
    })

    it('should have 6-digit sequence', async () => {
      const invoice = await createInvoiceWithPDF(testOrderId)

      const sequence = invoice.invoiceNumber.split('-')[2]
      expect(sequence.length).toBe(6)
      expect(parseInt(sequence, 10)).toBeGreaterThan(0)
    })
  })
})




