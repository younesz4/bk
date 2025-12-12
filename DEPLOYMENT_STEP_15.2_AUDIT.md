# STEP 15.2 — Full Deployment Audit for Vercel

## ✅ Audit Results & Fixes

### 1. next.config.js ✅ (Good, but needs updates)

**Current Status:**
- ✅ Image optimization configured
- ✅ Compression enabled
- ✅ Security headers configured
- ⚠️ Image domains need production URLs
- ⚠️ Missing output configuration for static export (if needed)
- ⚠️ Missing ISR revalidation settings

**Fixes Applied:**
See `next.config.js` updates below.

### 2. Image Domains ⚠️ (Needs Update)

**Current:**
```js
domains: ['images.unsplash.com', 'via.placeholder.com']
```

**Issue:** These are placeholder domains. Need to add:
- Your production image CDN (if using one)
- Vercel blob storage (if using)
- Any external image sources

**Fix:** Update `next.config.js` with production image sources.

### 3. Environment Variables 📋 (Critical)

**Required for Production:**

```env
# Database (CRITICAL - SQLite won't work on Vercel)
DATABASE_URL="postgresql://user:password@host:5432/dbname"

# Stripe
STRIPE_SECRET_KEY=sk_live_*****
STRIPE_WEBHOOK_SECRET=whsec_*****
NEXT_PUBLIC_STRIPE_PUBLIC_KEY=pk_live_*****

# App URL
NEXT_PUBLIC_BASE_URL=https://bk-agencements.com
NEXT_PUBLIC_SITE_URL=https://bk-agencements.com

# Admin
ADMIN_API_KEY=your-secure-api-key-here

# Email (if using SendGrid)
SENDGRID_API_KEY=SG.*****

# Analytics
NEXT_PUBLIC_UMAMI_WEBSITE_ID=your-umami-id
NEXT_PUBLIC_UMAMI_SCRIPT_URL=https://analytics.umami.is/script.js
```

**⚠️ CRITICAL ISSUE:** Currently using SQLite (`file:./dev.db`). 
- **SQLite does NOT work on Vercel** (read-only filesystem)
- **MUST migrate to PostgreSQL** (Vercel Postgres, Supabase, or PlanetScale)

### 4. Database Migration Required 🚨

**Current:** SQLite (local file)
**Required:** PostgreSQL (for Vercel)

**Options:**
1. **Vercel Postgres** (Recommended - integrated)
2. **Supabase** (Free tier available)
3. **PlanetScale** (MySQL-compatible, serverless)
4. **Railway/Neon** (PostgreSQL)

**Migration Steps:**
1. Create PostgreSQL database
2. Update `prisma/schema.prisma` datasource:
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```
3. Run migrations: `npx prisma migrate deploy`
4. Update `DATABASE_URL` in Vercel environment variables

### 5. Build Errors Check ✅

**To Test:**
```bash
npm run build
```

**Common Issues to Check:**
- TypeScript errors
- Missing dependencies
- Import errors
- Dynamic route conflicts (we fixed some, but check `app/api/products/[id]` vs `[slug]`)

### 6. Missing Types ⚠️

**Check for:**
- `@types/node` ✅ (installed)
- `@types/react` ✅ (installed)
- Any custom type definitions

**Action:** Run `npm run build` to identify any missing types.

### 7. Dynamic Metadata Issues ✅

**Current Status:**
- ✅ Static metadata configured in `app/layout.tsx`
- ✅ Uses `NEXT_PUBLIC_SITE_URL` for base URL
- ⚠️ Need to ensure all dynamic routes have proper metadata

**Check:**
- Product pages (`/boutique/[slug]`)
- Project pages (`/projets/[slug]`)
- Admin pages (should have noindex)

### 8. Server-Client Mismatch ✅

**Current Status:**
- ✅ Proper use of `'use client'` in client components
- ✅ Server components properly defined
- ✅ No obvious mismatches found

**Best Practices:**
- Server components by default
- `'use client'` only when needed (hooks, interactivity)
- API routes are server-only

### 9. Prisma Production Setup ⚠️

**Current Issues:**
- Using SQLite (won't work on Vercel)
- Need PostgreSQL migration
- Need to add `postinstall` script for Prisma generate

**Fix in `package.json`:**
```json
{
  "scripts": {
    "postinstall": "prisma generate"
  }
}
```

### 10. Vercel-Specific Requirements

**Missing:**
- `vercel.json` (will create in STEP 15.3)
- Build command configuration
- Environment variable setup
- Edge function configuration (if needed)

---

## 🔧 Immediate Fixes Needed

### Fix 1: Update next.config.js for Production

```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    // Add your production image domains here
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
      },
      // Add your CDN/cloud storage domains
      // {
      //   protocol: 'https',
      //   hostname: 'your-cdn-domain.com',
      // },
    ],
    deviceSizes: [640, 750, 828, 1080, 1200, 1600, 1920, 2048, 2560, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384, 533, 640, 768, 960, 1152, 1344],
    minimumCacheTTL: 31536000,
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    unoptimized: false,
  },
  compress: true,
  poweredByHeader: false,
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    optimizeCss: true,
  },
  // Production optimizations
  output: 'standalone', // For better Vercel deployment
  // Enable ISR
  revalidate: 60, // Revalidate every 60 seconds (adjust as needed)
}

module.exports = nextConfig
```

### Fix 2: Update package.json

Add postinstall script:
```json
{
  "scripts": {
    "postinstall": "prisma generate",
    "build": "prisma generate && next build"
  }
}
```

### Fix 3: Create .env.production.example

Create a template for production environment variables.

---

## ✅ Checklist Before Deployment

- [ ] Migrate database from SQLite to PostgreSQL
- [ ] Update `DATABASE_URL` in environment variables
- [ ] Update `next.config.js` with production image domains
- [ ] Add `postinstall` script to `package.json`
- [ ] Test build: `npm run build`
- [ ] Fix any TypeScript errors
- [ ] Resolve dynamic route conflicts (`app/api/products/[id]` vs `[slug]`)
- [ ] Set all environment variables in Vercel dashboard
- [ ] Test production build locally: `npm run build && npm start`
- [ ] Verify all API routes work
- [ ] Check admin authentication works
- [ ] Test Stripe webhooks
- [ ] Verify image optimization works

---

## 🚨 Critical Actions Required

1. **Database Migration** - MUST migrate to PostgreSQL before deployment
2. **Environment Variables** - Set all required vars in Vercel
3. **Build Test** - Run `npm run build` and fix any errors
4. **Route Conflicts** - Fix `app/api/products/[id]` vs `[slug]` conflict

---

**Next Step:** Proceed to STEP 15.3 - Deploy to Vercel




