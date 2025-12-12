# 🚀 How to Start the Dev Server

## The server isn't running. Here's how to start it:

### Step 1: Open a New Terminal

1. Open PowerShell or your terminal
2. Navigate to your project:
   ```powershell
   cd "C:\Users\mcmcb\OneDrive\Desktop\testing"
   ```

### Step 2: Start the Dev Server

```powershell
npm run dev
```

### Step 3: Wait for "Ready"

You should see:
```
▲ Next.js 14.2.33
- Local:        http://localhost:3000

✓ Starting...
✓ Ready in 5s
```

### Step 4: Visit the Page

Once you see "Ready", visit:
- http://localhost:3000/boutique

## If You See Errors

### Error: "Port 3000 is in use"
- The server will try port 3001 instead
- Visit: http://localhost:3001/boutique

### Error: Route conflict
- This should be fixed now (I deleted the conflicting file)
- If you still see it, let me know

### Error: Font error
- The "Bodoni Moda" font error is just a warning
- The server should still work

## Quick Checklist

- ✅ Route conflict fixed (deleted `/app/boutique/[slug]/page.tsx`)
- ✅ Categories added in Prisma Studio
- ⏳ Dev server needs to be started manually

## After Starting

Once the server is running:
1. Visit http://localhost:3000/boutique
2. You should see your 3 categories
3. Terminal should show: `✅ Fetched categories: 3`

Try starting the server now! 🚀

