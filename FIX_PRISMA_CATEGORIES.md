# 🔧 Fix: Can't Add Categories in Prisma Studio

## The Problem

The database file is missing or in the wrong location, so Prisma Studio can't save categories.

## Solution

### Step 1: Check Database Location

The database might be in a nested folder. Let's find it:

```powershell
Get-ChildItem -Recurse -Filter "dev.db" | Select-Object FullName
```

### Step 2: Create Database if Missing

If the database doesn't exist, create it:

```powershell
npx prisma migrate deploy
```

Or create it fresh:

```powershell
npx prisma migrate dev --name init
```

### Step 3: Verify Database Exists

Check if database is in the right place:

```powershell
Test-Path prisma\dev.db
```

Should return `True`.

### Step 4: Try Adding Categories Again

1. Open Prisma Studio: `npx prisma studio`
2. Click "Category" table
3. Click "+ Add record"
4. Fill in:
   - **name:** Chaises
   - **slug:** chaises
5. Click "Save"

## If You Still Get Errors

### Error: "Database is locked"
- Close Prisma Studio
- Close all terminals
- Restart and try again

### Error: "Table does not exist"
- Run: `npx prisma migrate dev`

### Error: "Cannot find database"
- Check `.env` file has: `DATABASE_URL="file:./prisma/dev.db"`
- Run: `npx prisma migrate dev`

## Quick Fix Commands

```powershell
# 1. Ensure database exists
npx prisma migrate deploy

# 2. Open Prisma Studio
npx prisma studio

# 3. Add categories manually
```

## The 6 Categories You Had

Based on your `lib/data.ts`, you had:
1. Chaise → slug: `chaises`
2. Fauteuil → slug: `fauteuils`
3. Table d'appoint → slug: `tables-appoint`
4. Table basse → slug: `tables-basse`
5. Console → slug: `consoles`
6. Meuble TV → slug: `meubles-tv`

Add these one by one in Prisma Studio once the database is fixed.

