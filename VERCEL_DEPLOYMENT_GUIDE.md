# 🚀 Deploy to Vercel - Complete Guide

This guide will help you deploy your Next.js application to Vercel. You have two options:

## Option 1: Deploy with Vercel CLI (Recommended - No Git Required)

### Step 1: Install Vercel CLI

Open PowerShell and run:

```powershell
npm install -g vercel
```

### Step 2: Login to Vercel

```powershell
vercel login
```

This will open your browser to authenticate with Vercel.

### Step 3: Set Up Database (CRITICAL - Do This First!)

**⚠️ IMPORTANT:** Your project currently uses SQLite, which won't work on Vercel. You need PostgreSQL.

#### Option A: Vercel Postgres (Easiest - Recommended)

1. Go to [vercel.com](https://vercel.com) and sign in
2. Go to **Storage** tab in your dashboard
3. Click **"Create Database"** → **"Postgres"**
4. Choose **Hobby** plan (free tier available)
5. Copy the `POSTGRES_URL` connection string
6. Save this URL - you'll need it for environment variables

#### Option B: Supabase (Free Tier Available)

1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Go to **Settings** → **Database**
4. Copy the connection string (URI format)
5. It will look like: `postgresql://postgres:[YOUR-PASSWORD]@db.xxxxx.supabase.co:5432/postgres`

### Step 4: Run Database Migrations

After setting up PostgreSQL, you need to migrate your database:

```powershell
# Set your DATABASE_URL temporarily
$env:DATABASE_URL="postgresql://user:password@host:port/database"

# Generate Prisma client
npx prisma generate

# Push schema to database (creates tables)
npx prisma db push

# Or use migrations (recommended for production)
npx prisma migrate deploy
```

**Note:** Replace the DATABASE_URL with your actual PostgreSQL connection string.

### Step 5: Deploy to Vercel

From your project directory:

```powershell
vercel
```

Follow the prompts:
- **Set up and deploy?** → Yes
- **Which scope?** → Your account
- **Link to existing project?** → No (first time)
- **What's your project's name?** → `bk-agencements` (or your preferred name)
- **In which directory is your code located?** → `./` (current directory)

### Step 6: Set Environment Variables

After the first deployment, you need to add environment variables:

```powershell
# Set environment variables via CLI
vercel env add DATABASE_URL production
# Paste your PostgreSQL connection string when prompted

vercel env add ADMIN_EMAIL production
# Enter: admin@bk-agencements.com

vercel env add ADMIN_PASSWORD production
# Enter your secure admin password

vercel env add ADMIN_SESSION_SECRET production
# Enter a random secret key (generate one: openssl rand -base64 32)

# Add all other required variables
vercel env add NEXT_PUBLIC_BASE_URL production
# Enter: https://your-project.vercel.app (or your custom domain)

# Repeat for Preview and Development environments if needed
```

**Or use the Vercel Dashboard:**
1. Go to your project on [vercel.com](https://vercel.com)
2. Click **Settings** → **Environment Variables**
3. Add each variable for **Production**, **Preview**, and **Development**

### Required Environment Variables:

```
DATABASE_URL=postgresql://user:password@host:port/database
ADMIN_EMAIL=admin@bk-agencements.com
ADMIN_PASSWORD=your-secure-password
ADMIN_SESSION_SECRET=your-random-secret-key-here
NEXT_PUBLIC_BASE_URL=https://your-project.vercel.app
NEXT_PUBLIC_SITE_URL=https://your-project.vercel.app

# Optional but recommended:
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
ADMIN_NOTIFICATION_EMAIL=admin@bk-agencements.com

# If using Stripe:
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PUBLIC_KEY=pk_live_...
```

### Step 7: Redeploy with Environment Variables

After adding environment variables:

```powershell
vercel --prod
```

This will deploy to production with all your environment variables.

---

## Option 2: Deploy via GitHub (If You Want Git Integration)

### Step 1: Install Git

1. Download from: https://git-scm.com/download/win
2. Install with default settings
3. Restart PowerShell

### Step 2: Initialize Git Repository

```powershell
git init
git config user.name "Your Name"
git config user.email "your.email@example.com"
git add .
git commit -m "Initial commit"
```

### Step 3: Create GitHub Repository

1. Go to [github.com](https://github.com) and create a new repository
2. **Don't** initialize with README, .gitignore, or license (you already have these)
3. Copy the repository URL

### Step 4: Push to GitHub

```powershell
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git branch -M main
git push -u origin main
```

### Step 5: Deploy via Vercel Dashboard

1. Go to [vercel.com](https://vercel.com)
2. Click **"Add New..."** → **"Project"**
3. Import your GitHub repository
4. Configure settings (auto-detected for Next.js)
5. Add environment variables (see Step 6 above)
6. Click **"Deploy"**

---

## Post-Deployment Steps

### 1. Verify Deployment

Visit your deployment URL: `https://your-project.vercel.app`

Test these features:
- ✅ Homepage loads correctly
- ✅ Products page works
- ✅ Admin login works (`/admin/login`)
- ✅ Images load correctly
- ✅ API routes respond

### 2. Set Up Custom Domain (Optional)

1. Go to **Project Settings** → **Domains**
2. Add your custom domain
3. Follow DNS configuration instructions
4. Wait for SSL certificate (automatic)

### 3. Enable Analytics

1. Go to **Project Settings** → **Analytics**
2. Enable **Web Analytics**
3. Enable **Speed Insights**

### 4. Monitor Your Deployment

- Check **Deployments** tab for build status
- Set up email notifications for failed builds
- Monitor function logs for errors

---

## Troubleshooting

### Build Fails

**Problem:** Build errors in Vercel
- **Solution:** 
  1. Check build logs in Vercel dashboard
  2. Run `npm run build` locally to see errors
  3. Fix errors and redeploy

### Database Connection Errors

**Problem:** Can't connect to database
- **Solution:**
  1. Verify `DATABASE_URL` is correct
  2. Ensure database allows connections from Vercel IPs
  3. Check SSL is enabled (required for cloud databases)
  4. Test connection locally first

### Environment Variables Not Working

**Problem:** Variables not available in app
- **Solution:**
  1. Ensure variables are set for correct environment (Production/Preview/Development)
  2. Redeploy after adding variables
  3. Check variable names match exactly (case-sensitive)
  4. `NEXT_PUBLIC_*` variables need to be set for all environments

### Images Not Loading

**Problem:** Images return 404 or don't load
- **Solution:**
  1. Verify image paths are correct
  2. Check `next.config.js` remote patterns
  3. Ensure images are in `public/` folder or use absolute URLs

### API Routes Not Working

**Problem:** API routes return errors
- **Solution:**
  1. Check function timeout (max 30s on Hobby plan)
  2. Verify environment variables are set
  3. Check middleware configuration
  4. Review function logs in Vercel dashboard

---

## Quick Reference Commands

```powershell
# Deploy to preview
vercel

# Deploy to production
vercel --prod

# View deployment logs
vercel logs

# List all deployments
vercel ls

# Remove deployment
vercel remove

# Link to existing project
vercel link
```

---

## Next Steps

After successful deployment:

1. ✅ Test all features on production
2. ✅ Set up monitoring and error tracking
3. ✅ Configure custom domain
4. ✅ Set up automated backups
5. ✅ Enable analytics and performance monitoring

---

**Need Help?**
- Vercel Docs: https://vercel.com/docs
- Prisma Docs: https://www.prisma.io/docs
- Next.js Docs: https://nextjs.org/docs

