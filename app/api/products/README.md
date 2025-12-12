# Products API Endpoints

All endpoints use Zod schemas for validation and return typed responses.

## Base URL
```
/api/products
```

## Endpoints

### GET /api/products
Get all products with optional filtering and pagination.

**Query Parameters:**
- `published` (boolean, optional): Filter by published state
- `category` (string, optional): Filter by category slug
- `page` (number, default: 1): Page number for pagination
- `limit` (number, default: 20): Items per page

**Example:**
```bash
GET /api/products?published=true&category=chaises&page=1&limit=20
```

**Response:**
```json
{
  "ok": true,
  "products": [
    {
      "id": "clx...",
      "name": "Luxury Chair",
      "slug": "luxury-chair",
      "description": "...",
      "price": 1250,
      "width": 55,
      "depth": 55,
      "height": 85,
      "metaTitle": "...",
      "metaDescription": "...",
      "published": true,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z",
      "categories": [...],
      "images": [...],
      "materials": [...],
      "variants": [...]
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5
  }
}
```

---

### GET /api/products/:slug
Get a single product by slug.

**Path Parameters:**
- `slug` (string): Product slug

**Example:**
```bash
GET /api/products/luxury-chair
```

**Response:**
```json
{
  "ok": true,
  "product": {
    "id": "clx...",
    "name": "Luxury Chair",
    "slug": "luxury-chair",
    ...
  }
}
```

**Error Responses:**
- `404`: Product not found
- `500`: Server error

---

### POST /api/products
Create a new product.

**Request Body:**
```json
{
  "name": "Luxury Chair",
  "slug": "luxury-chair",
  "description": "A beautiful luxury chair",
  "price": 1250,
  "width": 55,
  "depth": 55,
  "height": 85,
  "metaTitle": "Luxury Chair - BK Agencements",
  "metaDescription": "Premium luxury chair...",
  "published": true,
  "categories": [
    {
      "categoryId": "clx...",
      "order": 0
    }
  ],
  "images": [
    {
      "url": "https://...",
      "alt": "Luxury Chair",
      "order": 0
    }
  ],
  "materials": [
    {
      "name": "Noyer massif",
      "order": 0
    }
  ],
  "variants": [
    {
      "size": "Standard",
      "fabric": "Velvet",
      "color": "Navy",
      "finish": "Matte",
      "price": 1250,
      "stock": 5,
      "sku": "LC-VEL-NAV-MAT",
      "isDefault": true
    }
  ]
}
```

**Response:**
```json
{
  "ok": true,
  "product": { ... },
  "message": "Produit créé avec succès"
}
```

**Error Responses:**
- `400`: Invalid data (validation errors)
- `409`: Product with this slug already exists
- `500`: Server error

---

### PATCH /api/products/:id
Update a product by ID.

**Path Parameters:**
- `id` (string): Product ID (CUID)

**Request Body:**
All fields are optional (partial update):
```json
{
  "name": "Updated Name",
  "price": 1500,
  "published": false,
  "categories": [...],
  "images": [...],
  "materials": [...]
}
```

**Note:** Variants should be updated via the variants endpoint to avoid accidental data loss.

**Response:**
```json
{
  "ok": true,
  "product": { ... },
  "message": "Produit mis à jour avec succès"
}
```

**Error Responses:**
- `400`: Invalid data
- `404`: Product not found
- `409`: Unique constraint violation (e.g., slug already exists)
- `500`: Server error

---

### DELETE /api/products/:id
Delete a product by ID.

**Path Parameters:**
- `id` (string): Product ID (CUID)

**Response:**
```json
{
  "ok": true,
  "message": "Produit supprimé avec succès"
}
```

**Error Responses:**
- `404`: Product not found
- `500`: Server error

**Note:** Related records (categories, images, materials, variants) are automatically deleted via cascade.

---

### GET /api/products/:id/variants
Get all variants for a product.

**Path Parameters:**
- `id` (string): Product ID (CUID)

**Response:**
```json
{
  "ok": true,
  "variants": [
    {
      "id": "clx...",
      "productId": "clx...",
      "size": "Standard",
      "fabric": "Velvet",
      "color": "Navy",
      "finish": "Matte",
      "price": 1250,
      "stock": 5,
      "sku": "LC-VEL-NAV-MAT",
      "isDefault": true,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "count": 1
}
```

**Error Responses:**
- `404`: Product not found
- `500`: Server error

---

## Type Safety

All responses are typed using Zod schemas:

```typescript
import type {
  ProductWithRelationsResponse,
  ProductVariantResponse,
} from '@/lib/schemas'

// Example usage
const response = await fetch('/api/products/luxury-chair')
const data = await response.json()
const product: ProductWithRelationsResponse = data.product
```

## Error Format

All error responses follow this format:

```json
{
  "ok": false,
  "message": "Error message",
  "errors": [...], // Only present for validation errors
  "error": "Technical error details" // Only in development
}
```

## Status Codes

- `200`: Success
- `201`: Created
- `400`: Bad Request (validation errors)
- `404`: Not Found
- `409`: Conflict (unique constraint violation)
- `422`: Unprocessable Entity
- `500`: Internal Server Error


