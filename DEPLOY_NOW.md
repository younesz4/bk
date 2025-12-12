# 🚀 Deploy to Vercel - Step by Step

## ✅ Pre-Deployment Checklist

Before deploying, make sure:
- [x] PostgreSQL database is set up
- [x] Database is synced (`npx prisma db push` done)
- [x] Admin user is created (`npx prisma db seed` done)
- [x] Build works locally (`npm run build` - we fixed the errors)

---

## Step 1: Install Vercel CLI (2 minutes)

Open PowerShell and run:

```powershell
npm install -g vercel
```

Verify installation:
```powershell
vercel --version
```

---

## Step 2: Login to Vercel (1 minute)

```powershell
vercel login
```

This will:
- Open your browser
- Ask you to authorize Vercel
- Link your CLI to your account

---

## Step 3: Prepare Your Code (1 minute)

Make sure all changes are saved. Then:

```powershell
# Check if you have a .gitignore (you should)
# Make sure .env is NOT committed (it should be in .gitignore)
```

---

## Step 4: Deploy to Vercel (3 minutes)

From your project directory:

```powershell
vercel
```

**Follow the prompts:**
1. **Set up and deploy?** → Type `Y` and press Enter
2. **Which scope?** → Select your account
3. **Link to existing project?** → Type `N` (first time)
4. **What's your project's name?** → Type `bk-agencements` (or your preferred name)
5. **In which directory is your code located?** → Type `./` (current directory)
6. **Want to override the settings?** → Type `N` (use defaults)

Vercel will:
- Detect Next.js automatically
- Install dependencies
- Build your project
- Deploy it

**Wait 2-5 minutes** for the build to complete.

---

## Step 5: Add Environment Variables (CRITICAL - 5 minutes)

After first deployment, you MUST add environment variables:

### Option A: Via Vercel Dashboard (Easiest)

1. **Go to Vercel Dashboard**
   - Visit [vercel.com](https://vercel.com)
   - Click on your project

2. **Go to Settings → Environment Variables**

3. **Add these variables one by one:**

   #### Required Variables:

   ```
   DATABASE_URL
   Value: postgres://default:xxx@xxx.postgres.vercel-storage.com:5432/verceldb
   (Your PostgreSQL connection string)
   Environments: Production, Preview, Development (select all)
   ```

   ```
   ADMIN_EMAIL
   Value: admin@bk-agencements.com
   Environments: All
   ```

   ```
   ADMIN_PASSWORD
   Value: AdminPassword123!
   (Or your secure password)
   Environments: All
   ```

   ```
   ADMIN_SESSION_SECRET
   Value: [Generate a random string]
   (Use: openssl rand -base64 32)
   Environments: All
   ```

   ```
   NEXT_PUBLIC_BASE_URL
   Value: https://your-project-name.vercel.app
   (Replace with your actual Vercel URL)
   Environments: All
   ```

   ```
   NEXT_PUBLIC_SITE_URL
   Value: https://your-project-name.vercel.app
   (Same as above)
   Environments: All
   ```

   #### Optional (but recommended):

   ```
   SMTP_HOST
   Value: smtp.gmail.com
   Environments: All
   ```

   ```
   SMTP_PORT
   Value: 587
   Environments: All
   ```

   ```
   SMTP_USER
   Value: your-email@gmail.com
   Environments: All
   ```

   ```
   SMTP_PASS
   Value: your-app-password
   (Gmail App Password, not regular password)
   Environments: All
   ```

   ```
   FROM_EMAIL
   Value: your-email@gmail.com
   Environments: All
   ```

### Option B: Via CLI (Advanced)

```powershell
# Add each variable
vercel env add DATABASE_URL production
# Paste value when prompted

vercel env add ADMIN_EMAIL production
# etc...
```

---

## Step 6: Generate Session Secret

You need a random secret for `ADMIN_SESSION_SECRET`:

```powershell
# Option 1: Using OpenSSL (if installed)
openssl rand -base64 32

# Option 2: Using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"

# Option 3: Online generator
# Visit: https://generate-secret.vercel.app/32
```

Copy the generated string and use it for `ADMIN_SESSION_SECRET`.

---

## Step 7: Redeploy with Environment Variables (2 minutes)

After adding all environment variables:

```powershell
vercel --prod
```

This deploys to production with all your environment variables.

---

## Step 8: Verify Deployment (2 minutes)

1. **Visit your deployment URL:**
   ```
   https://your-project-name.vercel.app
   ```

2. **Test these pages:**
   - ✅ Homepage loads
   - ✅ Products page works
   - ✅ Admin login: `/admin/login`
     - Email: `admin@bk-agencements.com`
     - Password: `AdminPassword123!`

3. **Check build logs:**
   - Go to Vercel Dashboard → Deployments
   - Click on latest deployment
   - Check for any errors

---

## Step 9: Set Up Database on Vercel (If Using Vercel Postgres)

If you haven't created the database yet:

1. **Vercel Dashboard → Storage tab**
2. **Create Database → Postgres → Hobby**
3. **Copy connection string**
4. **Update `DATABASE_URL` environment variable**
5. **Redeploy:** `vercel --prod`

---

## Troubleshooting

### Build Fails

**Check build logs:**
```powershell
vercel logs
```

**Common issues:**
- Missing environment variables → Add them in dashboard
- Database connection error → Check DATABASE_URL
- TypeScript errors → Fix locally first with `npm run build`

### Database Connection Error

1. Verify `DATABASE_URL` is correct
2. Check database allows connections from Vercel
3. For Supabase: Enable connection pooling

### Environment Variables Not Working

1. Make sure variables are set for correct environment
2. Redeploy after adding variables: `vercel --prod`
3. Check variable names match exactly (case-sensitive)

---

## Quick Commands Reference

```powershell
# Deploy to preview
vercel

# Deploy to production
vercel --prod

# View logs
vercel logs

# List deployments
vercel ls

# Link to existing project
vercel link
```

---

## What Happens After Deployment?

✅ Your app is live at `https://your-project.vercel.app`
✅ Every Git push auto-deploys (if connected to GitHub)
✅ Preview deployments for pull requests
✅ Automatic SSL certificate
✅ Global CDN

---

## Next Steps After Deployment

1. ✅ Test all features
2. ✅ Change admin password
3. ✅ Set up custom domain (optional)
4. ✅ Enable monitoring/analytics
5. ✅ Set up backups

---

## Need Help?

- Vercel Docs: https://vercel.com/docs
- Check build logs in Vercel dashboard
- Run `vercel logs` for detailed errors

---

**Ready? Let's deploy! 🚀**

Start with Step 1 above.

