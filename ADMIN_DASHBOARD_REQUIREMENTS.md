# Admin Dashboard Requirements - Quotes & Payments

## Quote Management Features

### 1. Quote List Page (`/admin/quotes`)

**Features:**
- ✅ List all quotes with pagination
- ✅ Filter by status (pending, reviewed, waiting_client, approved, converted, completed, cancelled)
- ✅ Filter by date range
- ✅ Search by customer name/email
- ✅ Sort by date, amount, status
- ✅ Quick status update dropdown
- ✅ Export quotes to CSV/Excel
- ✅ Bulk actions (mark as reviewed, send email, etc.)

**Display Columns:**
- Quote ID (short)
- Customer name
- Email
- Project type
- Quote amount (if set)
- Status (with color coding)
- Created date
- Last updated
- Actions (view, edit, convert)

### 2. Quote Detail Page (`/admin/quotes/[id]`)

**Sections:**

#### Customer Information
- Full name
- Email
- Phone
- Address
- City
- Country

#### Project Details
- Project type
- Budget range
- Message/description
- Custom dimensions
- Preferred materials
- Preferred finishes
- Additional custom details

#### Quote Items
- List of quote items (products or custom items)
- Item name
- Description
- Quantity
- Unit price (if set)
- Total price (if set)
- Custom specifications

#### Quote Management
- **Status dropdown:** Update status
- **Quote amount input:** Set quote amount (in cents)
- **Valid until date:** Set expiration date
- **Admin notes:** Internal notes (not visible to customer)
- **Convert to order button:** Convert quote to order

#### Status Timeline
- Visual timeline showing status changes
- Date stamps for each status change
- Admin who made changes (if tracking enabled)

#### Email History
- List of emails sent to customer
- Email type (quote received, reviewed, approved, etc.)
- Sent date
- Resend option

#### Actions
- Send email to customer
- Convert to order
- Duplicate quote
- Cancel quote
- Delete quote (with confirmation)

### 3. Quote Status Management

**Status Workflow:**
```
pending → reviewed → waiting_client → approved → converted → completed
```

**Status Actions:**
- **pending:** New quote, admin can review
- **reviewed:** Admin reviewed, preparing quote
- **waiting_client:** Quote sent to client, waiting response
- **approved:** Client approved, ready to convert
- **converted:** Converted to order
- **completed:** Order completed
- **cancelled:** Quote cancelled (can be at any stage)

**Email Triggers:**
- Status change to "reviewed" → Send "Quote being reviewed" email
- Status change to "waiting_client" → Send "Quote ready" email
- Status change to "approved" → Send "Quote approved" email
- Status change to "converted" → Send "Quote converted" email

## Payment Management Features

### 1. Order List with Payment Filters

**Filters:**
- Payment method (stripe, cod, bank_transfer)
- Payment status (pending, paid, failed, refunded)
- Order status
- Date range
- Customer search

**Display:**
- Payment method badge
- Payment status indicator
- Amount
- Payment date (if paid)
- Actions (view payment details, refund, etc.)

### 2. Payment Details View

**For Stripe Orders:**
- Stripe session ID
- Stripe payment intent ID
- Payment status
- Transaction ID
- Payment date
- Refund history
- Link to Stripe dashboard

**For Bank Transfer Orders:**
- Order amount
- Bank details provided
- Payment reference
- Payment verification status
- Manual verification button
- Upload payment proof
- Mark as paid button

**For COD Orders:**
- Delivery address
- Delivery date
- Payment status (pending, received)
- Mark as paid button
- Delivery notes

### 3. Payment Verification System

**Bank Transfer Verification:**
- Manual verification interface
- Upload payment proof (screenshot, receipt)
- Verify payment amount
- Mark order as paid
- Send confirmation email to customer

**Fraud Checks:**
- Verify payment amount matches order
- Check payment reference matches order ID
- Flag suspicious payments
- Review queue for manual verification

### 4. Refund Management

**Features:**
- Process refunds (Stripe)
- Refund reason tracking
- Refund history
- Email notifications
- Update order status

## Dashboard Statistics

### Quote Statistics
- Total quotes (all time)
- Pending quotes count
- Approved quotes count
- Conversion rate (quotes → orders)
- Average quote amount
- Quotes by project type

### Payment Statistics
- Total revenue (by payment method)
- Pending payments count
- Payment success rate
- Average order value
- Payment method distribution
- Revenue by month

## Security Features

### Access Control
- Admin authentication required
- IP allowlist (optional)
- Session timeout
- Activity logging

### Data Protection
- Mask sensitive customer data
- Secure payment information
- Audit trail for changes
- Export restrictions

## Reporting & Analytics

### Reports
- Quote conversion report
- Payment method analysis
- Customer lifetime value
- Revenue by period
- Project type distribution

### Export Options
- CSV export
- Excel export
- PDF reports
- Email reports (scheduled)

## Integration Points

### Email System
- Send quote emails
- Send payment confirmations
- Send status updates
- Email templates management

### Order System
- Convert quote to order
- Link orders to quotes
- Track conversion history

### Payment System
- Stripe integration
- Bank transfer verification
- COD tracking
- Refund processing

## UI/UX Requirements

### Design
- Luxury minimal aesthetic
- Clean, professional interface
- Responsive design
- Fast loading times
- Intuitive navigation

### Features
- Real-time updates
- Bulk operations
- Quick actions
- Keyboard shortcuts
- Search functionality
- Filter presets
- Saved views

## Technical Requirements

### Performance
- Pagination for large lists
- Lazy loading
- Optimized queries
- Caching where appropriate

### Reliability
- Error handling
- Retry mechanisms
- Backup systems
- Data validation

### Scalability
- Handle high volume
- Efficient database queries
- Background job processing
- Queue system for emails




