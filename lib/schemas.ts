import { z } from 'zod'

/**
 * Zod schemas for Prisma models
 * These schemas match the Prisma schema exactly for validation purposes
 */

// ============================================================================
// Category Schema
// ============================================================================

export const categorySchema = z.object({
  id: z.string().cuid(),
  name: z.string(),
  slug: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export type Category = z.infer<typeof categorySchema>

// ============================================================================
// Product Schema
// ============================================================================

export const productSchema = z.object({
  id: z.string().cuid(),
  name: z.string(),
  slug: z.string(),
  description: z.string().nullable(),
  price: z.number().int(), // Base price (can be overridden by variants)
  // Dimensions
  width: z.number().nullable(), // Width in cm (Float? in Prisma)
  depth: z.number().nullable(), // Depth in cm (Float? in Prisma)
  height: z.number().nullable(), // Height in cm (Float? in Prisma)
  // SEO fields
  metaTitle: z.string().nullable(),
  metaDescription: z.string().nullable(),
  // Publishing state
  published: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export type Product = z.infer<typeof productSchema>

// ============================================================================
// ProductVariant Schema
// ============================================================================

export const productVariantSchema = z.object({
  id: z.string().cuid(),
  productId: z.string().cuid(),
  // Variant attributes
  size: z.string().nullable(), // e.g., "Small", "Medium", "Large", "Custom"
  fabric: z.string().nullable(), // e.g., "Velvet", "Leather", "Linen"
  color: z.string().nullable(), // e.g., "Navy", "Beige", "Charcoal"
  finish: z.string().nullable(), // e.g., "Matte", "Glossy", "Natural"
  // Pricing and stock
  price: z.number().int().nullable(), // Variant-specific price (overrides base price if set)
  stock: z.number().int(), // Stock quantity for this variant
  sku: z.string().nullable(), // Stock Keeping Unit (optional but recommended)
  // Metadata
  isDefault: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export type ProductVariant = z.infer<typeof productVariantSchema>

// ============================================================================
// ProductMaterial Schema
// ============================================================================

export const productMaterialSchema = z.object({
  id: z.string().cuid(),
  name: z.string(),
  productId: z.string().cuid(),
  order: z.number().int(),
  createdAt: z.date(),
})

export type ProductMaterial = z.infer<typeof productMaterialSchema>

// ============================================================================
// ProductImage Schema
// ============================================================================

export const productImageSchema = z.object({
  id: z.string().cuid(),
  url: z.string(),
  productId: z.string().cuid(),
  alt: z.string().nullable(),
  order: z.number().int(), // Order of images (0 = first, 1 = second, etc.)
  createdAt: z.date(),
})

export type ProductImage = z.infer<typeof productImageSchema>

// ============================================================================
// ProductCategory Schema (Junction table)
// ============================================================================

export const productCategorySchema = z.object({
  id: z.string().cuid(),
  productId: z.string().cuid(),
  categoryId: z.string().cuid(),
  order: z.number().int(), // Order of categories for a product
  createdAt: z.date(),
})

export type ProductCategory = z.infer<typeof productCategorySchema>

// ============================================================================
// Create/Update Input Schemas (for API validation)
// ============================================================================

// Category Input
export const createCategorySchema = categorySchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
})

export const updateCategorySchema = createCategorySchema.partial()

export type CreateCategoryInput = z.infer<typeof createCategorySchema>
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>

// Product Input
export const createProductSchema = productSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
})

export const updateProductSchema = createProductSchema.partial()

export type CreateProductInput = z.infer<typeof createProductSchema>
export type UpdateProductInput = z.infer<typeof updateProductSchema>

// ProductVariant Input
export const createProductVariantSchema = productVariantSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
})

export const updateProductVariantSchema = createProductVariantSchema.partial()

export type CreateProductVariantInput = z.infer<typeof createProductVariantSchema>
export type UpdateProductVariantInput = z.infer<typeof updateProductVariantSchema>

