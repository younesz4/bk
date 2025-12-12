/**
 * Script to create admin user
 * Usage: npx tsx scripts/create-admin-user.ts
 */

import { prisma } from '../lib/prisma'
import bcrypt from 'bcrypt'

async function createAdminUser() {
  const email = process.env.ADMIN_EMAIL
  const password = process.env.ADMIN_PASSWORD

  if (!email || !password) {
    console.error('❌ ADMIN_EMAIL and ADMIN_PASSWORD must be set in .env')
    console.error('Example:')
    console.error('ADMIN_EMAIL=admin@example.com')
    console.error('ADMIN_PASSWORD=your-secure-password')
    process.exit(1)
  }

  if (password.length < 6) {
    console.error('❌ Password must be at least 6 characters long')
    process.exit(1)
  }

  try {
    // Check if admin already exists
    const existing = await prisma.adminUser.findUnique({
      where: { email: email.trim().toLowerCase() },
    })

    if (existing) {
      console.log('ℹ️  Admin user with this email already exists')
      console.log(`   Email: ${existing.email}`)
      console.log(`   ID: ${existing.id}`)
      process.exit(0)
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 12)

    // Create admin user
    const admin = await prisma.adminUser.create({
      data: {
        email: email.trim().toLowerCase(),
        passwordHash,
      },
    })

    console.log('✅ Admin user created successfully!')
    console.log(`   ID: ${admin.id}`)
    console.log(`   Email: ${admin.email}`)
  } catch (error: any) {
    console.error('❌ Error creating admin user:', error.message)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

createAdminUser()



