# Admin Dashboard Architecture - BK Agencements

## Overview

Complete admin dashboard system for managing orders, quotes, products, categories, contacts, and payments.

## Database Schema

### Admin Model (Existing)
```prisma
model Admin {
  id        String   @id @default(cuid())
  email     String   @unique
  password  String   // bcrypt hashed
  role      String   @default("admin") // admin, manager, production, finance, viewer
  name      String?
  isActive  Boolean  @default(true)
  lastLogin DateTime?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  // Relations
  activityLogs ActivityLog[]
  notifications Notification[]
}
```

### ActivityLog Model
```prisma
model ActivityLog {
  id        String   @id @default(cuid())
  adminId   String
  admin     Admin    @relation(fields: [adminId], references: [id])
  action    String   // login, order_update, product_create, etc.
  entity    String?  // order, product, quote, etc.
  entityId  String?  // ID of the entity
  details   String?  // JSON string with action details
  ipAddress String?
  userAgent String?
  createdAt DateTime @default(now())
  
  @@index([adminId])
  @@index([entity, entityId])
  @@index([createdAt])
}
```

### Notification Model
```prisma
model Notification {
  id        String   @id @default(cuid())
  adminId   String?
  admin     Admin?   @relation(fields: [adminId], references: [id])
  type      String   // new_order, new_quote, payment_received, etc.
  title     String
  message   String
  link      String?  // URL to related resource
  isRead    Boolean  @default(false)
  createdAt DateTime @default(now())
  
  @@index([adminId])
  @@index([isRead])
  @@index([createdAt])
}
```

### ContactMessage Model
```prisma
model ContactMessage {
  id          String   @id @default(cuid())
  firstName   String
  lastName    String
  email       String
  phone       String?
  budget      String?
  projectType String?
  message     String
  status      String   @default("new") // new, read, assigned, resolved, archived
  assignedTo  String?  // Admin ID
  notes       String?  // Internal notes
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  @@index([status])
  @@index([assignedTo])
  @@index([createdAt])
}
```

## Pages Structure

```
/app/admin/
  ├── layout.tsx              # Admin layout with sidebar
  ├── page.tsx                 # Dashboard home (stats)
  ├── login/
  │   └── page.tsx            # Login page
  ├── orders/
  │   ├── page.tsx            # Orders list
  │   └── [id]/
  │       └── page.tsx        # Order details
  ├── quotes/
  │   ├── page.tsx            # Quotes list
  │   └── [id]/
  │       └── page.tsx        # Quote details
  ├── products/
  │   ├── page.tsx            # Products list
  │   ├── new/
  │   │   └── page.tsx        # Create product
  │   └── [id]/
  │       └── page.tsx        # Edit product
  ├── categories/
  │   ├── page.tsx            # Categories list
  │   ├── new/
  │   │   └── page.tsx        # Create category
  │   └── [id]/
  │       ├── page.tsx        # Category details
  │       └── edit/
  │           └── page.tsx    # Edit category
  ├── contacts/
  │   ├── page.tsx            # Contact messages list
  │   └── [id]/
  │       └── page.tsx        # Contact message details
  ├── payments/
  │   ├── page.tsx            # Payment tracking
  │   └── [id]/
  │       └── page.tsx        # Payment details
  ├── notifications/
  │   └── page.tsx            # Notifications center
  ├── activity/
  │   └── page.tsx            # Activity log
  └── settings/
      └── page.tsx            # Admin settings
```

## Components Structure

```
/components/admin/
  ├── layout/
  │   ├── AdminSidebar.tsx    # Left sidebar navigation
  │   ├── AdminTopbar.tsx     # Top bar with user info
  │   └── AdminLayout.tsx     # Main layout wrapper
  ├── dashboard/
  │   ├── StatsCard.tsx       # Statistic card
  │   ├── QuickStats.tsx      # Dashboard stats
  │   └── RecentActivity.tsx  # Recent activity widget
  ├── orders/
  │   ├── OrderList.tsx       # Orders table
  │   ├── OrderFilters.tsx    # Filter bar
  │   ├── OrderDetails.tsx    # Order detail view
  │   └── StatusUpdate.tsx    # Status update component
  ├── quotes/
  │   ├── QuoteList.tsx       # Quotes table
  │   ├── QuoteDetails.tsx    # Quote detail view
  │   └── ConvertQuote.tsx    # Convert to order form
  ├── products/
  │   ├── ProductList.tsx     # Products table
  │   ├── ProductForm.tsx     # Create/edit form
  │   └── ImageUploader.tsx   # Image upload component
  ├── categories/
  │   ├── CategoryList.tsx    # Categories table
  │   └── CategoryForm.tsx    # Create/edit form
  ├── contacts/
  │   ├── ContactList.tsx    # Contact messages table
  │   └── ContactDetails.tsx  # Message detail view
  ├── payments/
  │   ├── PaymentList.tsx    # Payment tracking table
  │   └── PaymentVerification.tsx # Bank transfer verification
  ├── notifications/
  │   └── NotificationCenter.tsx # Notifications UI
  └── shared/
      ├── DataTable.tsx       # Reusable table component
      ├── FilterBar.tsx       # Reusable filter bar
      ├── StatusBadge.tsx     # Status badge component
      └── ConfirmDialog.tsx   # Confirmation dialog
```

