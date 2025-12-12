# 🎨 Boutique Page Design & Layout

## Current Design Features

Your boutique page (`/boutique`) has a **luxury, modern design** with:

### 1. Hero Section
- **Full-width hero image** with overlay
- **Large title** "Boutique" in white
- **Subtitle** "Mobilier sur-mesure haut de gamme"
- **Responsive height**: 60vh on mobile, 70vh on desktop
- **Image**: Uses `/collectio1.jpg` from your public folder

### 2. Categories Grid Section
- **Clean grid layout**: 1 column (mobile) → 2 columns (tablet) → 3 columns (desktop)
- **Category cards** with:
  - Image from first product in category
  - Hover effects (scale + overlay)
  - Category name overlay at bottom
  - Product count display
- **Empty state**: Shows helpful message when no categories exist

### 3. Featured Products Section
- **Light gray background** (neutral-50)
- **4-column grid** on large screens
- **Product cards** with:
  - Product image
  - Product name
  - Category name
  - Price (formatted in EUR)
  - Hover effects (shadow + scale)

## Design System

### Colors
- **Background**: White (`bg-white`)
- **Text**: Black/Neutral shades
- **Accents**: Neutral grays for subtle backgrounds
- **Overlays**: Black with opacity for text readability

### Typography
- **Headings**: Bodoni Moda (serif, luxury feel)
- **Body**: Raleway (sans-serif, clean)
- **Sizes**: Responsive (text-2xl → text-3xl → text-4xl)

### Spacing
- **Sections**: py-16 md:py-24 (64px → 96px)
- **Grid gaps**: gap-8 md:gap-12 (32px → 48px)
- **Container**: max-w-7xl (1280px max width)

### Animations
- **Hover scale**: `group-hover:scale-105` (5% zoom)
- **Transition duration**: 500ms (smooth)
- **Shadow effects**: `hover:shadow-lg` (elevation on hover)

## Why You Might Not See the Design

### 1. No Categories Yet
If you haven't added categories, you'll see:
- Hero section (always visible)
- Empty state message for categories
- Empty state message for products

**Solution**: Add categories via Prisma Studio (see `HOW_TO_ADD_CATEGORIES.md`)

### 2. Missing Hero Image
If `/collectio1.jpg` doesn't exist:
- Hero section will show a broken image
- Background will be black/transparent

**Solution**: Add the image to `/public/collectio1.jpg`

### 3. No Products
Even with categories, if no products exist:
- Categories will show but with placeholder gradients
- Featured products section will be empty

**Solution**: Add products via Prisma Studio

## Visual Layout Structure

```
┌─────────────────────────────────────┐
│         HERO SECTION                │
│  (Full width, 60-70vh height)      │
│  - Background image                 │
│  - "Boutique" title                 │
│  - Subtitle                         │
└─────────────────────────────────────┘
┌─────────────────────────────────────┐
│      CATEGORIES SECTION             │
│  ┌─────┐ ┌─────┐ ┌─────┐          │
│  │ Cat │ │ Cat │ │ Cat │          │
│  │  1  │ │  2  │ │  3  │          │
│  └─────┘ └─────┘ └─────┘          │
│  (3 columns on desktop)            │
└─────────────────────────────────────┘
┌─────────────────────────────────────┐
│    FEATURED PRODUCTS SECTION        │
│  ┌──┐ ┌──┐ ┌──┐ ┌──┐              │
│  │P1│ │P2│ │P3│ │P4│              │
│  └──┘ └──┘ └──┘ └──┘              │
│  (4 columns on desktop)            │
└─────────────────────────────────────┘
```

## Making It Look Better

### Add Categories
Once you add categories, you'll see:
- Beautiful category cards with images
- Hover effects working
- Product counts displayed

### Add Products
Once you add products:
- Featured products will appear
- Category cards will show product images
- Full e-commerce experience

### Customize Colors
You can modify colors in `app/boutique/page.tsx`:
- Change `bg-white` to your brand color
- Adjust `text-neutral-600` for text colors
- Modify hover effects

## Responsive Breakpoints

- **Mobile** (< 640px): 1 column
- **Tablet** (640px - 1024px): 2 columns
- **Desktop** (1024px+): 3-4 columns

## Next Steps

1. ✅ **Add categories** (see `HOW_TO_ADD_CATEGORIES.md`)
2. ✅ **Add products** (via Prisma Studio)
3. ✅ **Add product images** (upload to `/public` folder)
4. ✅ **Test the design** (visit `/boutique`)

The design is already there - you just need data to see it in action! 🎨

