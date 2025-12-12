# Migration Guide: Product Variants & Enhanced Schema

This guide explains how to safely migrate from the old Prisma schema to the new luxury furniture product schema.

## Overview of Changes

### New Features
- ✅ Product variants (size, fabric, color, finish)
- ✅ Stock per variant (instead of per product)
- ✅ Dimensions (width, depth, height) as separate fields
- ✅ Multiple categories per product (many-to-many)
- ✅ SEO fields (metaTitle, metaDescription)
- ✅ Published/draft state
- ✅ Image ordering (already existed, now indexed)
- ✅ Slug uniqueness (already existed)

### Schema Changes

1. **Product Model**
   - Removed: `categoryId` (single category)
   - Removed: `stock` (moved to variants)
   - Added: `width`, `depth`, `height` (Float?)
   - Added: `metaTitle`, `metaDescription` (String?)
   - Added: `published` (Boolean, default: false)
   - Changed: `categories` relation to many-to-many via `ProductCategory`

2. **New Models**
   - `ProductCategory`: Junction table for many-to-many Product ↔ Category
   - `ProductVariant`: Variants with size, fabric, color, finish, stock, price
   - `ProductMaterial`: Renamed from `Material`, added `order` field

3. **Removed Models**
   - `Color`: Colors are now part of `ProductVariant`

## Migration Steps

### Step 1: Backup Your Database

```bash
# For SQLite
cp prisma/dev.db prisma/dev.db.backup
```

### Step 2: Generate Prisma Migration

```bash
# Generate migration (Prisma will detect schema changes)
npx prisma migrate dev --name add_product_variants

# This will:
# - Create new tables (ProductCategory, ProductVariant, ProductMaterial)
# - Add new columns to Product (width, depth, height, metaTitle, metaDescription, published)
# - Remove old columns (categoryId, stock from Product)
# - Remove old tables (Material, Color)
```

### Step 3: Run Data Migration Script

After the Prisma migration, run the data migration script to preserve existing data:

```bash
npx tsx prisma/migrate-to-variants.ts
```

This script will:
1. Migrate existing `categoryId` relationships to `ProductCategory` table
2. Migrate old `Material` records to `ProductMaterial`
3. Create default variants for all existing products
4. Set default published state

### Step 4: Verify Migration

```bash
# Open Prisma Studio to verify data
npx prisma studio
```

Check:
- ✅ All products have at least one variant
- ✅ Category relationships are preserved
- ✅ Materials are migrated
- ✅ Products are in desired published state

### Step 5: Update Application Code

Update your code to use the new schema:

```typescript
// Old way (single category)
const product = await prisma.product.findUnique({
  where: { slug },
  include: { category: true }
})

// New way (multiple categories)
const product = await prisma.product.findUnique({
  where: { slug },
  include: { 
    categories: { include: { category: true } },
    variants: true,
    materials: true
  }
})

// Old way (single stock)
product.stock

// New way (stock per variant)
product.variants[0].stock
```

## Rollback Plan

If you need to rollback:

1. Restore database backup:
   ```bash
   cp prisma/dev.db.backup prisma/dev.db
   ```

2. Revert Prisma migration:
   ```bash
   npx prisma migrate resolve --rolled-back <migration_name>
   ```

## Important Notes

- **Backward Compatibility**: The migration script preserves all existing data
- **Default Variants**: All products without variants will get a default variant
- **Published State**: Existing products default to `published: false` (change in migration script if needed)
- **Stock Migration**: Old `product.stock` is not automatically migrated to variants. You'll need to manually assign stock to variants if needed.

## Testing

After migration, test:
1. Product listing pages
2. Product detail pages
3. Category filtering
4. Variant selection (if implemented in UI)
5. Stock management

## Support

If you encounter issues:
1. Check Prisma migration logs
2. Verify data in Prisma Studio
3. Review the migration script output
4. Restore from backup if needed

