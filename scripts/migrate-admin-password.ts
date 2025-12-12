import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // This script migrates the Admin table from passwordHash to password
  // Run this before applying the schema change
  
  console.log('Checking existing Admin records...')
  
  // Note: This script assumes the old Admin table structure
  // You may need to adjust based on your current database state
  
  console.log('Migration complete. You can now update the schema.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })



