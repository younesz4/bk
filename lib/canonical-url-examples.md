# Canonical URL Helper - Usage Examples

## Basic Usage

### Static Pages
```typescript
import { generateStaticCanonical } from '@/lib/canonical-url'

// In metadata
export const metadata: Metadata = {
  alternates: {
    canonical: generateStaticCanonical('/boutique'),
  },
}
```

### Dynamic Routes with Params
```typescript
import { generateCanonicalFromParams } from '@/lib/canonical-url'

// In generateMetadata for /boutique/[collection]/[handle]
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { collection, handle } = await params
  
  return {
    alternates: {
      canonical: generateCanonicalFromParams(
        '/boutique/[collection]/[handle]',
        { collection, handle }
      ),
    },
  }
}
```

### Direct Pathname (Already Resolved)
```typescript
import { generateCanonicalUrl } from '@/lib/canonical-url'

// When you already have the full pathname
const canonical = generateCanonicalUrl({
  pathname: '/boutique/chaises/chaise-01'
})
```

## Real-World Examples

### Product Page
```typescript
// app/boutique/[collection]/[handle]/page.tsx
import { generateCanonicalFromParams } from '@/lib/canonical-url'

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { collection, handle } = await params
  const product = await getProduct(collection, handle)
  
  return {
    alternates: {
      canonical: generateCanonicalFromParams(
        '/boutique/[collection]/[handle]',
        { collection, handle }
      ),
    },
  }
}
```

### Category Page
```typescript
// app/boutique/[collection]/page.tsx
import { generateCanonicalFromParams } from '@/lib/canonical-url'

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { collection } = await params
  
  return {
    alternates: {
      canonical: generateCanonicalFromParams(
        '/boutique/[collection]',
        { collection }
      ),
    },
  }
}
```

### Project Page
```typescript
// app/projects/[slug]/layout.tsx
import { generateCanonicalFromParams } from '@/lib/canonical-url'

export async function generateMetadata({ params }: ProjectLayoutProps): Promise<Metadata> {
  const { slug } = await params
  
  return {
    alternates: {
      canonical: generateCanonicalFromParams(
        '/projets/[slug]',
        { slug }
      ),
    },
  }
}
```

### With Custom Base URL
```typescript
import { generateCanonicalUrl } from '@/lib/canonical-url'

const canonical = generateCanonicalUrl({
  pathname: '/boutique/[collection]/[handle]',
  params: { collection: 'chaises', handle: 'chaise-01' },
  baseUrl: 'https://custom-domain.com',
})
```

