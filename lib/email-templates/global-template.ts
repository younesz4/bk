/**
 * Global Email Template
 * Master HTML layout that wraps around all email templates
 * Luxury, minimal, modern design matching BK Agencements branding
 */

export interface EmailTemplateOptions {
  title: string
  content: string
  footerText?: string
  logoUrl?: string
}

/**
 * Generate the master email template
 */
export function generateEmailTemplate(options: EmailTemplateOptions): string {
  const {
    title,
    content,
    footerText = 'BK Agencements — Mobilier sur-mesure d\'exception',
    logoUrl,
  } = options

  return `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>${title}</title>
  <!--[if mso]>
  <style type="text/css">
    body, table, td {font-family: Arial, sans-serif !important;}
  </style>
  <![endif]-->
</head>
<body style="margin: 0; padding: 0; background-color: #f7f5f2; font-family: 'Raleway', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale;">
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f7f5f2; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="max-width: 600px; background-color: #FCFBFC; border: 1px solid #e5e5e5;">
          <!-- Logo / Header -->
          <tr>
            <td style="padding: 40px 40px 30px 40px; background-color: #000000; text-align: center;">
              ${logoUrl
                ? `<img src="${logoUrl}" alt="BK Agencements" style="max-width: 200px; height: auto; display: block; margin: 0 auto;" />`
                : `<h1 style="margin: 0; font-family: 'Bodoni Moda', Georgia, serif; font-size: 32px; font-weight: 400; color: #ffffff; letter-spacing: 2px; text-transform: uppercase; line-height: 1.2;">
                  BK Agencements
                </h1>`
              }
            </td>
          </tr>

          <!-- Title -->
          <tr>
            <td style="padding: 30px 40px 20px 40px; background-color: #000000; text-align: center; border-top: 1px solid #333333;">
              <h2 style="margin: 0; font-family: 'Bodoni Moda', Georgia, serif; font-size: 28px; font-weight: 400; color: #ffffff; letter-spacing: 2px; text-transform: uppercase; line-height: 1.3;">
                ${title}
              </h2>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 40px;">
              ${content}
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 30px 40px; background-color: #f7f5f2; border-top: 1px solid #e5e5e5; text-align: center;">
              <p style="margin: 0 0 12px 0; font-family: 'Raleway', Arial, sans-serif; font-size: 12px; color: #999999; line-height: 1.6;">
                ${footerText}
              </p>
              <p style="margin: 0; font-family: 'Raleway', Arial, sans-serif; font-size: 11px; color: #cccccc; line-height: 1.6;">
                Cet email a été envoyé automatiquement, merci de ne pas y répondre directement.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim()
}

/**
 * Generate plain text version from HTML content
 */
export function generatePlainTextFromHtml(html: string): string {
  // Simple HTML to text conversion
  return html
    .replace(/<style[^>]*>.*?<\/style>/gi, '')
    .replace(/<script[^>]*>.*?<\/script>/gi, '')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim()
}




