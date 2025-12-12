import PDFDocument from 'pdfkit'
import { Order, OrderItem, Product } from '@prisma/client'

export interface InvoiceOrder extends Order {
  items: (OrderItem & { product: Product })[]
}

export async function generateLuxuryInvoicePDF(order: InvoiceOrder): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({
      size: 'A4',
      margins: {
        top: 80,
        bottom: 80,
        left: 80,
        right: 80,
      },
    })

    const chunks: Buffer[] = []
    doc.on('data', (chunk) => chunks.push(chunk))
    doc.on('end', () => resolve(Buffer.concat(chunks)))
    doc.on('error', reject)

    // Colors
    const black = '#000000'
    const lightGrey = '#f7f7f5'
    const darkGrey = '#1a1a1a'
    const mediumGrey = '#666666'
    const borderGrey = '#e5e5e5'

    // Helper function to format price
    const formatPrice = (cents: number) => {
      return new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: order.currency || 'EUR',
      }).format(cents / 100)
    }

    // Helper function to format date
    const formatDate = (date: Date) => {
      return new Date(date).toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    }

    let yPos = 0

    // Logo/Header Section
    doc.fontSize(36)
      .fillColor(black)
      .font('Helvetica-Bold')
      .text('BK AGENCEMENTS', 0, yPos, {
        align: 'center',
      })

    yPos += 50

    doc.fontSize(12)
      .fillColor(mediumGrey)
      .font('Helvetica')
      .text('Mobilier sur-mesure d\'exception', 0, yPos, {
        align: 'center',
      })

    yPos += 60

    // Invoice Title
    doc.fontSize(32)
      .fillColor(black)
      .font('Helvetica-Bold')
      .text('FACTURE', 0, yPos, {
        align: 'center',
      })

    yPos += 50

    // Invoice Number and Date
    doc.fontSize(11)
      .fillColor(mediumGrey)
      .font('Helvetica')
      .text('Numéro de facture:', 0, yPos)
      .text('Date:', 0, yPos + 20)

    doc.fontSize(12)
      .fillColor(darkGrey)
      .font('Helvetica-Bold')
      .text(`#${order.id.substring(0, 8)}`, 150, yPos)
      .text(formatDate(order.createdAt), 150, yPos + 20)

    yPos += 60

    // Customer Info Section
    doc.fontSize(14)
      .fillColor(black)
      .font('Helvetica-Bold')
      .text('Informations client', 0, yPos)

    yPos += 25

    doc.fontSize(11)
      .fillColor(darkGrey)
      .font('Helvetica')
      .text(order.customerName, 0, yPos)
      .text(order.customerEmail, 0, yPos + 15)
      if (order.customerPhone) {
        doc.text(order.customerPhone, 0, yPos + 30)
        yPos += 15
      }
      doc.text(order.addressLine1, 0, yPos + 30)
      if (order.addressLine2) {
        doc.text(order.addressLine2, 0, yPos + 45)
        yPos += 15
      }
      doc.text(
        `${order.postalCode ? `${order.postalCode} ` : ''}${order.city}, ${order.country}`,
        0,
        yPos + 45
      )

    yPos += 80

    // Divider
    doc.moveTo(0, yPos)
      .lineTo(doc.page.width - 160, yPos)
      .strokeColor(borderGrey)
      .lineWidth(0.5)
      .stroke()

    yPos += 30

    // Products Table Header
    doc.rect(0, yPos, doc.page.width - 160, 35)
      .fillColor(lightGrey)
      .fill()
      .strokeColor(borderGrey)
      .lineWidth(0.5)
      .stroke()

    doc.fontSize(10)
      .fillColor(mediumGrey)
      .font('Helvetica-Bold')
      .text('PRODUIT', 10, yPos + 12)
      .text('QTÉ', 300, yPos + 12)
      .text('PRIX UNIT.', 380, yPos + 12)
      .text('TOTAL', doc.page.width - 180, yPos + 12, { align: 'right' })

    yPos += 45

    // Products
    order.items.forEach((item) => {
      const itemHeight = 40

      doc.fontSize(11)
        .fillColor(darkGrey)
        .font('Helvetica')
        .text(item.product.name, 10, yPos, { width: 280 })

      doc.fontSize(11)
        .fillColor(darkGrey)
        .font('Helvetica')
        .text(item.quantity.toString(), 300, yPos)

      doc.fontSize(11)
        .fillColor(darkGrey)
        .font('Helvetica')
        .text(formatPrice(item.unitPrice), 380, yPos)

      doc.fontSize(11)
        .fillColor(darkGrey)
        .font('Helvetica-Bold')
        .text(formatPrice(item.subtotal), doc.page.width - 180, yPos, { align: 'right' })

      // Divider line
      doc.moveTo(0, yPos + itemHeight - 5)
        .lineTo(doc.page.width - 160, yPos + itemHeight - 5)
        .strokeColor(borderGrey)
        .lineWidth(0.5)
        .stroke()

      yPos += itemHeight
    })

    yPos += 20

    // Total Section
    doc.moveTo(0, yPos)
      .lineTo(doc.page.width - 160, yPos)
      .strokeColor(black)
      .lineWidth(1)
      .stroke()

    yPos += 20

    doc.fontSize(16)
      .fillColor(black)
      .font('Helvetica-Bold')
      .text('TOTAL', 300, yPos)

    doc.fontSize(18)
      .fillColor(black)
      .font('Helvetica-Bold')
      .text(formatPrice(order.totalAmount), doc.page.width - 180, yPos, { align: 'right' })

    yPos += 50

    // Payment Method Badge
    if (order.paymentMethod === 'CASH_ON_DELIVERY' || order.paymentMethod === 'COD') {
      doc.rect(0, yPos, 200, 30)
        .fillColor(lightGrey)
        .fill()
        .strokeColor(black)
        .lineWidth(1)
        .stroke()

      doc.fontSize(11)
        .fillColor(black)
        .font('Helvetica-Bold')
        .text('PAIEMENT À LA LIVRAISON', 10, yPos + 9)

      yPos += 50
    }

    // Notes Section
    if (order.notes) {
      doc.fontSize(11)
        .fillColor(mediumGrey)
        .font('Helvetica')
        .text('Notes:', 0, yPos)

      yPos += 15

      doc.fontSize(11)
        .fillColor(darkGrey)
        .font('Helvetica')
        .text(order.notes, 0, yPos, { width: doc.page.width - 160 })

      yPos += 40
    }

    // Footer
    const footerY = doc.page.height - 120
    doc.moveTo(0, footerY)
      .lineTo(doc.page.width - 160, footerY)
      .strokeColor(borderGrey)
      .lineWidth(0.5)
      .stroke()

    doc.fontSize(10)
      .fillColor(mediumGrey)
      .font('Helvetica')
      .text(
        'BK Agencements — Mobilier sur-mesure d\'exception',
        0,
        footerY + 15,
        { align: 'center', width: doc.page.width - 160 }
      )

    doc.fontSize(9)
      .fillColor(mediumGrey)
      .font('Helvetica')
      .text(
        'Casablanca, Maroc | contact@bkagencements.com',
        0,
        footerY + 35,
        { align: 'center', width: doc.page.width - 160 }
      )

    // Signature field placeholder
    const signatureY = footerY - 80
    doc.moveTo(0, signatureY)
      .lineTo(200, signatureY)
      .strokeColor(borderGrey)
      .lineWidth(0.5)
      .stroke()

    doc.fontSize(9)
      .fillColor(mediumGrey)
      .font('Helvetica')
      .text('Signature', 0, signatureY + 5)

    // Finalize
    doc.end()
  })
}

