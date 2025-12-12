# 🗄️ PostgreSQL Setup Guide

This guide will help you set up PostgreSQL for your Vercel deployment. You have two main options:

---

## Option 1: Vercel Postgres (Recommended - Easiest)

Vercel Postgres is the simplest option since it integrates directly with your Vercel project.

### Step 1: Create Vercel Postgres Database

1. **Go to Vercel Dashboard**
   - Visit [vercel.com](https://vercel.com)
   - Sign in to your account

2. **Navigate to Storage**
   - Click on your project (or create one first)
   - Go to the **"Storage"** tab
   - Click **"Create Database"**

3. **Select Postgres**
   - Choose **"Postgres"** from the options
   - Select **"Hobby"** plan (Free tier - perfect for getting started)
   - Click **"Create"**

4. **Copy Connection String**
   - After creation, you'll see a connection string like:
     ```
     postgres://default:xxxxx@xxxxx.xxxxx.postgres.vercel-storage.com:5432/verceldb
     ```
   - **Save this URL** - you'll need it for environment variables

### Step 2: Add Database URL to Environment Variables

1. In Vercel dashboard, go to **Project Settings** → **Environment Variables**
2. Add a new variable:
   - **Name:** `DATABASE_URL`
   - **Value:** Your PostgreSQL connection string
   - **Environment:** Select all (Production, Preview, Development)
3. Click **"Save"**

### Step 3: Update Prisma Schema (Already Done ✅)

Your `prisma/schema.prisma` has already been updated to use PostgreSQL:
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

### Step 4: Run Migrations

After deploying to Vercel, migrations will run automatically. But you can also test locally:

```powershell
# Set your DATABASE_URL (use the one from Vercel)
$env:DATABASE_URL="postgres://default:xxxxx@xxxxx.xxxxx.postgres.vercel-storage.com:5432/verceldb"

# Generate Prisma Client
npx prisma generate

# Push schema to database (creates all tables)
npx prisma db push

# Or use migrations (recommended for production)
npx prisma migrate deploy
```

---

## Option 2: Supabase (Free Tier Available)

Supabase offers a generous free tier and is a great alternative.

### Step 1: Create Supabase Project

1. **Sign Up**
   - Go to [supabase.com](https://supabase.com)
   - Click **"Start your project"** or **"Sign in"**
   - Sign in with GitHub (easiest)

2. **Create New Project**
   - Click **"New Project"**
   - Fill in:
     - **Name:** `bk-agencements` (or your preferred name)
     - **Database Password:** Create a strong password (save it!)
     - **Region:** Choose closest to your users (e.g., `West US` or `Europe West`)
   - Click **"Create new project"**
   - Wait 2-3 minutes for setup

### Step 2: Get Connection String

1. **Go to Project Settings**
   - In your Supabase project dashboard
   - Click **"Settings"** (gear icon) → **"Database"**

2. **Copy Connection String**
   - Scroll to **"Connection string"** section
   - Select **"URI"** tab
   - Copy the connection string (it looks like):
     ```
     postgresql://postgres:[YOUR-PASSWORD]@db.xxxxx.supabase.co:5432/postgres
     ```
   - **Replace `[YOUR-PASSWORD]`** with your actual database password
   - **Save this complete URL**

### Step 3: Add to Vercel Environment Variables

1. In Vercel dashboard → **Project Settings** → **Environment Variables**
2. Add:
   - **Name:** `DATABASE_URL`
   - **Value:** Your Supabase connection string (with password replaced)
   - **Environment:** All environments
3. Click **"Save"**

### Step 4: Run Migrations

Same as Option 1 - use the commands above with your Supabase connection string.

---

## Step 5: Migrate Data from SQLite (If You Have Existing Data)

If you have data in your SQLite database that you want to migrate:

### Option A: Manual Migration (Small Amounts of Data)

1. **Export from SQLite:**
   ```powershell
   # Install sqlite3 if needed
   # Then export data to CSV or SQL
   ```

2. **Import to PostgreSQL:**
   - Use Supabase SQL Editor or pgAdmin
   - Or use Prisma Studio to manually add data

### Option B: Use Prisma Migrate (Recommended)

1. **Set up both databases temporarily:**
   ```powershell
   # Keep SQLite for reading
   # Set PostgreSQL for writing
   $env:DATABASE_URL="postgresql://..."
   ```

2. **Create a migration script:**
   ```typescript
   // scripts/migrate-data.ts
   import { PrismaClient as SQLiteClient } from '@prisma/client'
   import { PrismaClient as PostgresClient } from '@prisma/client'

   // Read from SQLite, write to PostgreSQL
   ```

3. **Or use Prisma Studio:**
   ```powershell
   # View SQLite data
   npx prisma studio
   # Then manually copy important data to PostgreSQL
   ```

### Option C: Start Fresh (Easiest)

If you don't have critical data yet, just start fresh:
1. Run `npx prisma db push` to create tables
2. Use your admin panel to add products/categories
3. Or create a seed script (see below)

---

## Step 6: Seed Your Database (Optional)

Create initial data for your database:

### Create Seed Script

1. **Check if seed script exists:**
   ```powershell
   # Look for prisma/seed.ts
   ```

2. **If it doesn't exist, create one:**
   ```typescript
   // prisma/seed.ts
   import { PrismaClient } from '@prisma/client'

   const prisma = new PrismaClient()

   async function main() {
     // Create categories
     const category1 = await prisma.category.create({
       data: {
         name: 'Chaise',
         slug: 'chaise',
         description: 'Chaises élégantes',
       },
     })

     // Create products
     await prisma.product.create({
       data: {
         name: 'Chaise Contemporaine 01',
         slug: 'chaise-contemporaine-01',
         description: 'Une chaise élégante...',
         price: 125000, // in cents (1250.00 EUR)
         stock: 10,
         isPublished: true,
         categoryId: category1.id,
         images: {
           create: [
             {
               url: '/images/chaise-1.jpg',
               alt: 'Chaise Contemporaine 01',
               order: 0,
             },
           ],
         },
       },
     })

     // Create admin user
     const bcrypt = require('bcrypt')
     await prisma.admin.create({
       data: {
         email: 'admin@bk-agencements.com',
         password: await bcrypt.hash('your-secure-password', 10),
       },
     })

     console.log('✅ Database seeded successfully!')
   }

   main()
     .catch((e) => {
       console.error(e)
       process.exit(1)
     })
     .finally(async () => {
       await prisma.$disconnect()
     })
   ```

3. **Run the seed:**
   ```powershell
   # Set DATABASE_URL first
   $env:DATABASE_URL="postgresql://..."
   
   # Run seed
   npx prisma db seed
   # Or: tsx prisma/seed.ts
   ```

---

## Step 7: Verify Connection

Test that your PostgreSQL connection works:

```powershell
# Set DATABASE_URL
$env:DATABASE_URL="postgresql://..."

# Test connection
npx prisma db pull

# Or open Prisma Studio
npx prisma studio
```

If Prisma Studio opens in your browser, your connection is working! ✅

---

## Troubleshooting

### Connection Refused

**Problem:** Can't connect to database
- **Solution:** 
  - Check connection string is correct
  - Verify password is correct (for Supabase)
  - Check if database allows connections from your IP
  - For Supabase: Go to Settings → Database → Connection Pooling (use transaction mode)

### SSL Required

**Problem:** "SSL connection required"
- **Solution:** Add `?sslmode=require` to connection string:
  ```
  postgresql://user:pass@host:5432/db?sslmode=require
  ```

### Migration Errors

**Problem:** Migrations fail
- **Solution:**
  - Make sure schema is correct
  - Try `npx prisma db push` instead of migrate
  - Check for conflicting migrations

### Connection Pool Exhausted

**Problem:** Too many connections
- **Solution:**
  - Use connection pooling (Supabase provides this)
  - For Vercel Postgres, connections are managed automatically
  - Add `?connection_limit=1` to connection string if needed

---

## Quick Reference

### Vercel Postgres
- **Free Tier:** 256 MB storage, 60 hours compute/month
- **Connection:** Automatic via Vercel dashboard
- **Best For:** Simple deployments, Vercel projects

### Supabase
- **Free Tier:** 500 MB database, 2 GB bandwidth
- **Connection:** Manual setup, connection pooling available
- **Best For:** More control, larger free tier

### Connection String Format
```
postgresql://[USER]:[PASSWORD]@[HOST]:[PORT]/[DATABASE]?sslmode=require
```

---

## Next Steps

After setting up PostgreSQL:

1. ✅ **Test locally** with `npx prisma studio`
2. ✅ **Deploy to Vercel** (migrations run automatically)
3. ✅ **Verify in production** - check your app works
4. ✅ **Set up backups** (Vercel Postgres has automatic backups)

---

**Need Help?**
- Vercel Postgres Docs: https://vercel.com/docs/storage/vercel-postgres
- Supabase Docs: https://supabase.com/docs
- Prisma Docs: https://www.prisma.io/docs

