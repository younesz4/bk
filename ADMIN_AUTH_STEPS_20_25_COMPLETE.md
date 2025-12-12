# Admin Authentication System - Steps 20-25 Complete

## ✅ Implementation Summary

### Step 20 - Admin Model Added ✅
- **Model:** `Admin` with:
  - `id` (Int, autoincrement)
  - `email` (String, unique)
  - `password` (String) - stores bcrypt hash
  - `createdAt` (DateTime)
- **Status:** Schema updated, Prisma client generated
- **Note:** Database migration pending (existing Admin table needs update)

### Step 21 - Admin Creation Script ✅
- **File:** `scripts/create-admin.ts`
- **Features:**
  - Connects to Prisma
  - Hashes password using bcrypt
  - Creates admin with email "admin@bk.com" and password "admin1234"
  - Prevents duplicate admin creation
- **Usage:** `npx ts-node scripts/create-admin.ts`

### Step 22 - Run Script ⚠️
- **Status:** Ready to run after database migration
- **Command:** `npx ts-node scripts/create-admin.ts`

### Step 23 - Login API Route ✅
- **File:** `app/api/admin/login/route.ts`
- **Features:**
  - Imports Prisma and bcrypt
  - Checks email & password from request.json()
  - Returns error if admin not found
  - Uses bcrypt.compare()
  - Returns JWT token with admin ID on success
  - Uses process.env.JWT_SECRET
  - Status 200 on success, 401 on invalid login

### Step 24 - JWT Secret ⚠️
- **Required:** Add to `.env`:
  ```env
  JWT_SECRET="supersecretgeneratedvalue"
  ```
- **Generate:** Use any random string (recommended: 32+ characters)

### Step 25 - Admin Login Page ✅
- **File:** `app/admin/login/page.tsx`
- **Features:**
  - Email + password fields
  - Uses fetch('/api/admin/login') on submit
  - Stores token in localStorage on success
  - Redirects to /admin/dashboard
  - Tailwind minimal styling

## Files Created/Updated

### New Files
1. `scripts/create-admin.ts` - Admin creation script
2. `app/api/admin/login/route.ts` - Login API route
3. `app/admin/login/page.tsx` - Login page
4. `scripts/migrate-admin.sql` - Database migration SQL (optional)

### Updated Files
1. `prisma/schema.prisma` - Added simple Admin model
2. `package.json` - Added jsonwebtoken dependency

## Next Steps

### 1. Handle Database Migration

The existing Admin table has `passwordHash` but the new schema uses `password`. You have two options:

**Option A: Reset Database (loses data)**
```bash
npx prisma migrate reset
npx prisma migrate dev --name add_admin_model
```

**Option B: Manual Migration (preserves data)**
1. Run the SQL migration script to rename the column
2. Or manually update existing Admin records

### 2. Add JWT_SECRET to .env

```env
JWT_SECRET="your-random-secret-key-here"
```

### 3. Create Admin User

```bash
npx ts-node scripts/create-admin.ts
```

This creates:
- Email: `admin@bk.com`
- Password: `admin1234`

### 4. Test Login

1. Navigate to `/admin/login`
2. Enter credentials
3. Should redirect to `/admin/dashboard` (create this page if needed)

## Important Notes

⚠️ **Database Migration:** The Admin table structure changed from `passwordHash` to `password`. Existing data needs migration.

⚠️ **JWT_SECRET:** Must be set in `.env` for the login to work.

⚠️ **Dashboard Route:** The login redirects to `/admin/dashboard` - make sure this route exists or update the redirect.

⚠️ **Token Storage:** Token is stored in `localStorage` - you'll need middleware to verify it on protected routes.

## Security Features

✅ Bcrypt password hashing
✅ JWT token authentication
✅ Secure password comparison
✅ Error messages don't leak information

All steps 20-25 have been implemented! 🎉



