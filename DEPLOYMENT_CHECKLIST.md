# ✅ Deployment Checklist

## Quick Steps to Deploy

### 1. Login to Vercel
```powershell
vercel login
```

### 2. Deploy
```powershell
vercel
```
Answer the prompts (first time, say "N" to linking, create new project)

### 3. Add Environment Variables (CRITICAL!)
Go to Vercel Dashboard → Settings → Environment Variables

**Required:**
- [ ] `DATABASE_URL` - Your PostgreSQL connection string
- [ ] `ADMIN_EMAIL` - admin@bk-agencements.com
- [ ] `ADMIN_PASSWORD` - Your secure password
- [ ] `ADMIN_SESSION_SECRET` - Random secret (generate with: `node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"`)
- [ ] `NEXT_PUBLIC_BASE_URL` - https://your-project.vercel.app
- [ ] `NEXT_PUBLIC_SITE_URL` - https://your-project.vercel.app

**Optional (for email):**
- [ ] `SMTP_HOST` - smtp.gmail.com
- [ ] `SMTP_PORT` - 587
- [ ] `SMTP_USER` - your-email@gmail.com
- [ ] `SMTP_PASS` - your-app-password
- [ ] `FROM_EMAIL` - your-email@gmail.com

### 4. Redeploy to Production
```powershell
vercel --prod
```

### 5. Test
- Visit your deployment URL
- Test admin login: `/admin/login`
- Verify everything works

---

**That's it! 🎉**

