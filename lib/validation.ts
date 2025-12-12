import { z } from 'zod'

/**
 * Central validation library for all forms
 * Includes security checks to reject malicious payloads
 * 
 * Usage:
 * - Client-side: validateFormData(schema, data) for inline errors
 * - Server-side: schema.parse(data) for strict validation
 */

// ============================================================================
// SECURITY HELPERS - Reject malicious content
// ============================================================================

/**
 * Check if string contains HTML tags or script attempts
 */
function containsHTMLTags(value: string): boolean {
  if (!value || typeof value !== 'string') return false

  // Check for HTML tags
  const htmlTagPattern = /<[^>]+>/g
  if (htmlTagPattern.test(value)) {
    return true
  }

  // Check for script injection attempts
  const scriptPatterns = [
    /<script/i,
    /<\/script>/i,
    /javascript:/i,
    /on\w+\s*=/i, // onclick=, onerror=, etc.
    /eval\(/i,
    /expression\(/i,
    /vbscript:/i,
    /data:text\/html/i,
    /data:image\/svg\+xml/i,
    /<iframe/i,
    /<object/i,
    /<embed/i,
    /<link/i,
    /<style/i,
    /<meta/i,
  ]

  return scriptPatterns.some((pattern) => pattern.test(value))
}

/**
 * Check for SQL injection patterns
 */
function containsSQLInjection(value: string): boolean {
  if (!value || typeof value !== 'string') return false

  const sqlPatterns = [
    /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|EXECUTE)\b)/i,
    /('|(\\')|(;)|(--)|(\/\*)|(\*\/)|(\+)|(\%27)|(\%22))/i,
    /(\b(OR|AND)\s+\d+\s*=\s*\d+)/i,
    /(\b(OR|AND)\s+['"]\w+['"]\s*=\s*['"]\w+['"])/i,
    /(UNION\s+SELECT)/i,
  ]

  return sqlPatterns.some((pattern) => pattern.test(value))
}

/**
 * Check for path traversal attempts
 */
function containsPathTraversal(value: string): boolean {
  if (!value || typeof value !== 'string') return false

  const pathPatterns = [
    /\.\.\//g,
    /\.\.\\/g,
    /\.\./g,
    /\/etc\/passwd/i,
    /\/proc\/self/i,
    /\.\./,
  ]

  return pathPatterns.some((pattern) => pattern.test(value))
}

/**
 * Sanitize string by removing HTML tags and dangerous patterns
 */
export function sanitizeString(value: string): string {
  if (!value || typeof value !== 'string') return value

  return value
    .replace(/<[^>]+>/g, '') // Remove HTML tags
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '')
    .replace(/eval\(/gi, '')
    .replace(/expression\(/gi, '')
    .replace(/vbscript:/gi, '')
    .replace(/data:text\/html/gi, '')
    .replace(/data:image\/svg\+xml/gi, '')
    .replace(/\.\.\//g, '')
    .replace(/\.\.\\/g, '')
    .trim()
}

/**
 * Custom Zod refinement to reject HTML/script content
 */
function noHTMLRefinement(value: string) {
  if (!value) return true
  if (containsHTMLTags(value)) {
    return false
  }
  if (containsSQLInjection(value)) {
    return false
  }
  if (containsPathTraversal(value)) {
    return false
  }
  return true
}

// ============================================================================
// COMMON VALIDATION PATTERNS
// ============================================================================

const emailSchema = z
  .string()
  .min(1, 'L\'email est requis')
  .max(255, 'L\'email est trop long (maximum 255 caractères)')
  .email('Format d\'email invalide')
  .refine(noHTMLRefinement, {
    message: 'L\'email contient des caractères non autorisés',
  })
  .refine((value) => !containsSQLInjection(value), {
    message: 'L\'email contient des caractères non autorisés',
  })

const phoneSchema = z
  .string()
  .max(50, 'Le numéro de téléphone est trop long (maximum 50 caractères)')
  .regex(/^[\d\s\-\+\(\)]+$/, 'Format de téléphone invalide (caractères autorisés: chiffres, espaces, +, -, parenthèses)')
  .refine(noHTMLRefinement, {
    message: 'Le téléphone contient des caractères non autorisés',
  })
  .optional()
  .nullable()

const nameSchema = z
  .string()
  .min(1, 'Ce champ est requis')
  .min(2, 'Ce champ doit contenir au moins 2 caractères')
  .max(255, 'Ce champ est trop long (maximum 255 caractères)')
  .refine(noHTMLRefinement, {
    message: 'Ce champ ne peut pas contenir de balises HTML ou de scripts',
  })
  .refine((value) => !containsSQLInjection(value), {
    message: 'Ce champ contient des caractères non autorisés',
  })

const textAreaSchema = z
  .string()
  .max(2000, 'Le message est trop long (maximum 2000 caractères)')
  .refine((value) => !value || noHTMLRefinement(value), {
    message: 'Le message ne peut pas contenir de balises HTML ou de scripts',
  })
  .refine((value) => !value || !containsSQLInjection(value), {
    message: 'Le message contient des caractères non autorisés',
  })
  .optional()
  .nullable()

// ============================================================================
// BOOKING FORM VALIDATION
// ============================================================================

export const bookingFormSchema = z.object({
  fullName: nameSchema,
  email: emailSchema,
  phone: phoneSchema,
  preferredDate: z
    .string()
    .min(1, 'La date est requise')
    .refine((value) => {
      const date = new Date(value)
      return !isNaN(date.getTime())
    }, {
      message: 'Format de date invalide',
    })
    .refine((value) => {
      const date = new Date(value)
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      date.setHours(0, 0, 0, 0)
      return date >= today
    }, {
      message: 'La date doit être aujourd\'hui ou dans le futur',
    })
    .refine((value) => {
      const date = new Date(value)
      const maxDate = new Date()
      maxDate.setFullYear(maxDate.getFullYear() + 1)
      return date <= maxDate
    }, {
      message: 'La date ne peut pas être plus d\'un an dans le futur',
    }),
  preferredTime: z
    .string()
    .min(1, 'L\'horaire est requis')
    .regex(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/, 'Format d\'horaire invalide (format attendu: HH:MM, ex: 14:30)'),
  projectType: z
    .string()
    .max(100, 'Le type de projet est trop long (maximum 100 caractères)')
    .refine((value) => !value || noHTMLRefinement(value), {
      message: 'Le type de projet ne peut pas contenir de balises HTML',
    })
    .optional()
    .nullable(),
  budget: z
    .string()
    .max(100, 'Le budget est trop long (maximum 100 caractères)')
    .refine((value) => !value || noHTMLRefinement(value), {
      message: 'Le budget ne peut pas contenir de balises HTML',
    })
    .optional()
    .nullable(),
  message: textAreaSchema,
  website: z.string().max(0, 'Ce champ doit rester vide').optional(), // Honeypot
})

export type BookingFormData = z.infer<typeof bookingFormSchema>

// ============================================================================
// CONTACT FORM VALIDATION
// ============================================================================

export const contactFormSchema = z.object({
  firstName: nameSchema,
  lastName: nameSchema,
  email: emailSchema,
  phone: phoneSchema,
  budget: z
    .string()
    .max(100, 'Le budget est trop long (maximum 100 caractères)')
    .refine((value) => !value || noHTMLRefinement(value), {
      message: 'Le budget ne peut pas contenir de balises HTML',
    })
    .optional()
    .nullable(),
  projectType: z
    .string()
    .max(100, 'Le type de projet est trop long (maximum 100 caractères)')
    .refine((value) => !value || noHTMLRefinement(value), {
      message: 'Le type de projet ne peut pas contenir de balises HTML',
    })
    .optional()
    .nullable(),
  message: z
    .string()
    .min(1, 'Le message est requis')
    .min(10, 'Le message doit contenir au moins 10 caractères')
    .max(2000, 'Le message est trop long (maximum 2000 caractères)')
    .refine(noHTMLRefinement, {
      message: 'Le message ne peut pas contenir de balises HTML ou de scripts',
    })
    .refine((value) => !containsSQLInjection(value), {
      message: 'Le message contient des caractères non autorisés',
    }),
  company2: z.string().max(0, 'Ce champ doit rester vide').optional(), // Honeypot
})

export type ContactFormData = z.infer<typeof contactFormSchema>

// ============================================================================
// CHECKOUT FORM VALIDATION
// ============================================================================

export const checkoutFormSchema = z.object({
  customerName: nameSchema,
  email: emailSchema,
  phone: z
    .string()
    .min(1, 'Le téléphone est requis')
    .max(50, 'Le numéro de téléphone est trop long (maximum 50 caractères)')
    .regex(/^[\d\s\-\+\(\)]+$/, 'Format de téléphone invalide (caractères autorisés: chiffres, espaces, +, -, parenthèses)')
    .refine(noHTMLRefinement, {
      message: 'Le téléphone ne peut pas contenir de balises HTML',
    })
    .refine((value) => !containsSQLInjection(value), {
      message: 'Le téléphone contient des caractères non autorisés',
    }),
  address: z
    .string()
    .min(1, 'L\'adresse est requise')
    .min(5, 'L\'adresse doit contenir au moins 5 caractères')
    .max(500, 'L\'adresse est trop longue (maximum 500 caractères)')
    .refine(noHTMLRefinement, {
      message: 'L\'adresse ne peut pas contenir de balises HTML',
    })
    .refine((value) => !containsSQLInjection(value), {
      message: 'L\'adresse contient des caractères non autorisés',
    })
    .refine((value) => !containsPathTraversal(value), {
      message: 'L\'adresse contient des caractères non autorisés',
    }),
  city: z
    .string()
    .min(1, 'La ville est requise')
    .min(2, 'La ville doit contenir au moins 2 caractères')
    .max(100, 'La ville est trop longue (maximum 100 caractères)')
    .refine(noHTMLRefinement, {
      message: 'La ville ne peut pas contenir de balises HTML',
    })
    .refine((value) => !containsSQLInjection(value), {
      message: 'La ville contient des caractères non autorisés',
    }),
  country: z
    .string()
    .min(1, 'Le pays est requis')
    .min(2, 'Le pays doit contenir au moins 2 caractères')
    .max(100, 'Le pays est trop long (maximum 100 caractères)')
    .refine(noHTMLRefinement, {
      message: 'Le pays ne peut pas contenir de balises HTML',
    })
    .refine((value) => !containsSQLInjection(value), {
      message: 'Le pays contient des caractères non autorisés',
    }),
  notes: z
    .string()
    .max(1000, 'Les notes sont trop longues (maximum 1000 caractères)')
    .refine((value) => !value || noHTMLRefinement(value), {
      message: 'Les notes ne peuvent pas contenir de balises HTML',
    })
    .refine((value) => !value || !containsSQLInjection(value), {
      message: 'Les notes contiennent des caractères non autorisés',
    })
    .optional()
    .nullable(),
})

export type CheckoutFormData = z.infer<typeof checkoutFormSchema>

// ============================================================================
// NEWSLETTER FORM VALIDATION
// ============================================================================

export const newsletterFormSchema = z.object({
  email: emailSchema,
})

export type NewsletterFormData = z.infer<typeof newsletterFormSchema>

// ============================================================================
// CLIENT-SIDE VALIDATION HELPERS
// ============================================================================

/**
 * Validate form data on client side
 * Returns errors object for inline display
 */
export function validateFormData<T extends z.ZodTypeAny>(
  schema: T,
  data: unknown
): {
  isValid: boolean
  errors: Record<string, string>
  data?: z.infer<T>
} {
  const result = schema.safeParse(data)

  if (result.success) {
    return {
      isValid: true,
      errors: {},
      data: result.data,
    }
  }

  // Format Zod errors into a simple object
  const errors: Record<string, string> = {}
  if (result.error && result.error.issues) {
    result.error.issues.forEach((issue) => {
      const path = issue.path.join('.')
      if (!errors[path]) {
        errors[path] = issue.message
      }
    })
  }

  return {
    isValid: false,
    errors,
  }
}

/**
 * Validate a single field
 */
export function validateField<T extends z.ZodTypeAny>(
  schema: T,
  fieldName: string,
  value: unknown
): string | null {
  try {
    // Extract the field schema from the object schema
    if (schema instanceof z.ZodObject) {
      const fieldSchema = schema.shape[fieldName]
      if (fieldSchema) {
        fieldSchema.parse(value)
        return null
      }
    }
    return 'Champ non trouvé dans le schéma'
  } catch (error) {
    if (error instanceof z.ZodError) {
      return error.issues[0]?.message || 'Erreur de validation'
    }
    return 'Erreur de validation'
  }
}

/**
 * Sanitize form data before validation
 */
export function sanitizeFormData<T extends Record<string, any>>(data: T): T {
  const sanitized = { ...data }
  for (const key in sanitized) {
    if (typeof sanitized[key] === 'string') {
      sanitized[key] = sanitizeString(sanitized[key] as string) as T[Extract<keyof T, string>]
    }
  }
  return sanitized
}
