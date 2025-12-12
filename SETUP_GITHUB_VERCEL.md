# Complete Setup Guide: GitHub + Vercel

This guide will help you connect your project to GitHub and deploy it to Vercel.

---

## Part 1: Install Git (Required First Step)

### Windows Installation

1. **Download Git for Windows:**
   - Go to: https://git-scm.com/download/win
   - Download the latest version (64-bit)
   - Run the installer

2. **Installation Settings (Recommended):**
   - ✅ Use Visual Studio Code as Git's default editor (if you have VS Code)
   - ✅ Git from the command line and also from 3rd-party software
   - ✅ Use bundled OpenSSH
   - ✅ Use the OpenSSL library
   - ✅ Checkout Windows-style, commit Unix-style line endings
   - ✅ Use MinTTY (default terminal)
   - ✅ Enable file system caching
   - ✅ Enable Git Credential Manager

3. **After Installation:**
   - Close and reopen your terminal/PowerShell
   - Verify installation:
     ```powershell
     git --version
     ```

---

## Part 2: Set Up GitHub Repository

### Step 1: Create GitHub Account (if needed)
1. Go to https://github.com
2. Sign up for a free account
3. Verify your email

### Step 2: Initialize Git in Your Project

Open PowerShell in your project directory and run:

```powershell
# Initialize Git repository
git init

# Configure Git (replace with your info)
git config user.name "Your Name"
git config user.email "your.email@example.com"

# Check status
git status
```

### Step 3: Create Repository on GitHub

1. Go to https://github.com/new
2. **Repository name:** `bk-agencements`
3. **Description:** `Luxury furniture e-commerce & interior design portfolio`
4. Choose **Public** or **Private**
5. ⚠️ **IMPORTANT:** Do NOT check:
   - ❌ Add a README file
   - ❌ Add .gitignore
   - ❌ Choose a license
   
   (We already have these files)
6. Click **"Create repository"**

### Step 4: Connect and Push to GitHub

After creating the repository, GitHub will show you commands. Use these:

```powershell
# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: Luxury furniture e-commerce & interior design portfolio"

# Rename branch to main (if needed)
git branch -M main

# Add remote (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/bk-agencements.git

# Push to GitHub
git push -u origin main
```

**Note:** You'll be prompted for your GitHub username and password (or Personal Access Token).

### Step 5: Verify GitHub Connection

```powershell
# Check remote connection
git remote -v

# Check status
git status
```

You should see:
- `origin` pointing to your GitHub repository
- "Your branch is up to date with 'origin/main'"

---

## Part 3: Deploy to Vercel

### Step 1: Sign Up for Vercel

1. Go to https://vercel.com
2. Click **"Sign Up"**
3. Choose **"Continue with GitHub"** (recommended - easiest)
4. Authorize Vercel to access your GitHub account

### Step 2: Import Your Project

1. In Vercel dashboard, click **"Add New..."** → **"Project"**
2. Find and select your `bk-agencements` repository
3. Click **"Import"**

### Step 3: Configure Project Settings

Vercel will auto-detect Next.js. Verify these settings:

- **Framework Preset:** Next.js ✅
- **Root Directory:** `./` ✅
- **Build Command:** `npm run build` ✅
- **Output Directory:** `.next` ✅
- **Install Command:** `npm install` ✅
- **Node.js Version:** 20.x (recommended)

### Step 4: Set Environment Variables

**CRITICAL:** Before deploying, add all environment variables:

1. Click **"Environment Variables"** in project settings
2. Add each variable for **Production**, **Preview**, and **Development**:

#### Required Variables:

```
# Database (use PostgreSQL - see Step 5)
DATABASE_URL=postgresql://user:password@host:port/database

# Admin Authentication
ADMIN_EMAIL=your-admin@email.com
ADMIN_PASSWORD=your-secure-password
ADMIN_SESSION_SECRET=your-random-secret-key-here

# Email (Nodemailer/Gmail SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
FROM_EMAIL=your-email@gmail.com
ADMIN_EMAIL=admin@yourdomain.com

# Admin Authentication
ADMIN_EMAIL=admin@bk-agencements.com
ADMIN_PASSWORD=your-secure-password
ADMIN_SESSION_SECRET=your-random-secret-key-here

# App URLs
NEXT_PUBLIC_APP_URL=https://your-project.vercel.app
NEXT_PUBLIC_BASE_URL=https://your-project.vercel.app
NEXT_PUBLIC_SITE_URL=https://your-project.vercel.app

# Optional: Analytics
NEXT_PUBLIC_UMAMI_WEBSITE_ID=your-umami-id
NEXT_PUBLIC_UMAMI_SCRIPT_URL=https://your-umami-instance.com/script.js
```

