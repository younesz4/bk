/**
 * Invoice PDF Generator
 * Creates elegant, minimalist PDF invoices using pdfkit
 */

import PDFDocument from 'pdfkit'
import fs from 'fs'
import path from 'path'

interface InvoiceItem {
  productName: string
  quantity: number
  unitPrice: number // In cents
  total: number // In cents
}

interface InvoiceData {
  invoiceNumber: string
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
  createdAt: Date
}

/**
 * PDF Layout Constants
 * Swiss grid inspired, luxury design
 */
const PDF_LAYOUT = {
  // Page dimensions
  pageWidth: 595.28, // A4 width in points
  pageHeight: 841.89, // A4 height in points

  // Margins
  marginTop: 80,
  marginBottom: 60,
  marginLeft: 60,
  marginRight: 60,

  // Logo
  logoHeight: 40,
  logoPaddingTop: 20,

  // Typography
  fontSizes: {
    title: 24,
    heading: 18,
    subheading: 14,
    body: 11,
    small: 9,
  },
  lineSpacing: 1.4,
  paragraphSpacing: 12,

  // Table
  tableColumnWidths: {
    product: 280,
    quantity: 60,
    unitPrice: 90,
    total: 90,
  },
  tableRowHeight: 24,
  tableHeaderHeight: 30,

  // Colors
  colors: {
    black: '#000000',
    darkGrey: '#333333',
    lightGrey: '#f5f5f5',
    borderGrey: '#e0e0e0',
  },
}

/**
 * Generate invoice PDF
 * Returns PDF buffer
 */
