# 📝 How to Add Categories in Prisma Studio

## Step-by-Step Guide

### Step 1: Open Prisma Studio

In your terminal, run:

```powershell
npx prisma studio
```

This will open a web interface at **http://localhost:5555**

### Step 2: Navigate to Category Table

1. You'll see a list of tables on the left side
2. Click on **"Category"** table
3. You'll see the category list (probably empty at first)

### Step 3: Add a New Category

1. Click the **"+ Add record"** button (usually at the top right)
2. A form will appear with fields:
   - **id** - Leave this empty (it will auto-generate)
   - **name** - Enter the category name (e.g., "Chaises")
   - **slug** - Enter the URL-friendly version (e.g., "chaises")
   - **createdAt** - Auto-filled
   - **updatedAt** - Auto-filled

### Step 4: Fill in the Fields

Example for "Chaises":
- **name:** `Chaises`
- **slug:** `chaises`

**Important:** The slug should be:
- Lowercase
- No spaces (use hyphens)
- URL-friendly
- Unique (each category needs a different slug)

### Step 5: Save

1. Click **"Save 1 change"** button
2. Your category is now created!

### Step 6: Add More Categories

Repeat the process for other categories:

| Name | Slug |
|------|------|
| Chaises | chaises |
| Fauteuils | fauteuils |
| Tables | tables |
| Consoles | consoles |
| Meubles TV | meubles-tv |

## Quick Reference

### Category Names and Slugs

Here are the recommended categories for BK Agencements:

1. **Chaises** → slug: `chaises`
2. **Fauteuils** → slug: `fauteuils`
3. **Tables** → slug: `tables`
4. **Consoles** → slug: `consoles`
5. **Meubles TV** → slug: `meubles-tv`

### Tips

- ✅ **Slug must be unique** - Each category needs a different slug
- ✅ **Use lowercase** - Slugs should be lowercase
- ✅ **Use hyphens** - Replace spaces with hyphens (meubles-tv, not "meubles tv")
- ✅ **Keep it simple** - Short, descriptive slugs work best
- ❌ **No special characters** - Avoid accents, spaces, or special chars in slugs

## Visual Guide

```
Prisma Studio Interface:

┌─────────────────────────────────────┐
│  Tables                             │
│  ┌───────────────────────────────┐  │
│  │ 📊 Category          [Add]    │  │
│  └───────────────────────────────┘  │
│  │ 📦 Product                     │  │
│  │ 🖼️  ProductImage               │  │
│  │ ...                            │  │
└─────────────────────────────────────┘

When you click "Category", you see:

┌─────────────────────────────────────┐
│  Category                            │
│  ┌────────────────────────────────┐ │
│  │ + Add record                   │ │
│  └────────────────────────────────┘ │
│                                      │
│  Form:                               │
│  ┌────────────────────────────────┐ │
│  │ name:  [Chaises          ]      │ │
│  │ slug:  [chaises         ]      │ │
│  │                                │ │
│  │        [Save 1 change]         │ │
│  └────────────────────────────────┘ │
└─────────────────────────────────────┘
```

## After Adding Categories

Once you've added categories:

1. **Refresh your boutique page** - http://localhost:3000/boutique
2. **You should see** your categories displayed
3. **Click on a category** to see its products (empty until you add products)

## Next: Adding Products

After adding categories, you can add products:

1. Click on **"Product"** table in Prisma Studio
2. Click **"+ Add record"**
3. Fill in:
   - **name:** Product name
   - **slug:** URL-friendly version
   - **description:** Product description (optional)
   - **price:** Price in cents (e.g., 50000 = 500.00 EUR)
   - **categoryId:** Select the category from dropdown
   - **stock:** Number in stock
4. Save the product
5. Then add images, materials, and colors in their respective tables

## Troubleshooting

### "Slug must be unique" error
- You already have a category with that slug
- Choose a different slug

### Can't see the Category table
- Make sure you ran `npx prisma studio` successfully
- Check that migrations ran: `npx prisma migrate dev`

### Categories not showing on boutique page
- Make sure your dev server is running: `npm run dev`
- Refresh the page
- Check browser console for errors

## Example: Complete Category Setup

Here's how to add all categories quickly:

1. Open Prisma Studio: `npx prisma studio`
2. Click "Category" table
3. Add each category:

**Category 1:**
- name: `Chaises`
- slug: `chaises`
- Save

**Category 2:**
- name: `Fauteuils`
- slug: `fauteuils`
- Save

**Category 3:**
- name: `Tables`
- slug: `tables`
- Save

**Category 4:**
- name: `Consoles`
- slug: `consoles`
- Save

**Category 5:**
- name: `Meubles TV`
- slug: `meubles-tv`
- Save

Done! Your categories are ready. 🎉

