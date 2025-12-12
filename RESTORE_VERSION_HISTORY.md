# How to Restore Version History

## 1. OneDrive Version History (Easiest - You're already on OneDrive!)

Since your project is in `OneDrive\Desktop\testing`, OneDrive automatically saves version history:

### Steps:
1. **Right-click** on any file in File Explorer (e.g., `lib/data.ts`)
2. Select **"Version history"** or **"Restore previous versions"**
3. You'll see a list of previous versions with timestamps
4. **Right-click** on the version you want
5. Select **"Restore"** or **"Restore to"** to save it

### For Multiple Files:
1. Go to OneDrive website: https://onedrive.live.com
2. Navigate to your folder
3. Select files/folders
4. Click **"Version history"** in the toolbar
5. Restore the versions you need

---

## 2. VS Code / Cursor Local History

Your IDE may have local history:

### VS Code:
1. Install extension: **"Local History"** by xyz
2. Right-click file → **"Show Local History"**
3. Compare and restore previous versions

### Cursor:
1. Open Command Palette (Ctrl+Shift+P)
2. Type: **"Local History: Show"**
3. Select file → view history → restore

---

## 3. Windows File History (If Enabled)

1. Open **File Explorer**
2. Navigate to your project folder
3. Right-click folder → **Properties**
4. Go to **"Previous Versions"** tab
5. Select date/time → **Restore**

*Note: Only works if File History was enabled before*

---

## 4. Set Up Git (For Future Protection)

Install Git to track all changes:

### Install Git:
1. Download from: https://git-scm.com/download/win
2. Install with default settings
3. Restart terminal/IDE

### Initialize Git in Your Project:
```bash
cd "C:\Users\mcmcb\OneDrive\Desktop\testing"
git init
git add .
git commit -m "Initial commit - restore point"
```

### Daily Usage:
```bash
# Save current state
git add .
git commit -m "Description of changes"

# View history
git log --oneline

# Restore previous version
git checkout <commit-hash> -- <file-path>
# Example: git checkout abc123 -- lib/data.ts
```

---

## 5. Manual Backup Strategy

Create backups before major changes:

1. **Copy entire folder:**
   ```
   Copy: C:\Users\mcmcb\OneDrive\Desktop\testing
   To: C:\Users\mcmcb\OneDrive\Desktop\testing-backup-[DATE]
   ```

2. **Or use Windows Backup:**
   - Settings → Update & Security → Backup
   - Add your project folder to backup

---

## Quick Recovery Steps (Right Now)

### Option A: OneDrive Website (Fastest)
1. Go to: https://onedrive.live.com
2. Navigate to: Desktop → testing
3. Select `lib/data.ts` or entire `lib` folder
4. Click **"Version history"** (or 3 dots menu)
5. Find version from 3 days ago
6. Download or restore

### Option B: File Explorer
1. Open: `C:\Users\mcmcb\OneDrive\Desktop\testing`
2. Right-click `lib/data.ts`
3. Properties → Previous Versions tab
4. Select version from before changes
5. Click Restore

### Option C: Restore Entire Folder
1. In OneDrive, go to parent folder
2. Right-click `testing` folder
3. Version history
4. Restore entire folder to previous date

---

## Prevention for Future

1. **Enable Git** (best practice)
2. **Commit before major changes**
3. **Use OneDrive version history regularly**
4. **Create manual backups** before risky changes

---

## Need Help?

If you can't find versions in OneDrive:
- Check OneDrive settings → ensure version history is enabled
- Version history might have retention limits
- Contact OneDrive support if needed

