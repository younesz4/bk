# Recovery Options for Lost Work

Since your `testing` folder might not be in OneDrive sync, here are alternative ways to recover your work:

## 1. Check Windows File History (If Enabled)

### Steps:
1. Press `Win + R`
2. Type: `filehistory` and press Enter
3. Navigate to: `Desktop\testing`
4. Select date from 3 days ago
5. Restore files

### Or via File Explorer:
1. Open: `C:\Users\mcmcb\Desktop\testing`
2. Right-click any file (e.g., `lib\data.ts`)
3. Click **"Restore previous versions"**
4. If "Previous Versions" tab exists, select older version
5. Click **Restore**

---

## 2. Check IDE Local History (VS Code / Cursor)

### VS Code:
1. Install extension: **"Local History"** by xyz
2. Right-click file → **"Show Local History"**
3. Or check: `C:\Users\mcmcb\AppData\Roaming\Code\User\History\`

### Cursor:
1. Check: `C:\Users\mcmcb\AppData\Roaming\Cursor\User\History\`
2. Look for timestamped files

### Manual Check:
```powershell
# In PowerShell:
Get-ChildItem -Path "$env:APPDATA\Code\User\History" -Recurse | Where-Object {$_.LastWriteTime -gt (Get-Date).AddDays(-4)} | Select-Object FullName
```

---

## 3. Check Windows Shadow Copies (System Restore Points)

### Steps:
1. Right-click `C:\Users\mcmcb\Desktop\testing` folder
2. Properties → **Previous Versions** tab
3. If any versions appear, select one
4. Click **Open** or **Restore**

### Via Command:
1. Open Command Prompt as Admin
2. Run:
```cmd
vssadmin list shadows
```
3. If shadows exist, you can restore from them

---

## 4. Check Recycle Bin

Your deleted files might still be there:
1. Open Recycle Bin
2. Search for: `data.ts` or `ProjectCarousel.tsx`
3. Restore if found

---

## 5. Check Temp Files / Auto-Save Locations

### VS Code/Cursor Auto-Save:
- Check: `C:\Users\mcmcb\AppData\Local\Temp\`
- Look for recent `.ts` or `.tsx` files

### Next.js Cache:
Your project might have auto-saved states in:
- `.next\cache\` folder
- But this won't help with source files

---

## 6. Check Browser Cache / Dev Tools

If you were testing the site:
1. Open browser DevTools (F12)
2. Application/Storage tab
3. Check if any cached source files exist
4. *Unlikely but worth checking*

---

## 7. Check Email / Cloud Backups

If you:
- Sent files via email
- Uploaded to Google Drive / Dropbox
- Shared via Teams / Slack

Check those locations!

---

## 8. Manual Recovery Strategy

Since I've already updated your files with:
- ✅ 5 projects (added wood project)
- ✅ WebP images everywhere
- ✅ Quality 100
- ✅ Full-height carousel
- ✅ Infinite scroll carousel

**You can manually tell me what was different**, and I'll restore it exactly:

### What to tell me:
1. Which projects did you have? (names, images)
2. What was different about the carousel?
3. What images did each project use?
4. Any layout differences?

I can recreate everything based on your description!

---

## 9. Set Up Git NOW (Prevent Future Loss)

### Quick Setup:
```powershell
# Install Git first: https://git-scm.com/download/win
# Then:

cd "C:\Users\mcmcb\Desktop\testing"
git init
git add .
git commit -m "Current state - backup point"
```

### Daily Usage:
```powershell
# Before making changes:
git add .
git commit -m "Backup before changes"

# To restore:
git log --oneline          # See history
git checkout <commit> -- <file>  # Restore file
```

---

## 10. Enable OneDrive Sync for This Folder

To prevent this in the future:

1. Check if Desktop is syncing:
   - Right-click OneDrive icon in system tray
   - Settings → Account → Choose folders
   - Ensure "Desktop" is checked

2. Or manually add folder:
   - Right-click `testing` folder
   - Include in OneDrive
   - Or move it to OneDrive folder

---

## What I've Already Restored

Based on what you told me, I've updated:
- ✅ 5 projects total (with wood project as 6th)
- ✅ All images to WebP
- ✅ Quality 100 everywhere
- ✅ Full-height carousel
- ✅ Infinite scroll animation

If you remember any differences, tell me and I'll fix them immediately!

