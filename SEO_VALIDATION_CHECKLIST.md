# SEO Validation Checklist - Google Lighthouse & Manual Testing

## 🔍 Testing Tools
- **Google Lighthouse**: Chrome DevTools > Lighthouse
- **Google Rich Results Test**: https://search.google.com/test/rich-results
- **Facebook Sharing Debugger**: https://developers.facebook.com/tools/debug/
- **Twitter Card Validator**: https://cards-dev.twitter.com/validator
- **LinkedIn Post Inspector**: https://www.linkedin.com/post-inspector/
- **W3C Validator**: https://validator.w3.org/
- **Schema.org Validator**: https://validator.schema.org/

---

## 1. 📋 META TAGS VALIDATION

### ✅ Required Meta Tags

#### High Priority
- [ ] **Title Tag**
  - ✅ Present on all pages
  - ✅ Unique for each page (max 60 characters)
  - ✅ Includes brand name
  - ✅ Template format: `%s | BK Agencements`
  - **Fix**: Verify all pages have unique titles
  - **Test**: View page source, check `<title>` tag

- [ ] **Meta Description**
  - ✅ Present on all pages
  - ✅ Unique for each page (150-160 characters)
  - ✅ Includes keywords naturally
  - ✅ Compelling and descriptive
  - **Fix**: Ensure all pages have unique descriptions
  - **Test**: View page source, check `<meta name="description">`

- [ ] **Meta Keywords** (Optional but present)
  - ✅ Present on main pages
  - ✅ Relevant keywords included
  - **Fix**: Add to pages missing keywords
  - **Test**: View page source

- [ ] **Viewport Meta Tag**
  - ✅ Present: `width=device-width, initialScale=1`
  - ✅ Mobile-friendly
  - **Status**: ✅ Already configured

- [ ] **Charset Declaration**
  - ✅ Present: `<meta charset="utf-8">`
  - **Status**: ✅ Next.js handles automatically

- [ ] **Language Declaration**
  - ✅ Present: `<html lang="fr">`
  - **Status**: ✅ Already configured

#### Medium Priority
- [ ] **Author Meta Tag**
  - ✅ Present: `BK Agencements`
  - **Status**: ✅ Already configured

- [ ] **Robots Meta Tag**
  - ✅ Present on all pages
  - ✅ `index, follow` for public pages
  - ✅ `noindex, nofollow` for admin/private pages
  - **Fix**: Verify admin pages have `noindex`
  - **Test**: Check `<meta name="robots">` on admin routes

- [ ] **Canonical URL**
  - ✅ Present on all pages
  - ✅ Absolute URLs (not relative)
  - ✅ Unique per page
  - ✅ No query parameters (unless necessary)
  - **Fix**: Use `generateCanonicalUrl()` helper everywhere
  - **Test**: View page source, check `<link rel="canonical">`

---

## 2. 🌐 OPENGRAPH (OG) TAGS VALIDATION

### ✅ Required OG Tags

#### High Priority
- [ ] **og:type**
  - ✅ Present: `website` for pages, `product` for products, `article` for projects
  - ✅ Correct type per page
  - **Fix**: Verify product pages use `og:type="product"`
  - **Test**: Facebook Sharing Debugger

- [ ] **og:title**
  - ✅ Present on all pages
  - ✅ Unique per page
  - ✅ Max 60 characters
  - **Status**: ✅ Already configured

- [ ] **og:description**
  - ✅ Present on all pages
  - ✅ Unique per page
  - ✅ Max 200 characters
  - **Status**: ✅ Already configured

