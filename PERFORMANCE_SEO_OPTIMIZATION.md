# Performance Optimization for SEO - Core Web Vitals

## Core Web Vitals Targets

| Metric | Target | Current Status | Priority |
|--------|--------|----------------|----------|
| **LCP (Largest Contentful Paint)** | < 2.5s | ⚠️ Needs testing | HIGH |
| **CLS (Cumulative Layout Shift)** | < 0.1 | ⚠️ Needs testing | HIGH |
| **FID (First Input Delay)** | < 100ms | ⚠️ Needs testing | MEDIUM |
| **INP (Interaction to Next Paint)** | < 200ms | ⚠️ Needs testing | MEDIUM |
| **TBT (Total Blocking Time)** | < 200ms | ⚠️ Needs testing | MEDIUM |

## Optimization Opportunities

### 1. Image Optimization

**Current Issues:**
- Some images use `quality={70}` (can be optimized)
- Some images don't have explicit `sizes` attribute
- Hero images should use `priority` and `loading="eager"`

**Fixes:**

```typescript
// Hero images - HIGH PRIORITY
<Image
  src="/hero.jpg"
  alt="..."
  fill
  priority
  quality={85}
  sizes="100vw"
  loading="eager"
/>

// Product images - LAZY LOAD
<Image
  src={product.image}
  alt={product.name}
  fill
  quality={75}
  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
  loading="lazy"
/>

// Thumbnail images - LAZY LOAD
<Image
  src={thumbnail}
  alt="..."
  fill
  quality={70}
  sizes="(max-width: 640px) 25vw, 12.5vw"
  loading="lazy"
/>
```

**Recommendations:**
- ✅ Use WebP/AVIF formats (already configured in next.config.js)
- ✅ Implement proper `sizes` for responsive images
- ✅ Use `priority` only for above-the-fold images
- ✅ Lazy load below-the-fold images

### 2. Animation Optimization

**Current Issues:**
- Heavy use of framer-motion
- Some animations may cause layout shifts
- Animations may block main thread

**Fixes:**

```typescript
// Use CSS transforms instead of position changes
// Use will-change for animated elements
// Reduce animation complexity

// Example: Optimize hover animations
<div className="transition-transform duration-300 hover:scale-105">
  {/* Use CSS transforms, not JS */}
</div>

// Reduce framer-motion usage where possible
// Use CSS animations for simple effects
```

**Recommendations:**
- ✅ Use `will-change: transform` for animated elements
- ✅ Prefer CSS animations over JS animations
- ✅ Reduce animation duration for better perceived performance
- ✅ Use `transform` and `opacity` only (GPU accelerated)

### 3. JavaScript Execution

**Current Issues:**
- Many components use `'use client'`
- Heavy dynamic imports
- Large bundle size potential

**Fixes:**

```typescript
// Already using dynamic imports - GOOD
const ProjectCarousel = dynamic(() => import('@/components/ProjectCarousel'), {
  ssr: false,
  loading: () => <div style={{height:"300px"}} />
})

// Add more dynamic imports for heavy components
// Split code at route level
// Use React.lazy for client components
```

**Recommendations:**
- ✅ Continue using dynamic imports for heavy components
- ✅ Split vendor chunks
- ✅ Use route-based code splitting
- ✅ Minimize client-side JavaScript

### 4. Layout Shifts (CLS)

**Current Issues:**
- Images without dimensions can cause shifts
- Dynamic content loading
- Font loading may cause shifts

**Fixes:**

```typescript
// Always specify image dimensions
<Image
  src={image}
  alt="..."
  width={1200}
  height={630}
  // OR use fill with aspect ratio container
/>

// Use aspect ratio containers
<div className="aspect-square">
  <Image fill ... />
</div>

// Preload critical fonts (already done in layout.tsx)
// Use font-display: swap
```

**Recommendations:**
- ✅ Always use aspect ratio containers for images
- ✅ Preload critical fonts (already implemented)
- ✅ Reserve space for dynamic content
- ✅ Use skeleton loaders instead of empty states

### 5. Caching Strategy

**Current Issues:**
- No explicit caching headers
- Static assets may not be cached optimally

**Fixes:**

```typescript
// Add to next.config.js or API routes
// Static assets: Cache-Control: public, max-age=31536000, immutable
// HTML: Cache-Control: public, max-age=0, must-revalidate
// API: Cache-Control: public, max-age=60, s-maxage=300
```

**Recommendations:**
- ✅ Use Vercel's automatic caching
- ✅ Implement ISR (Incremental Static Regeneration) for product pages
- ✅ Cache API responses where appropriate
- ✅ Use CDN for static assets

### 6. Preload Strategy

**Current Issues:**
- Some critical resources not preloaded
- Fonts already preloaded (GOOD)

**Fixes:**

```typescript
// Already preloading fonts - GOOD
// Add preload for critical images
<link rel="preload" as="image" href="/hero.jpg" />

// Preload critical API data
<link rel="prefetch" href="/api/products" />
```

**Recommendations:**
- ✅ Preload critical hero images
- ✅ Prefetch API data for above-the-fold content
- ✅ Use DNS prefetch for external resources
- ✅ Preconnect to critical domains

### 7. Bundle Size Optimization

**Current Issues:**
- Need to analyze bundle size
- May have unused dependencies

**Fixes:**

```bash
# Analyze bundle
npm run build
npx @next/bundle-analyzer

# Remove unused dependencies
# Use tree-shaking
# Code split at route level
```

**Recommendations:**
- ✅ Run bundle analyzer
- ✅ Remove unused dependencies
- ✅ Use tree-shaking
- ✅ Split vendor chunks

### 8. Database Query Optimization

**Current Issues:**
- May have N+1 queries
- No query caching

**Fixes:**

```typescript
// Use Prisma include efficiently
const products = await prisma.product.findMany({
  include: {
    category: true,
    images: true,
  },
  // Add indexes for frequently queried fields
})

// Implement query caching
// Use Redis or similar
```

**Recommendations:**
- ✅ Add database indexes
- ✅ Implement query caching
- ✅ Use connection pooling
- ✅ Optimize Prisma queries

## Implementation Priority

### High Priority (Do First)
1. ✅ Image optimization (sizes, quality, format)
2. ✅ Layout shift prevention (aspect ratios)
3. ✅ Font preloading (already done)
4. ✅ Critical image preloading

### Medium Priority
1. ⚠️ Animation optimization
2. ⚠️ Bundle size analysis
3. ⚠️ Caching strategy
4. ⚠️ Database query optimization

### Low Priority
1. ⚠️ Advanced code splitting
2. ⚠️ Service worker implementation
3. ⚠️ Advanced prefetching

## Testing

1. Run Lighthouse audit
2. Test Core Web Vitals
3. Use PageSpeed Insights
4. Monitor with Vercel Analytics
5. Test on real devices

## Expected Improvements

- **LCP:** < 2.5s (from ~3-4s)
- **CLS:** < 0.1 (from ~0.2-0.3)
- **FID:** < 100ms (from ~200-300ms)
- **TBT:** < 200ms (from ~400-500ms)




