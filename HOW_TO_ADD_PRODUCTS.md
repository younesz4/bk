# 📦 How to Add Products in Prisma Studio

## Step-by-Step Guide

### Step 1: Open Prisma Studio

```powershell
npx prisma studio
```

This opens http://localhost:5555

### Step 2: Add a Product

1. Click on **"Product"** table (left sidebar)
2. Click **"+ Add record"** button (top right)
3. Fill in the form:

**Required Fields:**
- **name:** `Chaise Design Moderne` (product name)
- **slug:** `chaise-design-moderne` (URL-friendly, lowercase, hyphens)
- **price:** `50000` (in cents = 500.00 EUR)
- **categoryId:** Click dropdown → Select a category (e.g., "Chaises")
- **stock:** `10` (number of items in stock)

**Optional Fields:**
- **description:** `Chaise design en bois massif, fabrication artisanale au Maroc`

4. Click **"Save 1 change"**

**Important:** 
- `slug` must be unique
- `price` is in cents (50000 = 500.00 EUR)
- You must select a `categoryId` (category must exist first)

### Step 3: Add Product Images

After creating the product, add images:

1. Click on **"ProductImage"** table
2. Click **"+ Add record"**
3. Fill in:
   - **url:** `/chaise.jpg` (path to image in `/public` folder)
   - **alt:** `Chaise Design Moderne` (image description)
   - **order:** `0` (first image = 0, second = 1, etc.)
   - **productId:** Click dropdown → Select the product you just created
4. Click **"Save 1 change"**

**Repeat for more images:**
- Second image: order = `1`, url = `/chaise-detail.jpg`
- Third image: order = `2`, url = `/chaise-back.jpg`
- etc.

### Step 4: Add Materials (Optional)

1. Click on **"Material"** table
2. Click **"+ Add record"**
3. Fill in:
   - **name:** `Chêne` (or Noyer, Hêtre, Frêne)
   - **productId:** Select your product
4. Click **"Save 1 change"**

**Add multiple materials:**
- Repeat for each material (Chêne, Noyer, Hêtre, Frêne)

### Step 5: Add Colors (Optional)

1. Click on **"Color"** table
2. Click **"+ Add record"**
3. Fill in:
   - **name:** `Naturel`
   - **hex:** `#D4A574` (color code)
   - **productId:** Select your product
4. Click **"Save 1 change"**

**Add multiple colors:**
- Repeat for each color (Naturel, Chocolat, Blanc, etc.)

## Complete Example: Adding a Chaise

### 1. Product Table

```
name: Chaise Design Moderne
slug: chaise-design-moderne
description: Chaise design en bois massif, fabrication artisanale
price: 50000
categoryId: [Select "Chaises"]
stock: 10
```

### 2. ProductImage Table (Add 3 images)

**Image 1:**
```
url: /chaise.jpg
alt: Chaise Design Moderne
order: 0
productId: [Select "Chaise Design Moderne"]
```

**Image 2:**
```
url: /chaise-detail.jpg
alt: Détail de la chaise
order: 1
productId: [Select "Chaise Design Moderne"]
```

**Image 3:**
```
url: /chaise-back.jpg
alt: Vue arrière de la chaise
order: 2
productId: [Select "Chaise Design Moderne"]
```

### 3. Material Table (Add 2 materials)

**Material 1:**
```
name: Chêne
productId: [Select "Chaise Design Moderne"]
```

**Material 2:**
```
name: Noyer
productId: [Select "Chaise Design Moderne"]
```

### 4. Color Table (Add 2 colors)

**Color 1:**
```
name: Naturel
hex: #D4A574
productId: [Select "Chaise Design Moderne"]
```

**Color 2:**
```
name: Chocolat
hex: #5C4033
productId: [Select "Chaise Design Moderne"]
```

## Image Setup

### Where to Put Images

Images must be in the `/public` folder:

```
public/
├── chaise.jpg
├── chaise-detail.jpg
├── fauteuil.jpg
├── console.jpg
└── ...
```

### Image Paths in Database

- Use paths starting with `/` (e.g., `/chaise.jpg`)
- These reference files in the `public` folder
- Next.js serves files from `/public` automatically

### Image Requirements

- **Format:** JPG, PNG, WebP
- **Size:** Recommended 1200x800px or larger
- **Location:** Must be in `/public` folder
- **Naming:** Use lowercase, hyphens (e.g., `chaise-design.jpg`)

## Price Format

**Important:** Prices are stored in cents!

- 500.00 EUR → `50000` (in database)
- 1,250.00 EUR → `125000` (in database)
- 99.99 EUR → `9999` (in database)

**Formula:** Price in EUR × 100 = Price in cents

## Quick Reference: All 6 Categories

When adding products, you'll select from these categories:

1. **Chaises** (slug: `chaises`)
2. **Fauteuils** (slug: `fauteuils`)
3. **Tables d'appoint** (slug: `tables-appoint`)
4. **Tables basses** (slug: `tables-basse`)
5. **Consoles** (slug: `consoles`)
6. **Meubles TV** (slug: `meubles-tv`)

## Tips

### Adding Multiple Products Quickly

1. Add all products first (Product table)
2. Then add all images (ProductImage table)
3. Then add all materials (Material table)
4. Then add all colors (Color table)

### Product Slugs

- Must be unique
- Use lowercase
- Use hyphens (not spaces)
- Examples:
  - ✅ `chaise-design-moderne`
  - ✅ `fauteuil-luxe-cuir`
  - ❌ `Chaise Design` (has spaces)
  - ❌ `chaise_design` (uses underscore)

### Image Order

- First image (order: 0) = Main product image
- Additional images (order: 1, 2, 3...) = Gallery images
- Images are displayed in order

## After Adding Products

1. **Refresh boutique page:** http://localhost:3000/boutique
2. **You should see:**
   - Category cards with product images
   - Featured products section populated
   - Product counts updated
   - Products clickable and viewable

## Troubleshooting

### "Cannot save product"
- Make sure `categoryId` is selected
- Make sure `slug` is unique
- Make sure `price` is a number (in cents)

### "Image not showing"
- Check image exists in `/public` folder
- Check image path starts with `/`
- Check browser console for 404 errors

### "Category not found"
- Make sure you created categories first
- Check category exists in Category table

## Example: Complete Product Setup

Here's a complete example for a luxury chair:

**Product:**
- name: `Chaise Design Moderne`
- slug: `chaise-design-moderne`
- description: `Chaise design en bois massif, fabrication artisanale au Maroc. Confort exceptionnel et finition haut de gamme.`
- price: `50000` (500.00 EUR)
- categoryId: Chaises
- stock: `10`

**Images (3):**
1. `/chaise.jpg` (order: 0)
2. `/chaise-detail.jpg` (order: 1)
3. `/chaise-back.jpg` (order: 2)

**Materials (2):**
1. Chêne
2. Noyer

**Colors (3):**
1. Naturel (#D4A574)
2. Chocolat (#5C4033)
3. Blanc (#F5F5DC)

## Next Steps

After adding products:
1. Visit http://localhost:3000/boutique
2. Click on a category to see products
3. Click on a product to see details
4. Test "Add to Cart" functionality

Start by adding 1-2 products to test, then add more! 🎉
