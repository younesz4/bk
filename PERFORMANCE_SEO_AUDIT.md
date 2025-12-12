# Next.js Performance & SEO Audit Checklist

## 📊 Current Status Summary
- ✅ Image optimization partially implemented
- ✅ Font loading configured with preload
- ⚠️ Code splitting used but can be expanded
- ❌ Caching headers not configured
- ⚠️ Preloading needs improvement
- ⚠️ Potential unused packages detected

---

## 🖼️ 1. IMAGE OPTIMIZATION

### ✅ Already Implemented
- [x] Next.js Image component used (184 instances)
- [x] AVIF and WebP formats configured in `next.config.js`
- [x] Image domains configured
- [x] Device sizes and image sizes configured
- [x] Cache TTL set to 1 year

### 🔧 Required Improvements

#### High Priority
- [ ] **Add `placeholder="blur"` to above-the-fold images**
  - Location: Hero images, product main images
  - Impact: Reduces Cumulative Layout Shift (CLS)
  - Example: `<Image placeholder="blur" blurDataURL="..." />`

- [ ] **Optimize image `sizes` attribute for all images**
  - Current: Many images use generic `sizes="100vw"` or missing sizes
  - Action: Add responsive sizes like `sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"`
  - Files to update:
    - `components/LuxuryHero.tsx`
    - `components/MobilierExcellence.tsx`
    - `app/boutique/[collection]/[handle]/page.tsx`
    - `app/projects/[slug]/page.tsx`

- [ ] **Convert all `.jpg` images to `.webp` in public folder**
  - Current: Many duplicate `.jpg` and `.webp` files exist
  - Action: Remove `.jpg` duplicates, use only `.webp` versions
  - Impact: 25-35% file size reduction

- [ ] **Add `loading="lazy"` to below-the-fold images**
  - Current: Some images missing lazy loading
  - Action: Ensure all non-critical images have `loading="lazy"`

- [ ] **Implement blur placeholders for product images**
  - Create base64 blur data URLs for product thumbnails
  - Use `plaiceholder` or `blurhash` library

#### Medium Priority
- [ ] **Remove unused image files from `/public`**
  - Audit: Many duplicate/unused images (e.g., `.jpg` when `.webp` exists)
  - Action: Run audit and remove unused files
  - Estimated savings: ~50-100MB

- [ ] **Add `priority` prop only to LCP images**
  - Current: Some non-critical images may have `priority={true}`
  - Action: Limit `priority` to hero images and first product image

- [ ] **Implement responsive image srcsets**
  - Use Next.js automatic srcset generation
  - Ensure proper `sizes` attribute for each use case

---

## 🔤 2. FONT LOADING

### ✅ Already Implemented
- [x] Google Fonts loaded via `next/font/google`
- [x] `display: 'swap'` configured
- [x] `preload: true` enabled
- [x] Font variables properly configured

### 🔧 Required Improvements

#### High Priority
- [ ] **Add `font-display: swap` to font-face declarations**
  - Already done via Next.js, but verify in production

- [ ] **Preload critical font files in `<head>`**
  - Current: Fonts preloaded via Next.js
  - Action: Add explicit `<link rel="preload">` for critical font weights
  - Example:
    ```html
    <link rel="preload" href="/fonts/raleway-regular.woff2" as="font" type="font/woff2" crossorigin />
    ```

- [ ] **Subset fonts to only required characters**
  - Current: Using full Latin subset
  - Action: Use `subsets: ['latin']` with specific character ranges if possible
  - Impact: Reduces font file size by 30-50%

#### Medium Priority
- [ ] **Self-host fonts instead of Google Fonts**
  - Download fonts and serve from `/public/fonts`
  - Impact: Better privacy, faster loading, no external requests
  - Use `next/font/local` instead

- [ ] **Add font-display fallback strategy**
  - Ensure fallback fonts are defined in CSS
  - Use `font-display: optional` for non-critical fonts

---

## 📦 3. CODE SPLITTING

### ✅ Already Implemented
- [x] Dynamic imports used on home page (`app/page.tsx`)
- [x] `ssr: false` for client-only components
- [x] Loading states provided

### 🔧 Required Improvements

