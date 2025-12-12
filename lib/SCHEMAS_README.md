# Zod Schemas for Prisma Models

This file contains Zod validation schemas that exactly match the Prisma models for type-safe validation.

## Installation

First, install Zod if not already installed:

```bash
npm install zod
```

## Usage

### Basic Validation

```typescript
import { productSchema, Product } from '@/lib/schemas'

// Validate data
const result = productSchema.safeParse(data)
if (result.success) {
  const product: Product = result.data
} else {
  console.error(result.error)
}
```

### API Route Validation

```typescript
import { createProductSchema } from '@/lib/schemas'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const body = await request.json()
  
  const validation = createProductSchema.safeParse(body)
  if (!validation.success) {
    return NextResponse.json(
      { error: validation.error.errors },
      { status: 400 }
    )
  }
  
  const productData = validation.data
  // Use productData to create product in database
}
```

### Type Inference

All types are exported and inferred from Zod schemas:

```typescript
import type { 
  Product, 
  Category, 
  ProductVariant, 
  ProductMaterial, 
  ProductImage,
  ProductWithRelations 
} from '@/lib/schemas'
```

## Available Schemas

### Core Models

- `categorySchema` - Category model
- `productSchema` - Product model
- `productVariantSchema` - ProductVariant model
- `productMaterialSchema` - ProductMaterial model
- `productImageSchema` - ProductImage model
- `productCategorySchema` - ProductCategory junction table

### Input Schemas (for API validation)

- `createCategorySchema` / `updateCategorySchema`
- `createProductSchema` / `updateProductSchema`
- `createProductVariantSchema` / `updateProductVariantSchema`
- `createProductMaterialSchema` / `updateProductMaterialSchema`
- `createProductImageSchema` / `updateProductImageSchema`
- `createProductCategorySchema` / `updateProductCategorySchema`

### Relation Schemas

- `productWithRelationsSchema` - Product with categories, images, materials, variants
- `categoryWithRelationsSchema` - Category with products

## Schema Mapping

| Prisma Type | Zod Schema |
|------------|------------|
| `String` | `z.string()` |
| `String?` | `z.string().nullable()` |
| `Int` | `z.number().int()` |
| `Int?` | `z.number().int().nullable()` |
| `Float?` | `z.number().nullable()` |
| `Boolean` | `z.boolean()` |
| `DateTime` | `z.date()` |
| `@id @default(cuid())` | `z.string().cuid()` |

## Notes

- All schemas match the Prisma schema exactly
- Nullable fields use `.nullable()` (Prisma's `?` syntax)
- Integer fields use `.int()` for validation
- CUID fields use `.cuid()` for validation
- Date fields use `.date()` for validation
- Input schemas omit auto-generated fields (id, createdAt, updatedAt)


