-- Add updatedAt to Booking table (nullable first)
ALTER TABLE "Booking" ADD COLUMN "updatedAt" DATETIME;

-- Update existing Booking rows with current timestamp
UPDATE "Booking" SET "updatedAt" = COALESCE("createdAt", CURRENT_TIMESTAMP) WHERE "updatedAt" IS NULL;

-- Add internalNotes to Booking table (nullable)
ALTER TABLE "Booking" ADD COLUMN "internalNotes" TEXT;

-- Create indexes for Booking
CREATE INDEX IF NOT EXISTS "Booking_status_idx" ON "Booking"("status");
CREATE INDEX IF NOT EXISTS "Booking_createdAt_idx" ON "Booking"("createdAt");

-- For Admin table: Handle migration from String ID to Int ID
-- Step 1: Create a new Admin table with Int ID
CREATE TABLE "Admin_new" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "twoFactorCode" TEXT,
    "twoFactorExpiresAt" DATETIME,
    "role" TEXT NOT NULL DEFAULT 'ADMIN',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Step 2: Copy data from old Admin to new Admin
INSERT INTO "Admin_new" ("email", "passwordHash", "role", "createdAt", "updatedAt")
SELECT "email", "password" as "passwordHash", 'ADMIN' as "role", "createdAt", "createdAt" as "updatedAt"
FROM "Admin";

-- Step 3: Drop old Admin table
DROP TABLE "Admin";

-- Step 4: Rename new Admin table
ALTER TABLE "Admin_new" RENAME TO "Admin";

-- Step 5: Recreate unique index
CREATE UNIQUE INDEX "Admin_email_key" ON "Admin"("email");
