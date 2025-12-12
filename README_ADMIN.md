# Admin Authentication System - BK Agencements

## Overview

This document explains the admin authentication system with 2FA (two-factor authentication) implemented for the BK Agencements admin panel.

## Database Models

### Admin Model

The `Admin` model stores admin user accounts:

- `id` (Int, autoincrement) - Primary key
- `email` (String, unique) - Admin email address
- `passwordHash` (String) - Bcrypt hashed password
- `twoFactorCode` (String?, nullable) - Temporary 6-digit code for 2FA
- `twoFactorExpiresAt` (DateTime?, nullable) - Expiry time for 2FA code (10 minutes)
- `role` (String) - Default: "ADMIN"
- `createdAt` (DateTime) - Account creation timestamp
- `updatedAt` (DateTime) - Last update timestamp
- `sessions` (AdminSession[]) - Related sessions

### AdminSession Model

The `AdminSession` model stores active admin sessions:

- `id` (String, cuid) - Primary key
- `adminId` (Int) - Foreign key to Admin
- `createdAt` (DateTime) - Session creation timestamp
- `expiresAt` (DateTime) - Session expiry (7 days)
- `admin` (Admin) - Related admin user

## Database Migration

To apply the database changes:

```bash
npx prisma generate
npx prisma migrate dev --name add_admin_auth
```

This will:
1. Generate the Prisma client with the new models
2. Create a migration file
3. Apply the migration to your database

## Creating Admin Users

Admin users must be created manually. There is no public signup.

### Method 1: Using the Script (Recommended)

1. Add to your `.env` file:
   ```
   ADMIN_EMAIL=admin@bk-agencements.com
   ADMIN_PASSWORD=your-secure-password-here
   ```

2. Run the script:
   ```bash
   npm run create:admin
   ```
   Or:
   ```bash
   npx tsx scripts/create-admin.ts
   ```

### Method 2: Using Prisma Studio

1. Open Prisma Studio:
   ```bash
   npx prisma studio
   ```

2. Navigate to the `Admin` model
3. Click "Add record"
4. Fill in:
   - `email`: Your admin email
   - `passwordHash`: You'll need to hash the password first (use the `hashPassword` function from `lib/adminAuth.ts` or create a temporary script)
   - `role`: "ADMIN"

**Note:** Method 1 is recommended as it properly hashes the password.

## Authentication Flow

1. **Login (Email + Password)**
   - User submits email and password at `/bk-agencements-panel/login`
   - System verifies credentials
   - If valid, generates a 6-digit code
   - Code is saved to `admin.twoFactorCode` with 10-minute expiry
   - Code is sent via email using SendGrid

2. **2FA Verification**
   - User enters the 6-digit code
   - System verifies code matches and hasn't expired
   - If valid, creates a session in `AdminSession`
   - Sets HTTP-only cookie `admin_session` (7-day expiry)
   - Redirects to `/bk-agencements-panel`

3. **Session Management**
   - Middleware checks `admin_session` cookie on each request
   - Verifies session exists and hasn't expired
   - If invalid/expired, redirects to login

4. **Logout**
   - Deletes session from database
   - Clears cookie
   - Redirects to login

## Protected Routes

All routes under `/bk-agencements-panel/*` are protected, except:
- `/bk-agencements-panel/login` - Login page
- `/bk-agencements-panel/verify` - 2FA verification (API route)

## Environment Variables

Required environment variables:

```env
# SendGrid (for email)
SENDGRID_API_KEY=your-sendgrid-api-key
FROM_EMAIL=noreply@bk-agencements.com

# Admin creation (only needed when creating admin)
ADMIN_EMAIL=admin@bk-agencements.com
ADMIN_PASSWORD=your-secure-password
```

## Security Features

- **Password Hashing**: Bcrypt with 12 salt rounds
- **2FA**: 6-digit codes valid for 10 minutes
- **HTTP-Only Cookies**: Prevents XSS attacks
- **Secure Cookies**: Enabled in production (HTTPS only)
- **Session Expiry**: 7-day sessions, auto-cleanup on expiry
- **No Public Signup**: Admins must be created manually

## Files Created/Modified

### New Files
- `lib/adminAuth.ts` - Authentication utilities
- `app/api/admin/login/route.ts` - Login API
- `app/api/admin/verify/route.ts` - 2FA verification API
- `app/api/admin/logout/route.ts` - Logout API
- `app/bk-agencements-panel/login/page.tsx` - Login UI
- `app/bk-agencements-panel/page.tsx` - Admin dashboard
- `app/bk-agencements-panel/layout.tsx` - Admin layout
- `scripts/create-admin.ts` - Admin creation script
- `README_ADMIN.md` - This file

### Modified Files
- `prisma/schema.prisma` - Added Admin and AdminSession models
- `lib/mail.ts` - Added `sendEmail` and `sendAdminLoginCodeEmail` functions
- `middleware.ts` - Added admin route protection
- `package.json` - Added `create:admin` script

## Testing

1. Create an admin user using the script
2. Navigate to `/bk-agencements-panel/login`
3. Enter email and password
4. Check email for 6-digit code
5. Enter code to complete login
6. You should be redirected to `/bk-agencements-panel`

## Troubleshooting

### "Identifiants invalides"
- Check that the admin exists in the database
- Verify password is correct
- Ensure password was hashed when creating admin

### "Code invalide ou expiré"
- Code expires after 10 minutes
- Request a new code by logging in again
- Check that email was sent (check SendGrid logs)

### Session not persisting
- Check that cookies are enabled in browser
- Verify `admin_session` cookie is set
- Check middleware is not blocking cookies

### Email not sending
- Verify `SENDGRID_API_KEY` is set in `.env`
- Check `FROM_EMAIL` is set
- Review SendGrid dashboard for errors

## Notes

- This system is for internal use only
- No public signup is available
- Admins must be created manually by developers
- The script should only be run by developers, not end users
- Keep `.env` file secure and never commit it to version control




