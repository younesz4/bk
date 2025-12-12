/**
 * Script to create the default admin user
 * Run with: npx tsx scripts/create-admin.ts
 */

import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  const email = 'admin@bk-agencements.com'
  const password = 'bk2025admin'

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 12)

  // Check if admin already exists
  const existingAdmin = await prisma.admin.findUnique({
    where: { email },
  })

  if (existingAdmin) {
    console.log('✅ Admin user already exists')
    // Update password if needed
    await prisma.admin.update({
      where: { email },
      data: { password: hashedPassword },
    })
    console.log('✅ Admin password updated')
    return
  }

  // Create admin
  const admin = await prisma.admin.create({
    data: {
      email,
      password: hashedPassword,
    },
  })

  console.log('✅ Admin user created successfully!')
  console.log('📧 Email:', email)
  console.log('🔑 Password:', password)
  console.log('⚠️  Please change the password after first login!')
}

main()
  .catch((e) => {
    console.error('❌ Error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