## API Endpoints

### Authentication
- `POST /api/admin/login` - Admin login
- `POST /api/admin/logout` - Admin logout
- `GET /api/admin/me` - Get current admin info

### Orders
- `GET /api/admin/orders/list` - List orders
- `GET /api/admin/orders/[id]` - Get order details
- `PATCH /api/admin/orders/[id]` - Update order
- `PATCH /api/admin/orders/[id]/status` - Update order status

### Quotes
- `GET /api/admin/quotes/list` - List quotes
- `GET /api/admin/quotes/[id]` - Get quote details
- `PATCH /api/admin/quotes/[id]` - Update quote
- `POST /api/admin/quotes/[id]/convert` - Convert quote to order

### Products
- `GET /api/admin/products` - List products
- `POST /api/admin/products` - Create product
- `GET /api/admin/products/[id]` - Get product
- `PATCH /api/admin/products/[id]` - Update product
- `DELETE /api/admin/products/[id]` - Delete product

### Categories
- `GET /api/admin/categories` - List categories
- `POST /api/admin/categories` - Create category
- `GET /api/admin/categories/[id]` - Get category
- `PATCH /api/admin/categories/[id]` - Update category
- `DELETE /api/admin/categories/[id]` - Delete category

### Contacts
- `GET /api/admin/contacts` - List contact messages
- `GET /api/admin/contacts/[id]` - Get message
- `PATCH /api/admin/contacts/[id]` - Update message status
- `DELETE /api/admin/contacts/[id]` - Delete message

### Payments
- `GET /api/admin/payments` - List payments
- `POST /api/admin/payments/[id]/verify` - Verify bank transfer
- `POST /api/admin/payments/[id]/refund` - Process refund

### Notifications
- `GET /api/admin/notifications` - Get notifications
- `PATCH /api/admin/notifications/[id]/read` - Mark as read
- `DELETE /api/admin/notifications/[id]` - Delete notification

### Activity
- `GET /api/admin/activity` - Get activity logs

## Security

### Authentication
- Session-based authentication (HMAC-signed cookies)
- Password hashing with bcrypt
- Session expiration (7 days)
- IP allowlist (optional)

### Authorization
- Role-based access control
- Permission checks on all endpoints
- Activity logging for all actions

### Protection
- Rate limiting
- Input validation
- SQL injection prevention
- XSS protection
- CSRF protection

## Roles & Permissions

### Admin (Full Access)
- All operations
- User management
- System settings

### Manager
- Orders management
- Quotes management
- Products management
- Categories management
- Contact management
- Payment tracking

### Production
- Orders view
- Order status updates
- Product view

### Finance
- Orders view
- Payment tracking
- Payment verification
- Refunds

### Viewer (Read Only)
- View all data
- No modifications

## Features

### Dashboard Home
- Quick stats (orders, quotes, revenue)
- Recent orders
- Pending quotes
- Unread notifications
- Recent activity

### Orders Management
- List with filters
- Order details
- Status updates
- Payment tracking
- COD confirmation
- Bank transfer verification
- Invoice generation

### Quotes Management
- List with filters
- Quote details
- Status updates
- Amount setting
- Convert to order
- Email to client

### Product Management
- CRUD operations
- Image upload
- Image reordering
- Stock management
- Category assignment

### Category Management
- CRUD operations
- Image upload
- SEO fields
- Slug validation

### Contact Management
- Message list
- Read messages
- Assign to team
- Archive
- Mark as resolved

### Payment Tracking
- Payment list
- Payment details
- Bank transfer verification
- Refund processing
- Payment history

### Notifications
- Real-time notifications
- Mark as read
- Delete notifications
- Filter by type

### Activity Logging
- All admin actions logged
- Searchable logs
- Filter by admin, action, entity
- Export logs

## UI/UX

### Design
- Luxury minimal aesthetic
- Dark sidebar, light content
- Bodoni Moda for headings
- Raleway for body text
- Responsive design

### Features
- Dark/light theme toggle
- Quick search
- Keyboard shortcuts
- Bulk operations
- Export functionality




