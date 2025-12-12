# Quote System Architecture - BK Agencements

## Database Schema

### Quote Model
```prisma
model Quote {
  id                  String       @id @default(cuid())
  createdAt           DateTime     @default(now())
  updatedAt           DateTime     @updatedAt
  
  // Customer Information
  customerName        String
  email               String
  phone               String
  address             String?
  city                String?
  country             String       @default("Morocco")
  
  // Project Details
  projectType         String       // residential, commercial, hotel, restaurant
  budget              String?      // budget range
  message             String?      // project description
  
  // Quote Details
  status              String       @default("pending") // pending, reviewed, waiting_client, approved, converted, completed, cancelled
  quoteAmount         Int?         // Quote amount in cents (null until admin sets it)
  quoteValidUntil     DateTime?    // Quote expiration date
  adminNotes          String?      // Internal notes
  
  // Custom Requirements
  dimensions          String?      // Custom dimensions
  materials           String?      // Preferred materials
  finishes            String?      // Preferred finishes
  customDetails       String?      // Additional custom requirements
  
  // Conversion
  convertedToOrderId  String?      // If converted to order
  convertedToOrder    Order?       @relation(fields: [convertedToOrderId], references: [id])
  convertedAt         DateTime?
  
  // Relations
  quoteItems          QuoteItem[]
  
  @@index([email])
  @@index([status])
  @@index([createdAt])
  @@index([convertedToOrderId])
}

model QuoteItem {
  id          String   @id @default(cuid())
  quoteId     String
  quote       Quote    @relation(fields: [quoteId], references: [id], onDelete: Cascade)
  
  // Product reference (optional - can be custom)
  productId   String?
  product     Product? @relation(fields: [productId], references: [id])
  
  // Custom item details
  itemName    String   // Product name or custom item name
  description String?  // Item description
  quantity    Int      @default(1)
  unitPrice   Int?     // Price per unit in cents (if known)
  totalPrice  Int?     // Total price in cents (if known)
  
  // Custom specifications
  dimensions  String?  // Item dimensions
  materials   String?  // Item materials
  finishes    String?  // Item finishes
  
  createdAt   DateTime @default(now())
  
  @@index([quoteId])
  @@index([productId])
}
```

## API Endpoints

### 1. POST /api/quotes
**Purpose:** Create a new quote request
**Request Body:**
```typescript
{
  customerName: string
  email: string
  phone: string
  address?: string
  city?: string
  projectType: string
  budget?: string
  message?: string
  dimensions?: string
  materials?: string
  finishes?: string
  customDetails?: string
  items?: Array<{
    productId?: string
    itemName: string
    description?: string
    quantity: number
    dimensions?: string
    materials?: string
    finishes?: string
  }>
}
```

**Response:**
```typescript
{
  success: true
  quoteId: string
  message: string
}
```

### 2. GET /api/quotes/[id]
**Purpose:** Get quote details (public - by email verification)
**Query Params:** `email` (required for verification)

### 3. PATCH /api/admin/quotes/[id]
**Purpose:** Admin update quote (status, amount, notes)
**Auth:** Admin token required
**Request Body:**
```typescript
{
  status?: string
  quoteAmount?: number
  quoteValidUntil?: string
  adminNotes?: string
}
```

### 4. POST /api/admin/quotes/[id]/convert
**Purpose:** Convert quote to order
**Auth:** Admin token required
**Request Body:**
```typescript
{
  paymentMethod: 'stripe' | 'cod' | 'bank_transfer'
  // Order will be created with quote items
}
```

## Admin Dashboard Flow

### Quote Management Page: `/admin/quotes`
**Features:**
- List all quotes with filters (status, date, customer)
- Search by customer name/email
- Quick status update
- View quote details
- Convert to order button
- Export quotes

### Quote Detail Page: `/admin/quotes/[id]`
**Features:**
- Full quote information
- Customer details
- Quote items list
- Status timeline
- Admin notes editor
- Quote amount editor
- Convert to order form
- Email history

## Customer Notifications

### Email Flow:
1. **Quote Request Received** (immediate)
   - Confirmation email to customer
   - Admin notification email

2. **Quote Reviewed** (when admin reviews)
   - Email to customer: "Your quote is being reviewed"

3. **Quote Approved** (when admin sets amount)
   - Email to customer: "Your quote is ready"
   - Includes quote amount and validity

4. **Quote Expiring** (7 days before expiration)
   - Reminder email to customer

5. **Quote Converted** (when converted to order)
   - Email to customer: "Your quote has been converted to order"

## Status Workflow

```
pending → reviewed → waiting_client → approved → converted → completed
   ↓         ↓            ↓              ↓           ↓
cancelled  cancelled   cancelled     cancelled   cancelled
```

**Status Descriptions:**
- **pending:** New quote request, not yet reviewed
- **reviewed:** Admin has reviewed, preparing quote
- **waiting_client:** Quote sent to client, waiting for response
- **approved:** Client approved quote, ready to convert
- **converted:** Quote converted to order
- **completed:** Order completed
- **cancelled:** Quote cancelled at any stage

## Integration Points

1. **Contact Form:** Can submit as quote request
2. **Product Pages:** "Request Quote" button
3. **Cart:** "Request Quote" option in checkout
4. **Admin Dashboard:** Quote management interface
5. **Email System:** Automated notifications

## Security Considerations

1. **Rate Limiting:** Max 5 quote requests per email per day
2. **Input Validation:** Zod schemas for all inputs
3. **Email Verification:** Required to view quote details
4. **Admin Authentication:** Bearer token for admin endpoints
5. **Bot Protection:** Honeypot fields, CAPTCHA (optional)




