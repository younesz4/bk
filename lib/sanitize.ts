/**
 * HTML Sanitization Utilities
 * 
 * Provides safe HTML sanitization for XSS prevention
 * Used when dangerouslySetInnerHTML is necessary
 */

/**
 * Sanitize HTML string by removing dangerous tags and attributes
 * Allows only safe HTML tags for formatting
 */
export function sanitizeHTML(html: string): string {
  if (!html || typeof html !== 'string') {
    return ''
  }

  // Remove script tags and their content
  html = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
  
  // Remove event handlers (onclick, onerror, etc.)
  html = html.replace(/on\w+\s*=\s*["'][^"']*["']/gi, '')
  html = html.replace(/on\w+\s*=\s*[^\s>]*/gi, '')
  
  // Remove javascript: and data: URLs
  html = html.replace(/javascript:/gi, '')
  html = html.replace(/data:text\/html/gi, '')
  html = html.replace(/data:image\/svg\+xml/gi, '')
  
  // Remove iframe, object, embed tags
  html = html.replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
  html = html.replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, '')
  html = html.replace(/<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi, '')
  
  // Remove style tags
  html = html.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
  
  // Remove link tags
  html = html.replace(/<link\b[^>]*>/gi, '')
  
  // Remove meta tags
  html = html.replace(/<meta\b[^>]*>/gi, '')
  
  // Remove base tags
  html = html.replace(/<base\b[^>]*>/gi, '')
  
  // Remove form tags
  html = html.replace(/<form\b[^<]*(?:(?!<\/form>)<[^<]*)*<\/form>/gi, '')
  
  // Remove input tags
  html = html.replace(/<input\b[^>]*>/gi, '')
  
  // Remove button tags
  html = html.replace(/<button\b[^<]*(?:(?!<\/button>)<[^<]*)*<\/button>/gi, '')
  
  // Remove select and option tags
  html = html.replace(/<select\b[^<]*(?:(?!<\/select>)<[^<]*)*<\/select>/gi, '')
  
  // Remove textarea tags
  html = html.replace(/<textarea\b[^<]*(?:(?!<\/textarea>)<[^<]*)*<\/textarea>/gi, '')
  
  // Remove dangerous attributes from remaining tags
  // Keep only safe formatting tags: p, br, strong, em, b, i, u, span, div, h1-h6, ul, ol, li, a (with href validation)
  const allowedTags = ['p', 'br', 'strong', 'em', 'b', 'i', 'u', 'span', 'div', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'li', 'a']
  const allowedAttributes = ['href', 'class', 'id']
  
  // Remove dangerous attributes from all tags
  html = html.replace(/<(\w+)([^>]*)>/g, (match, tag, attrs) => {
    if (!allowedTags.includes(tag.toLowerCase())) {
      return '' // Remove disallowed tags
    }
    
    // Clean attributes - only allow safe ones
    const cleanAttrs: string[] = []
    const attrRegex = /(\w+)\s*=\s*["']([^"']*)["']/g
    let attrMatch
    
    while ((attrMatch = attrRegex.exec(attrs)) !== null) {
      const attrName = attrMatch[1].toLowerCase()
      let attrValue = attrMatch[2]
      
      if (allowedAttributes.includes(attrName)) {
        // Special handling for href - must be safe
        if (attrName === 'href') {
          // Only allow relative URLs or http/https
          if (attrValue.startsWith('/') || 
              attrValue.startsWith('http://') || 
              attrValue.startsWith('https://')) {
            // Remove javascript: and other dangerous protocols
            attrValue = attrValue.replace(/javascript:/gi, '')
            attrValue = attrValue.replace(/data:/gi, '')
            cleanAttrs.push(`${attrName}="${attrValue}"`)
          }
        } else {
          cleanAttrs.push(`${attrName}="${attrValue}"`)
        }
      }
    }
    
    return cleanAttrs.length > 0 
      ? `<${tag} ${cleanAttrs.join(' ')}>`
      : `<${tag}>`
  })
  
  return html.trim()
}

/**
 * Sanitize URL to prevent XSS in href/src attributes
 * Only allows relative URLs, http://, and https://
 */
export function sanitizeURL(url: string): string {
  if (!url || typeof url !== 'string') {
    return ''
  }
  
  // Remove whitespace
  url = url.trim()
  
  // Remove javascript: and data: protocols
  url = url.replace(/^javascript:/i, '')
  url = url.replace(/^data:/i, '')
  
  // Remove vbscript: protocol
  url = url.replace(/^vbscript:/i, '')
  
  // If it's not a relative URL or http/https, make it relative
  if (!url.startsWith('/') && 
      !url.startsWith('http://') && 
      !url.startsWith('https://') &&
      !url.startsWith('#')) {
    // If it looks like it might be a URL, prepend /
    if (url.length > 0 && !url.includes(' ')) {
      url = '/' + url
    } else {
      // Otherwise, it's probably invalid - return empty
      return ''
    }
  }
  
  return url
}

/**
 * Escape HTML entities to render as plain text
 * Use this when you want to display user input as text (not HTML)
 */
export function escapeHTML(text: string): string {
  if (!text || typeof text !== 'string') {
    return ''
  }
  
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  }
  
  return text.replace(/[&<>"']/g, (m) => map[m])
}

/**
 * Sanitize JSON data before stringifying for JSON-LD
 * Ensures no XSS in structured data
 */
export function sanitizeJSONData(data: any): any {
  if (typeof data === 'string') {
    // Escape HTML entities in strings
    return escapeHTML(data)
  }
  
  if (Array.isArray(data)) {
    return data.map(item => sanitizeJSONData(item))
  }
  
  if (data && typeof data === 'object') {
    const sanitized: Record<string, any> = {}
    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        sanitized[key] = sanitizeJSONData(data[key])
      }
    }
    return sanitized
  }
  
  return data
}

