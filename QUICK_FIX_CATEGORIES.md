# ⚡ Quick Fix: Can't Add Categories

## The Problem

The database file was in the wrong location (`prisma/prisma/dev.db` instead of `prisma/dev.db`), and Prisma Studio couldn't access it properly.

## ✅ What I Fixed

1. ✅ Stopped all Node processes (to unlock database)
2. ✅ Copied database to correct location
3. ✅ Verified database exists

## 🚀 Now Try This

### Step 1: Open Prisma Studio

```powershell
npx prisma studio
```

### Step 2: Add Your 6 Categories

Click "Category" table, then add each one:

1. **Chaise**
   - name: `Chaise`
   - slug: `chaises`

2. **Fauteuil**
   - name: `Fauteuil`
   - slug: `fauteuils`

3. **Table d'appoint**
   - name: `Table d'appoint`
   - slug: `tables-appoint`

4. **Table basse**
   - name: `Table basse`
   - slug: `tables-basse`

5. **Console**
   - name: `Console`
   - slug: `consoles`

6. **Meuble TV**
   - name: `Meuble TV`
   - slug: `meubles-tv`

### Step 3: Verify

After adding all 6 categories:
- Refresh your boutique page
- You should see all 6 categories displayed

## If You Still Get Errors

### "Database is locked"
- Close Prisma Studio completely
- Wait 5 seconds
- Open it again

### "Cannot save"
- Make sure you filled in both `name` and `slug`
- Make sure `slug` is unique (no duplicates)
- Make sure `slug` is lowercase with hyphens

## Database Location

The database is now at: `prisma/dev.db` ✅

Your `.env` file should have:
```
DATABASE_URL="file:./prisma/dev.db"
```

Try adding categories now - it should work! 🎉
