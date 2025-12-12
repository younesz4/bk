# SEO Metadata Templates Reference

This document provides a complete reference for all page-level metadata templates created for the BK Agencements website.

## 📁 File Structure

- **`lib/metadata-templates.ts`** - Contains all metadata template functions and exports
- **Page layouts** - Each route has a `layout.tsx` file that exports the appropriate metadata

## ✅ Implemented Pages

### 1. **Home Page** (`app/page.tsx`)
**Status:** ⚠️ Client Component - Metadata needs to be added via route group or wrapper

Since `app/page.tsx` is a client component, you have two options:

**Option A: Create a route group**
```typescript
// app/(home)/layout.tsx
import type { Metadata } from 'next'
import { homeMetadata } from '@/lib/metadata-templates'

export const metadata: Metadata = homeMetadata

export default function HomeLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
```

**Option B: Add to root layout** (if home is the only page without metadata)
The home metadata is already included in the root layout's default metadata.

### 2. **About Page** (`app/about/page.tsx`)
**Status:** ✅ Complete
- **Layout:** `app/about/layout.tsx`
- **Metadata:** `aboutMetadata` from templates

### 3. **Boutique Page** (`app/boutique/page.tsx`)
**Status:** ✅ Complete
- **Metadata:** Exported directly in page file
- **Metadata:** `boutiqueMetadata` from templates

### 4. **Boutique Category Page** (`app/boutique/[collection]/page.tsx`)
**Status:** ✅ Complete
- **Metadata:** `generateBoutiqueCategoryMetadata()` function
- **Dynamic:** Generates metadata based on category data from Prisma

### 5. **Boutique Product Page** (`app/boutique/[collection]/[handle]/page.tsx`)
**Status:** ✅ Complete
- **Metadata:** `generateBoutiqueProductMetadata()` function
- **Dynamic:** Generates metadata based on product data from Prisma
- **Includes:** Product price, description, images, category

### 6. **Projects Page** (`app/projects/page.tsx`)
**Status:** ✅ Complete
- **Layout:** `app/projects/layout.tsx`
- **Metadata:** `projectsMetadata` from templates

### 7. **Single Project Page** (`app/projects/[slug]/page.tsx`)
**Status:** ✅ Complete
- **Layout:** `app/projects/[slug]/layout.tsx`
- **Metadata:** `generateProjectMetadata()` function
- **Dynamic:** Generates metadata based on project data from static data

### 8. **Réalisations Page** (`app/realisations/page.tsx`)
**Status:** ✅ Complete
- **Layout:** `app/realisations/layout.tsx`
- **Metadata:** `realisationsMetadata` from templates

### 9. **Contact Page** (`app/contact/page.tsx`)
**Status:** ✅ Complete
- **Layout:** `app/contact/layout.tsx`
- **Metadata:** `contactMetadata` from templates

## 📋 Metadata Template Functions

All templates are available in `lib/metadata-templates.ts`:

### Static Metadata Exports
- `homeMetadata` - Home page
- `aboutMetadata` - About page
- `boutiqueMetadata` - Main boutique/shop page
- `projectsMetadata` - Projects listing page
- `realisationsMetadata` - Réalisations gallery page
- `contactMetadata` - Contact page

### Dynamic Metadata Generators
- `generateBoutiqueCategoryMetadata(categoryName, categorySlug, productCount, categoryImage?)` - Category pages
- `generateBoutiqueProductMetadata(productName, productSlug, categoryName, categorySlug, description, price, productImage?)` - Product pages
- `generateProjectMetadata(projectName, projectSlug, projectDescription, projectImage?, projectType?)` - Single project pages

## 🔧 Usage Examples

### Using Static Metadata
```typescript
import type { Metadata } from 'next'
import { aboutMetadata } from '@/lib/metadata-templates'

export const metadata: Metadata = aboutMetadata
```

### Using Dynamic Metadata (Server Components)
```typescript
import type { Metadata } from 'next'
import { generateBoutiqueProductMetadata } from '@/lib/metadata-templates'

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = await getProduct(params.slug)
  return generateBoutiqueProductMetadata(
    product.name,
    product.slug,
    product.category.name,
    product.category.slug,
    product.description,
    product.price,
    product.images[0]?.url
  )
}
```

## 🌐 Base URL Configuration

All metadata templates use the `NEXT_PUBLIC_SITE_URL` environment variable:
```env
NEXT_PUBLIC_SITE_URL=https://bk-agencements.com
```

If not set, defaults to `https://bk-agencements.com`.

## 📊 SEO Features Included

Each metadata template includes:
- ✅ Title (with template support)
- ✅ Description
- ✅ Keywords
- ✅ Canonical URL
- ✅ OpenGraph tags (Facebook, LinkedIn)
- ✅ Twitter Card tags
- ✅ Language alternates
- ✅ Image optimization (1200x630 for OG)
- ✅ Product-specific metadata (for product pages)

## 🎯 Next Steps

1. **Home Page:** Add metadata via route group `(home)` or convert to server component wrapper
2. **Verify:** Test all pages with SEO tools (Google Search Console, Facebook Debugger, Twitter Card Validator)
3. **Images:** Ensure all referenced images exist in the public directory
4. **Environment:** Set `NEXT_PUBLIC_SITE_URL` in production

## 🔍 Testing Your Metadata

- **Google:** [Rich Results Test](https://search.google.com/test/rich-results)
- **Facebook:** [Sharing Debugger](https://developers.facebook.com/tools/debug/)
- **Twitter:** [Card Validator](https://cards-dev.twitter.com/validator)
- **LinkedIn:** [Post Inspector](https://www.linkedin.com/post-inspector/)

