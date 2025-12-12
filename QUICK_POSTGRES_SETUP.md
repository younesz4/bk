# ⚡ Quick PostgreSQL Setup (5 Minutes)

## Fastest Way: Vercel Postgres

### Step 1: Create Database (2 minutes)
1. Go to [vercel.com](https://vercel.com) → Your Project → **Storage** tab
2. Click **"Create Database"** → **"Postgres"** → **"Hobby"** (Free)
3. Copy the connection string (looks like `postgres://default:xxx@xxx.postgres.vercel-storage.com:5432/verceldb`)

### Step 2: Add to Vercel (1 minute)
1. Project Settings → **Environment Variables**
2. Add `DATABASE_URL` with your connection string
3. Select all environments (Production, Preview, Development)

### Step 3: Test Locally (2 minutes)
```powershell
# Set connection string
$env:DATABASE_URL="postgres://default:xxx@xxx.postgres.vercel-storage.com:5432/verceldb"

# Generate Prisma Client
npx prisma generate

# Create tables
npx prisma db push

# Create admin user
npx prisma db seed
```

### Step 4: Deploy! 🚀
When you deploy to Vercel, it will automatically:
- ✅ Use your DATABASE_URL
- ✅ Run migrations
- ✅ Connect to your database

---

## Alternative: Supabase (Free Tier)

### Step 1: Create Project
1. Go to [supabase.com](https://supabase.com)
2. Sign in → **New Project**
3. Choose region, set password, wait 2 minutes

### Step 2: Get Connection String
1. Settings → **Database** → **Connection string**
2. Copy **URI** format
3. Replace `[YOUR-PASSWORD]` with your actual password

### Step 3: Add to Vercel
Same as Step 2 above, but use Supabase connection string

### Step 4: Test & Deploy
Same as Steps 3-4 above

---

## Using the Setup Script

I've created a helper script for you:

```powershell
# Run the setup helper
.\setup-postgres.ps1
```

This interactive script will help you:
- Set DATABASE_URL
- Generate Prisma Client
- Push schema to database
- Seed database
- Open Prisma Studio

---

## What's Already Done ✅

- ✅ Prisma schema updated to PostgreSQL
- ✅ Seed script ready (creates admin user)
- ✅ Build errors fixed
- ✅ Ready for deployment

---

## After Setup

1. **Test your connection:**
   ```powershell
   npx prisma studio
   ```
   Opens at http://localhost:5555

2. **Login to admin:**
   - URL: `/admin/login`
   - Email: `admin@bk-agencements.com`
   - Password: `AdminPassword123!` (change this!)

3. **Deploy to Vercel:**
   ```powershell
   vercel --prod
   ```

---

## Need More Details?

See the full guide: `POSTGRESQL_SETUP_GUIDE.md`