export async function generateInvoicePDF(invoiceData: InvoiceData): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        size: 'A4',
        margins: {
          top: PDF_LAYOUT.marginTop,
          bottom: PDF_LAYOUT.marginBottom,
          left: PDF_LAYOUT.marginLeft,
          right: PDF_LAYOUT.marginRight,
        },
      })

      const buffers: Buffer[] = []
      doc.on('data', buffers.push.bind(buffers))
      doc.on('end', () => resolve(Buffer.concat(buffers)))
      doc.on('error', reject)

      // ============================================================================
      // HEADER - Logo
      // ============================================================================
      const logoPath = path.join(process.cwd(), 'public', 'logo-1.png')
      let logoY = PDF_LAYOUT.logoPaddingTop
      
      if (fs.existsSync(logoPath)) {
        try {
          doc.image(logoPath, PDF_LAYOUT.marginLeft, logoY, {
            width: 120,
            height: PDF_LAYOUT.logoHeight,
            fit: [120, PDF_LAYOUT.logoHeight],
          })
          logoY = PDF_LAYOUT.logoPaddingTop + PDF_LAYOUT.logoHeight + 10
        } catch (logoError) {
          // If image fails to load, use text fallback
          console.warn('Failed to load logo image, using text fallback')
          doc
            .fontSize(PDF_LAYOUT.fontSizes.heading)
            .font('Helvetica-Bold')
            .text('BK Agencements', PDF_LAYOUT.marginLeft, logoY)
          logoY = PDF_LAYOUT.logoPaddingTop + 20
        }
      } else {
        // Fallback: Text logo
        doc
          .fontSize(PDF_LAYOUT.fontSizes.heading)
          .font('Helvetica-Bold')
          .text('BK Agencements', PDF_LAYOUT.marginLeft, logoY)
        logoY = PDF_LAYOUT.logoPaddingTop + 20
      }

      let yPosition = logoY + 20

      // ============================================================================
      // COMPANY DETAILS BLOCK
      // ============================================================================
      doc
        .fontSize(PDF_LAYOUT.fontSizes.small)
        .font('Helvetica')
        .fillColor(PDF_LAYOUT.colors.darkGrey)
        .text('BK Agencements', PDF_LAYOUT.marginLeft, yPosition)
        .text('Mobilier sur-mesure d\'exception', PDF_LAYOUT.marginLeft, yPosition + 12)
        .text('Maroc', PDF_LAYOUT.marginLeft, yPosition + 24)

      // ============================================================================
      // INVOICE TITLE & NUMBER
      // ============================================================================
      const titleX = PDF_LAYOUT.pageWidth - PDF_LAYOUT.marginRight
      doc
        .fontSize(PDF_LAYOUT.fontSizes.title)
        .font('Helvetica-Bold')
        .fillColor(PDF_LAYOUT.colors.black)
        .text('FACTURE', titleX, yPosition, { align: 'right' })

      doc
        .fontSize(PDF_LAYOUT.fontSizes.body)
        .font('Helvetica')
        .text(`N° ${invoiceData.invoiceNumber}`, titleX, yPosition + 30, { align: 'right' })

      const invoiceDate = new Date(invoiceData.createdAt).toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
      doc
        .fontSize(PDF_LAYOUT.fontSizes.small)
        .fillColor(PDF_LAYOUT.colors.darkGrey)
        .text(`Date: ${invoiceDate}`, titleX, yPosition + 48, { align: 'right' })

      yPosition += 80

      // ============================================================================
      // CUSTOMER BLOCK
      // ============================================================================
      doc
        .fontSize(PDF_LAYOUT.fontSizes.subheading)
        .font('Helvetica-Bold')
        .fillColor(PDF_LAYOUT.colors.black)
        .text('Facturé à:', PDF_LAYOUT.marginLeft, yPosition)

      yPosition += 20

      doc
        .fontSize(PDF_LAYOUT.fontSizes.body)
        .font('Helvetica')
        .text(invoiceData.customerName, PDF_LAYOUT.marginLeft, yPosition)
        .text(invoiceData.billingAddress.address, PDF_LAYOUT.marginLeft, yPosition + 14)
        .text(
          `${invoiceData.billingAddress.city}${invoiceData.billingAddress.postalCode ? ` ${invoiceData.billingAddress.postalCode}` : ''}`,
          PDF_LAYOUT.marginLeft,
          yPosition + 28
        )
        .text(invoiceData.billingAddress.country, PDF_LAYOUT.marginLeft, yPosition + 42)
        .text(invoiceData.customerEmail, PDF_LAYOUT.marginLeft, yPosition + 56)
        .text(invoiceData.customerPhone, PDF_LAYOUT.marginLeft, yPosition + 70)

      yPosition += 100

      // ============================================================================
      // ITEMS TABLE
      // ============================================================================
      // Table Header
      doc
        .fontSize(PDF_LAYOUT.fontSizes.small)
        .font('Helvetica-Bold')
        .fillColor(PDF_LAYOUT.colors.black)
        .rect(PDF_LAYOUT.marginLeft, yPosition, PDF_LAYOUT.pageWidth - PDF_LAYOUT.marginLeft - PDF_LAYOUT.marginRight, PDF_LAYOUT.tableHeaderHeight)
        .fill(PDF_LAYOUT.colors.lightGrey)
        .stroke(PDF_LAYOUT.colors.borderGrey)

      doc.text('Produit', PDF_LAYOUT.marginLeft + 10, yPosition + 8)
      doc.text('Qté', PDF_LAYOUT.marginLeft + PDF_LAYOUT.tableColumnWidths.product + 10, yPosition + 8)
      doc.text('Prix unit.', PDF_LAYOUT.marginLeft + PDF_LAYOUT.tableColumnWidths.product + PDF_LAYOUT.tableColumnWidths.quantity + 10, yPosition + 8)
      doc.text('Total', PDF_LAYOUT.marginLeft + PDF_LAYOUT.tableColumnWidths.product + PDF_LAYOUT.tableColumnWidths.quantity + PDF_LAYOUT.tableColumnWidths.unitPrice + 10, yPosition + 8)

      yPosition += PDF_LAYOUT.tableHeaderHeight

      // Table Rows
      invoiceData.items.forEach((item, index) => {
        const isEven = index % 2 === 0
        const rowY = yPosition

        // Alternate row background
        if (isEven) {
          doc
            .rect(PDF_LAYOUT.marginLeft, rowY, PDF_LAYOUT.pageWidth - PDF_LAYOUT.marginLeft - PDF_LAYOUT.marginRight, PDF_LAYOUT.tableRowHeight)
            .fill(PDF_LAYOUT.colors.lightGrey)
        }

        // Product name (with auto-wrap)
        doc
          .fontSize(PDF_LAYOUT.fontSizes.body)
          .font('Helvetica')
          .fillColor(PDF_LAYOUT.colors.black)
          .text(item.productName, PDF_LAYOUT.marginLeft + 10, rowY + 6, {
            width: PDF_LAYOUT.tableColumnWidths.product - 20,
            ellipsis: true,
          })

        // Quantity
        doc.text(item.quantity.toString(), PDF_LAYOUT.marginLeft + PDF_LAYOUT.tableColumnWidths.product + 10, rowY + 6, {
          width: PDF_LAYOUT.tableColumnWidths.quantity - 20,
          align: 'center',
        })

        // Unit price
        doc.text(
          new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: invoiceData.currency,
          }).format(item.unitPrice / 100),
          PDF_LAYOUT.marginLeft + PDF_LAYOUT.tableColumnWidths.product + PDF_LAYOUT.tableColumnWidths.quantity + 10,
          rowY + 6,
          {
            width: PDF_LAYOUT.tableColumnWidths.unitPrice - 20,
            align: 'right',
          }
        )

        // Total
        doc.text(
          new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: invoiceData.currency,
          }).format(item.total / 100),
          PDF_LAYOUT.marginLeft + PDF_LAYOUT.tableColumnWidths.product + PDF_LAYOUT.tableColumnWidths.quantity + PDF_LAYOUT.tableColumnWidths.unitPrice + 10,
          rowY + 6,
          {
            width: PDF_LAYOUT.tableColumnWidths.total - 20,
            align: 'right',
          }
        )

        // Row border
        doc
          .moveTo(PDF_LAYOUT.marginLeft, rowY + PDF_LAYOUT.tableRowHeight)
          .lineTo(PDF_LAYOUT.pageWidth - PDF_LAYOUT.marginRight, rowY + PDF_LAYOUT.tableRowHeight)
          .strokeColor(PDF_LAYOUT.colors.borderGrey)
          .stroke()

        yPosition += PDF_LAYOUT.tableRowHeight
      })

      yPosition += 20

      // ============================================================================
      // TOTALS SUMMARY BLOCK
      // ============================================================================
      const totalsX = PDF_LAYOUT.pageWidth - PDF_LAYOUT.marginRight - 200
      const totalsStartY = yPosition

      // Subtotal
      doc
        .fontSize(PDF_LAYOUT.fontSizes.body)
        .font('Helvetica')
        .fillColor(PDF_LAYOUT.colors.darkGrey)
        .text('Sous-total HT:', totalsX, totalsStartY, { align: 'right' })
        .text(
          new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: invoiceData.currency,
          }).format(invoiceData.subtotal / 100),
          PDF_LAYOUT.pageWidth - PDF_LAYOUT.marginRight,
          totalsStartY,
          { align: 'right' }
        )

      // Tax
      doc
        .text('TVA (20%):', totalsX, totalsStartY + 18, { align: 'right' })
        .text(
          new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: invoiceData.currency,
          }).format(invoiceData.tax / 100),
          PDF_LAYOUT.pageWidth - PDF_LAYOUT.marginRight,
          totalsStartY + 18,
          { align: 'right' }
        )

      // Shipping
      if (invoiceData.shipping > 0) {
        doc
          .text('Livraison:', totalsX, totalsStartY + 36, { align: 'right' })
          .text(
            new Intl.NumberFormat('fr-FR', {
              style: 'currency',
              currency: invoiceData.currency,
            }).format(invoiceData.shipping / 100),
            PDF_LAYOUT.pageWidth - PDF_LAYOUT.marginRight,
            totalsStartY + 36,
            { align: 'right' }
          )
      }

      // Grand Total
      const totalY = invoiceData.shipping > 0 ? totalsStartY + 60 : totalsStartY + 36
      doc
        .moveTo(totalsX, totalY - 10)
        .lineTo(PDF_LAYOUT.pageWidth - PDF_LAYOUT.marginRight, totalY - 10)
        .strokeColor(PDF_LAYOUT.colors.black)
        .lineWidth(1)
        .stroke()

      doc
        .fontSize(PDF_LAYOUT.fontSizes.heading)
        .font('Helvetica-Bold')
        .fillColor(PDF_LAYOUT.colors.black)
        .text('Total TTC:', totalsX, totalY, { align: 'right' })
        .text(
          new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: invoiceData.currency,
          }).format(invoiceData.total / 100),
          PDF_LAYOUT.pageWidth - PDF_LAYOUT.marginRight,
          totalY,
          { align: 'right' }
        )

      // Payment method
      const paymentMethodLabels: Record<string, string> = {
        card: 'Carte bancaire',
        cash_on_delivery: 'Paiement à la livraison',
        bank_transfer: 'Virement bancaire',
      }

      doc
        .fontSize(PDF_LAYOUT.fontSizes.small)
        .font('Helvetica')
        .fillColor(PDF_LAYOUT.colors.darkGrey)
        .text(
          `Mode de paiement: ${paymentMethodLabels[invoiceData.paymentMethod] || invoiceData.paymentMethod}`,
          totalsX,
          totalY + 30,
          { align: 'right' }
        )

      // ============================================================================
      // FOOTER
      // ============================================================================
      const footerY = PDF_LAYOUT.pageHeight - PDF_LAYOUT.marginBottom
      doc
        .fontSize(PDF_LAYOUT.fontSizes.small)
        .font('Helvetica')
        .fillColor(PDF_LAYOUT.colors.darkGrey)
        .text('BK Agencements — Mobilier sur-mesure d\'exception', PDF_LAYOUT.marginLeft, footerY, {
          align: 'center',
        })
        .text('Merci pour votre confiance', PDF_LAYOUT.marginLeft, footerY + 12, {
          align: 'center',
        })

      doc.end()
    } catch (error) {
      reject(error)
    }
  })
}

