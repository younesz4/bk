-- Migrate Admin table from passwordHash to password
-- This script handles the column rename for SQLite

-- Step 1: Create new Admin table with password field
CREATE TABLE "Admin_new" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "email" TEXT NOT NULL UNIQUE,
    "password" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Step 2: Copy data from old Admin table (assuming passwordHash exists)
-- If the old table has passwordHash, copy it to password
INSERT INTO "Admin_new" ("id", "email", "password", "createdAt")
SELECT "id", "email", COALESCE("passwordHash", "password", "") as "password", "createdAt"
FROM "Admin";

-- Step 3: Drop old Admin table
DROP TABLE "Admin";

-- Step 4: Rename new table
ALTER TABLE "Admin_new" RENAME TO "Admin";



