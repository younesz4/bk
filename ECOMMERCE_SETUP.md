# E-Commerce System Setup Guide

## ✅ What Has Been Created

### 1. Database Models (Prisma)
- ✅ `Category` model
- ✅ `Product` model
- ✅ `ProductImage` model
- ✅ `Material` model
- ✅ `Color` model

### 2. API Routes
- ✅ `GET /api/products` - List all products with filters
- ✅ `GET /api/products/[slug]` - Get single product
- ✅ `POST /api/products` - Create product (admin)
- ✅ `POST /api/admin/products` - Create product (admin)
- ✅ `DELETE /api/admin/products` - Delete products (admin)
- ✅ `PATCH /api/admin/products/[id]` - Update product (admin)
- ✅ `GET /api/categories` - List all categories
- ✅ `POST /api/cart` - Calculate cart totals

### 3. Frontend Pages
- ✅ `/boutique` - Shop overview with categories and featured products
- ✅ `/boutique/[category]` - Category page with filters
- ✅ `/boutique/[category]/[slug]` - Product detail page

### 4. Components
- ✅ `ProductFilters` - Sidebar filters (price, material, stock)
- ✅ `ProductGrid` - Product grid display
- ✅ `AddToCartButton` - Updated for new product structure
- ✅ `Cart` - Updated cart drawer
- ✅ `CartContext` - Updated for new product types

## 🚀 Setup Instructions

### Step 1: Run Database Migrations

```bash
# Generate Prisma Client
npx prisma generate

# Create and run migrations
npx prisma migrate dev --name add_products
```

### Step 2: Seed Initial Data (Optional)

You can create a seed script or manually add categories and products via Prisma Studio:

```bash
npx prisma studio
```

### Step 3: Test the System

1. **Start the dev server:**
   ```bash
   npm run dev
   ```

2. **Visit the shop:**
   - http://localhost:3000/boutique

3. **Test API endpoints:**
   ```bash
   # Get all products
   curl http://localhost:3000/api/products
   
   # Get categories
   curl http://localhost:3000/api/categories
   
   # Create a product (admin)
   curl -X POST http://localhost:3000/api/admin/products \
     -H "Content-Type: application/json" \
     -H "x-admin-token: your-admin-token" \
     -d '{
       "name": "Chaise Design",
       "slug": "chaise-design",
       "price": 50000,
       "categoryId": "category-id",
       "images": [{"url": "/chaise.jpg"}],
       "materials": [{"name": "Chêne"}],
       "colors": [{"name": "Naturel", "hex": "#D4A574"}]
     }'
   ```

## 📝 Product Data Structure

Products are stored with:
- **Price in cents** (e.g., 50000 = 500.00 EUR)
- **Images** with order and alt text
- **Materials** (Chêne, Noyer, Hêtre, Frêne)
- **Colors** with hex codes
- **Stock** quantity

## 🎨 Features

### Filters
- Price range (multiple ranges)
- Material filter (Chêne, Noyer, Hêtre, Frêne)
- Stock filter (in stock only)
- Color filter (ready for implementation)

### Cart System
- Persistent localStorage
- Material/Color selection support
- Quantity management
- Price calculation (with tax ready)
- Slide-out drawer UI

### Admin Features
- Protected routes with `x-admin-token` header
- Create/Update/Delete products
- Full CRUD operations

## 🔧 Next Steps

1. **Add sample data:**
   - Create categories via Prisma Studio or API
   - Add products with images

2. **Configure images:**
   - Ensure product images are in `/public` folder
   - Or use external URLs

3. **Customize filters:**
   - Add more material options
   - Add color picker UI
   - Add sorting options

4. **Enhance product page:**
   - Add material selector
   - Add color selector
   - Add image gallery with zoom

## 📦 File Structure

```
├── prisma/
│   └── schema.prisma          # Database models
├── app/
│   ├── api/
│   │   ├── products/
│   │   │   ├── route.ts       # GET all, POST create
│   │   │   └── [slug]/route.ts # GET one
│   │   ├── admin/
│   │   │   └── products/
│   │   │       ├── route.ts   # POST, DELETE
│   │   │       └── [id]/route.ts # PATCH
│   │   ├── categories/
│   │   │   └── route.ts       # GET categories
│   │   └── cart/
│   │       └── route.ts        # POST calculate
│   └── boutique/
│       ├── page.tsx            # Shop overview
│       ├── [category]/
│       │   └── page.tsx       # Category page
│       └── [category]/[slug]/
│           └── page.tsx       # Product page
├── components/
│   ├── ProductFilters.tsx     # Filter sidebar
│   ├── ProductGrid.tsx         # Product grid
│   ├── AddToCartButton.tsx    # Add to cart
│   └── Cart.tsx               # Cart drawer
├── contexts/
│   └── CartContext.tsx        # Cart state management
└── types/
    └── product.ts              # TypeScript types
```

## 🎯 Ready to Use!

The e-commerce system is complete and ready. Just run the migrations and start adding products!