**⚠️ Important Notes:**
- Replace all placeholder values with your actual values
- For Gmail SMTP, you need to create an "App Password" (not your regular password)
- Keep secrets secure - never commit them to GitHub

### Step 5: Set Up Database (CRITICAL)

You need a PostgreSQL database. Here are your options:

#### Option A: Vercel Postgres (Easiest - Recommended)

1. In Vercel dashboard, go to **"Storage"** tab
2. Click **"Create Database"** → **"Postgres"**
3. Choose **Hobby** plan (free tier available)
4. Copy the `POSTGRES_URL` connection string
5. Update `DATABASE_URL` environment variable with this URL
6. Update your `prisma/schema.prisma`:
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```
7. Push the schema change to GitHub
8. Vercel will automatically run migrations on deploy

#### Option B: Supabase (Free Tier Available)

1. Go to https://supabase.com
2. Create a new project
3. Go to **Settings** → **Database**
4. Copy the connection string (URI format)
5. Update `DATABASE_URL` in Vercel
6. Update Prisma schema (same as Option A)
7. Run migrations locally first:
   ```powershell
   npx prisma migrate deploy
   ```

### Step 6: Deploy

1. Review all settings
2. Click **"Deploy"**
3. Wait 2-5 minutes for build to complete
4. Check build logs for any errors

### Step 7: Verify Deployment

1. Visit your deployment URL: `https://bk-agencements-xxx.vercel.app`
2. Test these features:
   - ✅ Homepage loads correctly
   - ✅ Products page works
   - ✅ Admin login works (`/admin/login`)
   - ✅ Images load correctly
   - ✅ API routes respond

---

## Part 4: Post-Deployment Setup

### Enable Vercel Analytics

1. Go to **Project Settings** → **Analytics**
2. Enable **Web Analytics**
3. Enable **Speed Insights**

### Set Up Custom Domain (Optional)

1. Go to **Project Settings** → **Domains**
2. Add your custom domain (e.g., `bk-agencements.com`)
3. Follow DNS configuration instructions
4. Wait for SSL certificate (automatic, takes a few minutes)

### Configure Webhooks (if using Stripe)

1. In Stripe dashboard, add webhook URL:
   ```
   https://your-domain.com/api/webhooks/stripe
   ```
2. Select events to listen for
3. Copy webhook secret to Vercel environment variables

---

## Troubleshooting

### Git Issues

**Problem:** `git: command not found`
- **Solution:** Install Git (see Part 1) and restart terminal

**Problem:** Authentication failed when pushing
- **Solution:** Use Personal Access Token instead of password:
  1. GitHub → Settings → Developer settings → Personal access tokens
  2. Generate new token with `repo` permissions
  3. Use token as password when pushing

### Vercel Build Fails

**Problem:** Build errors
- **Solution:** 
  1. Check build logs in Vercel dashboard
  2. Run `npm run build` locally to see errors
  3. Fix errors and push to GitHub (auto-redeploys)

**Problem:** Database connection errors
- **Solution:**
  1. Verify `DATABASE_URL` is correct
  2. Ensure database allows connections from Vercel IPs
  3. Check SSL is enabled (required for cloud databases)

**Problem:** Environment variables not working
- **Solution:**
  1. Ensure variables are set for correct environment (Production/Preview/Development)
  2. Redeploy after adding variables
  3. Check variable names match exactly (case-sensitive)

---

## Quick Reference Commands

### Git Commands

```powershell
# Check status
git status

# Add all changes
git add .

# Commit changes
git commit -m "Your commit message"

# Push to GitHub
git push origin main

# Pull latest changes
git pull origin main
```

### Vercel CLI (Optional)

```powershell
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel

# Link to existing project
vercel link
```

---

## Next Steps After Deployment

1. ✅ Test all features on production
2. ✅ Set up monitoring and error tracking
3. ✅ Configure custom domain
4. ✅ Set up automated backups
5. ✅ Enable analytics and performance monitoring

---

**Need Help?**
- GitHub Docs: https://docs.github.com
- Vercel Docs: https://vercel.com/docs
- Prisma Docs: https://www.prisma.io/docs

