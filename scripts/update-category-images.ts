import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Map category names to their image URLs
  const categoryImageMap: Record<string, string> = {
    'Chaise': '/chaise.jpg',
    'chaise': '/chaise.jpg',
    'Fauteuil': '/fauteuil.jpg',
    'fauteuil': '/fauteuil.jpg',
    'Console': '/console.jpg',
    'console': '/console.jpg',
    'Table basse': '/table basse.jpg',
    'table basse': '/table basse.jpg',
    "Table d'appoint": '/Table dappoint.jpg',
    'Table dappoint': '/Table dappoint.jpg',
    'table dappoint': '/Table dappoint.jpg',
    'Meuble TV': '/meuble tv.jpg',
    'meuble tv': '/meuble tv.jpg',
    'MeubleTV': '/meuble tv.jpg',
  }

  const categories = await prisma.category.findMany()

  for (const category of categories) {
    const imageUrl = categoryImageMap[category.name] || null
    
    if (imageUrl) {
      await prisma.category.update({
        where: { id: category.id },
        data: { imageUrl },
      })
      console.log(`✅ Updated "${category.name}" with image: ${imageUrl}`)
    } else {
      console.log(`⚠️  No image mapping found for "${category.name}"`)
    }
  }

  console.log('\n✅ All categories updated!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })



