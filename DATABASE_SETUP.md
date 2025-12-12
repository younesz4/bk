# Database Setup Guide - Step by Step

## Quick Setup (3 Steps)

### Step 1: Generate Prisma Client

This creates the TypeScript types and client code from your schema:

```bash
npx prisma generate
```

**What this does:**
- Reads `prisma/schema.prisma`
- Generates TypeScript types in `node_modules/.prisma/client`
- Creates the Prisma Client you use in your code

### Step 2: Create Database and Tables

This creates the SQLite database file and all tables:

```bash
npx prisma migrate dev --name add_products
```

**What this does:**
- Creates `prisma/dev.db` (SQLite database file)
- Creates all tables: Category, Product, ProductImage, Material, Color, Booking
- Creates migration files in `prisma/migrations/`
- Applies the migration to your database

### Step 3: Verify Setup

Open Prisma Studio to see your database:

```bash
npx prisma studio
```

This opens a web interface at http://localhost:5555 where you can:
- View all tables
- Add/edit/delete data
- See relationships

## Troubleshooting Windows Permission Errors

If you get `EPERM: operation not permitted` errors:

### Solution 1: Close Everything
1. Close VS Code completely
2. Close all terminal windows
3. Close any programs that might be using the files
4. Open a NEW terminal as Administrator:
   - Right-click PowerShell/CMD
   - Select "Run as Administrator"
5. Navigate to your project:
   ```bash
   cd "C:\Users\mcmcb\OneDrive\Desktop\testing"
   ```
6. Run the commands again

### Solution 2: Delete and Regenerate
```bash
# Delete the .prisma folder
rmdir /s /q node_modules\.prisma

# Then regenerate
npx prisma generate
npx prisma migrate dev --name add_products
```

### Solution 3: Restart Computer
Sometimes Windows locks files and a restart is needed.

## What Gets Created

After running migrations, you'll have:

1. **Database File:** `prisma/dev.db` (SQLite database)
2. **Migration Files:** `prisma/migrations/` (history of changes)
3. **Prisma Client:** Generated in `node_modules/.prisma/client`

## Tables Created

- `Category` - Product categories
- `Product` - Products
- `ProductImage` - Product images
- `Material` - Available materials
- `Color` - Product colors
- `Booking` - Booking requests (from booking system)

## Adding Sample Data

### Option 1: Prisma Studio (Easiest)

```bash
npx prisma studio
```

Then:
1. Click on "Category" table
2. Click "Add record"
3. Fill in: name, slug (e.g., "Chaises", "chaises")
4. Click "Save 1 change"
5. Repeat for more categories
6. Add products in the "Product" table

### Option 2: Via API (After setup)

Use the admin API endpoints to create products programmatically.

## Verify It's Working

1. **Check database file exists:**
   ```bash
   dir prisma\dev.db
   ```

2. **Check Prisma Client generated:**
   ```bash
   dir node_modules\.prisma\client
   ```

3. **Visit boutique page:**
   - http://localhost:3000/boutique
   - Should load without errors (may show empty states)

## Common Issues

### Issue: "Table does not exist"
**Solution:** Run `npx prisma migrate dev`

### Issue: "Prisma Client not generated"
**Solution:** Run `npx prisma generate`

### Issue: "Cannot find module '@prisma/client'"
**Solution:** Run `npm install @prisma/client prisma`

### Issue: Permission errors on Windows
**Solution:** Close VS Code, run terminal as Administrator

## Next Steps After Setup

1. Add categories via Prisma Studio
2. Add products with images
3. Test the boutique page
4. Test adding items to cart

## Quick Reference

```bash
# Generate client
npx prisma generate

# Create/apply migrations
npx prisma migrate dev --name migration_name

# Open database GUI
npx prisma studio

# Reset database (WARNING: deletes all data)
npx prisma migrate reset

# View database schema
npx prisma format
```

