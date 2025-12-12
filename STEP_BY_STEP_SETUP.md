# 📋 Step-by-Step Database Setup

## Prerequisites

Make sure you have:
- ✅ Node.js installed
- ✅ npm packages installed (`npm install`)

## Setup Steps

### Step 1: Install Prisma Packages (if not already done)

```bash
npm install @prisma/client prisma
```

### Step 2: Generate Prisma Client

This creates the TypeScript code to interact with your database:

```bash
npx prisma generate
```

**Expected output:**
```
✔ Generated Prisma Client
```

**If you get a permission error:**
- Close VS Code completely
- Close all terminals
- Open a NEW terminal as Administrator
- Try again

### Step 3: Create Database and Tables

This creates the SQLite database file and all tables:

```bash
npx prisma migrate dev --name add_products
```

**Expected output:**
```
✔ Generated Prisma Client
✔ Applied migration `add_products`
```

**What gets created:**
- `prisma/dev.db` - Your SQLite database
- `prisma/migrations/` - Migration history
- All tables: Category, Product, ProductImage, Material, Color, Booking

### Step 4: (Optional) Seed Initial Data

Add some sample categories:

```bash
npm run prisma:seed
```

Or manually via Prisma Studio (see Step 5).

### Step 5: Verify with Prisma Studio

Open the database GUI:

```bash
npx prisma studio
```

This opens http://localhost:5555 where you can:
- View all tables
- Add/edit/delete data
- See relationships

## Quick Commands Reference

```bash
# Generate Prisma Client
npx prisma generate

# Create/apply migrations
npx prisma migrate dev --name migration_name

# Open database GUI
npx prisma studio

# Seed sample data (after creating seed.ts)
npm run prisma:seed

# Or use the combined command
npm run db:setup
```

## Verification Checklist

After running the commands, verify:

- [ ] `prisma/dev.db` file exists
- [ ] `node_modules/.prisma/client` folder exists
- [ ] `prisma/migrations/` folder exists with migration files
- [ ] Boutique page loads: http://localhost:3000/boutique
- [ ] Prisma Studio opens: `npx prisma studio`

## Adding Your First Data

### Via Prisma Studio (Recommended)

1. Run `npx prisma studio`
2. Click on "Category" table
3. Click "Add record" button
4. Fill in:
   - **name:** Chaises
   - **slug:** chaises
5. Click "Save 1 change"
6. Repeat for other categories:
   - Fauteuils (slug: fauteuils)
   - Tables (slug: tables)
   - Consoles (slug: consoles)
   - Meubles TV (slug: meubles-tv)

### Then Add a Product

1. In Prisma Studio, click "Product" table
2. Click "Add record"
3. Fill in:
   - **name:** Chaise Design Moderne
   - **slug:** chaise-design-moderne
   - **description:** Chaise design en bois massif
   - **price:** 50000 (in cents = 500.00 EUR)
   - **categoryId:** Select the category you created
   - **stock:** 10
4. Click "Save"
5. Then add images, materials, and colors in their respective tables

## Troubleshooting

### "EPERM: operation not permitted"
**Solution:** Close VS Code, run terminal as Administrator

### "Table does not exist"
**Solution:** Run `npx prisma migrate dev`

### "Prisma Client not found"
**Solution:** Run `npx prisma generate`

### Database file not created
**Solution:** Check that `DATABASE_URL` in `.env.local` is correct:
```
DATABASE_URL="file:./prisma/dev.db"
```

## What's Next?

Once the database is set up:

1. ✅ Add categories via Prisma Studio
2. ✅ Add products with images
3. ✅ Test the boutique page
4. ✅ Test adding items to cart
5. ✅ Test the admin API endpoints

Your e-commerce system is ready to use! 🎉

