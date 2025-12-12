# 🚀 Quick Deploy to Vercel

You're already logged in! Just run:

## Step 1: Deploy

```powershell
vercel --prod
```

This will:
- Upload your project
- Build it
- Deploy to production
- Give you a live URL

## Step 2: Add Environment Variables

After first deploy, go to Vercel dashboard:
1. Visit: https://vercel.com/youneszaaimi4-9299s-projects/testing
2. Go to **Settings** → **Environment Variables**
3. Add these (minimum required):

```
DATABASE_URL=postgresql://... (get from Step 3)
ADMIN_EMAIL=your-email@example.com
ADMIN_PASSWORD=your-password
ADMIN_SESSION_SECRET=any-random-string-here
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-gmail-app-password
FROM_EMAIL=your-email@gmail.com
NEXT_PUBLIC_APP_URL=https://testing-xxx.vercel.app
```

**Important:** Add each variable for **Production**, **Preview**, and **Development** environments.

## Step 3: Add Database (Free!)

1. In Vercel dashboard → **Storage** tab
2. Click **"Create Database"** → **"Postgres"**
3. Choose **Hobby** (free tier)
4. Copy the `POSTGRES_URL` connection string
5. Add it as `DATABASE_URL` in environment variables (from Step 2)
6. Update `prisma/schema.prisma`:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

7. Push the change and redeploy:
```powershell
vercel --prod
```

## Step 4: Test Your Site

Visit your deployment URL (shown after deploy):
- Example: `https://testing-xxx.vercel.app`

Test:
- ✅ Homepage loads
- ✅ Products page works
- ✅ Admin login works (`/admin/login`)

## Troubleshooting

**Build fails?**
- Check build logs in Vercel dashboard
- Most errors will show exactly what's wrong

**Can't login?**
- Make sure `ADMIN_EMAIL` and `ADMIN_PASSWORD` are set
- Check `ADMIN_SESSION_SECRET` is set

**Database errors?**
- Make sure `DATABASE_URL` is correct PostgreSQL connection string
- Run migrations: Vercel will auto-run them on deploy

---

**That's it!** Your site will be live in ~2-3 minutes. 🎉