#### High Priority
- [ ] **Add code splitting to heavy components**
  - Files to update:
    - `components/ProjectGallery.tsx` (if large)
    - `components/Cart.tsx` (cart drawer)
    - `components/Header.tsx` (if large)
    - `app/checkout/page.tsx`
    - `app/admin/**` pages (admin-only code)

- [ ] **Split Framer Motion animations**
  - Current: Framer Motion loaded on every page
  - Action: Lazy load Framer Motion only where needed
  - Example:
    ```typescript
    const MotionDiv = dynamic(() => import('framer-motion').then(mod => mod.motion.div))
    ```

- [ ] **Split admin routes completely**
  - Use route groups: `app/(admin)/admin/**`
  - Exclude admin code from main bundle

#### Medium Priority
- [ ] **Implement route-based code splitting**
  - Ensure each route loads only its required code
  - Use Next.js automatic code splitting

- [ ] **Split large third-party libraries**
  - Consider splitting:
    - `framer-motion` (only load where animations exist)
    - `zod` (only in API routes/forms)
    - `stripe` (only in checkout/payment routes)

- [ ] **Add React.lazy for client components**
  - Convert heavy client components to use `React.lazy`
  - Example:
    ```typescript
    const HeavyComponent = React.lazy(() => import('./HeavyComponent'))
    ```

---

## 💾 4. CACHING HEADERS

### ❌ Not Implemented
- [ ] **Add caching headers in middleware or API routes**

### 🔧 Required Improvements

#### High Priority
- [ ] **Add static asset caching headers**
  - Location: `middleware.ts` or `next.config.js`
  - Action: Add headers for static files
  - Example:
    ```typescript
    // In middleware.ts
    if (pathname.startsWith('/_next/static')) {
      response.headers.set('Cache-Control', 'public, max-age=31536000, immutable')
    }
    ```

- [ ] **Add API route caching**
  - Cache GET requests for products, categories
  - Location: API routes
  - Example:
    ```typescript
    export async function GET() {
      const response = NextResponse.json(data)
      response.headers.set('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400')
      return response
    }
    ```

- [ ] **Add page-level caching**
  - Use `revalidate` in server components
  - Example:
    ```typescript
    export const revalidate = 3600 // Revalidate every hour
    ```

#### Medium Priority
- [ ] **Implement ISR (Incremental Static Regeneration)**
  - For product pages, category pages
  - Use `generateStaticParams` with `revalidate`

- [ ] **Add stale-while-revalidate strategy**
  - Serve stale content while revalidating
  - Better user experience

- [ ] **Cache database queries**
  - Use React Cache or SWR for client-side
  - Use Prisma query caching for server-side

---

## ⚡ 5. PRELOADING

### ⚠️ Partially Implemented
- [x] Font preloading configured
- [x] Some image preloading in layout
- [ ] Missing critical resource preloading

### 🔧 Required Improvements

#### High Priority
- [ ] **Preload critical CSS**
  - Add to `app/layout.tsx`:
    ```html
    <link rel="preload" href="/globals.css" as="style" />
    ```

- [ ] **Preload critical API routes**
  - Prefetch product data for above-the-fold products
  - Use `<link rel="prefetch">` for likely next pages

- [ ] **Preload critical images**
  - Current: Some preloads exist in layout
  - Action: Add preloads for hero images on each page
  - Example:
    ```html
    <link rel="preload" as="image" href="/hero-image.webp" />
    ```

- [ ] **Add DNS prefetch for external domains**
  - If using external APIs or CDNs
  - Example:
    ```html
    <link rel="dns-prefetch" href="https://api.example.com" />
    ```

#### Medium Priority
- [ ] **Implement resource hints for navigation**
  - Use `<link rel="prefetch">` for likely next pages
  - Prefetch category pages when hovering over menu items

- [ ] **Preload critical JavaScript**
  - Preload route chunks for likely next pages
  - Use Next.js automatic prefetching (already enabled)

- [ ] **Add module preload for critical scripts**
  - Preload ES modules for faster execution

---

## 🗑️ 6. REMOVING UNUSED PACKAGES

### ⚠️ Potential Issues Detected

#### High Priority
- [ ] **Check `@sendgrid/mail` usage**
  - Current: Package installed but using `nodemailer`
  - Action: Remove if not used
  - Command: `npm uninstall @sendgrid/mail`
  - Estimated savings: ~500KB

