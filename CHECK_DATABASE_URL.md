# How to Check Your PostgreSQL Database URL

## 🔍 Current Status

Your `.env` file contains a PostgreSQL URL. Here's how to verify it's correct:

## 📋 PostgreSQL URL Format

A valid PostgreSQL URL looks like this:
```
postgres://username:password@host:port/database?sslmode=require
```

**Parts:**
- `postgres://` - Protocol
- `username:password` - Credentials (before the `@`)
- `host:port` - Database server address
- `/database` - Database name
- `?sslmode=require` - Optional SSL settings

## ✅ Ways to Check Your Database URL

### 1. Check in Your Local `.env` File

```powershell
# View the DATABASE_URL
Get-Content .env | Select-String "DATABASE_URL"
```

### 2. Check on Vercel

1. Go to: https://vercel.com/dashboard
2. Click your project: **bk**
3. Go to **Settings** → **Environment Variables**
4. Look for `DATABASE_URL`
5. Click the **eye icon** to reveal the value

### 3. Test Database Connection

#### Option A: Test Locally with Prisma

```powershell
# Make sure your .env has DATABASE_URL set
npx prisma db pull
```

If it works, your database URL is valid!

#### Option B: Test Connection Directly

```powershell
# Install psql if you have it, or use Prisma Studio
npx prisma studio
```

This will open a web UI connected to your database.

### 4. Check Database Provider

Your URL looks like it might be from:
- **Prisma Accelerate** (if it has `db.prisma.io`)
- **Vercel Postgres** (if it has `vercel-storage.com`)
- **Supabase** (if it has `supabase.co`)
- **Custom PostgreSQL** (any other host)

## 🚨 Common Issues

### Issue 1: URL is for Development/Local
❌ `file:./dev.db` (SQLite - won't work on Vercel)
✅ `postgres://...` (PostgreSQL - required for Vercel)

### Issue 2: URL is Truncated or Missing Parts
Make sure your URL has:
- ✅ `postgres://` at the start
- ✅ `username:password@`
- ✅ `host:port/`
- ✅ Database name

### Issue 3: SSL Connection Required
Some providers require SSL. Your URL should end with:
```
?sslmode=require
```
or
```
?ssl=true
```

## 🔧 How to Get Your Database URL

### If Using Vercel Postgres:
1. Vercel Dashboard → Your Project → **Storage** tab
2. Click on your Postgres database
3. Copy the `POSTGRES_URL` or `DATABASE_URL`

### If Using Supabase:
1. Supabase Dashboard → Your Project
2. **Settings** → **Database**
3. Copy the **Connection String** (URI format)

### If Using Prisma Accelerate:
1. Prisma Dashboard → Your Project
2. Copy the connection string

## 📝 Quick Verification Checklist

- [ ] URL starts with `postgres://`
- [ ] Contains `@` (separates credentials from host)
- [ ] Contains `:` after host (indicates port)
- [ ] Contains `/` after port (database name)
- [ ] URL is NOT `file:./dev.db` (that's SQLite)
- [ ] URL works when you test it

## 🎯 Next Steps

Once you've verified your database URL:

1. ✅ If it's correct: You can use "Import .env" on Vercel
2. ✅ If it's wrong: Fix it first, then import
3. ✅ After importing: Redeploy on Vercel
4. ✅ Test: Check if your site connects to the database

---

**Need help?** Let me know what you see in your `.env` file or on Vercel!


