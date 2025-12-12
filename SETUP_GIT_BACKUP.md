# Quick Git Setup - Prevent Future Data Loss

## Install Git (If Not Installed)

1. Download: https://git-scm.com/download/win
2. Install with default settings
3. Restart terminal/IDE

## Initialize Git in Your Project

After installing Git, run these commands in PowerShell:

```powershell
cd "C:\Users\mcmcb\Desktop\testing"

# Initialize Git repository
git init

# Create .gitignore (exclude node_modules, etc.)
echo "node_modules/" > .gitignore
echo ".next/" >> .gitignore
echo ".env" >> .gitignore
echo "*.log" >> .gitignore

# Add all files
git add .

# Create first backup commit
git commit -m "Initial backup - all current files"
```

## Daily Usage - Save Your Work

### Before Making Changes:
```powershell
git add .
git commit -m "Backup before making changes"
```

### After Making Changes:
```powershell
git add .
git commit -m "Description of what you changed"
```

### View History:
```powershell
git log --oneline
```

### Restore Previous Version:
```powershell
# See what changed
git log --oneline

# Restore a file
git checkout <commit-hash> -- <file-path>

# Example:
git checkout abc123 -- lib/data.ts
```

### Restore Entire Project to Previous State:
```powershell
git checkout <commit-hash> .
```

## Automatic Backup (Advanced)

Create a batch file `backup.bat` in your project:

```batch
@echo off
cd /d "C:\Users\mcmcb\Desktop\testing"
git add .
git commit -m "Auto-backup %date% %time%"
```

Run it before making changes, or set it as a scheduled task.