- [ ] **Check `@studio-freight/lenis` usage**
  - Current: Package installed
  - Action: Verify if used, remove if not
  - Search: `grep -r "lenis" app/ components/`
  - Estimated savings: ~50KB

#### Medium Priority
- [ ] **Audit all dependencies**
  - Run: `npm audit`
  - Run: `npx depcheck` to find unused dependencies
  - Action: Remove unused packages

- [ ] **Check for duplicate dependencies**
  - Some packages may have overlapping functionality
  - Consolidate where possible

- [ ] **Update outdated packages**
  - Run: `npm outdated`
  - Update to latest versions for performance improvements

---

## 🚀 7. ADDITIONAL PERFORMANCE IMPROVEMENTS

### High Priority
- [ ] **Enable compression in Next.js**
  - Current: `compress: true` in config ✅
  - Verify it's working in production

- [ ] **Optimize bundle size**
  - Run: `npm run build` and analyze bundle
  - Use `@next/bundle-analyzer` to visualize
  - Target: Reduce initial bundle to < 200KB

- [ ] **Implement service worker for offline support**
  - Use Next.js PWA plugin
  - Cache static assets

- [ ] **Add performance monitoring**
  - Integrate Web Vitals tracking
  - Use `next/web-vitals` package
  - Monitor: LCP, FID, CLS, FCP, TTFB

### Medium Priority
- [ ] **Optimize database queries**
  - Use Prisma `select` to fetch only needed fields
  - Add database indexes for frequently queried fields
  - Implement query batching

- [ ] **Reduce JavaScript execution time**
  - Minimize client-side JavaScript
  - Move logic to server components where possible
  - Use React Server Components

- [ ] **Implement virtual scrolling for long lists**
  - For product grids, project lists
  - Use `react-window` or `react-virtual`

- [ ] **Add loading states and skeletons**
  - Improve perceived performance
  - Already partially implemented ✅

---

## 📈 8. SEO IMPROVEMENTS

### High Priority
- [ ] **Add canonical URLs to all pages**
  - Already implemented ✅

- [ ] **Implement hreflang tags for multi-language**
  - If planning international expansion

- [ ] **Add structured data validation**
  - Test all JSON-LD schemas with Google Rich Results Test
  - Fix any validation errors

- [ ] **Optimize meta descriptions**
  - Ensure all pages have unique, descriptive meta descriptions
  - Keep under 155 characters

### Medium Priority
- [ ] **Add Open Graph images for all pages**
  - Ensure each page has a unique OG image
  - Size: 1200x630px

- [ ] **Implement pagination metadata**
  - Add `rel="next"` and `rel="prev"` for paginated content

- [ ] **Add FAQ schema if applicable**
  - For product pages or service pages

---

## ✅ QUICK WINS (Do First)

1. **Remove unused packages** (`@sendgrid/mail`, `@studio-freight/lenis` if unused)
2. **Add `sizes` attribute to all images**
3. **Add caching headers in middleware**
4. **Convert duplicate `.jpg` to `.webp` only**
5. **Add `placeholder="blur"` to hero images**
6. **Run bundle analyzer** to identify large dependencies

---

## 📊 Performance Targets

- **Lighthouse Performance Score**: > 90
- **First Contentful Paint (FCP)**: < 1.8s
- **Largest Contentful Paint (LCP)**: < 2.5s
- **Time to Interactive (TTI)**: < 3.8s
- **Total Blocking Time (TBT)**: < 200ms
- **Cumulative Layout Shift (CLS)**: < 0.1
- **Initial Bundle Size**: < 200KB (gzipped)

---

## 🔧 Tools for Monitoring

- **Lighthouse**: Built into Chrome DevTools
- **WebPageTest**: https://www.webpagetest.org/
- **Next.js Bundle Analyzer**: `@next/bundle-analyzer`
- **Google PageSpeed Insights**: https://pagespeed.web.dev/
- **Web Vitals Extension**: Chrome extension for real-time metrics

---

## 📝 Implementation Priority

1. **Week 1**: Remove unused packages, add caching headers, optimize images
2. **Week 2**: Improve code splitting, add preloading, optimize fonts
3. **Week 3**: Advanced optimizations, monitoring setup, performance testing

---

**Last Updated**: 2024
**Next Review**: After implementing high-priority items

