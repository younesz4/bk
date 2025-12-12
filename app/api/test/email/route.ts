import { NextRequest, NextResponse } from 'next/server'
import { sendEmail, verifyEmailConnection } from '@/lib/email'
import { ADMIN_EMAIL, SMTP_USER, SMTP_HOST, SMTP_PORT, maskEmail } from '@/lib/config'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    // Get test email recipient from request body or use default
    const body = await request.json().catch(() => ({}))
    const testEmail = body.email || ADMIN_EMAIL || SMTP_USER

    if (!testEmail) {
      return NextResponse.json(
        {
          success: false,
          error: 'No email address provided. Please provide an email in the request body or set ADMIN_EMAIL/SMTP_USER environment variable.',
        },
        { status: 400 }
      )
    }

    // Verify SMTP connection first
    const connectionValid = await verifyEmailConnection()
    if (!connectionValid) {
      return NextResponse.json(
        {
          success: false,
          error: 'SMTP connection failed. Please check your SMTP configuration.',
        },
        { status: 500 }
      )
    }

    // Send test email
    const testEmailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Test Email</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #000; border-bottom: 2px solid #000; padding-bottom: 10px;">
            Test Email
          </h1>
          <p>This is a test email from your Next.js application.</p>
          <p><strong>Timestamp:</strong> ${new Date().toLocaleString('fr-FR')}</p>
          <p><strong>SMTP Host:</strong> ${SMTP_HOST || 'Not configured'}</p>
          <p><strong>SMTP Port:</strong> ${SMTP_PORT || 'Not configured'}</p>
          <p style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; color: #666; font-size: 12px;">
            If you received this email, your email configuration is working correctly!
          </p>
        </body>
      </html>
    `

    const testEmailText = `
Test Email

This is a test email from your Next.js application.

Timestamp: ${new Date().toLocaleString('fr-FR')}
SMTP Host: ${SMTP_HOST || 'Not configured'}
SMTP Port: ${SMTP_PORT || 'Not configured'}

If you received this email, your email configuration is working correctly!
    `.trim()

    const result = await sendEmail(
      testEmail,
      'Test Email - Email Configuration',
      testEmailHtml,
      testEmailText
    )

    if (result) {
      return NextResponse.json({
        success: true,
        message: 'Test email sent successfully',
        recipient: maskEmail(testEmail), // Mask email in response
        timestamp: new Date().toISOString(),
      })
    } else {
      return NextResponse.json(
        {
          success: false,
          error: 'Failed to send test email',
          recipient: maskEmail(testEmail), // Mask email in response
        },
        { status: 500 }
      )
    }
  } catch (error: any) {
    // Log full error server-side but don't expose stack trace to client
    console.error('Test email error:', error)
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Internal server error',
        // Don't expose stack trace or sensitive details
      },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    // Verify SMTP connection
    const connectionValid = await verifyEmailConnection()

    if (!connectionValid) {
      return NextResponse.json(
        {
          success: false,
          error: 'SMTP connection failed. Please check your SMTP configuration.',
          smtpHost: SMTP_HOST || 'Not configured',
          smtpPort: SMTP_PORT || 'Not configured',
          smtpUser: SMTP_USER ? 'Configured' : 'Not configured', // Don't expose actual username
        },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'SMTP connection verified successfully',
      smtpHost: SMTP_HOST || 'Not configured',
      smtpPort: SMTP_PORT || 'Not configured',
      smtpUser: SMTP_USER ? 'Configured' : 'Not configured', // Don't expose actual username
      timestamp: new Date().toISOString(),
    })
  } catch (error: any) {
    // Log full error server-side but don't expose stack trace to client
    console.error('SMTP verification error:', error)
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Internal server error',
        // Don't expose stack trace or sensitive details
      },
      { status: 500 }
    )
  }
}

