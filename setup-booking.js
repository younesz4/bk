#!/usr/bin/env node

/**
 * Setup script for booking system
 * This script helps set up the environment and database
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Setting up Booking System...\n');

// Create .env.local file
const envContent = `# Database
DATABASE_URL="file:./prisma/dev.db"

# SendGrid Email Configuration
# Get your API key from: https://app.sendgrid.com/settings/api_keys
SENDGRID_API_KEY="REPLACE_WITH_YOUR_SENDGRID_API_KEY"
FROM_EMAIL="noreply@bk-agencements.com"
ADMIN_EMAIL="youneszaaimi4@gmail.com"

# Admin Token (for accessing bookings API)
# Generate a strong random token
ADMIN_TOKEN="bk-agencements-admin-2025-secure-token-${Math.random().toString(36).substring(2, 15)}"

# Optional: App URL for admin email links
NEXT_PUBLIC_APP_URL="http://localhost:3000"
`;

const envPath = path.join(process.cwd(), '.env.local');

if (!fs.existsSync(envPath)) {
  fs.writeFileSync(envPath, envContent);
  console.log('✅ Created .env.local file');
  console.log('⚠️  Please update SENDGRID_API_KEY with your actual SendGrid API key\n');
} else {
  console.log('⚠️  .env.local already exists, skipping...\n');
}

// Run Prisma commands
console.log('📦 Generating Prisma Client...');
try {
  execSync('npx prisma generate', { stdio: 'inherit' });
  console.log('✅ Prisma Client generated\n');
} catch (error) {
  console.error('❌ Error generating Prisma Client:', error.message);
  console.log('💡 Try running manually: npx prisma generate\n');
}

console.log('🗄️  Running database migrations...');
try {
  execSync('npx prisma migrate dev --name init', { stdio: 'inherit' });
  console.log('✅ Database migrations completed\n');
} catch (error) {
  console.error('❌ Error running migrations:', error.message);
  console.log('💡 Try running manually: npx prisma migrate dev --name init\n');
}

console.log('✨ Setup complete!');
console.log('\n📝 Next steps:');
console.log('1. Update SENDGRID_API_KEY in .env.local with your SendGrid API key');
console.log('2. Verify FROM_EMAIL is a verified sender in SendGrid');
console.log('3. Start the dev server: npm run dev');
console.log('4. Test the booking endpoint at: http://localhost:3000/api/bookings\n');