// ProductMaterial Input
export const createProductMaterialSchema = productMaterialSchema.omit({
  id: true,
  createdAt: true,
})

export const updateProductMaterialSchema = createProductMaterialSchema.partial()

export type CreateProductMaterialInput = z.infer<typeof createProductMaterialSchema>
export type UpdateProductMaterialInput = z.infer<typeof updateProductMaterialSchema>

// ProductImage Input
export const createProductImageSchema = productImageSchema.omit({
  id: true,
  createdAt: true,
})

export const updateProductImageSchema = createProductImageSchema.partial()

export type CreateProductImageInput = z.infer<typeof createProductImageSchema>
export type UpdateProductImageInput = z.infer<typeof updateProductImageSchema>

// ProductCategory Input
export const createProductCategorySchema = productCategorySchema.omit({
  id: true,
  createdAt: true,
})

export const updateProductCategorySchema = createProductCategorySchema.partial()

export type CreateProductCategoryInput = z.infer<typeof createProductCategorySchema>
export type UpdateProductCategoryInput = z.infer<typeof updateProductCategorySchema>

// ============================================================================
// Schema with Relations (for queries with includes)
// ============================================================================

export const productWithRelationsSchema = productSchema.extend({
  categories: z.array(
    productCategorySchema.extend({
      category: categorySchema,
    })
  ),
  images: z.array(productImageSchema),
  materials: z.array(productMaterialSchema),
  variants: z.array(productVariantSchema),
})

export type ProductWithRelations = z.infer<typeof productWithRelationsSchema>

export const categoryWithRelationsSchema = categorySchema.extend({
  products: z.array(
    productCategorySchema.extend({
      product: productSchema,
    })
  ),
})

export type CategoryWithRelations = z.infer<typeof categoryWithRelationsSchema>

// ============================================================================
// JSON Response Schemas (dates as strings for API responses)
// ============================================================================

// Helper to convert date fields to string for JSON responses
const dateToString = z.union([
  z.string().datetime(), // ISO 8601 string
  z.date().transform((date) => date.toISOString()), // Date object -> string
])

// Product schema for JSON responses (dates as strings)
export const productResponseSchema = productSchema.extend({
  createdAt: dateToString,
  updatedAt: dateToString,
})

export type ProductResponse = z.infer<typeof productResponseSchema>

// ProductVariant schema for JSON responses
export const productVariantResponseSchema = productVariantSchema.extend({
  createdAt: dateToString,
  updatedAt: dateToString,
})

export type ProductVariantResponse = z.infer<typeof productVariantResponseSchema>

// ProductImage schema for JSON responses
export const productImageResponseSchema = productImageSchema.extend({
  createdAt: dateToString,
})

export type ProductImageResponse = z.infer<typeof productImageResponseSchema>

// ProductMaterial schema for JSON responses
export const productMaterialResponseSchema = productMaterialSchema.extend({
  createdAt: dateToString,
})

export type ProductMaterialResponse = z.infer<typeof productMaterialResponseSchema>

// ProductCategory schema for JSON responses
export const productCategoryResponseSchema = productCategorySchema.extend({
  createdAt: dateToString,
  category: categorySchema.extend({
    createdAt: dateToString,
    updatedAt: dateToString,
  }),
})

export type ProductCategoryResponse = z.infer<typeof productCategoryResponseSchema>

// Product with relations for JSON responses
export const productWithRelationsResponseSchema = productSchema.extend({
  createdAt: dateToString,
  updatedAt: dateToString,
  categories: z.array(
    productCategoryResponseSchema
  ),
  images: z.array(productImageResponseSchema),
  materials: z.array(productMaterialResponseSchema),
  variants: z.array(productVariantResponseSchema),
})

export type ProductWithRelationsResponse = z.infer<typeof productWithRelationsResponseSchema>

