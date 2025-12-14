# Quick Admin Setup Guide

## 🔐 Setting Up Admin Access on Vercel

### Step 1: Set Environment Variables on Vercel

1. Go to: https://vercel.com/dashboard
2. Click on your project: **bk**
3. Go to **Settings** → **Environment Variables**
4. Add these variables (one at a time):

```
ADMIN_EMAIL=admin@bk-agencements.com
ADMIN_PASSWORD=YourSecurePassword123!
ADMIN_SESSION_SECRET=generate-a-random-string-here-min-32-chars
JWT_SECRET=same-or-different-random-string-min-32-chars
```

**Important:**
- Select all environments: ✅ Production, ✅ Preview, ✅ Development
- Click "Save" after each variable
- **Redeploy** after adding all variables (click "Deployments" → latest → "Redeploy")

### Step 2: Generate Random Secrets

Use this command to generate secure secrets:
```bash
# On Mac/Linux:
openssl rand -base64 32

# On Windows PowerShell:
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))
```

### Step 3: Access Admin Panel

1. Go to: **https://bk-agencements.com/admin/login**
2. Login with:
   - Email: (whatever you set in `ADMIN_EMAIL`)
   - Password: (whatever you set in `ADMIN_PASSWORD`)

---

## 🔄 How Changes Go Live

### Current Setup:
- ✅ GitHub repository: `https://github.com/younesz4/bk.git`
- ✅ Vercel connected to GitHub
- ✅ Auto-deploys on every push to `main` branch

### To Deploy Changes:

```bash
# 1. Make your changes locally (edit files)

# 2. Stage changes
git add .

# 3. Commit changes
git commit -m "Describe what you changed"

# 4. Push to GitHub
git push origin main

# 5. Wait 2-5 minutes for Vercel to auto-deploy
# Check status at: https://vercel.com/dashboard
```

### ⚠️ Important Notes:

- ❌ **Local changes DON'T automatically go live**
- ✅ **Must commit + push to GitHub**
- ✅ **Vercel auto-deploys from GitHub**
- ⏱️ **Deployment takes 2-5 minutes**

---

## 🚨 Troubleshooting

### Can't access admin login?

1. ✅ Check environment variables are set on Vercel
2. ✅ Make sure you redeployed after adding env vars
3. ✅ Try incognito/private window
4. ✅ Check Vercel logs for errors

### Changes not appearing?

1. ✅ Did you commit? (`git commit`)
2. ✅ Did you push? (`git push`)
3. ✅ Check Vercel dashboard for deployment status
4. ✅ Hard refresh browser (Ctrl+F5 / Cmd+Shift+R)

---

## 📝 Quick Commands

```bash
# Check current status
git status

# See recent commits
git log --oneline -5

# See what changed
git diff

# Push to deploy
git push origin main
```


