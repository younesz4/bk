# Prisma Schema Refactoring Summary

## Overview

The Prisma schema has been refactored to support luxury furniture products with advanced features including variants, multi-category support, dimensions, SEO fields, and publishing states.

## ✅ Completed Features

### 1. Product Variants
- **Model**: `ProductVariant`
- **Attributes**: `size`, `fabric`, `color`, `finish` (all optional)
- **Stock**: Per-variant stock tracking (`stock` field)
- **Pricing**: Variant-specific pricing (`price` field, overrides base product price)
- **SKU**: Optional unique Stock Keeping Unit
- **Default**: `isDefault` flag to mark primary variant

### 2. Stock Per Variant
- Stock moved from `Product` to `ProductVariant`
- Each variant can have independent stock levels
- Base product no longer has stock field

### 3. Dimensions
- **Fields**: `width`, `depth`, `height` (all Float?, in cm)
- Stored as separate numeric fields for filtering/sorting
- Optional fields for flexibility

### 4. Multiple Categories Per Product
- **Model**: `ProductCategory` (junction table)
- Many-to-many relationship between `Product` and `Category`
- `order` field for category ordering
- Unique constraint on `[productId, categoryId]`

### 5. SEO Fields
- **Fields**: `metaTitle`, `metaDescription` (both optional String?)
- Separate from product description for SEO optimization

### 6. Slug Uniqueness
- Already enforced with `@unique` constraint on `Product.slug`
- Maintained in new schema

### 7. Image Ordering
- `ProductImage.order` field already existed
- Added index on `[productId, order]` for efficient sorting
- Added `createdAt` timestamp

### 8. Published/Draft State
- **Field**: `published` (Boolean, default: `false`)
- Allows draft products not visible to customers
- Can be filtered in queries

## Schema Changes

### New Models

1. **ProductCategory**
   - Junction table for many-to-many Product ↔ Category
   - Fields: `id`, `productId`, `categoryId`, `order`, `createdAt`
   - Unique constraint: `[productId, categoryId]`
   - Indexes on `productId` and `categoryId`

2. **ProductVariant**
   - Variant attributes: `size`, `fabric`, `color`, `finish`
   - Stock and pricing: `stock`, `price`, `sku`
   - Metadata: `isDefault`, `createdAt`, `updatedAt`
   - Indexes on `productId` and `sku`

3. **ProductMaterial** (renamed from `Material`)
   - Added `order` field for material ordering
   - Added `createdAt` timestamp
   - Index on `productId`

### Modified Models

1. **Product**
   - Removed: `categoryId`, `stock`
   - Added: `width`, `depth`, `height`, `metaTitle`, `metaDescription`, `published`
   - Relations: `categories` (many-to-many), `variants`, `materials`

2. **Category**
   - Relation changed from `Product[]` to `ProductCategory[]`

3. **ProductImage**
   - Added `createdAt` timestamp
   - Added index on `[productId, order]`

### Removed Models

- **Color**: Colors are now part of `ProductVariant.color` field

## Migration Strategy

1. **Prisma Migration**: Run `npx prisma migrate dev --name add_product_variants`
   - Creates new tables and columns
   - Removes old columns and tables
   - Preserves existing data where possible

2. **Data Migration**: Run `npx tsx prisma/migrate-to-variants.ts`
   - Migrates category relationships
   - Migrates materials
   - Creates default variants
   - Sets published state

3. **Verification**: Use Prisma Studio to verify data integrity

## Usage Examples

### Creating a Product with Variants

```typescript
const product = await prisma.product.create({
  data: {
    name: "Luxury Chair",
    slug: "luxury-chair",
    price: 1250,
    width: 55,
    depth: 55,
    height: 85,
    metaTitle: "Luxury Chair - BK Agencements",
    metaDescription: "Elegant luxury chair with premium materials",
    published: true,
    categories: {
      create: [
        { category: { connect: { slug: "chaises" } }, order: 0 }
      ]
    },
    variants: {
      create: [
        {
          size: "Standard",
          fabric: "Velvet",
          color: "Navy",
          finish: "Matte",
          stock: 5,
          price: 1250,
          sku: "LC-VEL-NAV-MAT",
          isDefault: true
        },
        {
          size: "Standard",
          fabric: "Leather",
          color: "Beige",
          finish: "Glossy",
          stock: 3,
          price: 1450,
          sku: "LC-LEA-BEI-GLO",
          isDefault: false
        }
      ]
    },
    materials: {
      create: [
        { name: "Noyer massif", order: 0 },
        { name: "Cuir italien", order: 1 }
      ]
    }
  }
})
```

### Querying Products with Variants

```typescript
const products = await prisma.product.findMany({
  where: {
    published: true,
    categories: {
      some: {
        category: {
          slug: "chaises"
        }
      }
    }
  },
  include: {
    categories: {
      include: {
        category: true
      },
      orderBy: {
        order: "asc"
      }
    },
    variants: {
      where: {
        stock: { gt: 0 }
      },
      orderBy: {
        isDefault: "desc"
      }
    },
    images: {
      orderBy: {
        order: "asc"
      }
    },
    materials: {
      orderBy: {
        order: "asc"
      }
    }
  }
})
```

## Backward Compatibility

- All new fields are optional (nullable)
- Migration script preserves existing data
- Default variants created for all products
- Existing queries will need updates to use new relations

## Next Steps

1. Run Prisma migration: `npx prisma migrate dev`
2. Run data migration: `npx tsx prisma/migrate-to-variants.ts`
3. Update application code to use new schema
4. Test product creation, listing, and filtering
5. Update UI to support variant selection

