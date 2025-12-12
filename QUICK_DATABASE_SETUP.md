# 🚀 Quick Database Setup

## The Problem

You're getting a Windows file permission error when running `npx prisma generate`. This is common on Windows when files are locked.

## ✅ Solution (Choose One)

### Method 1: Close Everything & Run as Admin (Recommended)

1. **Close VS Code completely** (not just the window, fully quit)
2. **Close all terminal windows**
3. **Open PowerShell as Administrator:**
   - Press `Windows Key`
   - Type "PowerShell"
   - Right-click "Windows PowerShell"
   - Click "Run as Administrator"
4. **Navigate to your project:**
   ```powershell
   cd "C:\Users\mcmcb\OneDrive\Desktop\testing"
   ```
5. **Run these commands one by one:**
   ```powershell
   npx prisma generate
   npx prisma migrate dev --name add_products
   ```

### Method 2: Use the Batch Script

1. Close VS Code
2. Right-click `setup-database.bat` in your project folder
3. Select "Run as Administrator"
4. Follow the prompts

### Method 3: Delete and Regenerate

If the above don't work:

```powershell
# Delete the problematic folder
Remove-Item -Recurse -Force node_modules\.prisma

# Then regenerate
npx prisma generate
npx prisma migrate dev --name add_products
```

## What Each Command Does

### `npx prisma generate`
- Reads your `prisma/schema.prisma` file
- Generates TypeScript types
- Creates the Prisma Client code
- **Result:** You can use `prisma.product.findMany()` in your code

### `npx prisma migrate dev --name add_products`
- Creates the database file (`prisma/dev.db`)
- Creates all tables (Category, Product, ProductImage, Material, Color, Booking)
- **Result:** Your database is ready to use

## Verify It Worked

After running both commands, check:

1. **Database file exists:**
   ```powershell
   Test-Path prisma\dev.db
   ```
   Should return `True`

2. **Prisma client exists:**
   ```powershell
   Test-Path node_modules\.prisma\client
   ```
   Should return `True`

3. **Visit the boutique page:**
   - http://localhost:3000/boutique
   - Should load (may show empty states if no data)

## Add Sample Data

Once the database is set up, add some data:

### Option 1: Prisma Studio (Easiest)

```powershell
npx prisma studio
```

This opens a web interface at http://localhost:5555 where you can:
- Click "Category" → "Add record"
- Add: name = "Chaises", slug = "chaises"
- Click "Save"
- Repeat for more categories
- Then add products

### Option 2: Quick Test Data

You can also create a seed script, but Prisma Studio is easiest for now.

## Common Errors & Fixes

### Error: "EPERM: operation not permitted"
**Fix:** Close VS Code, run terminal as Administrator

### Error: "Table does not exist"
**Fix:** Run `npx prisma migrate dev --name add_products`

### Error: "Prisma Client not found"
**Fix:** Run `npx prisma generate`

### Error: "Cannot find module '@prisma/client'"
**Fix:** Run `npm install @prisma/client prisma`

## After Setup

Once the database is set up:

1. ✅ Boutique page will load without errors
2. ✅ You can add categories/products via Prisma Studio
3. ✅ API endpoints will work
4. ✅ Cart system will work

## Still Having Issues?

If you're still getting permission errors:

1. **Check if any process is using the files:**
   - Close all programs
   - Restart your computer
   - Try again

2. **Check antivirus:**
   - Some antivirus software locks files
   - Temporarily disable and try again

3. **Check OneDrive:**
   - OneDrive can sometimes lock files
   - Try moving the project outside OneDrive temporarily

The database setup is just these 2 commands - once they run successfully, everything will work!

