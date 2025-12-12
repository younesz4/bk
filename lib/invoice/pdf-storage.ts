/**
 * PDF Storage Service
 * Saves invoice PDFs to public/invoices directory
 */

import fs from 'fs'
import path from 'path'

/**
 * Save PDF to storage
 * @param buffer PDF buffer
 * @param invoiceNumber Invoice number for filename
 * @returns Absolute URL for PDF
 */
export async function savePDF(buffer: Buffer, invoiceNumber: string): Promise<string> {
  try {
    // Create invoices directory if it doesn't exist
    const invoicesDir = path.join(process.cwd(), 'public', 'invoices')
    if (!fs.existsSync(invoicesDir)) {
      fs.mkdirSync(invoicesDir, { recursive: true })
    }

    // Generate filename
    const filename = `${invoiceNumber}.pdf`
    const filePath = path.join(invoicesDir, filename)

    // Write PDF file
    fs.writeFileSync(filePath, buffer)

    // Return relative URL
    return `/invoices/${filename}`
  } catch (error: any) {
    console.error('Error saving PDF:', error)
    throw new Error(`Failed to save PDF: ${error.message}`)
  }
}

/**
 * Get PDF file path
 */
export function getPDFPath(invoiceNumber: string): string {
  return path.join(process.cwd(), 'public', 'invoices', `${invoiceNumber}.pdf`)
}

/**
 * Check if PDF exists
 */
export function pdfExists(invoiceNumber: string): boolean {
  const filePath = getPDFPath(invoiceNumber)
  return fs.existsSync(filePath)
}

/**
 * Delete PDF file
 */
export async function deletePDF(invoiceNumber: string): Promise<void> {
  try {
    const filePath = getPDFPath(invoiceNumber)
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath)
    }
  } catch (error: any) {
    console.error('Error deleting PDF:', error)
    throw new Error(`Failed to delete PDF: ${error.message}`)
  }
}




