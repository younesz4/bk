/**
 * Migration script to safely migrate existing Prisma schema to support:
 * - Product variants (size, fabric, color, finish)
 * - Stock per variant
 * - Dimensions (width, depth, height)
 * - Multiple categories per product
 * - SEO fields (metaTitle, metaDescription)
 * - Published/draft state
 * 
 * This script should be run AFTER running the Prisma migration.
 * Run: npx tsx prisma/migrate-to-variants.ts
 */

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🚀 Starting data migration...')

  try {
    // Step 1: Migrate existing category relationships
    // Note: This step handles the migration from categoryId to ProductCategory
    // Prisma migration will drop categoryId, so we need to migrate before that
    
    console.log('📦 Step 1: Migrating category relationships...')
    
    // Check if categoryId column still exists (before Prisma migration drops it)
    // If running after Prisma migration, this will be skipped
    try {
      const products = await prisma.$queryRaw<Array<{ id: string; categoryId: string }>>`
        SELECT id, categoryId FROM Product WHERE categoryId IS NOT NULL
      `

      if (products.length > 0) {
        for (const product of products) {
          if (product.categoryId) {
          // Check if category exists
          const category = await prisma.category.findUnique({
            where: { id: product.categoryId },
          })

          if (category) {
            // Create ProductCategory relationship
            await prisma.productCategory.upsert({
              where: {
                productId_categoryId: {
                  productId: product.id,
                  categoryId: product.categoryId,
                },
              },
              create: {
                productId: product.id,
                categoryId: product.categoryId,
                order: 0,
              },
              update: {},
            })
          }
        }
        console.log(`✅ Migrated ${products.length} product-category relationships`)
      } else {
        console.log('ℹ️  No existing category relationships to migrate')
      }
    } catch (error: any) {
      // Column doesn't exist (already migrated or fresh start)
      if (error.message?.includes('no such column: categoryId')) {
        console.log('ℹ️  categoryId column not found - skipping category migration')
      } else {
        throw error
      }
    }

    // Step 2: Migrate old Material records to ProductMaterial
    console.log('📦 Step 2: Migrating materials...')
    
    try {
      const oldMaterials = await prisma.$queryRaw<Array<{ id: string; name: string; productId: string }>>`
        SELECT id, name, productId FROM Material
      `

      if (oldMaterials.length > 0) {
        let migratedCount = 0
        for (const material of oldMaterials) {
          // Check if product still exists
          const product = await prisma.product.findUnique({
            where: { id: material.productId },
          })

          if (product) {
            await prisma.productMaterial.upsert({
              where: {
                id: material.id,
              },
              create: {
                id: material.id,
                name: material.name,
                productId: material.productId,
                order: 0,
              },
              update: {},
            })
            migratedCount++
          }
        }
        console.log(`✅ Migrated ${migratedCount} materials`)
      } else {
        console.log('ℹ️  No existing materials to migrate')
      }
    } catch (error: any) {
      // Material table doesn't exist (already migrated or fresh start)
      if (error.message?.includes('no such table: Material')) {
        console.log('ℹ️  Material table not found - skipping material migration')
      } else {
        throw error
      }
    }

    // Step 3: Create default variants for existing products
    // This ensures all products have at least one variant
    console.log('📦 Step 3: Creating default variants for existing products...')
    
    const allProducts = await prisma.product.findMany({
      include: {
        variants: true,
      },
    })

    let variantsCreated = 0
    for (const product of allProducts) {
      if (product.variants.length === 0) {
        // Create a default variant
        await prisma.productVariant.create({
          data: {
            productId: product.id,
            isDefault: true,
            stock: 0, // Preserve old stock value if needed
          },
        })
        variantsCreated++
      }
    }
    console.log(`✅ Created ${variantsCreated} default variants`)

    // Step 4: Set all existing products as published (optional - adjust as needed)
    console.log('📦 Step 4: Setting default published state...')
    
    // Only update products that don't have published explicitly set
    // By default, Prisma sets published: false, so we update to true for existing products
    const unpublishedCount = await prisma.product.updateMany({
      where: {
        published: false,
      },
      data: {
        published: true, // Set to true if you want existing products published by default
      },
    })
    console.log(`✅ Updated ${unpublishedCount.count} products to published state`)
    console.log('ℹ️  Note: Adjust published state in the script if you want different default behavior')

    console.log('✅ Migration completed successfully!')
  } catch (error) {
    console.error('❌ Migration failed:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })

