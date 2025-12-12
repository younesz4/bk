import { PrismaClient } from '@prisma/client'
import * as bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  const email = 'admin@bk-agencements.com'
  const password = 'AdminPassword123!' // Change this in production!
  const hashed = await bcrypt.hash(password, 12)

  await prisma.admin.upsert({
    where: { email },
    update: {},
    create: { email, password: hashed },
  })

  console.log('✅ Admin user ready:', email)
  console.log('⚠️  Default password:', password)
  console.log('⚠️  Please change the password after first login!')
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
