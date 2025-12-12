# 🔧 Troubleshooting: Categories Not Showing

## Problem
You've added categories in Prisma Studio, but they're not showing on the boutique page.

## Quick Fixes

### Fix 1: Restart Dev Server (Most Common)

The dev server might be caching the old empty state. Restart it:

1. **Stop the dev server:**
   - Press `Ctrl + C` in the terminal where `npm run dev` is running

2. **Start it again:**
   ```powershell
   npm run dev
   ```

3. **Hard refresh the browser:**
   - Press `Ctrl + Shift + R` (Windows) or `Cmd + Shift + R` (Mac)
   - Or open in incognito/private window

### Fix 2: Check Terminal for Errors

Look at your terminal where `npm run dev` is running. You should see:
- `✅ Fetched categories: 3` (or however many you added)

If you see errors instead, check:
- Database connection issues
- Prisma Client errors

### Fix 3: Verify Database Connection

Check if Prisma can connect to your database:

```powershell
npx prisma studio
```

If Prisma Studio opens and shows your categories, the database is fine.

### Fix 4: Check Database File Location

The database might be in a different location. Check:

```powershell
Get-ChildItem -Recurse -Filter "dev.db" | Select-Object FullName
```

Make sure your `.env` file has:
```
DATABASE_URL="file:./prisma/dev.db"
```

### Fix 5: Clear Next.js Cache

Next.js might be caching the page. Clear the cache:

```powershell
# Stop dev server first (Ctrl + C)
Remove-Item -Recurse -Force .next
npm run dev
```

## Step-by-Step Debugging

### Step 1: Verify Categories Exist

1. Open Prisma Studio: `npx prisma studio`
2. Click "Category" table
3. Confirm you see your categories (Chaises, Fauteuil, consoles)

### Step 2: Check Server Logs

1. Look at your terminal where `npm run dev` is running
2. Visit http://localhost:3000/boutique
3. Check the terminal for:
   - `✅ Fetched categories: 3` (success)
   - `❌ Error fetching categories:` (error - check the message)

### Step 3: Test Database Query

Create a test file to verify the query works:

Create `test-categories.js`:
```javascript
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function test() {
  try {
    const categories = await prisma.category.findMany()
    console.log('Categories found:', categories.length)
    console.log(categories)
  } catch (error) {
    console.error('Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

test()
```

Run it:
```powershell
node test-categories.js
```

If this works, the issue is with Next.js caching or the page component.

## Common Issues

### Issue: "Cannot find module '@prisma/client'"
**Solution:** Run `npx prisma generate`

### Issue: "Table does not exist"
**Solution:** Run `npx prisma migrate dev`

### Issue: Categories show in Prisma Studio but not on page
**Solution:** 
1. Restart dev server
2. Hard refresh browser
3. Clear `.next` cache

### Issue: Page shows "0 categories" but Prisma Studio shows 3
**Solution:** This is a caching issue. Restart dev server and hard refresh.

## Still Not Working?

If none of the above work:

1. **Check the browser console:**
   - Press `F12` to open DevTools
   - Look for errors in the Console tab

2. **Check the Network tab:**
   - See if the page is making requests
   - Check for failed requests

3. **Verify the page code:**
   - Make sure `app/boutique/page.tsx` is using `prisma.category.findMany()`
   - Check that it's not using the old static data

4. **Try a different route:**
   - Visit http://localhost:3000/boutique/chaises
   - If this works, the issue is with the main page

## Expected Behavior

After adding categories and restarting:

1. ✅ Prisma Studio shows 3 categories
2. ✅ Terminal shows `✅ Fetched categories: 3`
3. ✅ Boutique page shows 3 category cards
4. ✅ Each card shows the category name and product count

If you see all of these, it's working! 🎉

