# STEP 15.3 — Deploy to Vercel

## ✅ Configuration Complete

I've created `vercel.json` with optimal settings for your deployment.

## Deployment Steps

### Step 1: Push to GitHub First

**IMPORTANT:** Complete STEP 15.1 first (connect to GitHub).

```bash
# Make sure your code is pushed to GitHub
git add .
git commit -m "Prepare for Vercel deployment"
git push origin main
```

### Step 2: Import Project to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Sign in with your GitHub account
3. Click **"Add New..."** → **"Project"**
4. Import your `bk-agencements` repository
5. Vercel will auto-detect Next.js

### Step 3: Configure Project Settings

**Project Name:** `bk-agencements`

**Framework Preset:** Next.js (auto-detected)

**Root Directory:** `./` (default)

**Build Command:** `npm run build` (auto-detected)

**Output Directory:** `.next` (auto-detected)

**Install Command:** `npm install` (auto-detected)

**Node.js Version:** 18.x or 20.x (recommended: 20.x)

### Step 4: Set Environment Variables

**CRITICAL:** Add all environment variables from `.env.production.example`:

1. Go to **Project Settings** → **Environment Variables**
2. Add each variable for **Production**, **Preview**, and **Development**:

```
DATABASE_URL=postgresql://...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PUBLIC_KEY=pk_live_...
NEXT_PUBLIC_BASE_URL=https://bk-agencements.com
NEXT_PUBLIC_SITE_URL=https://bk-agencements.com
ADMIN_API_KEY=your-secure-key
SENDGRID_API_KEY=SG....
NEXT_PUBLIC_UMAMI_WEBSITE_ID=...
NEXT_PUBLIC_UMAMI_SCRIPT_URL=...
```

**⚠️ IMPORTANT:**
- Use **PostgreSQL** for `DATABASE_URL` (NOT SQLite)
- Set `NEXT_PUBLIC_*` variables for all environments
- Keep secrets (API keys) secure

### Step 5: Database Setup (CRITICAL)

**You MUST migrate from SQLite to PostgreSQL before deployment.**

#### Option A: Vercel Postgres (Recommended - Integrated)

1. In Vercel dashboard, go to **Storage** tab
2. Click **"Create Database"** → **"Postgres"**
3. Choose plan (Hobby plan is free)
4. Copy the `POSTGRES_URL` connection string
5. Update `DATABASE_URL` environment variable
6. Update `prisma/schema.prisma`:
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```
7. Run migrations:
   ```bash
   npx prisma migrate deploy
   ```

#### Option B: Supabase (Free Tier Available)

1. Go to [supabase.com](https://supabase.com)
2. Create new project
3. Get connection string from **Settings** → **Database**
4. Update `DATABASE_URL` in Vercel
5. Update Prisma schema (same as above)
6. Run migrations

#### Option C: PlanetScale (MySQL-Compatible)

1. Go to [planetscale.com](https://planetscale.com)
2. Create database
3. Get connection string
4. Update Prisma schema:
   ```prisma
   datasource db {
     provider = "mysql"
     url      = env("DATABASE_URL")
   }
   ```

### Step 6: Deploy

1. Click **"Deploy"** button
2. Wait for build to complete (2-5 minutes)
3. Check build logs for any errors

### Step 7: Verify Deployment

1. Visit your deployment URL: `https://bk-agencements-xxx.vercel.app`
2. Test key features:
   - ✅ Homepage loads
   - ✅ Products page works
   - ✅ Admin login works
   - ✅ API routes respond
   - ✅ Images load correctly

## Vercel Configuration Checklist

### ✅ Production Build
- [x] Build command: `npm run build`
- [x] Output directory: `.next`
- [x] Node.js version: 18.x or 20.x

### ✅ Edge Caching Rules
- [x] Static assets: 1 year cache
- [x] API routes: No cache
- [x] Images: 1 year cache
- [x] Configured in `vercel.json`

### ✅ Runtime Configuration
- [x] Node.js 18/20 (set in Vercel dashboard)
- [x] Function timeout: 30s (for API routes)
- [x] Region: `cdg1` (Paris - closest to Morocco)

### ✅ Image Optimization
- [x] Next.js Image Optimization enabled
- [x] AVIF/WebP formats configured
- [x] Remote patterns configured

### ✅ ISR (Incremental Static Regeneration)
- Configure per-route in your pages:
  ```tsx
  export const revalidate = 60 // Revalidate every 60 seconds
  ```

### ✅ Font Optimization
- [x] Google Fonts optimized (Raleway, Bodoni Moda)
- [x] `display: 'swap'` configured
- [x] Preload enabled

## Post-Deployment Optimizations

### 1. Enable Vercel Analytics
1. Go to **Project Settings** → **Analytics**
2. Enable **Web Analytics**
3. Enable **Speed Insights**

### 2. Configure Custom Domain
- See STEP 15.4 for domain setup

### 3. Set Up Webhooks
- Stripe webhooks: `https://bk-agencements.com/api/webhooks/stripe`
- Update webhook URL in Stripe dashboard

### 4. Monitor Builds
- Check **Deployments** tab for build status
- Set up email notifications for failed builds

## Troubleshooting

### Build Fails
- Check build logs in Vercel dashboard
- Verify all environment variables are set
- Ensure database is accessible
- Check for TypeScript errors: `npm run build` locally

### Database Connection Errors
- Verify `DATABASE_URL` is correct
- Check database allows connections from Vercel IPs
- Ensure SSL is enabled (required for most cloud databases)

### Image Optimization Errors
- Verify image domains in `next.config.js`
- Check image URLs are accessible
- Ensure images are served over HTTPS

### API Routes Not Working
- Check function timeout (max 30s on Hobby plan)
- Verify environment variables are set
- Check middleware configuration

## Next Steps

After successful deployment:
1. ✅ **STEP 15.4** - Connect Custom Domain
2. ✅ **STEP 15.5** - Set Up Business Email
3. ✅ **STEP 15.6** - Create Automated Backups
4. ✅ **STEP 15.7** - Monitoring + Error Alerts

---

**Deployment URL Format:**
- Production: `https://bk-agencements.com` (after domain setup)
- Preview: `https://bk-agencements-git-{branch}-{username}.vercel.app`
- Development: `https://bk-agencements-{hash}.vercel.app`