- [ ] **og:image**
  - ✅ Present on all pages
  - ✅ Absolute URL (starts with https://)
  - ✅ Minimum size: 1200x630px
  - ✅ Recommended: 1200x630px
  - ✅ Format: JPG or PNG
  - ✅ File size: < 8MB
  - ✅ Unique per page (when possible)
  - **Fix**: Ensure all images are absolute URLs
  - **Test**: Facebook Sharing Debugger, check image preview

- [ ] **og:url**
  - ✅ Present on all pages
  - ✅ Absolute URL
  - ✅ Matches canonical URL
  - **Status**: ✅ Already configured

- [ ] **og:site_name**
  - ✅ Present: `BK Agencements`
  - **Status**: ✅ Already configured

- [ ] **og:locale**
  - ✅ Present: `fr_FR`
  - **Status**: ✅ Already configured

#### Medium Priority
- [ ] **og:image:width**
  - ✅ Present: `1200`
  - **Status**: ✅ Already configured

- [ ] **og:image:height**
  - ✅ Present: `630`
  - **Status**: ✅ Already configured

- [ ] **og:image:alt**
  - ✅ Present with descriptive text
  - **Status**: ✅ Already configured

- [ ] **Product-specific OG tags** (for product pages)
  - [ ] `product:price:amount` - ✅ Present
  - [ ] `product:price:currency` - ✅ Present (EUR)
  - [ ] `product:availability` - ✅ Present
  - [ ] `product:condition` - ✅ Present (New)
  - **Test**: Facebook Sharing Debugger for product pages

---

## 3. 🐦 TWITTER CARD VALIDATION

### ✅ Required Twitter Tags

#### High Priority
- [ ] **twitter:card**
  - ✅ Present: `summary_large_image`
  - ✅ Consistent across all pages
  - **Status**: ✅ Already configured

- [ ] **twitter:title**
  - ✅ Present on all pages
  - ✅ Unique per page
  - ✅ Max 70 characters
  - **Status**: ✅ Already configured

- [ ] **twitter:description**
  - ✅ Present on all pages
  - ✅ Unique per page
  - ✅ Max 200 characters
  - **Status**: ✅ Already configured

- [ ] **twitter:image**
  - ✅ Present on all pages
  - ✅ Absolute URL
  - ✅ Minimum: 1200x675px (recommended: 1200x630px)
  - ✅ Format: JPG, PNG, or WebP
  - ✅ File size: < 5MB
  - **Fix**: Ensure all images are absolute URLs
  - **Test**: Twitter Card Validator

#### Medium Priority
- [ ] **twitter:site**
  - ⚠️ Placeholder: `@bkagencements`
  - **Fix**: Update with actual Twitter handle or remove if not available
  - **Test**: Twitter Card Validator

- [ ] **twitter:creator**
  - ⚠️ Placeholder: `@bkagencements`
  - **Fix**: Update with actual Twitter handle or remove if not available
  - **Test**: Twitter Card Validator

---

## 4. 📊 SCHEMA.ORG / JSON-LD VALIDATION

### ✅ Required Schemas

#### High Priority
- [ ] **Organization Schema**
  - ✅ Present in root layout
  - ✅ Valid JSON-LD format
  - ✅ Includes: name, url, logo, address, contactPoint
  - **Test**: Google Rich Results Test, Schema.org Validator
  - **Fix**: Verify all required fields present

- [ ] **WebSite Schema**
  - ✅ Present in root layout
  - ✅ Valid JSON-LD format
  - ✅ Includes: name, url, publisher
  - **Test**: Google Rich Results Test

- [ ] **Product Schema** (for product pages)
  - ✅ Present on all product pages
  - ✅ Valid JSON-LD format
  - ✅ Includes: name, description, image, brand, offers, availability
  - ✅ Price in correct format (number, not string)
  - ✅ Currency code: EUR
  - **Test**: Google Rich Results Test for product pages
  - **Fix**: Use `generateProductSchema()` helper

- [ ] **BreadcrumbList Schema** (for product/category pages)
  - ✅ Present on product pages
  - ✅ Present on category pages
  - ✅ Valid JSON-LD format
  - ✅ Correct position numbers (1, 2, 3...)
  - ✅ Absolute URLs
  - **Test**: Google Rich Results Test
  - **Fix**: Use `generateBreadcrumbSchema()` helper

#### Medium Priority
- [ ] **LocalBusiness Schema**
  - ✅ Present in root layout
  - ✅ Valid JSON-LD format
  - ✅ Includes: address, geo coordinates, opening hours
  - **Test**: Google Rich Results Test

- [ ] **Article Schema** (for project pages)
  - [ ] Present on project pages
  - [ ] Valid JSON-LD format
  - [ ] Includes: headline, image, datePublished, author
  - **Fix**: Add Article schema to project pages
  - **Test**: Google Rich Results Test

- [ ] **FAQ Schema** (if applicable)
  - [ ] Add if FAQ section exists
  - **Test**: Google Rich Results Test

### Schema Validation Checklist
- [ ] All schemas use `@context: "https://schema.org"`
- [ ] All schemas use correct `@type`
- [ ] All URLs are absolute (https://)
- [ ] All required properties present
- [ ] No syntax errors in JSON-LD
- [ ] No duplicate schemas on same page
- [ ] Schemas match page content

---

## 5. 🗺️ SITEMAP VALIDATION

### ✅ Sitemap Requirements

#### High Priority
- [ ] **Sitemap exists**
  - ✅ Present: `/sitemap.xml`
  - ✅ Accessible: `https://bk-agencements.com/sitemap.xml`
  - **Test**: Visit URL directly

- [ ] **Sitemap format**
  - ✅ Valid XML format
  - ✅ UTF-8 encoding
  - ✅ Proper XML structure
  - **Test**: W3C XML Validator

- [ ] **Sitemap content**
  - ✅ All static pages included
  - ✅ All product pages included
  - ✅ All category pages included
  - ✅ All project pages included
  - ✅ No duplicate URLs
  - ✅ No broken URLs (404s)
  - **Test**: Check sitemap content manually

- [ ] **URL format**
  - ✅ All URLs absolute (https://)
  - ✅ No trailing slashes (except root)
  - ✅ No query parameters
  - ✅ No fragments (#)
  - **Fix**: Verify all URLs in sitemap

- [ ] **Priority values**
  - ✅ Homepage: 1.0
  - ✅ Main pages: 0.8-0.9
  - ✅ Secondary pages: 0.6-0.7
  - ✅ Valid range: 0.0 to 1.0
  - **Status**: ✅ Already configured

- [ ] **Change frequency**
  - ✅ Appropriate values (always, hourly, daily, weekly, monthly, yearly, never)
  - ✅ Realistic based on content update frequency
  - **Status**: ✅ Already configured

- [ ] **Last modified dates**
  - ✅ Present for all URLs
  - ✅ Valid date format (ISO 8601)
  - ✅ Recent dates (not too old)
  - **Status**: ✅ Already configured

#### Medium Priority
- [ ] **Sitemap size**
  - ✅ Under 50MB
  - ✅ Under 50,000 URLs
  - ✅ Split into multiple sitemaps if needed
  - **Test**: Check file size and URL count

- [ ] **Sitemap index** (if multiple sitemaps)
  - [ ] Create if > 50,000 URLs
  - [ ] Link from robots.txt

- [ ] **Image sitemap** (optional)
  - [ ] Consider adding for better image SEO
  - [ ] Include all product/project images

---

## 6. 🤖 ROBOTS.TXT VALIDATION

### ✅ Robots.txt Requirements

#### High Priority
- [ ] **Robots.txt exists**
  - ✅ Present: `/robots.txt`
  - ✅ Accessible: `https://bk-agencements.com/robots.txt`
  - **Test**: Visit URL directly

- [ ] **Format**
  - ✅ Valid format
  - ✅ UTF-8 encoding
  - ✅ Proper line breaks
  - **Test**: Check format manually

- [ ] **User-agent rules**
  - ✅ `User-agent: *` present
  - ✅ `Allow: /` for public content
  - ✅ `Disallow:` for admin, API, private routes
  - **Status**: ✅ Already configured

- [ ] **Sitemap declaration**
  - ✅ `Sitemap:` present
  - ✅ Absolute URL to sitemap
  - ✅ Correct sitemap URL
  - **Status**: ✅ Already configured

- [ ] **Disallowed paths**
  - ✅ `/admin/` disallowed
  - ✅ `/api/` disallowed
  - ✅ `/checkout/` disallowed
  - ✅ `/cart/` disallowed
  - ✅ Private routes disallowed
  - **Status**: ✅ Already configured

#### Medium Priority
- [ ] **Crawl-delay** (if needed)
  - [ ] Add if server needs rate limiting
  - [ ] Usually not needed

- [ ] **Specific user-agent rules** (if needed)
  - [ ] Add rules for specific bots if needed
  - [ ] Usually not needed

---

## 7. ⚡ PERFORMANCE VALIDATION

### ✅ Lighthouse Performance Targets

#### High Priority
- [ ] **Performance Score**
  - Target: ≥ 90
  - Current: Test with Lighthouse
  - **Fix**: See PERFORMANCE_SEO_AUDIT.md

- [ ] **First Contentful Paint (FCP)**
  - Target: < 1.8s
  - **Fix**: Optimize images, reduce render-blocking resources

- [ ] **Largest Contentful Paint (LCP)**
  - Target: < 2.5s
  - **Fix**: Optimize hero images, preload critical resources

- [ ] **Time to Interactive (TTI)**
  - Target: < 3.8s
  - **Fix**: Reduce JavaScript execution time, code splitting

- [ ] **Total Blocking Time (TBT)**
  - Target: < 200ms
  - **Fix**: Reduce main thread work, optimize JavaScript

- [ ] **Cumulative Layout Shift (CLS)**
  - Target: < 0.1
  - **Fix**: Add image dimensions, use placeholders

- [ ] **Speed Index**
  - Target: < 3.4s
  - **Fix**: Optimize above-the-fold content

#### Medium Priority
- [ ] **Image optimization**
  - ✅ Next.js Image component used
  - ✅ WebP/AVIF formats
  - ⚠️ Add `sizes` attribute to all images
  - ⚠️ Add `placeholder="blur"` to hero images
  - **Fix**: See PERFORMANCE_SEO_AUDIT.md

- [ ] **Font optimization**
  - ✅ Font preloading configured
  - ✅ `font-display: swap`
  - **Status**: ✅ Already configured

- [ ] **Code splitting**
  - ✅ Dynamic imports used
  - ⚠️ Expand to more components
  - **Fix**: See PERFORMANCE_SEO_AUDIT.md

- [ ] **Caching**
  - ❌ Caching headers not configured
  - **Fix**: Add to middleware.ts

- [ ] **Bundle size**
  - Target: < 200KB (gzipped) initial bundle
  - **Test**: Run `npm run build` and analyze
  - **Fix**: Remove unused packages, code splitting

---

## 8. ♿ ACCESSIBILITY VALIDATION

### ✅ Lighthouse Accessibility Targets

#### High Priority
- [ ] **Accessibility Score**
  - Target: ≥ 90
  - Current: Test with Lighthouse
  - **Fix**: Address issues below

- [ ] **Alt text for images**
  - ✅ All images have `alt` attributes
  - ✅ Alt text is descriptive and meaningful
  - ✅ Decorative images have empty `alt=""`
  - **Test**: Lighthouse, WAVE tool
  - **Fix**: Add missing alt text

- [ ] **Color contrast**
  - ✅ Text meets WCAG AA standards (4.5:1 for normal text)
  - ✅ Text meets WCAG AA standards (3:1 for large text)
  - **Test**: Lighthouse, WebAIM Contrast Checker
  - **Fix**: Adjust colors if needed

- [ ] **Heading hierarchy**
  - ✅ Proper h1-h6 hierarchy
  - ✅ Only one h1 per page
  - ✅ No skipped heading levels
  - **Test**: Lighthouse, WAVE tool
  - **Fix**: Correct heading structure

- [ ] **Form labels**
  - ✅ All form inputs have labels
  - ✅ Labels are associated with inputs (`htmlFor` / `id`)
  - ✅ Required fields marked
  - **Test**: Lighthouse, keyboard navigation
  - **Fix**: Add missing labels

- [ ] **Keyboard navigation**
  - ✅ All interactive elements keyboard accessible
  - ✅ Focus indicators visible
  - ✅ Logical tab order
  - **Test**: Tab through page
  - **Fix**: Add focus styles, fix tab order

- [ ] **ARIA labels**
  - ✅ Interactive elements have ARIA labels when needed
  - ✅ Landmarks properly marked
  - ✅ Live regions for dynamic content
  - **Test**: Screen reader, Lighthouse
  - **Fix**: Add ARIA attributes

#### Medium Priority
- [ ] **Language declaration**
  - ✅ `<html lang="fr">` present
  - ✅ Language changes marked with `lang` attribute
  - **Status**: ✅ Already configured

- [ ] **Skip links**
  - ✅ Skip to main content link present
  - ✅ Visible on focus
  - **Status**: ✅ Already configured in layout

- [ ] **Semantic HTML**
  - ✅ Proper use of semantic elements (`<nav>`, `<main>`, `<article>`, etc.)
  - ✅ No div soup
  - **Test**: Manual review
  - **Fix**: Use semantic HTML

- [ ] **Focus management**
  - ✅ Focus trapped in modals
  - ✅ Focus restored after modal closes
  - **Test**: Keyboard navigation
  - **Fix**: Implement focus management

---

## 9. 🔍 ADDITIONAL SEO CHECKS

### High Priority
- [ ] **HTTPS**
  - ✅ Site uses HTTPS
  - ✅ No mixed content warnings
  - **Test**: Check browser security indicator

- [ ] **Mobile-friendly**
  - ✅ Responsive design
  - ✅ Viewport meta tag
  - ✅ Touch targets ≥ 44x44px
  - **Test**: Google Mobile-Friendly Test

- [ ] **Page speed**
  - ✅ Fast loading times
  - ✅ Optimized assets
  - **Test**: Google PageSpeed Insights

- [ ] **404 page**
  - ✅ Custom 404 page exists
  - ✅ Helpful navigation
  - ✅ `noindex` meta tag
  - **Status**: ✅ Already configured

- [ ] **XML sitemap submitted**
  - [ ] Submit to Google Search Console
  - [ ] Submit to Bing Webmaster Tools
  - **Action**: Manual submission required

- [ ] **Google Search Console**
  - [ ] Property verified
  - [ ] Sitemap submitted
  - [ ] Monitor for errors
  - **Action**: Manual setup required

### Medium Priority
- [ ] **Structured data testing**
  - ✅ All schemas validate
  - ✅ No errors in Google Rich Results Test
  - **Test**: Google Rich Results Test for each page type

- [ ] **Social sharing preview**
  - ✅ Facebook preview works
  - ✅ Twitter preview works
  - ✅ LinkedIn preview works
  - **Test**: Use sharing debuggers

- [ ] **Internal linking**
  - ✅ Logical internal link structure
  - ✅ Descriptive anchor text
  - ✅ No broken internal links
  - **Test**: Manual review, broken link checker

- [ ] **External links**
  - ✅ External links use `rel="noopener noreferrer"`
  - ✅ No broken external links
  - **Test**: Broken link checker

---

## 10. 🚨 CRITICAL FIXES (Do First)

### Immediate Actions
1. [ ] **Test all pages with Lighthouse**
   - Run Lighthouse on: Home, About, Boutique, Product, Category, Project, Contact
   - Document scores and issues

2. [ ] **Validate all JSON-LD schemas**
   - Use Google Rich Results Test
   - Fix any validation errors

3. [ ] **Test OpenGraph on all pages**
   - Use Facebook Sharing Debugger
   - Verify images load correctly
   - Check all OG tags present

4. [ ] **Verify sitemap.xml**
   - Check all URLs are valid
   - Test sitemap accessibility
   - Verify no 404s in sitemap

5. [ ] **Test robots.txt**
   - Verify accessibility
   - Check disallow rules work
   - Verify sitemap link

6. [ ] **Fix accessibility issues**
   - Run Lighthouse accessibility audit
   - Fix critical issues first
   - Aim for 90+ score

7. [ ] **Update Twitter handles**
   - Replace `@bkagencements` placeholder
   - Or remove if no Twitter account

8. [ ] **Add caching headers**
   - Implement in middleware.ts
   - Test cache behavior

---

## 📊 Testing Workflow

### Step 1: Automated Testing
1. Run Lighthouse on all main pages
2. Run Google Rich Results Test on each page type
3. Test sitemap.xml accessibility
4. Test robots.txt accessibility
5. Run WAVE accessibility checker

### Step 2: Manual Testing
1. Test OpenGraph with Facebook Sharing Debugger
2. Test Twitter Cards with Twitter Card Validator
3. Verify all canonical URLs
4. Check all meta tags in page source
5. Test keyboard navigation
6. Test with screen reader

### Step 3: Fix Issues
1. Prioritize critical issues (score < 70)
2. Fix high-priority items
3. Document fixes
4. Re-test after fixes

### Step 4: Monitor
1. Set up Google Search Console
2. Monitor Core Web Vitals
3. Track search performance
4. Regular audits (monthly)

---

## ✅ Final Checklist Summary

### Must Have (Critical)
- [x] Title tags on all pages
- [x] Meta descriptions on all pages
- [x] Canonical URLs on all pages
- [x] OpenGraph tags on all pages
- [x] Twitter Card tags on all pages
- [x] Organization schema
- [x] Product schema on product pages
- [x] Breadcrumb schema on product/category pages
- [x] Sitemap.xml
- [x] Robots.txt
- [ ] All schemas validate (test required)
- [ ] Performance score ≥ 90 (test required)
- [ ] Accessibility score ≥ 90 (test required)

### Should Have (Important)
- [ ] Article schema on project pages
- [ ] Image sitemap (optional)
- [ ] Caching headers
- [ ] All images optimized
- [ ] Bundle size < 200KB

### Nice to Have (Optional)
- [ ] FAQ schema
- [ ] Video schema (if videos exist)
- [ ] Review schema (if reviews exist)
- [ ] Event schema (if events exist)

---

## 📝 Notes

- **Last Audit Date**: [Fill in after testing]
- **Lighthouse Scores**: [Document scores]
- **Issues Found**: [Document issues]
- **Fixes Applied**: [Document fixes]
- **Next Review Date**: [Set monthly review]

---

**Status Legend:**
- ✅ = Implemented
- ⚠️ = Needs improvement
- ❌ = Not implemented
- [ ] = Action item

